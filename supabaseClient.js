(function () {
  const PLAYER_ID_KEY = "lifeReplay.anonymousPlayerId";
  const LOCAL_RUNS_KEY = "lifeReplay.playRuns";
  const LOCAL_CARDS_KEY = "lifeReplay.collectedCards";
  const CURRENT_PROGRESS_KEY = "lifeReplayCurrentSave";
  const CONFIG = window.LIFE_REPLAY_SUPABASE_CONFIG || {};
  const isConfigured = Boolean(CONFIG.url && CONFIG.anonKey);

  function getPlayerId() {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function request(path, options = {}) {
    if (!isConfigured) throw new Error("Supabase is not configured");
    const response = await fetch(`${CONFIG.url.replace(/\/$/, "")}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: CONFIG.anonKey,
        Authorization: `Bearer ${CONFIG.anonKey}`,
        "Content-Type": "application/json",
        Prefer: options.prefer || "return=representation",
        ...(options.headers || {})
      }
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Supabase request failed: ${response.status} ${body}`);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function upsertPlayer(displayName) {
    const playerId = getPlayerId();
    if (!isConfigured) return { source: "local", playerId };
    try {
      await request("players?on_conflict=id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: JSON.stringify([{
          id: playerId,
          display_name: displayName || "あなた",
          last_played_at: new Date().toISOString()
        }])
      });
      return { source: "supabase", playerId };
    } catch (error) {
      console.warn(error);
      return { source: "local", playerId, error };
    }
  }

  async function syncCardCatalog(cards) {
    if (!isConfigured || !cards?.length) return { source: "local" };
    try {
      await request("card_catalog?on_conflict=id", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=representation",
        body: JSON.stringify(cards.map((card) => ({
          id: card.id,
          name: card.name,
          category: card.category,
          rarity: card.rarity,
          description: card.description,
          unlock_hint: card.unlockHint,
          unlock_condition_hidden: Boolean(card.unlockConditionHidden),
          sort_order: card.sortOrder || 0
        })))
      });
      return { source: "supabase" };
    } catch (error) {
      console.warn(error);
      return { source: "local", error };
    }
  }

  function localRuns() {
    return readJson(LOCAL_RUNS_KEY, []);
  }

  function localCollectedCards() {
    return readJson(LOCAL_CARDS_KEY, {});
  }

  async function nextRunNumber(playerId) {
    if (!isConfigured) return localRuns().filter((run) => run.player_id === playerId).length + 1;
    try {
      const rows = await request(`play_runs?player_id=eq.${encodeURIComponent(playerId)}&select=run_number&order=run_number.desc&limit=1`, {
        method: "GET",
        prefer: "return=representation"
      });
      return (rows?.[0]?.run_number || 0) + 1;
    } catch (error) {
      console.warn(error);
      return localRuns().filter((run) => run.player_id === playerId).length + 1;
    }
  }

  async function savePlayRun(run) {
    const playerId = getPlayerId();
    const runNumber = run.run_number || await nextRunNumber(playerId);
    const payload = {
      ...run,
      player_id: playerId,
      run_number: runNumber,
      finished_at: run.finished_at || new Date().toISOString()
    };

    if (isConfigured) {
      try {
        await upsertPlayer(run.display_name);
        const rows = await request("play_runs", {
          method: "POST",
          body: JSON.stringify([payload])
        });
        return { source: "supabase", run: rows?.[0] || payload };
      } catch (error) {
        console.warn(error);
      }
    }

    const runs = localRuns();
    const localRun = { ...payload, id: payload.id || crypto.randomUUID(), saved_locally: true };
    runs.push(localRun);
    writeJson(LOCAL_RUNS_KEY, runs);
    return { source: "local", run: localRun };
  }

  async function listPlayRuns() {
    const playerId = getPlayerId();
    if (isConfigured) {
      try {
        return await request(`play_runs?player_id=eq.${encodeURIComponent(playerId)}&select=*&order=finished_at.desc`, {
          method: "GET",
          prefer: "return=representation"
        });
      } catch (error) {
        console.warn(error);
      }
    }
    return localRuns().filter((run) => run.player_id === playerId).sort((a, b) => String(b.finished_at).localeCompare(String(a.finished_at)));
  }

  async function upsertCollectedCard(card) {
    const playerId = getPlayerId();
    const now = new Date().toISOString();
    if (isConfigured) {
      try {
        const existing = await request(`collected_cards?player_id=eq.${encodeURIComponent(playerId)}&card_id=eq.${encodeURIComponent(card.id)}&select=*`, {
          method: "GET",
          prefer: "return=representation"
        });
        if (existing?.length) {
          await request(`collected_cards?player_id=eq.${encodeURIComponent(playerId)}&card_id=eq.${encodeURIComponent(card.id)}`, {
            method: "PATCH",
            body: JSON.stringify({ collect_count: (existing[0].collect_count || 1) + 1 })
          });
        } else {
          await request("collected_cards", {
            method: "POST",
            body: JSON.stringify([{
              player_id: playerId,
              card_id: card.id,
              first_run_id: card.runId || null,
              first_collected_at: now,
              collect_count: 1
            }])
          });
        }
        return { source: "supabase" };
      } catch (error) {
        console.warn(error);
      }
    }

    const cards = localCollectedCards();
    const current = cards[card.id];
    cards[card.id] = current
      ? { ...current, collectCount: current.collectCount + 1 }
      : { id: card.id, name: card.name, category: card.category, rarity: card.rarity, description: card.description, firstCollectedAt: now, collectCount: 1 };
    writeJson(LOCAL_CARDS_KEY, cards);
    return { source: "local" };
  }

  async function listCollectedCards() {
    const playerId = getPlayerId();
    if (isConfigured) {
      try {
        const rows = await request(`collected_cards?player_id=eq.${encodeURIComponent(playerId)}&select=*`, {
          method: "GET",
          prefer: "return=representation"
        });
        return Object.fromEntries((rows || []).map((row) => [row.card_id, {
          id: row.card_id,
          firstCollectedAt: row.first_collected_at,
          collectCount: row.collect_count || 1
        }]));
      } catch (error) {
        console.warn(error);
      }
    }
    return localCollectedCards();
  }

  function currentProgressKey() {
    return `${CURRENT_PROGRESS_KEY}.${getPlayerId()}`;
  }

  async function saveCurrentProgress(progress) {
    const playerId = getPlayerId();
    const now = new Date().toISOString();
    const payload = {
      player_id: playerId,
      save_data: progress,
      current_turn: (progress.turnIndex ?? 0) + 1,
      current_stage: progress.stage || "",
      current_period: progress.date || "",
      updated_at: now
    };

    if (isConfigured) {
      try {
        const rows = await request("game_saves?on_conflict=player_id", {
          method: "POST",
          prefer: "resolution=merge-duplicates,return=representation",
          body: JSON.stringify([payload])
        });
        writeJson(currentProgressKey(), { ...payload, savedTo: "supabase" });
        return { source: "supabase", save: rows?.[0] || payload };
      } catch (error) {
        console.warn(error);
      }
    }

    writeJson(currentProgressKey(), { ...payload, savedTo: "local" });
    return { source: "local", save: payload };
  }

  async function getCurrentProgress() {
    const playerId = getPlayerId();
    if (isConfigured) {
      try {
        const rows = await request(`game_saves?player_id=eq.${encodeURIComponent(playerId)}&select=*&order=updated_at.desc&limit=1`, {
          method: "GET",
          prefer: "return=representation"
        });
        if (rows?.[0]?.save_data) return { source: "supabase", save: rows[0] };
      } catch (error) {
        console.warn(error);
      }
    }
    const local = readJson(currentProgressKey(), null);
    return local ? { source: "local", save: local } : null;
  }

  async function clearCurrentProgress() {
    const playerId = getPlayerId();
    if (isConfigured) {
      try {
        await request(`game_saves?player_id=eq.${encodeURIComponent(playerId)}`, {
          method: "DELETE",
          prefer: "return=minimal"
        });
      } catch (error) {
        console.warn(error);
      }
    }
    localStorage.removeItem(currentProgressKey());
  }

  window.LifeReplayStorage = {
    isSupabaseConfigured: () => isConfigured,
    getPlayerId,
    upsertPlayer,
    syncCardCatalog,
    savePlayRun,
    listPlayRuns,
    upsertCollectedCard,
    listCollectedCards,
    saveCurrentProgress,
    getCurrentProgress,
    clearCurrentProgress
  };
})();

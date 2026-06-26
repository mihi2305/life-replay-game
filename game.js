const moodLevels = ["悪い", "ちょい悪", "普通", "調子いい", "幸せ"];
const hiddenKeys = ["安定志向", "挑戦志向", "協調志向", "自立志向", "計画志向", "直感志向", "探索志向", "達成志向"];
const statLabels = { academic: "学力", skill: "スキル", social: "社交性", energy: "体力", mood: "満足度", money: "お金" };

const timeline = [
  ["小学校", "小1 4月", "入学式"], ["小学校", "小1 夏", "初めての友達イベント"], ["小学校", "小2 春", "習い事選択イベント"],
  ["小学校", "小2 秋", "習い事・遊び・勉強のバランス"], ["小学校", "小3 春", "得意なことが見え始める"], ["小学校", "小3 冬", "初めての失敗イベント"],
  ["小学校", "小4 春", "塾に入るかイベント"], ["小学校", "小4 夏", "受験ルート or 地元ルートの生活差"], ["小学校", "小5 春", "中学受験合格可能性表示開始"],
  ["小学校", "小5 冬", "友達との距離イベント"], ["小学校", "小6 夏", "最後の追い込み or 小学校生活満喫"], ["小学校", "小6 冬", "中学受験・進学先決定"],
  ["中学校", "中1 4月", "中学ルート選択"], ["中学校", "中1 夏", "部活・友達・勉強イベント"], ["中学校", "中1 冬", "生活リズムイベント"],
  ["中学校", "中2 春", "ルート固有イベント①"], ["中学校", "中2 夏", "友達・恋愛・大会イベント"], ["中学校", "中2 冬", "初めての大きな葛藤"],
  ["中学校", "中3 春", "高校受験ルート決定"], ["中学校", "中3 夏", "追い込み・大会・人間関係"], ["中学校", "中3 冬", "高校進学先決定"],
  ["高校", "高1 4月", "高校ルート開始"], ["高校", "高1 夏", "新しい環境イベント"], ["高校", "高1 冬", "友達・部活・勉強のバランス"],
  ["高校", "高2 春", "進路意識イベント"], ["高校", "高2 夏", "ルート固有イベント"], ["高校", "高2 冬", "恋愛・挫折・責任イベント"],
  ["高校", "高3 春", "大学受験・推薦・別進路選択"], ["高校", "高3 夏", "最後の追い込み"], ["高校", "高3 冬", "大学進学先決定"],
  ["大学", "大1 春", "大学生活開始"], ["大学", "大1 夏", "サークル・バイト選択"], ["大学", "大1 冬", "初めての自由イベント"],
  ["大学", "大2 春", "専門・ゼミ・活動選択"], ["大学", "大2 夏", "旅行・恋愛・挑戦イベント"], ["大学", "大2 冬", "将来への迷い"],
  ["大学", "大3 春", "留学・インターン・起業イベント"], ["大学", "大3 夏", "ルート本格化"], ["大学", "大3 冬", "大きな選択・失敗イベント"],
  ["大学", "大4 春", "社会に出る準備"], ["大学", "大4 夏", "最後の自由時間"], ["大学", "大4 冬", "大学生活の締めくくり"],
  ["社会に出る前", "出発前", "これまでの人生アルバムを振り返る"], ["社会に出る前", "前夜", "最後に何を大切にするか選ぶ"], ["社会に出る前", "結果", "最終タイプ表示"]
].map(([stage, date, title], index) => ({ stage, date, title, turn: index + 1 }));

const actions = {
  study: { label: "勉強する", desc: "机に向かって、少しずつ力を積み上げる。", stat: "academic", base: 3, energy: -18, hidden: { 計画志向: 2, 達成志向: 2, 安定志向: 1 } },
  play: { label: "遊ぶ", desc: "友達や自分の時間を楽しむ。", stat: "social", base: 3, energy: -14, hidden: { 協調志向: 2, 直感志向: 2, 探索志向: 1 } },
  rest: { label: "休む", desc: "しっかり休んで、また動ける自分に戻る。", fullRest: true, hidden: { 安定志向: 1 } },
  lesson: { label: "習い事をする", desc: "続けてきたことに取り組む。", stat: "skill", base: 3, energy: -20, hidden: { 達成志向: 1, 探索志向: 1 } },
  exam: { label: "受験勉強する", desc: "少し先の目標に向けて集中する。", stat: "academic", base: 4, energy: -30, cap: 7, hidden: { 計画志向: 3, 達成志向: 3, 安定志向: 1 } },
  club: { label: "部活をする", desc: "放課後の熱量に飛び込む。", stat: "skill", secondStat: "social", base: 3, energy: -22, hidden: { 達成志向: 2, 協調志向: 1 } },
  expression: { label: "表現活動をする", desc: "音楽や表現を通して、自分の形を探す。", stat: "skill", secondStat: "social", base: 3, energy: -19, hidden: { 自立志向: 2, 探索志向: 1 } },
  language: { label: "語学を学ぶ", desc: "知らない場所へ向かう言葉を少しずつ増やす。", stat: "academic", secondStat: "skill", base: 3, energy: -18, hidden: { 探索志向: 2, 計画志向: 1 } },
  create: { label: "制作する", desc: "アイデアを手で動かして、形にしてみる。", stat: "skill", secondStat: "academic", base: 3, energy: -21, hidden: { 自立志向: 2, 達成志向: 1 } },
  deepen: { label: "専門を深める", desc: "ひとつの問いや技術にじっくり向き合う。", stat: "skill", secondStat: "academic", base: 3, energy: -20, hidden: { 計画志向: 2, 達成志向: 1 } },
  romance: { label: "恋愛する", desc: "誰かを想う時間を大切にする。", stat: "social", base: 3, energy: -16, hidden: { 直感志向: 2, 協調志向: 1 } },
  work: { label: "バイトする", desc: "自分の力で社会と少し関わってみる。", money: 2600, energy: -22, hidden: { 自立志向: 2, 安定志向: 1 } },
  abroad: { label: "留学準備をする", desc: "知らない場所へ向かう準備を始める。", stat: "academic", secondStat: "skill", base: 3, energy: -20, money: -1200, hidden: { 探索志向: 2, 挑戦志向: 2 } },
  startup: { label: "起業準備をする", desc: "小さな企画を現実に近づける。", stat: "skill", secondStat: "social", base: 3, energy: -24, money: -1000, hidden: { 自立志向: 3, 挑戦志向: 2 } },
  intern: { label: "インターンをする", desc: "まだ知らない仕事の現場に触れる。", stat: "skill", base: 3, energy: -22, money: 1800, hidden: { 計画志向: 1, 自立志向: 2, 達成志向: 1 } }
};

const shops = [
  { name: "栄養ドリンク", price: 500, desc: "体力 +20", buy: () => changeStats({ energy: 20 }) },
  { name: "参考書", price: 800, desc: "次の勉強効果 +2", buy: () => addBoost("study", 2, 1) },
  { name: "学力のお守り", price: 1500, desc: "3ターン、勉強効果 +1", buy: () => addBoost("study", 1, 3) },
  { name: "部活道具", price: 1500, desc: "3ターン、習い事・部活効果 +1", buy: () => addBoost("skill", 1, 3) },
  { name: "友達とのお菓子", price: 500, desc: "次の遊ぶ効果 +2", buy: () => addBoost("play", 2, 1) },
  { name: "気分転換セット", price: 1000, desc: "満足度を1段階上げる。3ターンに1回まで", buy: () => improveMoodItem(), cooldown: true }
];

const typeDefs = [
  ["冒険家タイプ", "挑戦志向", "探索志向", "知らない景色に足を向けられる人。失敗も寄り道も、次の物語の材料に変えられます。"],
  ["調和者タイプ", "協調志向", "安定志向", "周りの空気をやさしく整えられる人。自分と誰かの安心を、同じくらい大切にできます。"],
  ["職人タイプ", "達成志向", "安定志向", "積み重ねの強さを知っている人。派手さよりも、続けた時間があなたの輪郭になります。"],
  ["自由人タイプ", "自立志向", "直感志向", "心が動く方向へ進める人。自分のリズムを守りながら、新しい選択を楽しめます。"],
  ["戦略家タイプ", "計画志向", "達成志向", "目標までの道筋を描ける人。準備と実行の両方で、未来を少しずつ近づけます。"],
  ["仲間思いタイプ", "協調志向", "直感志向", "人との時間から力を受け取る人。誰かの表情を見て、次の一歩を選べます。"],
  ["表現者タイプ", "自立志向", "探索志向", "自分だけの形を探せる人。うまく言葉にならない気持ちも、作品や行動に変えていけます。"],
  ["安定設計士タイプ", "安定志向", "計画志向", "暮らしと未来を丁寧に組み立てられる人。安心できる土台を作る才能があります。"]
];

let state;

function initialState() {
  return {
    turnIndex: 0,
    academic: 24,
    skill: 22,
    social: 24,
    energy: 82,
    mood: 2,
    money: 3500,
    lesson: null,
    lessonStatus: "none",
    currentUniversityRoute: null,
    universityRouteLabel: "",
    studyAbroadDeparted: false,
    cramSchool: false,
    juniorSchool: "未定",
    routes: [],
    actionCounts: {},
    stageActionCounts: {},
    routeChoices: [],
    unlocked: new Set(["study", "play", "rest"]),
    hidden: Object.fromEntries(hiddenKeys.map((key) => [key, 0])),
    recentHidden: Object.fromEntries(hiddenKeys.map((key) => [key, 0])),
    boosts: [],
    cards: [],
    logs: ["小さなランドセルで、人生リプレイが始まった。"],
    mode: "action",
    pendingEvent: null,
    pendingOutcome: null,
    pendingExamReveal: null,
    afterOutcome: null,
    effectBuffer: null,
    lastMoodItemTurn: -99,
    lastStage: "小学校"
  };
}

const $ = (id) => document.getElementById(id);

function rank(value) {
  if (value >= 95) return "S";
  if (value >= 85) return "A";
  if (value >= 70) return "B";
  if (value >= 55) return "C";
  if (value >= 40) return "D";
  if (value >= 25) return "E";
  if (value >= 10) return "F";
  return "G";
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function log(text) {
  state.logs.push(text);
  if (state.logs.length > 80) state.logs.shift();
}

function addHidden(scores) {
  Object.entries(scores || {}).forEach(([key, value]) => {
    state.hidden[key] += value;
    state.recentHidden[key] += value;
  });
}

function changeStats(delta) {
  const before = snapshotStats();
  ["academic", "skill", "social"].forEach((key) => {
    if (delta[key]) state[key] = clamp(state[key] + adjustedGrowth(key, delta[key], delta.cap || 8));
  });
  if (delta.energyTo !== undefined) state.energy = clamp(delta.energyTo);
  if (delta.energy) state.energy = clamp(state.energy + delta.energy);
  if (delta.money) state.money = Math.max(0, state.money + delta.money);
  if (delta.mood !== undefined) state.mood = clamp(delta.mood, 0, 4);
  const summary = summarizeStatChanges(before, snapshotStats(), delta);
  summary.changes.forEach((change) => log(change.text));
  summary.rankUps.forEach((rankUp) => log(rankUp.text));
  if (state.effectBuffer) {
    state.effectBuffer.changes.push(...summary.changes);
    state.effectBuffer.rankUps.push(...summary.rankUps);
  }
  return summary;
}

function adjustedGrowth(key, amount, cap) {
  if (amount <= 0) return amount;
  let adjusted = Math.min(amount, cap);
  const current = state[key];
  if (current >= 95) adjusted -= 3;
  else if (current >= 85) adjusted -= 2;
  else if (current >= 70) adjusted -= 1;
  else if (current >= 40) adjusted = Math.max(1, adjusted - (adjusted >= 4 ? 1 : 0));
  return Math.max(0, adjusted);
}

function snapshotStats() {
  return {
    academic: state.academic,
    skill: state.skill,
    social: state.social,
    energy: state.energy,
    mood: state.mood,
    money: state.money,
    ranks: { academic: rank(state.academic), skill: rank(state.skill), social: rank(state.social) }
  };
}

function summarizeStatChanges(before, after, delta) {
  const changes = [];
  ["academic", "skill", "social"].forEach((key) => {
    const amount = after[key] - before[key];
    if (amount) changes.push(statChange(key, amount, `${statLabels[key]}が ${signed(amount)} 上がった！`));
  });
  const energyAmount = after.energy - before.energy;
  if (energyAmount) {
    const full = delta.energyTo === 100 && after.energy === 100;
    changes.push(statChange("energy", energyAmount, full ? "体力が全回復した！" : `体力が ${signed(energyAmount)} ${energyAmount > 0 ? "回復した" : "減った"}！`, full));
  }
  const moodAmount = after.mood - before.mood;
  if (moodAmount) {
    changes.push(statChange("mood", moodAmount, `満足度が「${moodLevels[before.mood]}」から「${moodLevels[after.mood]}」になった！`, moodAmount > 0));
  }
  const moneyAmount = after.money - before.money;
  if (moneyAmount) {
    changes.push(statChange("money", moneyAmount, `お金が ${signed(moneyAmount)}G ${moneyAmount > 0 ? "増えた" : "減った"}！`));
  }
  const rankUps = ["academic", "skill", "social"].flatMap((key) => {
    const from = before.ranks[key];
    const to = after.ranks[key];
    if (from !== to && rankValue(to) > rankValue(from)) {
      return [{ key, text: `${statLabels[key]}が ${from} から ${to} に上がった！`, route: unlockedRouteByRank(key, to) }];
    }
    return [];
  });
  return { changes, rankUps };
}

function statChange(key, amount, text, special = false) {
  const magnitude = Math.abs(amount);
  const level = special || magnitude >= 10 ? "special" : magnitude >= 5 ? "strong" : "normal";
  return { key, amount, text, level };
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function rankValue(value) {
  return ["G", "F", "E", "D", "C", "B", "A", "S"].indexOf(value);
}

function unlockedRouteByRank(key, toRank) {
  if (rankValue(toRank) < rankValue("D")) return "";
  if (key === "academic") return "進学校準備ルート";
  if (key === "skill") return "部活強豪ルート / 表現・個性ルート";
  if (key === "social") return "人気者・友達ルート";
  return "";
}

function startEffectCapture() {
  state.effectBuffer = { changes: [], rankUps: [], cards: [], notices: [] };
}

function finishEffectCapture() {
  const effects = state.effectBuffer || { changes: [], rankUps: [], cards: [], notices: [] };
  state.effectBuffer = null;
  return effects;
}

function addNotice(text, level = "normal") {
  log(text);
  if (state.effectBuffer) state.effectBuffer.notices.push({ text, level });
}

function showOutcome(text, effects, after) {
  state.pendingOutcome = { text, effects };
  state.afterOutcome = after;
  state.mode = "outcome";
  render();
}

function continueOutcome() {
  const after = state.afterOutcome;
  state.pendingOutcome = null;
  state.afterOutcome = null;
  state.mode = "action";
  if (after) after();
  else render();
}

function energyMod() {
  if (state.energy >= 70) return 1;
  if (state.energy >= 40) return 0;
  if (state.energy >= 20) return -2;
  return -99;
}

function moodMod() {
  return [-2, -1, 0, 1, 2][state.mood];
}

function boostFor(actionKey, action) {
  let total = 0;
  state.boosts.forEach((boost) => {
    if (boost.kind === actionKey) total += boost.amount;
    if (boost.kind === "study" && action.stat === "academic") total += boost.amount;
    if (boost.kind === "skill" && (action.stat === "skill" || action.secondStat === "skill")) total += boost.amount;
    if (boost.kind === "play" && action.stat === "social") total += boost.amount;
  });
  return total;
}

function addBoost(kind, amount, turns) {
  state.boosts.push({ kind, amount, turns });
  const labels = { study: "次の勉強効果が強化された！", skill: "習い事・部活の効果が強化された！", play: "次の遊ぶ効果が強化された！" };
  addNotice(labels[kind] || "次の行動効果が強化された！", "strong");
}

function improveMoodItem() {
  if (state.turnIndex - state.lastMoodItemTurn < 3) {
    log("気分転換セットはまだ続けて使えない。");
    return false;
  }
  state.lastMoodItemTurn = state.turnIndex;
  changeStats({ mood: state.mood + 1 });
  return true;
}

function addCard(name, category, rarity, description) {
  const current = timeline[state.turnIndex];
  const card = { name, category, rarity, description, date: current.date };
  state.cards.push(card);
  log(`カード獲得：${name}`);
  if (state.effectBuffer) state.effectBuffer.cards.push(card);
}

function currentInfo() {
  return timeline[state.turnIndex];
}

function render() {
  const info = currentInfo();
  $("stageName").textContent = info.stage;
  $("turnLabel").textContent = `${info.turn} / 45`;
  $("yearLabel").textContent = info.date;
  $("chapterTitle").textContent = displayChapterTitle(info);
  $("stats").innerHTML = statHtml();
  $("logList").innerHTML = state.logs.map((item) => `<div class="log-item">${escapeHtml(item)}</div>`).join("");
  $("latestCards").innerHTML = state.cards.slice(-4).map(cardHtml).join("") || `<div class="log-item">まだカードはありません。</div>`;
  renderMain();
}

function displayChapterTitle(info) {
  if (state.mode === "action") return "今月の選択";
  return info.title;
}

function statHtml() {
  const rows = [
    ["学力", "academic"], ["スキル", "skill"], ["社交性", "social"]
  ].map(([label, key]) => `
    <div class="stat-row">
      <strong>${label}</strong>
      <div class="bar"><span style="width:${state[key]}%"></span></div>
      <span class="rank-badge rank-${rank(state[key]).toLowerCase()}">${rank(state[key])} ${state[key]}</span>
    </div>`).join("");
  return `${rows}
    <div class="stat-row">
      <strong>体力</strong>
      <div class="bar vital"><span style="width:${state.energy}%"></span></div>
      <span>${state.energy}/100</span>
    </div>
    <div class="mood">満足度：${moodLevels[state.mood]}</div>
    <div class="money">お金：${state.money.toLocaleString()}G</div>`;
}

function renderMain() {
  $("chanceBox").classList.add("hidden");
  const info = currentInfo();
  if (state.mode === "outcome") return renderOutcome();
  if (state.mode === "examReveal") return renderExamReveal();
  if (state.mode === "event") return renderEvent();
  if (state.mode === "result") return renderResult();
  const routeNotice = routeStatusText();
  $("message").textContent = `${info.date}\n${monthPrompt(info)}${routeNotice}`;
  $("choices").innerHTML = availableActions().map(([key, action]) => `
    <button class="choice-button" type="button" data-action="${key}">
      ${action.label}<small>${action.desc}</small>
    </button>
  `).join("");
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => doAction(button.dataset.action));
  });
  renderChance();
}

function renderOutcome() {
  const outcome = state.pendingOutcome || { text: "", effects: {} };
  const effects = outcome.effects || {};
  const changes = effects.changes || [];
  const rankUps = effects.rankUps || [];
  const cards = effects.cards || [];
  const notices = effects.notices || [];
  $("message").textContent = outcome.text;
  $("choices").innerHTML = `
    <div class="outcome-stage">
      <h2>今回の結果</h2>
      <div class="effect-grid">
        ${changes.map(effectHtml).join("") || `<div class="effect-card normal">変化は静かだった。</div>`}
      </div>
      ${rankUps.length ? `<div class="rankup-box">${rankUps.map(rankUpHtml).join("")}</div>` : ""}
      ${notices.length ? `<div class="notice-box">${notices.map((notice) => `<p>${escapeHtml(notice.text)}</p>`).join("")}</div>` : ""}
      ${cards.length ? `<div class="card-gain-box"><strong>カード獲得！</strong>${cards.map((card) => `<p>${escapeHtml(card.name)} <span>${escapeHtml(card.rarity)}</span></p>`).join("")}</div>` : ""}
      <button class="primary-button next-button" id="nextOutcome" type="button">次へ</button>
    </div>
  `;
  $("nextOutcome").addEventListener("click", continueOutcome);
}

function effectHtml(effect) {
  return `<div class="effect-card ${effect.level} ${effect.key}">
    <span>${escapeHtml(statLabels[effect.key] || "変化")}</span>
    <strong>${escapeHtml(effect.text)}</strong>
  </div>`;
}

function rankUpHtml(rankUp) {
  const routeText = rankUp.route ? `<small>新しいルートが開放されました！<br>「${escapeHtml(rankUp.route)}」が選べるようになりました。</small>` : "";
  return `<p><strong>${escapeHtml(rankUp.text)}</strong>${routeText}</p>`;
}

function routeStatusText() {
  const texts = [];
  if (state.cramSchool && state.turnIndex >= 8 && state.turnIndex <= 11) {
    texts.push(`\n中学受験合格可能性：${examChance()}%`);
  }
  if (state.routes.length) texts.push(`\n歩んでいるルート：${state.routes.join(" / ")}`);
  return texts.join("");
}

function monthPrompt(info) {
  const prompts = {
    "小学校": "少しずつ、自分の得意なことや苦手なことが見えてきた。\n今月、何を大切にして過ごそう？",
    "中学校": "新しい人間関係の中で、毎日のリズムが形になっていく。\n今月、何を大切にして過ごそう？",
    "高校": "選べることが増えるほど、迷う時間も増えてきた。\n今月、何を大切にして過ごそう？",
    "大学": "自由な時間の使い方が、そのまま自分の輪郭になっていく。\n今月、何を大切にして過ごそう？",
    "社会に出る前": "ここまでの選択が、静かに背中を押している。\n今月、何を大切にして過ごそう？"
  };
  return prompts[info.stage] || "今月、何を大切にして過ごそう？";
}

function availableActions() {
  const stage = currentInfo().stage;
  const keys = [...state.unlocked].filter((key) => key !== "lesson" || (stage === "小学校" || stage === "中学校"));
  if (state.turnIndex >= 13) keys.push("club");
  if (stage === "高校" || stage === "大学" || stage === "社会に出る前") keys.push(...maturedLessonActions());
  if (state.turnIndex >= 24 && state.social >= 35) keys.push("romance");
  if (state.turnIndex >= 30) keys.push("work", ...universityActionKeys());
  return [...new Set(keys)].filter((key) => actions[key]).map((key) => [key, actions[key]]);
}

function maturedLessonActions() {
  if (state.lessonStatus === "quit" || !state.lesson) return [];
  if (state.lessonStatus === "club" || state.lesson === "サッカー") return ["club"];
  if (state.lesson === "ピアノ") return ["expression"];
  if (state.lesson === "英会話") return ["language"];
  if (state.lesson === "プログラミング") return ["create"];
  return [];
}

function universityActionKeys() {
  const route = state.currentUniversityRoute;
  if (!route) return ["intern"];
  return {
    study_abroad: state.studyAbroadDeparted ? ["language"] : ["abroad", "language"],
    startup: ["startup", "create"],
    internship: ["intern", "deepen"],
    sports_specialty: ["club", "deepen"],
    circle_network: ["play", "romance"],
    research: ["deepen", "intern"],
    local_stable: ["work", "deepen"],
    free_explore: ["play", "language", "intern"]
  }[route] || ["intern"];
}

function doAction(key) {
  const action = actions[key];
  recordAction(key);
  if (state.energy < 20 && key !== "rest") {
    startEffectCapture();
    changeStats({ energy: 12, mood: Math.max(0, state.mood - 1) });
    addHidden({ 安定志向: 1 });
    addCard("布団の中の作戦会議", "休息", "Common", "動けない日にも、次のための静かな準備があった。");
    log("体力が足りず、予定はうまく進まなかった。少し休んで立て直した。");
    showOutcome("体が重くて、予定していたことはうまく進まなかった。\n今日は少し休んで、次に動くための時間にした。", finishEffectCapture(), nextTurn);
    return;
  }

  startEffectCapture();
  const mod = key === "rest" ? 0 : energyMod() + moodMod() + boostFor(key, action);
  const gain = Math.max(0, (action.base || 0) + mod);
  const delta = action.fullRest ? { energyTo: 100, money: action.money || 0, cap: action.cap || 5 } : { energy: action.energy || 0, money: action.money || 0, cap: action.cap || 5 };
  if (action.stat) delta[action.stat] = gain;
  if (action.secondStat) delta[action.secondStat] = Math.max(1, Math.floor(gain / 2));
  if (key === "lesson") applyLessonFlavor(delta);
  changeStats(delta);
  addHidden(action.hidden);
  log(`${action.label}を選んだ。`);
  tickBoosts();
  maybeMilestoneCard(key);
  showOutcome(actionResultText(key), finishEffectCapture(), afterMainAction);
}

function recordAction(key) {
  const stage = currentInfo().stage;
  const label = actions[key]?.label || key;
  state.actionCounts[label] = (state.actionCounts[label] || 0) + 1;
  state.stageActionCounts[stage] = state.stageActionCounts[stage] || {};
  state.stageActionCounts[stage][label] = (state.stageActionCounts[stage][label] || 0) + 1;
}

function actionResultText(key) {
  return {
    study: "今日は集中して机に向かうことができた。\n苦手だった問題も、少しだけ分かるようになった。",
    play: "友達や自分の時間を楽しんだ。\n何気ない会話が、少しだけ世界を広げてくれた。",
    rest: "しっかり眠って、体の奥から軽くなった。\n明日からまた動けそうだ。",
    lesson: "続けてきたことに向き合った。\n昨日より少し、手応えが残った。",
    exam: "目標に向けて、いつもより深く集中した。\n積み上げた時間が、未来の選択肢を少し広げた。",
    club: "放課後の熱量に飛び込んだ。\n声を出して動くうちに、自分の輪郭が少し強くなった。",
    expression: "音や表現に向き合った。\nうまく言えない気持ちが、少しだけ形になった。",
    language: "言葉を学ぶ時間を作った。\n知らない場所への距離が、ほんの少し縮まった気がした。",
    create: "手を動かして、アイデアを形にしてみた。\n小さな完成が、次の工夫を呼んでくれた。",
    deepen: "ひとつのことを深く掘ってみた。\n分からない部分が見えたことも、ちゃんと前進だった。",
    romance: "誰かを想う時間を過ごした。\n言葉にする前の気持ちも、大切な経験になった。",
    work: "働く時間の中で、少しだけ社会に触れた。\n自分で選んだ責任が、手のひらに残った。",
    abroad: "知らない場所へ向かう準備を進めた。\nまだ見ぬ景色が、少し現実に近づいた。",
    startup: "小さな企画を現実に近づけた。\nうまくいくか分からないからこそ、胸が少し熱くなった。",
    intern: "仕事の現場に触れてみた。\n教室だけでは分からない空気を、少し吸い込んだ。"
  }[key] || "今月の選択が、少しだけ自分を変えた。";
}

function applyLessonFlavor(delta) {
  if (state.lesson === "サッカー") delta.social = (delta.social || 0) + 1;
  if (state.lesson === "ピアノ") addHidden({ 計画志向: 1, 自立志向: 1 });
  if (state.lesson === "英会話") delta.academic = (delta.academic || 0) + 1;
  if (state.lesson === "プログラミング") delta.academic = (delta.academic || 0) + 1;
}

function statName(key) {
  return { academic: "学力", skill: "スキル", social: "社交性" }[key] || "変化";
}

function tickBoosts() {
  state.boosts.forEach((boost) => boost.turns -= 1);
  state.boosts = state.boosts.filter((boost) => boost.turns > 0);
}

function afterMainAction() {
  const fixed = fixedEventForTurn();
  if (fixed) {
    state.pendingEvent = fixed;
    state.mode = "event";
    render();
    return;
  }
  if (Math.random() < naturalEventRate()) {
    state.pendingEvent = randomNaturalEvent();
    state.mode = "event";
    render();
    return;
  }
  nextTurn();
}

function naturalEventRate() {
  if (state.turnIndex >= 42) return 1;
  return 0.72;
}

function fixedEventForTurn() {
  const turn = state.turnIndex + 1;
  if (turn === 3) return lessonEvent();
  if (turn === 8 && state.lesson && state.lessonStatus !== "quit") return lessonReviewEvent();
  if (turn === 7) return cramEvent();
  if (turn === 12) return juniorExamEvent();
  if (turn === 13) return routeEvent("中学校で大切にしたいこと", juniorRoutes());
  if (turn === 14 && state.lesson && state.lessonStatus !== "quit") return juniorLessonDecisionEvent();
  if (turn === 19) return routeEvent("高校受験で目指す場所", highSchoolRoutes());
  if (turn === 21) return highSchoolDecisionEvent();
  if (turn === 28) return routeEvent("高校の先に向けて準備する", preUniversityRoutes());
  if (turn === 30) return universityDecisionEvent();
  if (turn === 32) return universityActionEvent();
  if (turn === 37) return universityRouteDevelopmentEvent();
  if (turn === 43) return albumReflectEvent();
  if (turn === 44) return finalValueEvent();
  if (turn === 45) {
    state.mode = "result";
    return null;
  }
  if ([6, 10, 15, 18, 23, 25, 27, 35, 39, 42].includes(turn)) return themedEvent();
  return null;
}

function lessonEvent() {
  return {
    title: "親から「何か習い事を始めてみる？」と聞かれた。",
    choices: ["サッカー", "ピアノ", "英会話", "プログラミング", "何もしない"].map((name) => ({
      label: name,
      text: name === "何もしない" ? "今は自由な時間を大切にする。" : `${name}を始める。`,
      apply: () => {
        if (name !== "何もしない") {
          state.lesson = name;
          state.lessonStatus = "active";
          state.unlocked.add("lesson");
          changeStats({ skill: 4, social: name === "サッカー" ? 2 : 0, academic: ["英会話", "プログラミング"].includes(name) ? 2 : 0 });
          addHidden(lessonHidden(name));
          addCard(`はじめての${name}`, "習い事", "Rare", "小さな好奇心が、続く時間の入口になった。");
        } else {
          changeStats({ energy: 15, social: 2 });
          addHidden({ 直感志向: 2, 安定志向: 1 });
          addCard("空き地の午後", "日常", "Rare", "何もしない時間にも、ちゃんと育つものがあった。");
        }
      }
    }))
  };
}

function lessonHidden(name) {
  return {
    サッカー: { 協調志向: 2, 達成志向: 1 },
    ピアノ: { 計画志向: 2, 自立志向: 1 },
    英会話: { 探索志向: 2, 挑戦志向: 1 },
    プログラミング: { 自立志向: 2, 探索志向: 1 }
  }[name] || {};
}

function lessonReviewEvent() {
  return {
    title: "習い事を続けるか迷う日",
    choices: [
      { label: "今の習い事を続ける", text: `${state.lesson}を続けることにした。少し迷ったぶん、続ける理由が前よりはっきりした。`, apply: () => { changeStats({ skill: 2, cap: 5 }); addHidden({ 達成志向: 2, 安定志向: 1 }); addCard("続ける理由", "習い事", "Rare", "迷ったあとに続けると決めた時間は、少し強かった。"); } },
      { label: "別の習い事に変える", text: "新しいことを試してみることにした。前の経験も、次の入口でちゃんと役に立った。", apply: () => { state.lesson = nextLessonType(); state.lessonStatus = "active"; state.unlocked.add("lesson"); changeStats({ skill: 2, social: 1, cap: 5 }); addHidden({ 探索志向: 2, 自立志向: 1 }); addCard(`新しい${state.lesson}`, "習い事", "Rare", "途中で変えることも、自分を知るための大切な選択だった。"); } },
      { label: "習い事をやめる", text: "いったん習い事から離れることにした。空いた時間に、別の自分が見えてきそうだ。", apply: () => { state.lessonStatus = "quit"; state.unlocked.delete("lesson"); changeStats({ social: 2, energy: 10, mood: Math.min(4, state.mood + 1), cap: 5 }); addHidden({ 探索志向: 2, 自立志向: 1 }); addCard("空いた放課後", "分岐", "Rare", "やめたことで、別の時間の使い方が始まった。"); } }
    ]
  };
}

function nextLessonType() {
  const options = ["サッカー", "ピアノ", "英会話", "プログラミング"].filter((name) => name !== state.lesson);
  return options[Math.floor(Math.random() * options.length)];
}

function juniorLessonDecisionEvent() {
  return {
    title: "中学生になって、習い事をどうする？",
    choices: [
      { label: "そのまま続ける", text: `${state.lesson}をもう少し続けることにした。部活や勉強と両立しながら、自分のペースを探していく。`, apply: () => { state.lessonStatus = "active"; state.unlocked.add("lesson"); changeStats({ skill: 2, energy: -6, cap: 5 }); addHidden({ 達成志向: 2, 安定志向: 1 }); } },
      { label: "部活に切り替える", text: "中学校では、習い事で身につけたものを部活につなげることにした。放課後の景色が少し変わった。", apply: () => { state.lessonStatus = "club"; state.unlocked.delete("lesson"); changeStats({ skill: 2, social: 2, energy: -6, cap: 5 }); addHidden({ 協調志向: 2, 達成志向: 2 }); addCard("放課後の入部届", "部活", "Rare", "続けてきた経験が、仲間と過ごす時間へつながった。"); } },
      { label: "一度やめて、別のことを探す", text: "一度立ち止まって、別のことを探してみることにした。決めきらない時間にも、意味がありそうだ。", apply: () => { state.lessonStatus = "quit"; state.unlocked.delete("lesson"); changeStats({ social: 1, energy: 8, mood: Math.min(4, state.mood + 1), cap: 5 }); addHidden({ 探索志向: 2, 自立志向: 2 }); addCard("探し直す春", "分岐", "Rare", "続けない選択も、新しい入口になった。"); } }
    ]
  };
}

function cramEvent() {
  return {
    title: "小4の春、塾のチラシをもらった。中学受験という道もあるらしい。",
    choices: shuffle([
      { label: "塾に入る", text: "受験勉強する行動が開放される。", apply: () => { state.cramSchool = true; state.unlocked.add("exam"); changeStats({ academic: 4, energy: -10, money: -1500 }); addHidden({ 計画志向: 2, 達成志向: 1 }); addCard("夜の参考書", "勉強", "Rare", "机の灯りが、少し先の未来を照らした。"); } },
      { label: "体験だけ行く", text: "少し学び、選択は保留する。", apply: () => { changeStats({ academic: 2, social: 1 }); addHidden({ 探索志向: 1, 計画志向: 1 }); } },
      { label: "地元の友達と過ごす", text: "今の生活を大切にする。", apply: () => { changeStats({ social: 3, energy: 5, mood: Math.min(4, state.mood + 1) }); addHidden({ 協調志向: 2, 安定志向: 1 }); } }
    ])
  };
}

function juniorExamEvent() {
  const chance = examChance();
  const success = chance >= Math.floor(Math.random() * 100);
  return {
    title: state.cramSchool ? "中学受験の結果発表の日が来た。" : "小学校卒業。地元の中学へ進む日が来た。",
    choices: state.cramSchool ? [
      { label: "封筒を受け取る", text: success ? juniorSuccessText() : juniorFailureText(), examReveal: examReveal({
        intro: "中学受験の結果発表の日が来た。\n封筒を開く手が少し震える。\nここまで積み上げてきた日々の結果が、今わかる。",
        success,
        successText: juniorSuccessText(),
        failureText: juniorFailureText(),
        apply: () => {
        state.juniorSchool = success ? "私立中学" : "地元中学";
        if (success) { changeStats({ academic: 4, mood: 3 }); addCard("開かれたドア", "進学", "Epic", "頑張った時間が、新しい廊下につながった。"); }
        else { changeStats({ social: 3, mood: 2 }); addCard("不合格通知", "分岐", "Epic", "悔しさも、別の道を照らす灯りになった。"); }
        state.routes.push(state.juniorSchool);
        state.routeChoices.push(state.juniorSchool);
      } }) }
    ] : [
      { label: "地元中学へ進む", text: "同じ街で、次の季節が始まる。", apply: () => { state.juniorSchool = "地元中学"; state.routes.push("地元中学"); state.routeChoices.push("地元中学"); changeStats({ social: 3, mood: 3, cap: 5 }); addCard("何気ない帰り道", "日常", "Rare", "いつもの道が、次の始まりになった。"); } }
    ]
  };
}

function examReveal(config) {
  return {
    intro: config.intro,
    success: config.success,
    successText: config.successText,
    failureText: config.failureText,
    apply: config.apply,
    after: config.after || nextTurn
  };
}

function juniorSuccessText() {
  return "お母さんが、少し涙ぐみながら笑ってくれた。\n学校の先生も「よく頑張ったな」と声をかけてくれた。\n塾の先生は、何度も頷きながら「最後まで伸びたね」と言ってくれた。\nこれまでの努力が、ひとつの形になった。";
}

function juniorFailureText() {
  return "少しだけ、時間が止まったように感じた。\nでも、ここまで机に向かった時間も、悩みながら続けた日々も、なくなるわけではない。\nお母さんは「よく頑張ったね」と言ってくれた。\n先生も「この経験は、次に必ず残る」と話してくれた。\n新しい場所で、また次の生活が始まる。";
}

function examChance() {
  let chance = state.academic < 40 ? 20 : state.academic < 55 ? 40 : state.academic < 65 ? 60 : state.academic < 75 ? 75 : 90;
  if (state.cramSchool) chance += 10;
  if (state.energy < 25) chance -= 15;
  if (state.hidden["計画志向"] >= 12) chance += 5;
  if (state.mood === 0) chance -= 10;
  return clamp(chance, 5, 95);
}

function routeEvent(title, routes) {
  return {
    title,
    choices: routes.map((route) => ({
      label: route.name,
      text: route.ok ? route.desc : `ロック：${route.need}`,
      locked: !route.ok,
      apply: () => {
        state.routes.push(route.name);
        state.routeChoices.push(route.name);
        if (route.uniKey) {
          state.currentUniversityRoute = route.uniKey;
          state.universityRouteLabel = route.name;
          state.studyAbroadDeparted = false;
        }
        changeStats(route.delta || {});
        addHidden(route.hidden || {});
        addCard(route.card || route.name, "ルート", route.rarity || "Rare", route.desc);
        addNotice(`新しいルートが開放されました！「${route.name}」が選べるようになりました。`, "special");
      }
    }))
  };
}

function juniorRoutes() {
  return [
    route("進学校準備ルート", state.academic >= 40, "学力D以上", "勉強を軸にしながら、中学生活を組み立てる。", { academic: 3 }, { 計画志向: 2 }),
    route("部活強豪ルート", state.skill >= 40 || state.lesson === "サッカー", "スキルD以上 またはサッカー経験", "放課後の熱量に飛び込む。", { skill: 3, energy: -5 }, { 達成志向: 2, 協調志向: 1 }),
    route("人気者・友達ルート", state.social >= 40, "社交性D以上", "人とのつながりを広げる。", { social: 3 }, { 協調志向: 2, 直感志向: 1 }),
    route("表現・個性ルート", state.skill >= 40 || ["ピアノ", "プログラミング"].includes(state.lesson), "スキルD以上 または専門系習い事", "自分だけの得意を深める。", { skill: 3 }, { 自立志向: 2, 探索志向: 1 }),
    route("地元バランスルート", true, "常に選択可能", "無理せず、いろいろな時間を味わう。", { energy: 8, social: 1 }, { 安定志向: 2 })
  ];
}

function highSchoolRoutes() {
  return [
    route("偏差値上位高校", state.academic >= 70, "学力B以上", "高い目標に囲まれる高校生活。", { academic: 4, energy: -8 }, { 計画志向: 2, 達成志向: 2 }),
    route("部活強豪校", state.skill >= 70, "スキルB以上", "練習と大会が生活の中心になる。", { skill: 4, energy: -10 }, { 達成志向: 3 }),
    route("人間関係充実高校", state.social >= 70, "社交性B以上", "友達、文化祭、恋愛の多い日々。", { social: 4 }, { 協調志向: 2, 直感志向: 2 }),
    route("特色・専門高校", state.skill >= 55, "スキルC以上", "個性と専門性を伸ばす環境。", { skill: 4 }, { 自立志向: 2, 探索志向: 2 }),
    route("地元高校", true, "常に選択可能", "慣れた街で自由に育つ。", { energy: 10 }, { 安定志向: 2 })
  ];
}

function universityRoutes() {
  return [
    route("留学ルート", state.academic >= 55 && state.skill >= 55 && state.money >= 18000, "学力C以上・スキルC以上・18000G以上", "知らない街の朝を見に行く。", { academic: 2, skill: 2, money: -9000, cap: 6 }, { 探索志向: 3, 挑戦志向: 2 }, "知らない街の朝", "Epic", "study_abroad"),
    route("起業・プロジェクトルート", state.skill >= 65 && state.social >= 50 && state.money >= 12000, "スキルB付近・社交性C以上・12000G以上", "小さな企画を現実に変える。", { skill: 2, social: 2, money: -6000, cap: 6 }, { 自立志向: 3, 挑戦志向: 2 }, "失敗した企画書", "Epic", "startup"),
    route("インターン・キャリア探索ルート", state.academic >= 45 || state.skill >= 45, "学力D以上 または スキルD以上", "働き方や社会との関わりを探す。", { skill: 2, money: 2000, cap: 6 }, { 計画志向: 2, 自立志向: 2 }, "名刺のない挑戦", "Rare", "internship"),
    route("体育会・専門継続ルート", state.skill >= 60, "スキルC後半以上", "続けた力を次の舞台へ運ぶ。", { skill: 2, cap: 6 }, { 達成志向: 2, 安定志向: 1 }, null, null, "sports_specialty"),
    route("サークル・人脈ルート", state.social >= 60, "社交性C後半以上", "人との出会いから世界を広げる。", { social: 2, cap: 6 }, { 協調志向: 2, 直感志向: 1 }, null, null, "circle_network"),
    route("専門探究ルート", state.academic >= 50 && state.money >= 7000, "学力C付近・7000G以上", "ひとつの問いを深く掘る。", { academic: 2, skill: 2, money: -3000, cap: 6 }, { 探索志向: 2, 計画志向: 1 }, null, null, "research"),
    route("地元・堅実ルート", true, "常に選択可能", "暮らしの足場を大切にする。", { energy: 8, money: 1000, cap: 6 }, { 安定志向: 3 }, null, null, "local_stable"),
    route("自由探索ルート", true, "常に選択可能", "まだ決めきれない時間も含めて、複数の選択肢を試す。", { social: 1, skill: 1, cap: 6 }, { 探索志向: 3, 直感志向: 1 }, "旅先のメモ", "Rare", "free_explore")
  ];
}

function preUniversityRoutes() {
  return [
    route("受験に集中する", state.academic >= 40, "学力D以上", "最後の追い込みに向けて、学ぶ時間を増やす。", { academic: 2, energy: -8, cap: 5 }, { 計画志向: 2, 達成志向: 1 }),
    route("推薦・専門活動を磨く", state.skill >= 40, "スキルD以上", "得意なことを進路につなげる準備をする。", { skill: 2, energy: -8, cap: 5 }, { 達成志向: 2, 自立志向: 1 }),
    route("人とのつながりを大切にする", state.social >= 40, "社交性D以上", "相談や出会いの中で、次の進路を考える。", { social: 2, cap: 5 }, { 協調志向: 2, 直感志向: 1 }),
    route("まだ決めすぎずに探す", true, "常に選択可能", "焦らずに、いくつかの可能性を見比べる。", { energy: 5, cap: 5 }, { 探索志向: 2, 直感志向: 1 })
  ];
}

function route(name, ok, need, desc, delta, hidden, card, rarity, uniKey) {
  return { name, ok, need, desc, delta, hidden, card, rarity, uniKey };
}

function highSchoolDecisionEvent() {
  return {
    title: "高校受験の結果発表の日が来た。",
    choices: highSchoolRoutes().filter((r) => r.ok).map((r) => {
      const success = r.name.includes("地元") || state.academic >= 45 || state.skill >= 45 || state.social >= 45;
      return {
        label: r.name,
        text: success ? highSchoolSuccessText(r.name) : examFailureText("高校受験"),
        examReveal: examReveal({
          intro: "高校受験の結果発表の日が来た。\n掲示板の前で、胸の音がやけに大きく聞こえる。\nここまでの毎日が、今ひとつの結果になる。",
          success,
          successText: highSchoolSuccessText(r.name),
          failureText: examFailureText("高校受験"),
          apply: () => {
            const routeName = success ? r.name : "地元高校";
            state.routes.push(routeName);
            state.routeChoices.push(routeName);
            changeStats(success ? r.delta : { social: 2, mood: 2 });
            addHidden(success ? r.hidden : { 安定志向: 2, 達成志向: 1 });
            addCard(success ? r.name : "次の教室", "進学", success ? "Rare" : "Epic", success ? r.desc : "届かなかった結果の先にも、新しい教室と日々が待っていた。");
          }
        })
      };
    })
  };
}

function universityDecisionEvent() {
  const routes = universityRoutes().filter((r) => r.ok);
  if (!routes.some((r) => r.name.includes("難関")) && state.academic < 45) routes.push(route("浪人・再挑戦ルート", true, "大学受験失敗時", "もう一年、自分のペースで挑み直す。", { academic: 5, money: -3000, mood: 2 }, { 達成志向: 2, 安定志向: 1 }, "再挑戦の春", "Epic"));
  return {
    title: "大学受験の結果発表の日が来た。",
    choices: routes.map((r) => {
      const success = !r.name.includes("浪人");
      return {
        label: r.name,
        text: success ? universitySuccessText(r.name) : examFailureText("大学受験"),
        examReveal: examReveal({
          intro: "大学受験の結果発表の日が来た。\n画面を開く指先に、少し力が入る。\nここまで積み上げてきた日々の結果が、今わかる。",
          success,
          successText: universitySuccessText(r.name),
          failureText: examFailureText("大学受験"),
          apply: () => {
            state.routes.push(r.name);
            state.routeChoices.push(r.name);
            if (r.uniKey) {
              state.currentUniversityRoute = r.uniKey;
              state.universityRouteLabel = r.name;
              state.studyAbroadDeparted = false;
            }
            changeStats(r.delta);
            addHidden(r.hidden);
            addCard(r.card || r.name, "進学", r.rarity || "Rare", r.desc);
          }
        })
      };
    })
  };
}

function highSchoolSuccessText(routeName) {
  return `合格通知の文字が、ゆっくり目に入ってきた。\n先生が「ここからがまた面白いぞ」と笑ってくれた。\n友達からのメッセージが、少し遅れて何件も届いた。\n${routeName}で、新しい高校生活が始まる。`;
}

function universitySuccessText(routeName) {
  return `画面の中に、待っていた結果が表示された。\n家族がほっと息をつき、少しだけ部屋が明るくなった気がした。\nこれまでの努力と迷いが、次の場所につながった。\n${routeName}で、また新しい日々が始まる。`;
}

function examFailureText(label) {
  return `結果は、届かなかった。\n少しだけ、時間が止まったように感じた。\nでも、${label}に向き合った時間も、悩みながら続けた日々も、なくなるわけではない。\n「この経験は、次に必ず残る」と先生が話してくれた。\n新しい場所で、また次の生活が始まる。`;
}

function universityActionEvent() {
  return {
    title: "大学生活が始まった。自由な時間を何に使おう？",
    choices: shuffle([
      { label: "サークルに入る", text: "人との出会いを増やす。", apply: () => { state.unlocked.add("romance"); changeStats({ social: 4, energy: -8 }); addHidden({ 協調志向: 2, 直感志向: 1 }); addCard("新歓の輪", "大学", "Common", "ぎこちない自己紹介から、大学の日々がほどけていった。"); } },
      { label: "バイトを始める", text: "お金を稼ぐ行動が増える。", apply: () => { state.unlocked.add("work"); changeStats({ money: 4000, energy: -10 }); addHidden({ 自立志向: 2, 安定志向: 1 }); addCard("初めての給料日", "仕事", "Rare", "自分で得たお金は、少し重くて嬉しかった。"); } },
      { label: "専門を探す", text: "ゼミや探究の入口を探す。", apply: () => { state.unlocked.add("intern"); changeStats({ academic: 2, skill: 2 }); addHidden({ 探索志向: 2, 計画志向: 1 }); } }
    ])
  };
}

function universityRouteDevelopmentEvent() {
  const route = state.currentUniversityRoute || "free_explore";
  const labels = {
    study_abroad: "留学先で、自分の輪郭を見直す時期が来た。",
    startup: "プロジェクトを続けるか、形を変えるか考える時期が来た。",
    internship: "働くことと学生生活の距離を考える時期が来た。",
    sports_specialty: "続けてきた活動を、次の生活にどう残すか考える時期が来た。",
    circle_network: "人とのつながりが、将来の選択にも影響し始めた。",
    research: "専門に向き合うほど、自分の問いがはっきりしてきた。",
    local_stable: "無理のない暮らしの中で、将来の足場を考える時期が来た。",
    free_explore: "まだ決めきれないまま、いくつかの道が並んでいる。"
  };
  return {
    title: labels[route],
    choices: routeEventChoices(route)
  };
}

function routeEventChoices(route) {
  const map = {
    study_abroad: [
      choice("現地の友人と話す", "違う文化の中で、当たり前だと思っていたことを見直した。", { social: 2, academic: 1, cap: 5 }, { 探索志向: 2, 協調志向: 1 }, "現地の友人"),
      choice("言葉が通じない日を越える", "うまく話せない悔しさも、次に向かう力になった。", { academic: 2, skill: 1, mood: Math.max(0, state.mood - 1), cap: 5 }, { 挑戦志向: 2, 達成志向: 1 }),
      choice("日本にいた頃の自分を振り返る", "遠くから見たことで、自分の大切にしたいものが少し見えた。", { energy: 8, mood: Math.min(4, state.mood + 1), cap: 5 }, { 探索志向: 1, 安定志向: 1 })
    ],
    startup: [
      choice("小さなサービスを作る", "形にしてみると、想像と現実の差が見えてきた。", { skill: 2, energy: -10, money: -800, cap: 5 }, { 自立志向: 2, 挑戦志向: 1 }, "小さなリリース"),
      choice("仲間に声をかける", "一人では進まなかったことが、会話の中で少し動き出した。", { social: 2, skill: 1, cap: 5 }, { 協調志向: 1, 挑戦志向: 2 }),
      choice("続けるかやめるか考える", "立ち止まることで、続けたい理由とやめたい理由が見えた。", { energy: 8, mood: 2, cap: 5 }, { 計画志向: 1, 自立志向: 1 })
    ],
    internship: [
      choice("初めてのインターンに行く", "社会人の会話の速さに驚きながら、自分の現在地を知った。", { skill: 2, money: 1800, energy: -12, cap: 5 }, { 自立志向: 2, 計画志向: 1 }),
      choice("働き方について聞く", "正解は一つではないと知って、将来の見え方が少し柔らかくなった。", { social: 2, academic: 1, cap: 5 }, { 探索志向: 1, 協調志向: 1 }),
      choice("忙しさとの両立を考える", "動く時間と休む時間の配分を、前より真剣に考えた。", { energy: 10, mood: 3, cap: 5 }, { 安定志向: 2, 計画志向: 1 })
    ],
    sports_specialty: [
      choice("練習を続ける", "積み重ねた動きが、少しだけ自分のものになった。", { skill: 2, energy: -12, cap: 5 }, { 達成志向: 2, 安定志向: 1 }),
      choice("後輩に教える", "人に伝えることで、続けてきた意味が少し違って見えた。", { social: 2, skill: 1, cap: 5 }, { 協調志向: 2 }),
      choice("次の続け方を考える", "勝ち負けだけではない残し方を探し始めた。", { energy: 8, academic: 1, cap: 5 }, { 計画志向: 1, 探索志向: 1 })
    ],
    circle_network: [
      choice("旅行の計画を立てる", "予定を合わせるだけで、関係の距離感が少し見えてきた。", { social: 2, money: -800, mood: 4, cap: 5 }, { 協調志向: 2, 直感志向: 1 }, "友人との旅程"),
      choice("恋愛について話す", "誰かの言葉を聞きながら、自分の気持ちも少し整理された。", { social: 2, mood: 3, cap: 5 }, { 直感志向: 2 }),
      choice("将来不安を共有する", "楽しいだけではない話ができる関係も、大切だと思えた。", { academic: 1, social: 1, cap: 5 }, { 協調志向: 1, 安定志向: 1 })
    ],
    research: [
      choice("ゼミで発表する", "考えてきたことを言葉にすると、足りない部分も見えてきた。", { academic: 2, skill: 1, energy: -8, cap: 5 }, { 計画志向: 2, 達成志向: 1 }),
      choice("資格学習を進める", "すぐには見えない積み重ねが、未来の足場になっていく。", { academic: 2, energy: -8, cap: 5 }, { 安定志向: 1, 達成志向: 2 }),
      choice("制作活動に向き合う", "自分の専門が、少しだけ形として外に出た。", { skill: 2, mood: 3, cap: 5 }, { 自立志向: 1, 探索志向: 1 })
    ],
    local_stable: [
      choice("バイトのシフトを整える", "無理のない生活のリズムが、少しずつ見えてきた。", { money: 2200, energy: -8, cap: 5 }, { 安定志向: 2 }),
      choice("家族と話す", "近い人との会話が、遠い未来を考えるきっかけになった。", { social: 1, mood: 3, cap: 5 }, { 協調志向: 1, 安定志向: 2 }),
      choice("地元の友人に会う", "変わらない場所があることに、少し安心した。", { social: 2, energy: 5, cap: 5 }, { 安定志向: 1, 直感志向: 1 })
    ],
    free_explore: [
      choice("短期活動に参加する", "少しだけ違う場所に身を置いて、自分の反応を確かめた。", { skill: 1, social: 1, energy: -8, cap: 5 }, { 探索志向: 2, 挑戦志向: 1 }),
      choice("一人で旅行する", "誰にも合わせない時間の中で、直感が少し戻ってきた。", { social: 1, money: -1200, mood: 4, cap: 5 }, { 自立志向: 2, 直感志向: 1 }, "一人旅の切符"),
      choice("まだ決めない", "決めきれない不安を抱えながらも、急がない選択をした。", { energy: 10, mood: 2, cap: 5 }, { 探索志向: 1, 安定志向: 1 })
    ]
  };
  return shuffle(map[route] || map.free_explore);
}

function albumReflectEvent() {
  return { title: `アルバムには${state.cards.length}枚のカードが並んだ。成功も迷いも、ちゃんと残っている。`, choices: shuffle([
    { label: "頑張った自分を見る", text: "達成した時間を思い出す。", apply: () => addHidden({ 達成志向: 2, 計画志向: 1 }) },
    { label: "出会った人を思い出す", text: "人との時間を思い出す。", apply: () => addHidden({ 協調志向: 2, 直感志向: 1 }) },
    { label: "寄り道を笑う", text: "選ばなかった道にも手を振る。", apply: () => addHidden({ 探索志向: 2, 自立志向: 1 }) }
  ]) };
}

function finalValueEvent() {
  return { title: "社会に出る前夜。最後に、何を大切にして眠ろう？", choices: shuffle([
    { label: "安心できる暮らし", text: "足場があるから遠くへ行ける。", apply: () => addHidden({ 安定志向: 3, 計画志向: 1 }) },
    { label: "まだ見ぬ挑戦", text: "知らない明日を楽しみにする。", apply: () => addHidden({ 挑戦志向: 3, 探索志向: 1 }) },
    { label: "大切な人たち", text: "誰かと笑える未来を選ぶ。", apply: () => addHidden({ 協調志向: 3, 直感志向: 1 }) }
  ]) };
}

function themedEvent() {
  if (currentInfo().stage === "大学" && state.currentUniversityRoute) {
    return universityRouteDevelopmentEvent();
  }
  const pool = [
    { title: "友達から急に遊びに誘われた。", choices: [
      choice("行く", "笑いすぎて帰り道が少し明るい。", { social: 2, energy: -10, mood: 3 }, { 協調志向: 2, 直感志向: 1 }),
      choice("今日は断って勉強する", "少し寂しいけれど、机に向かった。", { academic: 2, mood: 2 }, { 計画志向: 2 }),
      choice("既読をつけずに寝る", "疲れていた自分を守った。", { energy: 15, mood: 1 }, { 安定志向: 1 })
    ] },
    { title: "小さな失敗をして、しばらく引きずっている。", choices: [
      choice("原因をメモする", "次に活かせる形に変えた。", { academic: 1, skill: 1, mood: 2 }, { 計画志向: 2, 達成志向: 1 }, "初めての敗北"),
      choice("誰かに話す", "笑って聞いてもらえて少し軽くなった。", { social: 2, mood: 3 }, { 協調志向: 2 }),
      choice("違うことを試す", "気分を変えたら、別の入口が見えた。", { skill: 2, energy: -5, mood: 3 }, { 探索志向: 2, 挑戦志向: 1 })
    ] },
    { title: "冬、親戚が集まる日。お年玉をもらった。", choices: [
      choice("将来のために貯める", "少し大人になった気がした。", { money: otoshidama(), mood: 3 }, { 安定志向: 2, 計画志向: 1 }),
      choice("必要なものだけ買う", "ほしいものと必要なものを考えた。", { money: otoshidama() - 800, skill: 1, mood: 3 }, { 計画志向: 1, 自立志向: 1 }),
      choice("友達と楽しむ", "思い出にも少し使った。", { money: otoshidama() - 1200, social: 2, mood: 4 }, { 協調志向: 2, 直感志向: 1 })
    ] },
    { title: "いつもの帰り道で、少しだけ遠回りしたくなった。", choices: [
      choice("知らない道へ行く", "見慣れない景色に胸が弾んだ。", { skill: 1, social: 1, energy: -5, mood: 3 }, { 探索志向: 2, 挑戦志向: 1 }, "放課後の秘密基地"),
      choice("まっすぐ帰る", "いつもの安心が体に戻ってきた。", { energy: 8, mood: 2 }, { 安定志向: 2 }),
      choice("誰かを誘う", "遠回りが小さな冒険になった。", { social: 2, energy: -6, mood: 3 }, { 協調志向: 2 })
    ] }
  ];
  const event = pool[Math.floor(Math.random() * pool.length)];
  event.choices = shuffle(event.choices);
  return event;
}

function randomNaturalEvent() {
  return themedEvent();
}

function choice(label, text, delta, hidden, cardName) {
  return { label, text, apply: () => { changeStats(delta); addHidden(hidden); if (cardName && Math.random() < 0.55) addCard(cardName, "記憶", "Common", text); } };
}

function otoshidama() {
  let amount = 3000;
  if (state.academic >= 40) amount += 500;
  if (state.skill >= 40) amount += 500;
  if (state.social >= 40) amount += 500;
  if ([state.academic, state.skill, state.social].some((value) => value >= 70)) amount += 1000;
  return amount;
}

function renderEvent() {
  const event = state.pendingEvent;
  const displayChoices = shuffle(event.choices);
  $("message").textContent = event.title;
  $("choices").innerHTML = displayChoices.map((choiceItem, index) => `
    <button class="choice-button ${choiceItem.locked ? "locked" : ""}" type="button" data-choice="${index}" ${choiceItem.locked ? "disabled" : ""}>
      ${choiceItem.label}${choiceItem.locked ? "<small>まだ選べません</small>" : ""}
    </button>
  `).join("");
  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveEvent(displayChoices[Number(button.dataset.choice)]));
  });
}

function resolveEvent(choiceItem) {
  if (choiceItem.examReveal) {
    state.pendingEvent = null;
    state.pendingExamReveal = { ...choiceItem.examReveal, phase: "intro" };
    state.mode = "examReveal";
    render();
    return;
  }
  startEffectCapture();
  const result = choiceItem.apply();
  const effects = finishEffectCapture();
  if (result === false) return render();
  log(`選択：${choiceItem.label}`);
  state.pendingEvent = null;
  showOutcome(choiceItem.text || `${choiceItem.label}を選んだ。`, effects, () => {
    if (state.turnIndex === 44) {
      state.mode = "result";
      render();
      return;
    }
    nextTurn();
  });
}

function renderExamReveal() {
  const reveal = state.pendingExamReveal;
  if (!reveal) {
    state.mode = "action";
    render();
    return;
  }
  if (reveal.phase === "intro") {
    $("message").textContent = reveal.intro;
    $("choices").innerHTML = `
      <div class="exam-reveal intro">
        <p>封筒を開く手が、少しだけ震えている。</p>
        <button class="primary-button next-button" id="showExamResult" type="button">結果を見る</button>
      </div>
    `;
    $("showExamResult").addEventListener("click", () => {
      reveal.phase = "waiting";
      render();
      window.setTimeout(() => {
        if (state.pendingExamReveal === reveal && reveal.phase === "waiting") {
          reveal.phase = "result";
          startEffectCapture();
          reveal.apply();
          reveal.effects = finishEffectCapture();
          render();
        }
      }, 900);
    });
    return;
  }
  if (reveal.phase === "waiting") {
    $("message").textContent = "結果は……\n……\n……";
    $("choices").innerHTML = `<div class="exam-reveal waiting"><div class="waiting-dots"><span></span><span></span><span></span></div></div>`;
    return;
  }
  $("message").textContent = reveal.success ? reveal.successText : reveal.failureText;
  $("choices").innerHTML = `
    <div class="exam-result ${reveal.success ? "success" : "failure"}">
      <div class="exam-burst" aria-hidden="true"></div>
      <h2>${reveal.success ? "合格！" : "結果は、届かなかった。"}</h2>
      <div class="effect-grid">
        ${(reveal.effects?.changes || []).map(effectHtml).join("")}
      </div>
      ${(reveal.effects?.rankUps || []).length ? `<div class="rankup-box">${reveal.effects.rankUps.map(rankUpHtml).join("")}</div>` : ""}
      ${(reveal.effects?.cards || []).length ? `<div class="card-gain-box"><strong>カード獲得！</strong>${reveal.effects.cards.map((card) => `<p>${escapeHtml(card.name)} <span>${escapeHtml(card.rarity)}</span></p>`).join("")}</div>` : ""}
      <button class="primary-button next-button" id="finishExamReveal" type="button">次へ</button>
    </div>
  `;
  $("finishExamReveal").addEventListener("click", () => {
    const after = reveal.after;
    state.pendingExamReveal = null;
    state.mode = "action";
    if (after) after();
    else nextTurn();
  });
}

function nextTurn() {
  if (state.turnIndex < 44) {
    const prevStage = currentInfo().stage;
    state.turnIndex += 1;
    const nextStage = currentInfo().stage;
    if (prevStage !== nextStage) addCard(`${prevStage}のアルバム`, "ステージ", "Rare", `${prevStage}で過ごした日々を一冊にまとめた。`);
    if (state.turnIndex === 44) state.mode = "result";
  } else {
    state.mode = "result";
  }
  render();
}

function maybeMilestoneCard(key) {
  const cards = {
    study: ["鉛筆の跡", "勉強", "Common", "小さな理解が、次のページを開いた。"],
    play: ["何気ない帰り道", "友達", "Common", "くだらない話ほど、あとで思い出す。"],
    lesson: ["続けた手のひら", "習い事", "Common", "同じ動きを何度も繰り返した時間。"],
    club: ["最後の円陣", "部活", "Rare", "声を重ねた瞬間、ひとりではないとわかった。"],
    work: ["初めての給料日", "仕事", "Rare", "働いた時間が、数字になって返ってきた。"],
    intern: ["名刺のない挑戦", "仕事", "Rare", "知らない大人たちの中で、自分の輪郭を探した。"]
  };
  if (cards[key] && Math.random() < 0.18) addCard(...cards[key]);
}

function renderChance() {
  if (state.cramSchool && state.turnIndex >= 8 && state.turnIndex <= 11) {
    $("chanceBox").textContent = `中学受験合格可能性：${examChance()}%`;
    $("chanceBox").classList.remove("hidden");
  }
}

function openShop() {
  $("modalTitle").textContent = "ショップ";
  $("modalBody").innerHTML = `<p>所持金：${state.money.toLocaleString()}G</p><div class="shop-grid">${shops.map((item, index) => `
    <div class="shop-item">
      <strong>${item.name}</strong>
      <span>${item.desc}</span>
      <span>${item.price.toLocaleString()}G</span>
      <button class="primary-button" type="button" data-shop="${index}" ${state.money < item.price ? "disabled" : ""}>購入</button>
    </div>`).join("")}</div>`;
  showModal();
  document.querySelectorAll("[data-shop]").forEach((button) => {
    button.addEventListener("click", () => buyItem(Number(button.dataset.shop)));
  });
}

function buyItem(index) {
  const item = shops[index];
  if (state.money < item.price) return;
  if (item.price >= 1500 && state.money < 32000 && !confirm("この買い物をすると、大学以降の選択肢が狭まるかもしれません。本当に購入しますか？")) return;
  startEffectCapture();
  const ok = item.buy();
  if (ok === false) {
    finishEffectCapture();
    render();
    openShop();
    return;
  }
  changeStats({ money: -item.price });
  log(`${item.name}を購入した。`);
  closeModal();
  showOutcome(`${item.name}を使った！`, finishEffectCapture(), render);
}

function showAlbum() {
  $("modalTitle").textContent = "人生アルバム";
  $("modalBody").innerHTML = state.cards.length
    ? `<div class="card-grid">${state.cards.map(cardHtml).join("")}</div>`
    : `<p>まだカードはありません。</p>`;
  showModal();
}

function cardHtml(card) {
  return `<div class="card"><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(card.rarity)} / ${escapeHtml(card.category)} / ${escapeHtml(card.date)}</span><p>${escapeHtml(card.description)}</p></div>`;
}

function renderResult() {
  const result = decideType();
  const analysis = buildFinalAnalysis(result);
  $("message").innerHTML = `<div class="result-title">${result.name}</div>${result.desc}`;
  $("choices").innerHTML = `
    <div class="final-analysis">
      <h2>人生リプレイ分析</h2>
      <p>${escapeHtml(analysis.overview)}</p>
      <h3>よく選んだ行動</h3>
      <ul>${analysis.topActions.map((item) => `<li>${escapeHtml(item[0])}：${item[1]}回</li>`).join("") || "<li>記録なし</li>"}</ul>
      <h3>強く出ていた傾向</h3>
      <ol>${analysis.topHidden.map((item) => `<li>${escapeHtml(item[0])}</li>`).join("")}</ol>
      <h3>強み</h3>
      <ul>${analysis.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <h3>注意しやすい傾向</h3>
      <ul>${analysis.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p><strong>これから大切にするとよさそうなこと：</strong>${escapeHtml(analysis.advice)}</p>
    </div>
    <button class="choice-button" type="button" id="resultAlbum">人生アルバムを見る<small>${state.cards.length}枚のカード</small></button>
    <button class="choice-button" type="button" id="playAgain">もう一度プレイする<small>別の選択でリプレイ</small></button>
  `;
  $("chanceBox").classList.remove("hidden");
  $("chanceBox").innerHTML = `最終ステータス：学力${rank(state.academic)}(${state.academic}) / スキル${rank(state.skill)}(${state.skill}) / 社交性${rank(state.social)}(${state.social}) / 満足度 ${moodLevels[state.mood]} / ${state.money.toLocaleString()}G`;
  $("resultAlbum").addEventListener("click", showFinalModal);
  $("playAgain").addEventListener("click", resetGame);
}

function buildFinalAnalysis(result) {
  const topHidden = Object.entries(state.hidden).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topActions = Object.entries(state.actionCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const stageTexts = ["小学校", "中学校", "高校", "大学"].map((stage) => stageAnalysis(stage));
  const routeText = routeAnalysisText();
  return {
    overview: `${routeText} ${hiddenSummary(topHidden)} ${actionSummary(topActions)}`,
    stageTexts,
    topActions,
    topHidden,
    strengths: strengthsFor(result.name, topHidden),
    cautions: cautionsFor(result.name, topActions),
    advice: adviceFor(result.name, topHidden, topActions)
  };
}

function stageAnalysis(stage) {
  const counts = state.stageActionCounts[stage] || {};
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) return `${stage}：大きく偏らず、その時々の流れに合わせて選んでいました。`;
  const [action, count] = top;
  const tone = {
    "勉強する": "目標に向けて準備する時間が目立ちました。",
    "遊ぶ": "人との時間や気分の動きを大切にする選択が目立ちました。",
    "習い事をする": "続けてきた得意を伸ばす選択が目立ちました。",
    "部活をする": "仲間と打ち込む時間を大切にしていました。",
    "休む": "立て直す時間をきちんと選んでいました。",
    "バイトする": "生活や将来の足場を意識する選択が目立ちました。",
    "語学を学ぶ": "外の世界へ向かう準備を重ねていました。",
    "制作する": "自分の手で形にする選択が目立ちました。",
    "専門を深める": "ひとつの問いを深く掘る姿勢が見られました。"
  }[action] || "その時期らしい選択を重ねていました。";
  return `${stage}：${action}を${count}回選び、${tone}`;
}

function routeAnalysisText() {
  const routes = state.routeChoices.join("、") || state.routes.join("、");
  if (!routes) return "大きなルートに縛られすぎず、毎月の選択で少しずつ自分を作っていました。";
  if (routes.includes("留学")) return "未知の環境に飛び込むことで、自分を広げようとする傾向が見られます。";
  if (routes.includes("起業")) return "正解が決まっていない状況でも、自分で道を作ろうとする傾向があります。";
  if (routes.includes("部活") || routes.includes("体育会")) return "一つのことに打ち込み、仲間とともに成長する選択を好みやすいです。";
  if (routes.includes("進学校") || routes.includes("難関") || routes.includes("受験")) return "目標を決めて、そこに向けて準備する力が見られます。";
  if (routes.includes("地元") || routes.includes("堅実")) return "無理に大きな変化を選ぶより、安定した環境の中で自分らしく積み上げる傾向があります。";
  return "選んだルートからは、状況に合わせて自分の場所を探す柔らかさが見られます。";
}

function hiddenSummary(topHidden) {
  const names = topHidden.map(([name]) => name).join("、");
  if (names.includes("探索志向") || names.includes("挑戦志向")) return `特に${names}が強く、試しながら進む力が出ていました。`;
  if (names.includes("協調志向")) return `特に${names}が強く、人との関係から力を受け取る傾向があります。`;
  if (names.includes("計画志向") || names.includes("達成志向")) return `特に${names}が強く、準備して形にする姿勢が見られます。`;
  return `特に${names}が強く、あなたらしい選択の軸になっていました。`;
}

function actionSummary(topActions) {
  const rest = state.actionCounts["休む"] || 0;
  const total = Object.values(state.actionCounts).reduce((sum, value) => sum + value, 0);
  if (total && rest / total < 0.12) return "休むよりも何かに取り組む選択が多く、成長機会を逃しにくい一方で、体力や満足度を後回しにしやすい面もあります。";
  if (rest / Math.max(total, 1) > 0.25) return "立て直す時間を比較的しっかり選んでおり、無理をしすぎないバランス感覚がありました。";
  return "行動と休息のどちらかに極端に偏りすぎず、その時期ごとに選択を変えていました。";
}

function strengthsFor(typeName, topHidden) {
  const names = topHidden.map(([name]) => name).join("");
  if (typeName.includes("冒険家") || names.includes("探索")) return ["新しい環境に飛び込む力", "興味を行動に移す力", "変化を楽しめる柔軟さ"];
  if (typeName.includes("戦略家") || names.includes("計画")) return ["先を見て準備する力", "積み上げを続ける力", "目標を現実に近づける力"];
  if (typeName.includes("仲間") || typeName.includes("調和") || names.includes("協調")) return ["人との関係を育てる力", "場の空気を読む力", "誰かと一緒に前へ進む力"];
  if (typeName.includes("表現") || typeName.includes("自由")) return ["自分の感覚を大切にする力", "決まった道に縛られない柔らかさ", "形にして伝える力"];
  return ["安定した足場を作る力", "続けることで力を伸ばす力", "自分のペースを守る力"];
}

function cautionsFor(typeName, topActions) {
  const actionText = topActions.map(([name]) => name).join("");
  if (actionText.includes("勉強") || typeName.includes("戦略")) return ["結果を優先して、楽しさや休息を後回しにしやすい", "予定通りに進まないと焦りやすい", "できたことより不足に目が向きやすい"];
  if (actionText.includes("遊ぶ") || typeName.includes("自由")) return ["興味が移ると継続が難しくなることがある", "大事な準備を後回しにしやすい", "直感だけで決めて疲れることがある"];
  if (actionText.includes("部活") || actionText.includes("習い事")) return ["一つのことに集中しすぎて視野が狭くなることがある", "休むタイミングを逃しやすい", "期待に応えようとして無理をしやすい"];
  return ["安定を大切にするぶん、大きな変化を選ぶまで時間がかかる", "挑戦の機会を慎重に見送りやすい", "自分の希望より周囲の安心を優先しやすい"];
}

function adviceFor(typeName, topHidden, topActions) {
  if ((state.actionCounts["休む"] || 0) <= 3) return "ワクワクする方向に進みながらも、休む時間を意識して残しておくこと。";
  if (topHidden.some(([name]) => name === "探索志向")) return "試したことを一度振り返り、次に少し長く続けたいものを選んでみること。";
  if (topHidden.some(([name]) => name === "協調志向")) return "人との時間を大切にしながら、自分だけの希望も小さく言葉にしておくこと。";
  return "積み上げてきた安心を土台にして、少しだけ未知の選択も試してみること。";
}

function decideType() {
  const scored = typeDefs.map(([name, a, b, desc]) => ({
    name,
    desc,
    score: state.hidden[a] + state.hidden[b],
    tie: state.recentHidden[a] + state.recentHidden[b] + cardCategoryBonus(name)
  }));
  scored.sort((a, b) => b.score - a.score || b.tie - a.tie);
  return scored[0];
}

function cardCategoryBonus(typeName) {
  const text = state.cards.map((card) => `${card.name}${card.category}`).join("");
  if (typeName.includes("仲間") || typeName.includes("調和")) return (text.match(/友達|日常|大学/g) || []).length;
  if (typeName.includes("表現") || typeName.includes("自由")) return (text.match(/習い事|記憶|分岐/g) || []).length;
  if (typeName.includes("戦略") || typeName.includes("職人")) return (text.match(/勉強|進学|仕事/g) || []).length;
  if (typeName.includes("冒険")) return (text.match(/挑戦|分岐|ルート/g) || []).length;
  return 0;
}

function showFinalModal() {
  const result = decideType();
  const analysis = buildFinalAnalysis(result);
  $("modalTitle").textContent = "最終結果";
  $("modalBody").innerHTML = `
    <h3>${result.name}</h3>
    <p>${result.desc}</p>
    <h3>歩んだ人生ルート</h3>
    <ul class="route-list">${state.routes.map((routeName) => `<li>${escapeHtml(routeName)}</li>`).join("") || "<li>地道な日々</li>"}</ul>
    <h3>ステージごとの選択傾向</h3>
    ${analysis.stageTexts.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
    <h3>よく選んだ行動</h3>
    <ul>${analysis.topActions.map((item) => `<li>${escapeHtml(item[0])}：${item[1]}回</li>`).join("") || "<li>記録なし</li>"}</ul>
    <h3>裏スコアから見た性格傾向</h3>
    <ol>${analysis.topHidden.map((item) => `<li>${escapeHtml(item[0])}</li>`).join("")}</ol>
    <p>${escapeHtml(analysis.overview)}</p>
    <h3>強み</h3>
    <ul>${analysis.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <h3>注意しやすい傾向</h3>
    <ul>${analysis.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <h3>これから大切にするとよさそうなこと</h3>
    <p>${escapeHtml(analysis.advice)}</p>
    <h3>最終ステータス</h3>
    <p>学力：${rank(state.academic)}（${state.academic}） / スキル：${rank(state.skill)}（${state.skill}） / 社交性：${rank(state.social)}（${state.social}） / 体力：${state.energy}/100 / 満足度：${moodLevels[state.mood]} / お金：${state.money.toLocaleString()}G</p>
    <h3>人生アルバム</h3>
    <div class="card-grid">${state.cards.map(cardHtml).join("") || "<p>カードなし</p>"}</div>
  `;
  showModal();
}

function showModal() {
  $("modalBackdrop").classList.remove("hidden");
}

function closeModal() {
  $("modalBackdrop").classList.add("hidden");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function resetGame() {
  state = initialState();
  render();
}

$("shopButton").addEventListener("click", openShop);
$("albumButton").addEventListener("click", showAlbum);
$("resetButton").addEventListener("click", resetGame);
$("closeModal").addEventListener("click", closeModal);
$("modalBackdrop").addEventListener("click", (event) => {
  if (event.target === $("modalBackdrop")) closeModal();
});

resetGame();

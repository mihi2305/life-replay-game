const moodLevels = ["悪い", "ちょい悪", "普通", "調子いい", "幸せ"];
const hiddenKeys = ["安定志向", "挑戦志向", "協調志向", "自立志向", "計画志向", "直感志向", "探索志向", "達成志向"];
const statLabels = { academic: "学力", skill: "スキル", social: "社交性", energy: "体力", mood: "満足度", money: "お金" };
const cardCatalog = [
  "幼い日のかけっこ", "小さな図鑑", "砂場の友達", "はじめての作品", "なんでも試した日",
  "はじめてのサッカー", "はじめてのピアノ", "はじめての英会話", "はじめてのプログラミング", "空き地の午後",
  "夜の参考書", "開かれたドア", "不合格通知", "何気ない帰り道", "続ける理由", "放課後の入部届",
  "探し直す春", "初めての敗北", "放課後の秘密基地", "鉛筆の跡", "続けた手のひら", "最後の円陣",
  "初めての給料日", "名刺のない挑戦", "新歓の輪", "知らない街の朝", "失敗した企画書", "旅先のメモ",
  "現地の友人", "小さなリリース", "友人との旅程", "一人旅の切符", "気になる子と同じ班", "文化祭の照明",
  "告白前の廊下", "価値観のすれ違い", "朝練の記憶", "練習ノート", "初めての背番号", "ベンチから見た景色",
  "キャプテンマーク", "初めての順位表", "赤ペンだらけのノート", "放課後の教え合い", "夜の自習室",
  "問いを書いたノート", "模試の判定", "志望校のパンフレット", "合格発表の掲示板",
  "小学校のアルバム", "中学校のアルバム", "高校のアルバム", "大学のアルバム"
].map((name, index) => ({
  id: cardIdFromName(name),
  name,
  category: inferCardCategory(name),
  rarity: inferCardRarity(name),
  description: "まだ見ぬ人生のかけらです。",
  unlockHint: inferUnlockHint(name),
  unlockConditionHidden: inferCardRarity(name) === "legendary",
  sortOrder: index + 1
}));

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

const commonShopItemIds = ["energyDrink", "textbook", "studyCharm", "sportsGear", "snackWithFriends", "refreshSet"];
const routeShopUnlocks = {
  exam: ["ramune", "luckyPencil", "summaryNotebook", "lateNightSnack"],
  social: ["manekiNeko", "matchingKeychain", "afterSchoolTicket", "festivalCamera"],
  sports: ["sportsDrink", "newShoes", "taping", "tournamentCharm"],
  expression: ["sketchbook", "recorder", "favoriteSticker", "oldNotebook"],
  abroad: ["vocabularyBook", "passportCase", "overseasSim", "japanGift"],
  startup: ["laptop", "stickyNotes", "coffeeTicket", "startupInitialFund"]
};
const shopItems = [
  item("energyDrink", "栄養ドリンク", "体力を20回復する。", 500, "common", "common", {}, "anytime", 5, { energy: 20 }),
  item("textbook", "参考書", "次の「勉強する」の効果が上がる。", 800, "common", "common", {}, "before_action", 3, { activeFlag: "textbookBoost" }),
  item("studyCharm", "学力のお守り", "3ターンの間、勉強効果が少し上がる。", 1500, "common", "rare", {}, "before_action", 2, { turnFlag: "studyCharmTurns", turns: 3 }),
  item("sportsGear", "部活道具", "3ターンの間、習い事・部活・専門活動の効果が少し上がる。", 1500, "common", "rare", {}, "before_action", 2, { turnFlag: "sportsGearTurns", turns: 3 }),
  item("snackWithFriends", "友達とのお菓子", "次の「遊ぶ」の効果が上がる。", 500, "common", "common", {}, "before_action", 4, { activeFlag: "snackBoost" }),
  item("refreshSet", "気分転換セット", "満足度を1段階上げる。3ターンに1回まで。", 1000, "common", "common", {}, "anytime", 3, { mood: 1, cooldown: true }),
  item("ramune", "ラムネ", "次の「受験勉強する」で集中しやすくなる。", 600, "exam", "common", { group: "exam" }, "before_action", 5, { activeFlag: "ramuneBoost" }),
  item("luckyPencil", "勝負鉛筆", "次の模試・受験イベント成功率が少し上がる。", 1000, "exam", "rare", { group: "exam" }, "before_event", 2, { activeFlag: "luckyPencilBoost" }),
  item("summaryNotebook", "まとめノート", "3ターンの間、勉強効果が少し上がる。", 1800, "exam", "rare", { group: "exam" }, "before_action", 2, { turnFlag: "studyCharmTurns", turns: 3 }),
  item("lateNightSnack", "夜食セット", "体力を10回復し、次の受験勉強効果が少し上がる。", 700, "exam", "common", { group: "exam" }, "anytime", 3, { energy: 10, activeFlag: "lateNightSnackBoost", moodRisk: true }),
  item("manekiNeko", "招き猫", "次の友達イベントで良い流れが起きやすくなる。", 1200, "social", "rare", { group: "social" }, "before_event", 2, { activeFlag: "manekiNekoBoost" }),
  item("matchingKeychain", "おそろいキーホルダー", "次の「遊ぶ」の効果が上がる。", 700, "social", "common", { group: "social" }, "before_action", 4, { activeFlag: "snackBoost" }),
  item("afterSchoolTicket", "放課後チケット", "3ターンの間、友達・恋愛系イベントが少し起きやすくなる。", 1500, "social", "rare", { group: "social" }, "before_action", 2, { turnFlag: "friendshipEventBoostTurns", turns: 3 }),
  item("festivalCamera", "文化祭カメラ", "社交性イベントでカード獲得率が少し上がる。", 2000, "social", "rare", { group: "social" }, "before_event", 1, { activeFlag: "festivalCameraBoost" }),
  item("sportsDrink", "スポーツドリンク", "体力を15回復し、次の部活・スキル系行動が少し伸びる。", 700, "sports", "common", { group: "sports" }, "anytime", 4, { energy: 15, activeFlag: "sportsDrinkBoost" }),
  item("newShoes", "新しいシューズ", "3ターンの間、部活・スキル系行動効果が少し上がる。", 2500, "sports", "rare", { group: "sports" }, "before_action", 1, { turnFlag: "newShoesTurns", turns: 3 }),
  item("taping", "テーピング", "体力が低い時の部活失敗を少し防ぐ。", 900, "sports", "common", { group: "sports" }, "before_action", 3, { activeFlag: "tapingProtection" }),
  item("tournamentCharm", "お守りミサンガ", "大会イベント成功率が少し上がる。", 1800, "sports", "rare", { group: "sports" }, "before_event", 1, { activeFlag: "tournamentCharmBoost" }),
  item("sketchbook", "スケッチブック", "次の表現活動・制作効果が上がる。", 800, "expression", "common", { group: "expression" }, "before_action", 4, { activeFlag: "sketchbookBoost" }),
  item("recorder", "小さな録音機", "表現系イベントでカードを得やすくなる。", 1600, "expression", "rare", { group: "expression" }, "before_event", 1, { activeFlag: "recorderCardBoost" }),
  item("favoriteSticker", "好きなステッカー", "満足度を1段階上げる。3ターンに1回まで。", 500, "expression", "common", { group: "expression" }, "anytime", 3, { mood: 1, cooldown: true }),
  item("oldNotebook", "古いノート", "探索・自立につながる出来事を少し呼び込みやすくする。", 1200, "expression", "rare", { group: "expression" }, "before_event", 2, { activeFlag: "oldNotebookBoost" }),
  item("vocabularyBook", "単語帳", "次の語学・留学準備効果が上がる。", 900, "abroad", "common", { group: "abroad" }, "before_action", 4, { activeFlag: "vocabularyBookBoost" }),
  item("passportCase", "パスポートケース", "留学ルート重要イベントの成功率が少し上がる。", 2000, "abroad", "rare", { group: "abroad" }, "before_event", 1, { activeFlag: "passportCaseBoost" }),
  item("overseasSim", "海外SIM", "留学中の不安イベントで満足度低下を防ぎやすくする。", 1500, "abroad", "rare", { group: "abroad" }, "before_event", 2, { activeFlag: "overseasSimProtection" }),
  item("japanGift", "小さな日本のお土産", "現地友人イベントで良い流れが起きやすくなる。", 1000, "abroad", "common", { group: "abroad" }, "before_event", 3, { activeFlag: "japanGiftBoost" }),
  item("laptop", "ノートPC", "制作・起業準備効果が大きく上がる。", 30000, "startup", "epic", { group: "startup" }, "before_action", 1, { activeFlag: "laptopBoost", expensive: true }),
  item("stickyNotes", "付箋セット", "次の企画イベント成功率が少し上がる。", 800, "startup", "common", { group: "startup" }, "before_event", 4, { activeFlag: "stickyNotesBoost" }),
  item("coffeeTicket", "コーヒーチケット", "体力を10回復し、次の制作効果が少し上がる。", 700, "startup", "common", { group: "startup" }, "anytime", 4, { energy: 10, activeFlag: "coffeeTicketBoost" }),
  item("startupInitialFund", "初期費用", "起業ルートの一部重要選択肢を開放する。", 20000, "startup", "epic", { group: "startup" }, "before_event", 1, { routeFlag: "startupInitialFund", expensive: true })
];

function item(id, name, description, price, category, rarity, unlockCondition, usableTiming, maxOwned, effect) {
  return { id, name, description, price, category, rarity, unlockCondition, usableTiming, maxOwned, effect };
}

function findShopItem(itemId) {
  return shopItems.find((shopItem) => shopItem.id === itemId);
}

function isShopItemUnlocked(itemId) {
  return commonShopItemIds.includes(itemId) || state.unlockedShopItems.includes(itemId);
}

function hasClubStrongRoute() {
  return Boolean(state.clubRoute?.active || state.routes.includes("部活強豪ルート") || state.routeChoices.includes("部活強豪ルート"));
}

function hasClubStrongHighSchool() {
  return state.routes.includes("部活強豪校") || state.routeChoices.includes("部活強豪校");
}

function hasAcademicRoute() {
  return Boolean(state.academicRoute?.active || state.routes.includes("進学校準備ルート") || state.routeChoices.includes("進学校準備ルート"));
}

function hasAdvancedHighSchool() {
  return Boolean(state.academicRoute?.highSchool || state.routes.includes("偏差値上位高校") || state.routeChoices.includes("偏差値上位高校"));
}

function recordClubRouteExperience(kind, values = {}) {
  state.clubRoute.active = true;
  state.clubRoute.eventCount += 1;
  state.clubRoute.intensity += values.intensity || 0;
  state.clubRoute.support += values.support || 0;
  state.clubRoute.reflection += values.reflection || 0;
  if (kind === "finalTournament") state.clubRoute.finalTournament = true;
}

function clubRouteDepth() {
  return (hasClubStrongRoute() ? 1 : 0) + (state.clubRoute?.eventCount || 0) + (state.clubRoute?.finalTournament ? 1 : 0);
}

function recordAcademicRouteExperience(kind, values = {}) {
  state.academicRoute.active = true;
  state.academicRoute.eventCount += 1;
  state.academicRoute.pressure += values.pressure || 0;
  state.academicRoute.collaboration += values.collaboration || 0;
  state.academicRoute.inquiry += values.inquiry || 0;
  if (kind === "topSchoolAim") state.academicRoute.topSchoolAim = true;
  if (kind === "fieldFocus") state.academicRoute.fieldFocus = true;
  if (kind === "stableChoice") state.academicRoute.stableChoice = true;
  if (kind === "highSchoolWall") state.academicRoute.highSchoolWall = true;
}

function academicRouteDepth() {
  return (hasAcademicRoute() ? 1 : 0) + (state.academicRoute?.eventCount || 0) + (state.academicRoute?.topSchoolAim ? 1 : 0) + (state.academicRoute?.fieldFocus ? 1 : 0);
}

function refreshUnlockedShopItems(showNotice = false) {
  if (!state) return [];
  const before = new Set(state.unlockedShopItems || []);
  const groups = unlockedShopGroups();
  groups.forEach((group) => {
    (routeShopUnlocks[group] || []).forEach((itemId) => before.add(itemId));
  });
  commonShopItemIds.forEach((itemId) => before.add(itemId));
  const previous = new Set(state.unlockedShopItems || []);
  state.unlockedShopItems = [...before];
  const newlyUnlocked = state.unlockedShopItems.filter((itemId) => !previous.has(itemId) && !commonShopItemIds.includes(itemId));
  if (showNotice && newlyUnlocked.length) {
    const names = newlyUnlocked.map((itemId) => `「${findShopItem(itemId)?.name || itemId}」`).join(" ");
    addNotice(`新しいアイテムがショップに追加されました！\n${names}が購入できるようになりました。`, "special");
    state.routeUnlockedItems.push(...newlyUnlocked.map((itemId) => ({ itemId, turnIndex: state.turnIndex, timestamp: new Date().toISOString() })));
  }
  return newlyUnlocked;
}

function unlockedShopGroups() {
  const routeText = [...(state.routes || []), ...(state.routeChoices || []), state.universityRouteLabel || "", state.currentUniversityRoute || ""].join(" ");
  const groups = new Set();
  if (state.cramSchool || state.unlocked.has("exam") || /受験|進学校|偏差値上位/.test(routeText)) groups.add("exam");
  if (/人気者|友達|人間関係|サークル|人脈/.test(routeText)) groups.add("social");
  if (/部活|体育会|スポーツ/.test(routeText) || state.lesson === "サッカー") groups.add("sports");
  if (/表現|個性|特色|専門|研究/.test(routeText) || ["ピアノ", "プログラミング"].includes(state.lesson)) groups.add("expression");
  if (/留学|語学|study_abroad/.test(routeText) || state.currentUniversityRoute === "study_abroad") groups.add("abroad");
  if (/起業|プロジェクト|制作|startup/.test(routeText) || state.currentUniversityRoute === "startup") groups.add("startup");
  return groups;
}

function unlockHintForItem(shopItem) {
  return {
    exam: "受験・進学校ルートに入ると解放",
    social: "友達・人間関係ルートに入ると解放",
    sports: "部活・体育会ルートに入ると解放",
    expression: "表現・専門探究ルートに入ると解放",
    abroad: "留学・語学ルートに入ると解放",
    startup: "起業・プロジェクトルートに入ると解放"
  }[shopItem.category] || "特定のルートに入ると解放";
}

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
let availableCurrentSave = null;
let persistTimer = null;

function initialState() {
  return {
    turnIndex: 0,
    academic: 24,
    skill: 22,
    social: 24,
    energy: 82,
    mood: 2,
    money: 3500,
    playerName: "あなた",
    childhoodType: null,
    relationship: { crush: false, partner: false, affection: 0, partnerStage: null },
    clubRoute: { active: false, eventCount: 0, intensity: 0, support: 0, reflection: 0, finalTournament: false },
    academicRoute: { active: false, eventCount: 0, pressure: 0, collaboration: 0, inquiry: 0, topSchoolAim: false, fieldFocus: false, stableChoice: false, highSchool: false, highSchoolWall: false },
    startedAt: new Date().toISOString(),
    choicesLog: [],
    savedRun: null,
    saveStatus: "",
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
    inventory: Object.fromEntries(shopItems.map((shopItem) => [shopItem.id, 0])),
    activeEffects: initialActiveEffects(),
    unlockedShopItems: [...commonShopItemIds],
    routeUnlockedItems: [],
    itemUseHistory: [],
    routeFlags: {},
    hidden: Object.fromEntries(hiddenKeys.map((key) => [key, 0])),
    recentHidden: Object.fromEntries(hiddenKeys.map((key) => [key, 0])),
    boosts: [],
    cards: [],
    logs: ["小さなランドセルで、人生リプレイが始まった。"],
    mode: "start",
    pendingEvent: null,
    pendingOutcome: null,
    pendingExamReveal: null,
    afterOutcome: null,
    afterOutcomeKey: "",
    effectBuffer: null,
    lastMoodItemTurn: -99,
    lastStage: "小学校"
  };
}

function initialActiveEffects() {
  return {
    textbookBoost: false,
    snackBoost: false,
    studyCharmTurns: 0,
    sportsGearTurns: 0,
    ramuneBoost: false,
    luckyPencilBoost: false,
    lateNightSnackBoost: false,
    manekiNekoBoost: false,
    friendshipEventBoostTurns: 0,
    festivalCameraBoost: false,
    sportsDrinkBoost: false,
    newShoesTurns: 0,
    tapingProtection: false,
    tournamentCharmBoost: false,
    sketchbookBoost: false,
    recorderCardBoost: false,
    vocabularyBookBoost: false,
    passportCaseBoost: false,
    overseasSimProtection: false,
    japanGiftBoost: false,
    laptopBoost: false,
    stickyNotesBoost: false,
    coffeeTicketBoost: false,
    oldNotebookBoost: false
  };
}

const $ = (id) => document.getElementById(id);

function ensureStorageLayer() {
  if (window.LifeReplayStorage) return window.LifeReplayStorage;
  const playerKey = "lifeReplay.anonymousPlayerId";
  const runsKey = "lifeReplay.playRuns";
  const cardsKey = "lifeReplay.collectedCards";
  const progressKey = "lifeReplayCurrentSave";
  const read = (key, fallback) => {
    try {
      return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  };
  const write = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));
  window.LifeReplayStorage = {
    isSupabaseConfigured: () => false,
    getPlayerId: () => {
      let id = window.localStorage.getItem(playerKey);
      if (!id) {
        id = crypto.randomUUID();
        window.localStorage.setItem(playerKey, id);
      }
      return id;
    },
    upsertPlayer: async () => ({ source: "local" }),
    syncCardCatalog: async () => ({ source: "local" }),
    savePlayRun: async (run) => {
      const playerId = window.LifeReplayStorage.getPlayerId();
      const runs = read(runsKey, []);
      const saved = { ...run, id: crypto.randomUUID(), player_id: playerId, run_number: runs.filter((item) => item.player_id === playerId).length + 1, saved_locally: true };
      runs.push(saved);
      write(runsKey, runs);
      return { source: "local", run: saved };
    },
    listPlayRuns: async () => {
      const playerId = window.LifeReplayStorage.getPlayerId();
      return read(runsKey, []).filter((run) => run.player_id === playerId).sort((a, b) => String(b.finished_at).localeCompare(String(a.finished_at)));
    },
    upsertCollectedCard: async (card) => {
      const cards = read(cardsKey, {});
      const current = cards[card.id];
      cards[card.id] = current ? { ...current, collectCount: current.collectCount + 1 } : { ...card, firstCollectedAt: new Date().toISOString(), collectCount: 1 };
      write(cardsKey, cards);
      return { source: "local" };
    },
    listCollectedCards: async () => read(cardsKey, {}),
    saveCurrentProgress: async (progress) => {
      const playerId = window.LifeReplayStorage.getPlayerId();
      const payload = {
        player_id: playerId,
        save_data: progress,
        current_turn: (progress.turnIndex ?? 0) + 1,
        current_stage: progress.stage || "",
        current_period: progress.date || "",
        updated_at: new Date().toISOString(),
        savedTo: "local"
      };
      write(`${progressKey}.${playerId}`, payload);
      return { source: "local", save: payload };
    },
    getCurrentProgress: async () => {
      const playerId = window.LifeReplayStorage.getPlayerId();
      const save = read(`${progressKey}.${playerId}`, null);
      return save ? { source: "local", save } : null;
    },
    clearCurrentProgress: async () => {
      const playerId = window.LifeReplayStorage.getPlayerId();
      window.localStorage.removeItem(`${progressKey}.${playerId}`);
    }
  };
  return window.LifeReplayStorage;
}

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

function cardIdFromName(name) {
  return `card_${btoa(unescape(encodeURIComponent(name))).replace(/=+$/g, "").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
}

function inferCardCategory(name) {
  if (name.includes("アルバム")) return "ステージ";
  if (["朝練の記憶", "練習ノート", "初めての背番号", "ベンチから見た景色", "最後の円陣", "キャプテンマーク"].includes(name)) return "部活";
  if (["初めての順位表", "赤ペンだらけのノート", "放課後の教え合い", "夜の自習室", "問いを書いたノート", "模試の判定", "志望校のパンフレット", "合格発表の掲示板"].includes(name)) return "勉強";
  if (name.includes("受験") || name.includes("参考書") || name.includes("鉛筆") || name.includes("図鑑")) return "勉強";
  if (name.includes("友") || name.includes("班") || name.includes("文化祭") || name.includes("告白") || name.includes("価値観")) return "人間関係";
  if (name.includes("給料") || name.includes("名刺") || name.includes("リリース")) return "仕事";
  if (name.includes("サッカー") || name.includes("ピアノ") || name.includes("英会話") || name.includes("プログラミング") || name.includes("習い事")) return "習い事";
  if (name.includes("留学") || name.includes("街") || name.includes("旅")) return "探索";
  return "記憶";
}

function inferCardRarity(name) {
  if (["初めての背番号", "ベンチから見た景色", "キャプテンマーク"].includes(name)) return "epic";
  if (["夜の自習室", "模試の判定", "合格発表の掲示板"].includes(name)) return "epic";
  if (["初めての順位表", "赤ペンだらけのノート", "放課後の教え合い", "問いを書いたノート", "志望校のパンフレット"].includes(name)) return "rare";
  if (name.includes("不合格") || name.includes("開かれた") || name.includes("失敗した企画書") || name.includes("知らない街")) return "epic";
  if (name.includes("告白") || name.includes("価値観") || name.includes("アルバム") || name.includes("給料") || name.includes("入部届")) return "rare";
  return "common";
}

function inferUnlockHint(name) {
  const rarity = inferCardRarity(name);
  if (rarity === "legendary") return "入手条件: ？？？";
  if (rarity === "epic") return "一度つまずいた先に、特別な景色があるかもしれません。";
  if (rarity === "rare") return "誰かとの距離や、大きな選択が少し動いたときに出会いやすいです。";
  return "毎月の何気ない選択から生まれる思い出です。";
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

function showOutcome(text, effects, after, afterKey = "") {
  state.pendingOutcome = { text, effects };
  state.afterOutcome = after;
  state.afterOutcomeKey = afterKey || afterOutcomeKeyFor(after);
  state.mode = "outcome";
  render();
}

function continueOutcome() {
  const after = state.afterOutcome || afterOutcomeForKey(state.afterOutcomeKey);
  state.pendingOutcome = null;
  state.afterOutcome = null;
  state.afterOutcomeKey = "";
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
  const partnerBonus = state.relationship?.partner ? 1 : 0;
  return [-2, -1, 0, 1, 2][state.mood] + partnerBonus;
}

function boostFor(actionKey, action) {
  let total = 0;
  state.boosts.forEach((boost) => {
    if (boost.kind === actionKey) total += boost.amount;
    if (boost.kind === "study" && action.stat === "academic") total += boost.amount;
    if (boost.kind === "skill" && (action.stat === "skill" || action.secondStat === "skill")) total += boost.amount;
    if (boost.kind === "play" && action.stat === "social") total += boost.amount;
  });
  total += activeEffectBoostFor(actionKey, action);
  return total;
}

function activeEffectBoostFor(actionKey, action) {
  const effects = state.activeEffects || {};
  let total = 0;
  if (actionKey === "study" && effects.textbookBoost) total += 2;
  if (actionKey === "study" && effects.studyCharmTurns > 0) total += 1;
  if (actionKey === "exam" && effects.ramuneBoost) total += 2;
  if (actionKey === "exam" && effects.lateNightSnackBoost) total += 1;
  if (actionKey === "exam" && effects.studyCharmTurns > 0) total += 1;
  if (actionKey === "play" && effects.snackBoost) total += 2;
  if (["lesson", "club", "deepen", "expression", "create"].includes(actionKey) && effects.sportsGearTurns > 0) total += 1;
  if (["club", "lesson", "deepen"].includes(actionKey) && effects.sportsDrinkBoost) total += 1;
  if (["club", "lesson", "deepen"].includes(actionKey) && effects.newShoesTurns > 0) total += 1;
  if (["expression", "create"].includes(actionKey) && effects.sketchbookBoost) total += 2;
  if (["language", "abroad"].includes(actionKey) && effects.vocabularyBookBoost) total += 2;
  if (["create", "startup"].includes(actionKey) && effects.laptopBoost) total += 2;
  if (["create", "startup"].includes(actionKey) && effects.coffeeTicketBoost) total += 1;
  return Math.min(total, 4);
}

function consumeActiveEffectsForAction(actionKey) {
  const effects = state.activeEffects || {};
  if (actionKey === "study") effects.textbookBoost = false;
  if (actionKey === "exam") {
    effects.ramuneBoost = false;
    effects.lateNightSnackBoost = false;
  }
  if (actionKey === "play") effects.snackBoost = false;
  if (["club", "lesson", "deepen"].includes(actionKey)) effects.sportsDrinkBoost = false;
  if (["expression", "create"].includes(actionKey)) effects.sketchbookBoost = false;
  if (["language", "abroad"].includes(actionKey)) effects.vocabularyBookBoost = false;
  if (["create", "startup"].includes(actionKey)) {
    effects.laptopBoost = false;
    effects.coffeeTicketBoost = false;
  }
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
  const catalog = findCatalogCard(name);
  const card = {
    id: catalog?.id || cardIdFromName(name),
    name,
    category: category || catalog?.category || "記憶",
    rarity: normalizeRarity(rarity || catalog?.rarity || "common"),
    description: description || catalog?.description || "",
    unlockHint: catalog?.unlockHint || inferUnlockHint(name),
    date: current.date
  };
  state.cards.push(card);
  log(`カード獲得：${name}`);
  ensureStorageLayer().upsertCollectedCard(card).catch((error) => console.warn(error));
  if (state.effectBuffer) {
    state.effectBuffer.cards.push(card);
    state.effectBuffer.notices.push({ text: `アルバムが開放された！「${name}」`, level: card.rarity === "epic" || card.rarity === "legendary" ? "special" : "normal" });
  }
}

function normalizeRarity(rarity) {
  return String(rarity || "common").toLowerCase();
}

function displayRarity(rarity) {
  return ({ common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary", unknown: "Unknown" }[normalizeRarity(rarity)] || rarity);
}

function findCatalogCard(nameOrId) {
  return cardCatalog.find((card) => card.name === nameOrId || card.id === nameOrId);
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
  updateAuxiliaryButtons();
  renderMain();
  persistCurrentProgress();
}

function updateAuxiliaryButtons() {
  const inGame = !["start", "result"].includes(state.mode);
  $("shopButton").classList.toggle("hidden", !inGame);
  $("inventoryButton").classList.toggle("hidden", !inGame);
  $("resetButton").classList.add("hidden");
  $("albumButton").classList.toggle("hidden", state.mode === "start");
}

function persistCurrentProgress() {
  if (!state || state.mode === "start" || state.mode === "result") return;
  window.clearTimeout(persistTimer);
  persistTimer = window.setTimeout(() => {
    ensureStorageLayer().saveCurrentProgress(serializeStateForSave()).catch((error) => console.warn(error));
  }, 120);
}

function serializeStateForSave() {
  const info = currentInfo();
  const save = {
    ...state,
    unlocked: [...state.unlocked],
    effectBuffer: null,
    afterOutcome: null,
    afterOutcomeKey: state.afterOutcomeKey || afterOutcomeKeyFor(state.afterOutcome),
    stage: info.stage,
    date: info.date,
    savedAt: new Date().toISOString()
  };
  if (save.mode === "event") {
    save.pendingEventResume = true;
    save.pendingEventTitle = state.pendingEvent?.title || "";
    save.pendingEvent = null;
  }
  if (save.mode === "examReveal") {
    save.mode = "action";
    save.pendingExamReveal = null;
  }
  return save;
}

function restoreStateFromSave(saveData) {
  const restored = { ...initialState(), ...(saveData || {}) };
  restored.turnIndex = clamp(Number(restored.turnIndex) || 0, 0, 44);
  restored.unlocked = new Set(Array.isArray(restored.unlocked) ? restored.unlocked : ["study", "play", "rest"]);
  restored.hidden = { ...Object.fromEntries(hiddenKeys.map((key) => [key, 0])), ...(restored.hidden || {}) };
  restored.recentHidden = { ...Object.fromEntries(hiddenKeys.map((key) => [key, 0])), ...(restored.recentHidden || {}) };
  restored.cards = Array.isArray(restored.cards) ? restored.cards : [];
  restored.logs = Array.isArray(restored.logs) ? restored.logs : [];
  restored.routes = Array.isArray(restored.routes) ? restored.routes : [];
  restored.routeChoices = Array.isArray(restored.routeChoices) ? restored.routeChoices : [];
  restored.choicesLog = Array.isArray(restored.choicesLog) ? restored.choicesLog : [];
  restored.boosts = Array.isArray(restored.boosts) ? restored.boosts : [];
  restored.inventory = { ...Object.fromEntries(shopItems.map((shopItem) => [shopItem.id, 0])), ...(restored.inventory || {}) };
  restored.activeEffects = { ...initialActiveEffects(), ...(restored.activeEffects || {}) };
  restored.unlockedShopItems = Array.from(new Set([...(restored.unlockedShopItems || []), ...commonShopItemIds]));
  restored.routeUnlockedItems = Array.isArray(restored.routeUnlockedItems) ? restored.routeUnlockedItems : [];
  restored.itemUseHistory = Array.isArray(restored.itemUseHistory) ? restored.itemUseHistory : [];
  restored.routeFlags = restored.routeFlags || {};
  restored.actionCounts = restored.actionCounts || {};
  restored.stageActionCounts = restored.stageActionCounts || {};
  restored.relationship = { crush: false, partner: false, affection: 0, partnerStage: null, ...(restored.relationship || {}) };
  restored.clubRoute = { active: false, eventCount: 0, intensity: 0, support: 0, reflection: 0, finalTournament: false, ...(restored.clubRoute || {}) };
  restored.academicRoute = { active: false, eventCount: 0, pressure: 0, collaboration: 0, inquiry: 0, topSchoolAim: false, fieldFocus: false, stableChoice: false, highSchool: false, highSchoolWall: false, ...(restored.academicRoute || {}) };
  restored.effectBuffer = null;
  restored.savedRun = null;
  restored.saveStatus = "";
  restored.afterOutcome = afterOutcomeForKey(restored.afterOutcomeKey);
  if (restored.pendingEventResume || restored.mode === "event") {
    const previousState = state;
    state = restored;
    restored.pendingEvent = !restored.childhoodType && restored.turnIndex === 0 ? childhoodEvent() : fixedEventForTurn() || randomNaturalEvent();
    state = previousState;
    restored.mode = "event";
  }
  if (restored.mode === "outcome" && !restored.pendingOutcome) restored.mode = "action";
  if (restored.mode === "examReveal") restored.mode = "action";
  return restored;
}

function afterOutcomeKeyFor(after) {
  if (after === nextTurn) return "nextTurn";
  if (after === afterMainAction) return "afterMainAction";
  if (after === render) return "render";
  return "";
}

function afterOutcomeForKey(key) {
  return {
    nextTurn,
    afterMainAction,
    render,
    action: () => {
      state.mode = "action";
      render();
    }
  }[key] || null;
}

function currentSaveData() {
  const save = availableCurrentSave?.save;
  if (save?.save_data) return save.save_data;
  if (save?.turnIndex !== undefined) return save;
  return availableCurrentSave?.saveData || null;
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
  if (state.mode === "start") return renderStart();
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

function renderStart() {
  $("stageName").textContent = "はじまり";
  $("turnLabel").textContent = "0 / 45";
  $("yearLabel").textContent = "幼稚園";
  $("chapterTitle").textContent = "名前を入力";
  const saveData = currentSaveData();
  $("message").textContent = saveData
    ? "途中まで歩いた人生があります。\n続きから遊ぶか、最初から新しい人生を始められます。"
    : "これから、もう一度人生をリプレイします。\n呼ばれたい名前を入れてください。未入力でも、そのまま始められます。";
  $("stats").innerHTML = statHtml();
  $("choices").innerHTML = saveData ? `
    <div class="start-panel">
      <p>${escapeHtml(saveData.playerName || "あなた")} / ${escapeHtml(saveData.date || "")} / ${Number(saveData.turnIndex || 0) + 1}ターン目</p>
      <button class="primary-button next-button" id="continueGameButton" type="button">続きから遊ぶ</button>
      <button class="secondary-button" id="freshStartButton" type="button">最初から始める</button>
      <button class="secondary-button" id="startHistoryButton" type="button">過去の人生</button>
      <button class="secondary-button" id="startCatalogButton" type="button">カード図鑑</button>
    </div>
  ` : `
    <div class="start-panel">
      <label for="playerNameInput">名前</label>
      <input id="playerNameInput" class="name-input" type="text" maxlength="12" placeholder="あなた" autocomplete="off" />
      <button class="primary-button next-button" id="startGameButton" type="button">はじめる</button>
      <button class="secondary-button" id="startHistoryButton" type="button">過去の人生</button>
      <button class="secondary-button" id="startCatalogButton" type="button">カード図鑑</button>
    </div>
  `;
  if (saveData) {
    $("continueGameButton").addEventListener("click", continueSavedGame);
    $("freshStartButton").addEventListener("click", startFreshGameWithConfirm);
  } else {
    $("startGameButton").addEventListener("click", startNewGameFromTitle);
  }
  $("startHistoryButton").addEventListener("click", showPlayHistory);
  $("startCatalogButton").addEventListener("click", () => showCardCatalog());
}

function startNewGameFromTitle() {
  const input = $("playerNameInput")?.value.trim();
  state.playerName = input || "あなた";
  ensureStorageLayer().upsertPlayer(state.playerName).catch((error) => console.warn(error));
  state.pendingEvent = childhoodEvent();
  state.mode = "event";
  render();
}

async function startFreshGameWithConfirm() {
  const confirmed = confirm("現在の途中データがあります。\n最初から始めると、進行中のデータは削除されます。\n本当に最初から始めますか？");
  if (!confirmed) return;
  await ensureStorageLayer().clearCurrentProgress();
  availableCurrentSave = null;
  state = initialState();
  render();
}

function continueSavedGame() {
  const saveData = currentSaveData();
  if (!saveData) return;
  state = restoreStateFromSave(saveData);
  availableCurrentSave = null;
  render();
}

function childhoodEvent() {
  return {
    title: `${state.playerName}は、幼稚園のころ、どんな時間が好きだった？`,
    choices: [
      { label: "外で走り回るのが好きだった", text: "園庭を走る足音が、今でも少し体に残っている。", noTurnAdvance: true, apply: () => { state.childhoodType = "active"; changeStats({ energy: 10, skill: 3, cap: 6 }); addHidden({ 挑戦志向: 2 }); addCard("幼い日のかけっこ", "幼少期", "Common", "外の空気と走る楽しさが、最初の記憶になった。"); } },
      { label: "絵本や図鑑を見るのが好きだった", text: "ページをめくるたびに、知らない世界が少し近くなった。", noTurnAdvance: true, apply: () => { state.childhoodType = "book"; changeStats({ academic: 4, cap: 6 }); addHidden({ 探索志向: 2, 計画志向: 1 }); addCard("小さな図鑑", "幼少期", "Common", "知らないものを眺める時間が、好奇心の入口になった。"); } },
      { label: "友達と遊ぶのが好きだった", text: "誰かと笑う時間が、毎日の楽しみだった。", noTurnAdvance: true, apply: () => { state.childhoodType = "friend"; changeStats({ social: 4, cap: 6 }); addHidden({ 協調志向: 2 }); addCard("砂場の友達", "幼少期", "Common", "一緒に作った山や道が、人との時間の始まりだった。"); } },
      { label: "一人で工作やお絵描きをするのが好きだった", text: "静かな時間の中で、自分だけの形を作っていた。", noTurnAdvance: true, apply: () => { state.childhoodType = "craft"; changeStats({ skill: 4, cap: 6 }); addHidden({ 自立志向: 2, 直感志向: 1 }); addCard("はじめての作品", "幼少期", "Common", "小さな手で作ったものが、自分だけの世界を広げてくれた。"); } },
      { label: "いろいろ試してみるのが好きだった", text: "飽きっぽいというより、いろんな扉を開けてみたかった。", noTurnAdvance: true, apply: () => { state.childhoodType = "curious"; changeStats({ mood: Math.min(4, state.mood + 1) }); addHidden({ 探索志向: 3 }); addCard("なんでも試した日", "幼少期", "Common", "あれもこれも触ってみることが、最初の選び方だった。"); } }
    ]
  };
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
      ${cards.length ? `<div class="card-gain-box"><strong>アルバムが開放された！</strong>${cards.map((card) => `<p>${escapeHtml(card.name)} <span>${escapeHtml(card.rarity)}</span></p>`).join("")}</div>` : ""}
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
  const keys = [...state.unlocked].filter((key) => {
    if (key === "lesson") return stage === "小学校" || stage === "中学校";
    if (key === "exam") return shouldShowExamAction();
    return true;
  });
  if (state.turnIndex >= 13) keys.push("club");
  if (shouldShowExamAction()) keys.push("exam");
  if (stage === "高校" || stage === "大学" || stage === "社会に出る前") keys.push(...maturedLessonActions());
  if (shouldShowRomanceAction()) keys.push("romance");
  if (state.turnIndex >= 30) keys.push("work", ...universityActionKeys());
  return [...new Set(keys)].filter((key) => actions[key]).map((key) => [key, actions[key]]);
}

function shouldShowExamAction() {
  const turn = state.turnIndex + 1;
  if (currentInfo().stage === "小学校") return state.cramSchool && turn >= 9 && turn <= 12;
  if (currentInfo().stage === "中学校") return turn >= 19 && turn <= 21;
  if (currentInfo().stage === "高校") return turn >= 28 && turn <= 30;
  return false;
}

function shouldShowRomanceAction() {
  if (state.relationship.partner) return state.turnIndex >= 24;
  return currentInfo().stage === "高校" && state.turnIndex >= 26 && state.relationship.affection >= 4 && state.social >= 40;
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
  const protectedLowEnergy = (key === "exam" && state.activeEffects.ramuneBoost) || (["club", "lesson"].includes(key) && state.activeEffects.tapingProtection);
  if (state.energy < 20 && key !== "rest" && !protectedLowEnergy) {
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
  consumeActiveEffectsForAction(key);
  log(`${action.label}を選んだ。`);
  tickBoosts();
  maybeMilestoneCard(key);
  const effects = finishEffectCapture();
  recordChoiceEntry({ label: action.label, actionKey: key, choiceText: actionResultText(key), effects });
  showOutcome(actionResultText(key), effects, afterMainAction);
}

function recordChoiceEntry({ label, actionKey = "", choiceText = "", effects = {} }) {
  state.choicesLog.push({
    turnIndex: state.turnIndex,
    turn: state.turnIndex + 1,
    stage: currentInfo().stage,
    date: currentInfo().date,
    label,
    actionKey,
    choiceText,
    statDelta: (effects.changes || []).map((change) => ({ key: change.key, amount: change.amount, text: change.text })),
    cardsUnlocked: (effects.cards || []).map((card) => ({ id: card.id, name: card.name, rarity: card.rarity })),
    timestamp: new Date().toISOString()
  });
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
  ["studyCharmTurns", "sportsGearTurns", "friendshipEventBoostTurns", "newShoesTurns"].forEach((key) => {
    if (state.activeEffects[key] > 0) state.activeEffects[key] -= 1;
  });
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
  let rate = 0.72;
  if (state.activeEffects.friendshipEventBoostTurns > 0) rate += 0.08;
  if (state.activeEffects.oldNotebookBoost) rate += 0.05;
  return Math.min(0.88, rate);
}

function fixedEventForTurn() {
  const turn = state.turnIndex + 1;
  if (turn === 3) return lessonEvent();
  if (turn === 8 && state.lesson && state.lessonStatus !== "quit") return lessonReviewEvent();
  if (turn === 7) return cramEvent();
  if (turn === 12) return juniorExamEvent();
  if (turn === 13) return routeEvent("中学校で大切にしたいこと", juniorRoutes());
  if (turn === 14 && state.lesson && state.lessonStatus !== "quit") return juniorLessonDecisionEvent();
  if (turn === 15 && hasAcademicRoute()) return academicFirstTestEvent();
  if (turn === 15 && hasClubStrongRoute()) return clubSeriousnessEvent();
  if (turn === 17 && hasAcademicRoute()) return academicPressureEvent();
  if (turn === 17 && hasClubStrongRoute()) return clubRegularCompetitionEvent();
  if (turn === 19 && hasAcademicRoute()) return academicHighSchoolAimEvent();
  if (turn === 19) return routeEvent("高校受験で目指す場所", highSchoolRoutes());
  if (turn === 20 && hasClubStrongRoute()) return clubFinalTournamentEvent();
  if (turn === 21) return highSchoolDecisionEvent();
  if (turn === 23 && shouldShowAcademicHighSchoolWall()) return academicHighSchoolWallEvent();
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

function clubSeriousnessEvent() {
  return {
    title: "冬の体育館に、先輩たちの声が響いている。顧問の目も、思っていたよりずっと本気だった。",
    choices: [
      { label: "誰よりも練習量を増やす", text: "朝練の空気は冷たかったけれど、ボールに触れる時間だけ少し自分を信じられた。", apply: () => { recordClubRouteExperience("seriousness", { intensity: 2 }); changeStats({ skill: 4, energy: -12, mood: Math.max(0, state.mood - 1), cap: 6 }); addHidden({ 達成志向: 2, 挑戦志向: 1 }); addCard("朝練の記憶", "部活", "Rare", "眠い朝に積み重ねた練習が、本気で続ける入口になった。"); } },
      { label: "仲間と声をかけ合って頑張る", text: "一人で背負うより、声を重ねた方が苦しい練習も少し前へ進めた。", apply: () => { recordClubRouteExperience("seriousness", { support: 2 }); changeStats({ social: 3, skill: 2, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 協調志向: 2, 達成志向: 1 }); addCard("練習ノート", "部活", "Rare", "仲間と書き込んだ課題が、次の練習の合図になった。"); } },
      { label: "まずは自分のペースで続ける", text: "焦って背伸びするより、続けられるリズムを探すことにした。", apply: () => { recordClubRouteExperience("seriousness", { reflection: 2 }); changeStats({ skill: 1, energy: 6, mood: Math.min(4, state.mood + 1), cap: 5 }); addHidden({ 自立志向: 2, 探索志向: 1 }); addCard("練習ノート", "部活", "Rare", "自分のペースを書き留めたノートが、続けるための地図になった。"); } }
    ]
  };
}

function clubRegularCompetitionEvent() {
  return {
    title: "夏の練習試合が近づく。レギュラー争いの空気が、少しずつチームを硬くしている。",
    choices: [
      { label: "自主練してレギュラーを狙う", text: "帰り道の暗さより、背番号をもらう想像の方が強かった。", apply: () => { recordClubRouteExperience("regularCompetition", { intensity: 2 }); changeStats({ skill: 5, energy: -14, mood: Math.max(0, state.mood - 1), cap: 7 }); addHidden({ 達成志向: 2, 挑戦志向: 2 }); addCard("初めての背番号", "部活", "Epic", "番号の重さが、これまでの練習を少しだけ形にした。"); } },
      { label: "仲間を支えながらチームに貢献する", text: "自分が出ることだけではなく、チームが前へ進むことも大切だと思えた。", apply: () => { recordClubRouteExperience("regularCompetition", { support: 2 }); changeStats({ social: 4, skill: 1, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 協調志向: 2, 安定志向: 1 }); addCard("ベンチから見た景色", "部活", "Epic", "外から見た試合にも、チームの一員としての意味があった。"); } },
      { label: "自分の役割を考え直す", text: "悔しさの中で、得意なことも苦手なことも少しはっきり見えた。", apply: () => { recordClubRouteExperience("regularCompetition", { reflection: 2 }); changeStats({ skill: 2, energy: 4, cap: 6 }); addHidden({ 自立志向: 2, 探索志向: 2 }); addCard("ベンチから見た景色", "部活", "Rare", "立ち位置を考え直した時間が、別の強さにつながった。"); } }
    ]
  };
}

function clubFinalTournamentEvent() {
  return {
    title: "中学最後の大会が近づいてきた。勝つこと、仲間のこと、これまでの時間が胸の中で混ざっている。",
    choices: [
      { label: "自分が結果を出すことに集中する", text: "最後くらい、自分の足で勝負したいと思った。緊張も含めて、前へ出る準備をした。", apply: () => { recordClubRouteExperience("finalTournament", { intensity: 2 }); changeStats({ skill: 4, energy: -10, cap: 7 }); addHidden({ 自立志向: 2, 達成志向: 2 }); addCard("初めての背番号", "部活", "Epic", "大会の日の背番号は、いつもより少し重かった。"); } },
      { label: "チームのために走りきる", text: "自分のためだけでは出ない一歩が、仲間の声で前に出た。", apply: () => { recordClubRouteExperience("finalTournament", { support: 2 }); changeStats({ social: 4, skill: 2, mood: Math.min(4, state.mood + 1), cap: 7 }); addHidden({ 協調志向: 2, 達成志向: 1 }); addCard("最後の円陣", "部活", "Rare", "声を重ねた瞬間、ひとりではないとわかった。"); } },
      { label: "後輩や仲間に思いを託す", text: "結果だけではなく、次に残すものを考えた。続いていく時間の中に、自分も少し残れる気がした。", apply: () => { recordClubRouteExperience("finalTournament", { support: 1, reflection: 2 }); changeStats({ social: 2, skill: 1, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 協調志向: 1, 自立志向: 2, 安定志向: 1 }); addCard("キャプテンマーク", "部活", "Epic", "託す言葉が、次の誰かの背中を少し押した。"); } }
    ]
  };
}

function academicFirstTestEvent() {
  return {
    title: "中学に入って、初めての大きな定期テストが近づいてきた。点数だけではなく、順位まで出るらしい。",
    choices: [
      { label: "毎日計画を立てて勉強する", text: "帰ってからの時間を細かく分けて、赤ペンで間違いをつぶしていった。順位表を見るのは少し怖かったけれど、積み上げた跡はノートに残った。", apply: () => { recordAcademicRouteExperience("firstTest", { pressure: 2 }); changeStats({ academic: 5, energy: -12, mood: Math.max(0, state.mood - 1), cap: 7 }); addHidden({ 計画志向: 2, 自立志向: 1, 達成志向: 1 }); addCard("初めての順位表", "勉強", "Rare", "点数が、初めて自分の現在地として返ってきた。"); addCard("赤ペンだらけのノート", "勉強", "Rare", "間違いの数だけ、次に進む場所が見えた。"); } },
      { label: "友達と教え合いながら勉強する", text: "放課後の教室で、分からない問題を出し合った。自分が説明できるところと、まだ曖昧なところが少しずつ見えてきた。", apply: () => { recordAcademicRouteExperience("firstTest", { collaboration: 2 }); changeStats({ academic: 3, social: 2, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 協調志向: 2, 計画志向: 1 }); addCard("放課後の教え合い", "勉強", "Rare", "誰かに教えることで、自分の理解も少し深くなった。"); } },
      { label: "得意科目だけは本気で伸ばす", text: "全部を完璧にするより、好きな科目だけは誰にも負けたくないと思った。順位とは別の場所に、自分だけの入口がありそうだった。", apply: () => { recordAcademicRouteExperience("firstTest", { inquiry: 2 }); changeStats({ academic: 2, skill: 2, cap: 6 }); addHidden({ 探索志向: 2, 自立志向: 1 }); addCard("問いを書いたノート", "勉強", "Rare", "得意なことの奥に、自分だけの問いが芽を出した。"); } }
    ]
  };
}

function academicPressureEvent() {
  return {
    title: "成績が上がるほど、先生や家族からの期待も増えてきた。うれしいはずなのに、次も結果を出さなければと思ってしまう。",
    choices: [
      { label: "期待に応えるためにさらに勉強する", text: "夜の自習室で、時計の音だけが大きく聞こえた。期待は重いけれど、逃げずに向き合うことで少し先の景色が見えてきた。", apply: () => { recordAcademicRouteExperience("pressure", { pressure: 3 }); changeStats({ academic: 5, energy: -14, mood: Math.max(0, state.mood - 1), cap: 7 }); addHidden({ 計画志向: 2, 自立志向: 1, 達成志向: 2 }); addCard("夜の自習室", "勉強", "Epic", "静かな夜に残ったノートの影が、次の目標を照らした。"); } },
      { label: "一度、友達との時間も大切にする", text: "帰り道に少し寄り道をした。笑って話しているうちに、成績だけでは測れない自分もちゃんといると思えた。", apply: () => { recordAcademicRouteExperience("pressure", { collaboration: 2 }); changeStats({ social: 3, academic: 1, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 協調志向: 2, 安定志向: 1 }); addCard("放課後の教え合い", "勉強", "Rare", "比べるだけではない勉強の時間が、友達との間に残った。"); } },
      { label: "自分が何を学びたいのか考える", text: "点数の先に何があるのか、ノートの端にいくつも問いを書いた。正解を選ぶより、自分の疑問を見つけることが大事に思えた。", apply: () => { recordAcademicRouteExperience("pressure", { inquiry: 3 }); changeStats({ academic: 2, skill: 1, energy: 4, cap: 6 }); addHidden({ 探索志向: 3, 自立志向: 1, 計画志向: 1 }); addCard("問いを書いたノート", "勉強", "Rare", "点数の外側にある問いが、未来の方向を少し変えた。"); } }
    ]
  };
}

function academicHighSchoolAimEvent() {
  return {
    title: "そろそろ高校の志望校を決める時期になった。偏差値、学びたいこと、通いやすさ。選び方にも、自分の価値観が出てくる。",
    choices: [
      { label: "一番偏差値の高い高校を目指す", text: "模試の判定を見ながら、少し背伸びした志望校名を書いた。届くかは分からないけれど、ここまで来た自分を信じてみたくなった。", apply: () => { recordAcademicRouteExperience("topSchoolAim", { pressure: 2 }); changeStats({ academic: 4, energy: -8, mood: Math.max(0, state.mood - 1), cap: 7 }); addHidden({ 計画志向: 2, 達成志向: 2 }); addCard("模試の判定", "勉強", "Epic", "数字は冷たいけれど、目標を具体的な場所にしてくれた。"); } },
      { label: "学びたい分野がある高校を選ぶ", text: "偏差値だけでなく、授業や活動のページを何度も読み返した。将来の自分が、少しだけその校舎の中に見えた気がした。", apply: () => { recordAcademicRouteExperience("fieldFocus", { inquiry: 2 }); changeStats({ academic: 2, skill: 2, cap: 6 }); addHidden({ 探索志向: 2, 自立志向: 1, 計画志向: 1 }); addCard("志望校のパンフレット", "勉強", "Rare", "紙の向こうに、学びたい場所の輪郭が見えた。"); } },
      { label: "通いやすさや生活の安定も考える", text: "家族と通学路を歩いて、毎日の生活を想像してみた。高い目標だけではなく、続けられる場所を選ぶことも大切だと思えた。", apply: () => { recordAcademicRouteExperience("stableChoice", { collaboration: 1 }); changeStats({ social: 1, energy: 8, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 安定志向: 2, 協調志向: 1 }); addCard("何気ない帰り道", "日常", "Rare", "いつもの道から考える進路も、ちゃんと自分の選択だった。"); } }
    ]
  };
}

function shouldShowAcademicHighSchoolWall() {
  return hasAdvancedHighSchool() || (hasAcademicRoute() && (state.routeChoices.includes("受験に集中する") || state.routes.includes("受験に集中する")));
}

function academicHighSchoolWallEvent() {
  return {
    title: "偏差値上位の高校では、周りもみんなよくできた。中学では上位だった自分が、ここでは普通に見えて少し息が詰まる。",
    choices: [
      { label: "もう一度、勉強量で追いつく", text: "焦りをそのまま机に向けた。すぐに楽にはならないけれど、分からない場所をひとつずつ減らしていくしかなかった。", apply: () => { recordAcademicRouteExperience("highSchoolWall", { pressure: 2 }); changeStats({ academic: 4, energy: -10, mood: Math.max(0, state.mood - 1), cap: 7 }); addHidden({ 計画志向: 2, 達成志向: 1 }); addCard("赤ペンだらけのノート", "勉強", "Rare", "追いつきたい気持ちが、もう一度ノートを赤くした。"); } },
      { label: "友達と悩みを共有する", text: "同じように不安な人がいると知って、少し肩の力が抜けた。競争の中にも、支え合える場所はあった。", apply: () => { recordAcademicRouteExperience("highSchoolWall", { collaboration: 2 }); changeStats({ social: 3, mood: Math.min(4, state.mood + 1), cap: 6 }); addHidden({ 協調志向: 2, 探索志向: 1 }); addCard("放課後の教え合い", "勉強", "Rare", "悩みを共有した机の上に、次の一歩が残った。"); } },
      { label: "自分だけの得意分野を探す", text: "順位で全員に勝つより、自分が深く潜れる場所を探したくなった。小さな問いが、進路の地図になり始めた。", apply: () => { recordAcademicRouteExperience("highSchoolWall", { inquiry: 3 }); changeStats({ skill: 3, academic: 1, cap: 6 }); addHidden({ 探索志向: 3, 自立志向: 1 }); addCard("問いを書いたノート", "勉強", "Rare", "普通になった場所で、自分だけの強みを探し始めた。"); } }
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
  if (state.activeEffects.luckyPencilBoost) chance += 5;
  if (state.activeEffects.passportCaseBoost && currentInfo().stage === "大学") chance += 5;
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
        if (route.name === "進学校準備ルート") state.academicRoute.active = true;
        if (route.name === "偏差値上位高校") state.academicRoute.highSchool = true;
        if (route.name === "部活強豪ルート") state.clubRoute.active = true;
        if (route.name === "部活強豪校") state.clubRoute.highSchool = true;
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
  const clubQualified = state.skill >= 70 || (hasClubStrongRoute() && state.skill >= 55) || (state.clubRoute.eventCount >= 2 && state.skill >= 50);
  const academicQualified = state.academic >= 70 || (hasAcademicRoute() && state.academic >= 55) || (state.academicRoute.eventCount >= 2 && state.academic >= 50) || (state.academicRoute.topSchoolAim && state.academic >= 48);
  return [
    route("偏差値上位高校", academicQualified, "学力B以上 または 進学校準備ルートで経験を積む", "高い目標に囲まれる高校生活。", { academic: 4, energy: -8 }, { 計画志向: 2, 達成志向: 2 }),
    route("部活強豪校", clubQualified, "スキルB以上 または 部活強豪ルートで経験を積む", "練習と大会が生活の中心になる。", { skill: 4, energy: -10 }, { 達成志向: 3 }),
    route("人間関係充実高校", state.social >= 70, "社交性B以上", "友達、文化祭、恋愛の多い日々。", { social: 4 }, { 協調志向: 2, 直感志向: 2 }),
    route("特色・専門高校", state.skill >= 55, "スキルC以上", "個性と専門性を伸ばす環境。", { skill: 4 }, { 自立志向: 2, 探索志向: 2 }),
    route("地元高校", true, "常に選択可能", "慣れた街で自由に育つ。", { energy: 10 }, { 安定志向: 2 })
  ];
}

function universityRoutes() {
  const sportsQualified = state.skill >= 60 || (hasClubStrongHighSchool() && state.skill >= 50) || (state.clubRoute.finalTournament && state.clubRoute.eventCount >= 2 && state.skill >= 48);
  const academicDepth = academicRouteDepth();
  const researchQualified = (state.academic >= 50 && state.money >= 7000) || (academicDepth >= 3 && state.academic >= 45 && state.money >= 5000);
  const abroadQualified = (state.academic >= 55 && state.skill >= 55 && state.money >= 18000) || (hasAdvancedHighSchool() && state.academic >= 50 && state.skill >= 45 && state.money >= 14000) || (state.academicRoute.inquiry >= 3 && state.academic >= 50 && state.money >= 12000);
  const internshipQualified = state.academic >= 45 || state.skill >= 45 || (academicDepth >= 2 && (state.academic >= 40 || state.skill >= 40));
  return [
    route("留学ルート", abroadQualified, "学力C以上・スキルC以上・18000G以上 または 進学校ルートで探究を深める", "知らない街の朝を見に行く。", { academic: 2, skill: 2, money: -9000, cap: 6 }, { 探索志向: 3, 挑戦志向: 2 }, "知らない街の朝", "Epic", "study_abroad"),
    route("起業・プロジェクトルート", state.skill >= 65 && state.social >= 50 && state.money >= 12000, "スキルB付近・社交性C以上・12000G以上", "小さな企画を現実に変える。", { skill: 2, social: 2, money: -6000, cap: 6 }, { 自立志向: 3, 挑戦志向: 2 }, "失敗した企画書", "Epic", "startup"),
    route("インターン・キャリア探索ルート", internshipQualified, "学力D以上 または スキルD以上、または進学校ルートで将来を考える", "働き方や社会との関わりを探す。", { skill: 2, money: 2000, cap: 6 }, { 計画志向: 2, 自立志向: 2 }, "名刺のない挑戦", "Rare", "internship"),
    route("体育会・専門継続ルート", sportsQualified, "スキルC後半以上 または 部活強豪校・最後の大会経験", "続けた力を次の舞台へ運ぶ。", { skill: 2, cap: 6 }, { 達成志向: 2, 安定志向: 1 }, null, null, "sports_specialty"),
    route("サークル・人脈ルート", state.social >= 60, "社交性C後半以上", "人との出会いから世界を広げる。", { social: 2, cap: 6 }, { 協調志向: 2, 直感志向: 1 }, null, null, "circle_network"),
    route("専門探究ルート", researchQualified, "学力C付近・7000G以上 または 進学校ルートで問いを深める", "ひとつの問いを深く掘る。", { academic: 2, skill: 2, money: -3000, cap: 6 }, { 探索志向: 2, 計画志向: 1 }, null, null, "research"),
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
      const success = highSchoolRouteSuccess(r.name);
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
            if (routeName === "偏差値上位高校") state.academicRoute.highSchool = true;
            if (routeName === "部活強豪校") state.clubRoute.highSchool = true;
            changeStats(success ? r.delta : { social: 2, mood: 2 });
            addHidden(success ? r.hidden : { 安定志向: 2, 達成志向: 1 });
            addCard(success && routeName === "偏差値上位高校" ? "合格発表の掲示板" : success ? r.name : "次の教室", "進学", success && routeName === "偏差値上位高校" ? "Epic" : success ? "Rare" : "Epic", success ? r.desc : "届かなかった結果の先にも、新しい教室と日々が待っていた。");
          }
        })
      };
    })
  };
}

function highSchoolRouteSuccess(routeName) {
  if (routeName.includes("地元")) return true;
  let chance = 35;
  if (routeName.includes("偏差値上位")) {
    chance += state.academic >= 70 ? 40 : state.academic >= 55 ? 22 : 8;
    if (hasAcademicRoute()) chance += 15;
    chance += Math.min(18, (state.academicRoute.eventCount || 0) * 6);
    if (state.academicRoute.topSchoolAim) chance += 10;
    if (state.academicRoute.fieldFocus) chance += 4;
    if (state.hidden["計画志向"] >= 10) chance += 5;
  } else if (routeName.includes("部活強豪")) {
    chance += state.skill >= 70 ? 35 : state.skill >= 55 ? 22 : 8;
    if (hasClubStrongRoute()) chance += 15;
    chance += Math.min(18, (state.clubRoute.eventCount || 0) * 6);
    if (state.clubRoute.finalTournament) chance += 10;
  } else if (routeName.includes("人間関係")) {
    chance += state.social >= 70 ? 35 : state.social >= 55 ? 22 : 8;
    if (state.routes.includes("人気者・友達ルート")) chance += 14;
  } else if (routeName.includes("特色")) {
    chance += state.skill >= 60 ? 28 : state.skill >= 50 ? 18 : 8;
    if (state.routes.includes("表現・個性ルート")) chance += 14;
  }
  if (state.energy < 25) chance -= 10;
  if (state.mood === 0) chance -= 8;
  return Math.floor(Math.random() * 100) < clamp(chance, 15, 95);
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
    title: `${state.playerName}の大学生活が始まった。自由な時間を何に使おう？`,
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
    const routeEvent = Math.random() < 0.55 ? universityRouteDevelopmentEvent() : null;
    if (routeEvent) return routeEvent;
  }
  const pool = [...stageNaturalEvents(currentInfo().stage),
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
      choice("必要なものだけ買う", "ほしいものと必要なものを考えた。", { money: Math.max(0, otoshidama() - stageMoneyCost()), skill: 1, mood: 3 }, { 計画志向: 1, 自立志向: 1 }),
      choice("友達と楽しむ", "思い出にも少し使った。", { money: -stageMoneyCost(), social: 2, mood: 4 }, { 協調志向: 2, 直感志向: 1 })
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

function stageNaturalEvents(stage) {
  const elementary = [
    event("席替えで隣の子と仲良くなった。", [
      choice("少し話しかける", "休み時間の短い会話が、次の日の楽しみになった。", { social: 2, cap: 5 }, { 協調志向: 1 }),
      relationshipChoice("同じ係を頑張る", "気になる子と同じ班になって、少しだけ学校が楽しみになった。", 1, { social: 1, mood: 3, cap: 5 }, "気になる子と同じ班"),
      choice("いつも通り過ごす", "大きく変わらない日も、ちゃんと一日だった。", { energy: 4, cap: 5 }, { 安定志向: 1 })
    ]),
    event("忘れ物をして、先生に注意された。", [
      choice("次からメモする", "小さな失敗を、次の準備に変えた。", { academic: 1, mood: 2, cap: 5 }, { 計画志向: 2 }),
      choice("友達に助けてもらう", "困ったときに頼れる人がいると知った。", { social: 1, mood: 3, cap: 5 }, { 協調志向: 1 }),
      choice("今日は早めに寝る", "疲れていたことにも気づけた。", { energy: 12, mood: 2, cap: 5 }, { 安定志向: 1 })
    ]),
    event("運動会の練習が始まった。", [
      choice("全力で走る", "息が上がるほど走って、体が少し軽くなった。", { skill: 2, energy: -8, cap: 5 }, { 挑戦志向: 1 }),
      choice("応援を頑張る", "声を合わせる楽しさを知った。", { social: 2, cap: 5 }, { 協調志向: 1 }),
      choice("無理せず参加する", "できる範囲で参加することも、大事な選択だった。", { energy: 5, mood: 2, cap: 5 }, { 安定志向: 1 })
    ]),
    event("友達とケンカしてしまった。", [
      choice("自分から謝る", "言いにくい一言を出したら、胸が少し軽くなった。", { social: 2, mood: 3, cap: 5 }, { 協調志向: 2 }),
      choice("少し距離を置く", "すぐに答えを出さない時間も必要だった。", { energy: 6, mood: 2, cap: 5 }, { 安定志向: 1 }),
      choice("理由を考える", "何が嫌だったのかを、少し言葉にできた。", { academic: 1, cap: 5 }, { 計画志向: 1 })
    ]),
    event("家の手伝いをして、少しお小遣いをもらった。", [
      choice("貯金する", "小さなお金だけど、自分で残すと決めた。", { money: 200, cap: 5 }, { 安定志向: 1 }),
      choice("文房具を買う", "新しいノートを開くのが少し楽しみになった。", { money: -120, academic: 1, cap: 5 }, { 計画志向: 1 }),
      choice("友達とお菓子を買う", "帰り道の小さな買い物が、思い出になった。", { money: -100, social: 1, mood: 3, cap: 5 }, { 協調志向: 1 })
    ])
  ];
  const middle = [
    event("部活の先輩に褒められた。", [
      choice("もっと練習する", "期待されることが、少し力になった。", { skill: 2, energy: -8, cap: 5 }, { 達成志向: 2 }),
      choice("素直に喜ぶ", "褒められた言葉が、帰り道まで残った。", { mood: 3, social: 1, cap: 5 }, { 協調志向: 1 }),
      choice("自分の課題を聞く", "次に伸ばす場所が見えた。", { skill: 1, academic: 1, cap: 5 }, { 計画志向: 1 })
    ]),
    event("定期テストの結果が返ってきた。", [
      choice("復習する", "焦りを、次の準備に変えた。", { academic: 2, energy: -6, cap: 5 }, { 計画志向: 2 }),
      choice("友達と見せ合う", "笑いながらも、少し刺激を受けた。", { social: 1, academic: 1, cap: 5 }, { 協調志向: 1 }),
      choice("参考書を買う", "少しだけ本気の道具を増やした。", { money: -400, academic: 2, cap: 5 }, { 達成志向: 1 })
    ]),
    event("友達グループで少し悩んだ。", [
      choice("一人とじっくり話す", "全員に合わせなくても、話せる人がいると分かった。", { social: 2, cap: 5 }, { 協調志向: 1 }),
      choice("別の居場所も探す", "ひとつの場所にこだわりすぎなくてもよかった。", { skill: 1, mood: 3, cap: 5 }, { 探索志向: 1 }),
      choice("今日は早く帰る", "疲れた日は、家の静けさが助けになった。", { energy: 12, mood: 2, cap: 5 }, { 安定志向: 1 })
    ]),
    event("文化祭準備で役割を任された。", [
      choice("責任を持って進める", "任されたことが、自分を少し大きくした。", { skill: 2, energy: -8, cap: 5 }, { 達成志向: 1, 計画志向: 1 }),
      choice("みんなに声をかける", "一人で抱えない方が、うまく進むこともあった。", { social: 2, cap: 5 }, { 協調志向: 2 }),
      relationshipChoice("気になる人と準備する", "準備の合間に少し話せて、放課後がいつもより短く感じた。", 2, { social: 1, mood: 3, cap: 5 }, "文化祭の照明")
    ]),
    event("帰り道、気になる人と少し話せた。", [
      relationshipChoice("もう少し話す", "何気ない話なのに、家に帰ってからも思い出した。", 2, { social: 1, mood: 3, cap: 5 }),
      choice("友達として普通に接する", "変に意識しすぎず、自然に話せた。", { social: 1, cap: 5 }, { 安定志向: 1 }),
      choice("今日は早めに帰る", "浮ついた気持ちを、少し落ち着かせた。", { energy: 6, cap: 5 }, { 計画志向: 1 })
    ])
  ];
  const high = [
    event("模試の結果が返ってきた。", [
      choice("苦手を洗い出す", "数字は少し重かったけれど、次にやることは見えた。", { academic: 2, energy: -8, cap: 5 }, { 計画志向: 2 }),
      choice("先生に相談する", "一人で抱えなくていいと分かった。", { academic: 1, social: 1, cap: 5 }, { 協調志向: 1 }),
      choice("今日は切り替える", "落ち込みすぎないことも、続けるために必要だった。", { mood: 3, energy: 6, cap: 5 }, { 安定志向: 1 })
    ]),
    event("文化祭で、誰かとの距離が少し縮まった。", [
      relationshipChoice("一緒に回る", "人混みの中で、少しだけ特別な時間になった。", 2, { social: 2, energy: -6, mood: 3, cap: 5 }, "文化祭の照明"),
      choice("友達みんなで楽しむ", "にぎやかな時間が、高校生活の一枚になった。", { social: 2, mood: 3, cap: 5 }, { 協調志向: 1 }),
      choice("裏方を頑張る", "見えないところを支える楽しさを知った。", { skill: 2, energy: -8, cap: 5 }, { 達成志向: 1 })
    ]),
    event("部活最後の大会が近づいてきた。", [
      choice("最後まで練習する", "疲れの奥に、続けてきた時間があった。", { skill: 2, energy: -12, cap: 5 }, { 達成志向: 2 }),
      choice("仲間と話す", "勝ち負けだけじゃないものが、そこに残っていた。", { social: 2, mood: 3, cap: 5 }, { 協調志向: 1 }),
      choice("体を休める", "無理をしないことも、最後まで行くための準備だった。", { energy: 15, cap: 5 }, { 安定志向: 1 })
    ]),
    event("進路面談で、現実的な話を聞いた。", [
      choice("計画を立て直す", "夢と現実の間に、具体的な道を引いてみた。", { academic: 2, cap: 5 }, { 計画志向: 2 }),
      choice("別の選択肢も聞く", "ひとつの道だけじゃないと知って、少し息がしやすくなった。", { skill: 1, academic: 1, cap: 5 }, { 探索志向: 1 }),
      choice("家族と相談する", "自分だけで決めなくてもいいと思えた。", { social: 1, mood: 3, cap: 5 }, { 協調志向: 1 })
    ]),
    event("告白できそうなタイミングが来た。", [
      relationshipChoice("気持ちを伝える", "うまく言えなかったけれど、ちゃんと自分の言葉で伝えた。", 4, { social: 2, energy: -8, mood: 4, cap: 5 }, "告白前の廊下", true),
      relationshipChoice("もう少し距離を縮める", "急がずに、話す時間を少し増やすことにした。", 2, { social: 1, mood: 3, cap: 5 }),
      choice("今は進路を優先する", "気持ちはあるけれど、今は別のことに向き合うと決めた。", { academic: 1, energy: 4, cap: 5 }, { 計画志向: 1 })
    ], () => state.relationship.affection >= 3 || state.social >= 45)
  ];
  const university = [
    event("サークルの誘いを受けた。", [
      choice("顔を出してみる", "知らない人の輪に入るのは少し緊張したけれど、悪くなかった。", { social: 2, energy: -6, cap: 5 }, { 探索志向: 1, 協調志向: 1 }),
      choice("予定を見て考える", "自由な時間ほど、使い方を考える必要があった。", { academic: 1, energy: 4, cap: 5 }, { 計画志向: 1 }),
      choice("今回は断る", "行かない選択も、自分のペースを守るためだった。", { energy: 8, cap: 5 }, { 安定志向: 1 })
    ]),
    event("ゼミや授業で発表することになった。", [
      choice("準備して発表する", "緊張したけれど、考えを人に渡す感覚が少し分かった。", { academic: 2, skill: 1, energy: -8, cap: 5 }, { 計画志向: 1, 達成志向: 1 }),
      choice("友達と練習する", "誰かに聞いてもらうだけで、言葉が整っていった。", { social: 1, academic: 1, cap: 5 }, { 協調志向: 1 }),
      choice("最低限で乗り切る", "完璧ではないけれど、終えたことで少し楽になった。", { energy: 5, mood: 2, cap: 5 }, { 安定志向: 1 })
    ]),
    event("バイト先で責任ある仕事を任された。", [
      choice("引き受ける", "少し重い役割が、自分を大人に近づけた気がした。", { money: 2200, skill: 1, energy: -10, cap: 5 }, { 自立志向: 2 }),
      choice("できる範囲を相談する", "無理なく続けるために、言葉にして調整した。", { social: 1, money: 1200, cap: 5 }, { 計画志向: 1 }),
      choice("今回は断る", "今の体力を見て、続けるために断った。", { energy: 10, mood: 2, cap: 5 }, { 安定志向: 1 })
    ]),
    event("留学説明会のチラシを見つけた。", [
      choice("説明だけ聞いてみる", "遠い場所の話が、少しだけ現実の言葉になった。", { academic: 1, skill: 1, cap: 5 }, { 探索志向: 2 }),
      choice("費用を調べる", "夢にも予算があると知って、少し現実的になった。", { money: -300, academic: 1, cap: 5 }, { 計画志向: 1 }),
      choice("今は見送る", "行かない選択にも、自分の理由があった。", { energy: 5, cap: 5 }, { 安定志向: 1 })
    ]),
    event("恋人との価値観の違いを感じた。", [
      relationshipChoice("正直に話す", "少し怖かったけれど、話したことで分かることがあった。", 1, { social: 1, mood: 2, cap: 5 }, "価値観のすれ違い"),
      choice("少し距離を置く", "近い関係だからこそ、一人の時間も必要だった。", { energy: 8, mood: Math.max(0, state.mood - 1), cap: 5 }, { 自立志向: 1 }),
      choice("友達に相談する", "誰かに話すと、自分の気持ちも少し見えてきた。", { social: 1, cap: 5 }, { 協調志向: 1 })
    ], () => state.relationship.partner)
  ];
  return (stage === "小学校" ? elementary : stage === "中学校" ? middle : stage === "高校" ? high : stage === "大学" ? university : []).filter((item) => !item.condition || item.condition());
}

function event(title, choices, condition) {
  return { title, choices, condition };
}

function relationshipChoice(label, text, affection, delta, cardName, canBecomePartner = false) {
  return choice(label, text, delta, { 直感志向: 1, 協調志向: 1 }, cardName, () => {
    state.relationship.affection += affection;
    if (state.relationship.affection >= 3) state.relationship.crush = true;
    if (canBecomePartner && !state.relationship.partner && state.relationship.affection >= 6 && state.social >= 40) {
      state.relationship.partner = true;
      state.relationship.partnerStage = currentInfo().stage;
      addNotice("恋人ができた。うれしさと少しの緊張が、毎日に混ざり始めた。", "special");
    }
  });
}

function randomNaturalEvent() {
  return themedEvent();
}

function choice(label, text, delta, hidden, cardName, extraApply) {
  return { label, text, apply: () => { changeStats(delta); addHidden(hidden); if (extraApply) extraApply(); if (cardName && Math.random() < 0.55) addCard(cardName, "記憶", cardName.includes("告白") || cardName.includes("価値観") ? "Rare" : "Common", text); } };
}

function otoshidama() {
  const stage = currentInfo().stage;
  let amount = { 小学校: 200, 中学校: 350, 高校: 600, 大学: 1500 }[stage] || 500;
  if (state.academic >= 40) amount += stage === "大学" ? 400 : 80;
  if (state.skill >= 40) amount += stage === "大学" ? 400 : 80;
  if (state.social >= 40) amount += stage === "大学" ? 400 : 80;
  if ([state.academic, state.skill, state.social].some((value) => value >= 70)) amount += stage === "大学" ? 700 : 150;
  return amount;
}

function stageMoneyCost() {
  return { 小学校: 120, 中学校: 350, 高校: 600, 大学: 1400 }[currentInfo().stage] || 300;
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
  refreshUnlockedShopItems(true);
  const effects = finishEffectCapture();
  if (result === false) return render();
  log(`選択：${choiceItem.label}`);
  recordChoiceEntry({ label: choiceItem.label, actionKey: "event", choiceText: choiceItem.text || choiceItem.label, effects });
  state.pendingEvent = null;
  if (choiceItem.noTurnAdvance) {
    showOutcome(choiceItem.text || `${choiceItem.label}を選んだ。`, effects, () => {
      state.mode = "action";
      render();
    }, "action");
    return;
  }
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
          refreshUnlockedShopItems(true);
          state.activeEffects.luckyPencilBoost = false;
          state.activeEffects.passportCaseBoost = false;
          state.activeEffects.tournamentCharmBoost = false;
          reveal.effects = finishEffectCapture();
          recordChoiceEntry({ label: reveal.success ? "結果を見る：合格" : "結果を見る：届かなかった", actionKey: "exam_result", choiceText: reveal.success ? reveal.successText : reveal.failureText, effects: reveal.effects });
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
  refreshUnlockedShopItems();
  const visibleItems = shopItems.filter((shopItem) => isShopItemUnlocked(shopItem.id));
  const lockedItems = shopItems.filter((shopItem) => !isShopItemUnlocked(shopItem.id));
  $("modalBody").innerHTML = `
    <p>所持金：${state.money.toLocaleString()}G</p>
    <div class="shop-grid">
      ${visibleItems.map(shopItemHtml).join("")}
      ${lockedItems.map(lockedShopItemHtml).join("")}
    </div>`;
  showModal();
  document.querySelectorAll("[data-shop]").forEach((button) => {
    button.addEventListener("click", () => buyItem(button.dataset.shop));
  });
}

function shopItemHtml(shopItem) {
  const owned = state.inventory[shopItem.id] || 0;
  const maxed = owned >= shopItem.maxOwned;
  return `
    <div class="shop-item">
      <strong>${escapeHtml(shopItem.name)}</strong>
      <span>${escapeHtml(shopItem.description)}</span>
      <span>${shopItem.price.toLocaleString()}G / 所持 ${owned}/${shopItem.maxOwned}</span>
      <button class="primary-button" type="button" data-shop="${shopItem.id}" ${state.money < shopItem.price || maxed ? "disabled" : ""}>購入</button>
    </div>`;
}

function lockedShopItemHtml(shopItem) {
  return `
    <div class="shop-item locked-item">
      <strong>？？？</strong>
      <span>${escapeHtml(unlockHintForItem(shopItem))}</span>
      <span>未解放</span>
      <button class="secondary-button" type="button" disabled>購入不可</button>
    </div>`;
}

function buyItem(itemId) {
  const itemData = findShopItem(itemId);
  if (!itemData || !isShopItemUnlocked(itemId)) return;
  if (state.money < itemData.price) return;
  if ((itemData.effect.expensive || itemData.price >= 15000) && !confirm("高額な買い物です。今後の選択肢が狭まるかもしれません。本当に購入しますか？")) return;
  startEffectCapture();
  changeStats({ money: -itemData.price });
  state.inventory[itemId] = (state.inventory[itemId] || 0) + 1;
  state.itemUseHistory.push({ type: "buy", itemId, turnIndex: state.turnIndex, timestamp: new Date().toISOString() });
  log(`${itemData.name}を購入した。持ち物に追加された。`);
  closeModal();
  showOutcome(`${itemData.name}を購入した！\n持ち物に追加されました。`, finishEffectCapture(), render, "render");
}

function openInventory() {
  const ownedItems = shopItems.filter((shopItem) => (state.inventory[shopItem.id] || 0) > 0);
  $("modalTitle").textContent = "持ち物";
  $("modalBody").innerHTML = ownedItems.length ? `
    <div class="shop-grid">${ownedItems.map(inventoryItemHtml).join("")}</div>
  ` : `<p>持ち物はまだありません。ショップで購入したアイテムがここに並びます。</p>`;
  showModal();
  document.querySelectorAll("[data-use-item]").forEach((button) => {
    button.addEventListener("click", () => useInventoryItem(button.dataset.useItem));
  });
}

function inventoryItemHtml(shopItem) {
  return `
    <div class="shop-item">
      <strong>${escapeHtml(shopItem.name)} ×${state.inventory[shopItem.id] || 0}</strong>
      <span>${escapeHtml(shopItem.description)}</span>
      <button class="primary-button" type="button" data-use-item="${shopItem.id}">使う</button>
    </div>`;
}

function useInventoryItem(itemId) {
  const itemData = findShopItem(itemId);
  if (!itemData || (state.inventory[itemId] || 0) <= 0) return;
  startEffectCapture();
  const ok = applyItemEffect(itemData);
  if (ok === false) {
    finishEffectCapture();
    openInventory();
    return;
  }
  state.inventory[itemId] -= 1;
  state.itemUseHistory.push({ type: "use", itemId, turnIndex: state.turnIndex, timestamp: new Date().toISOString() });
  log(`${itemData.name}を使った。`);
  closeModal();
  showOutcome(`${itemData.name}を使った！\n${itemUseMessage(itemData)}`, finishEffectCapture(), render, "render");
}

function applyItemEffect(itemData) {
  const effect = itemData.effect || {};
  if (effect.cooldown && state.turnIndex - state.lastMoodItemTurn < 3) {
    log(`${itemData.name}はまだ続けて使えない。`);
    return false;
  }
  if (effect.energy) changeStats({ energy: effect.energy });
  if (effect.mood) {
    state.lastMoodItemTurn = state.turnIndex;
    changeStats({ mood: Math.min(4, state.mood + effect.mood) });
  }
  if (effect.moodRisk && state.mood <= 1 && Math.random() < 0.35) changeStats({ mood: Math.max(0, state.mood - 1) });
  if (effect.activeFlag) state.activeEffects[effect.activeFlag] = true;
  if (effect.turnFlag) state.activeEffects[effect.turnFlag] = Math.max(state.activeEffects[effect.turnFlag] || 0, effect.turns || 1);
  if (effect.routeFlag) state.routeFlags[effect.routeFlag] = true;
  return true;
}

function itemUseMessage(itemData) {
  const effect = itemData.effect || {};
  if (effect.energy && effect.activeFlag) return "体力が回復し、次の行動が少し伸びやすくなります。";
  if (effect.energy) return `体力が +${effect.energy} 回復した！`;
  if (effect.mood) return "気持ちが少し整いました。";
  if (effect.turnFlag) return "しばらくの間、関連する行動が少し伸びやすくなります。";
  if (effect.routeFlag) return "新しい準備が整いました。";
  return "次の関連する行動やイベントで良い流れが起きやすくなります。";
}

function showAlbum() {
  const collection = collectionStats();
  const acquired = new Set(state.cards.map((card) => card.name));
  const unknownCards = cardCatalog.filter((card) => !acquired.has(card.name)).map((card) => ({ name: "？？？", category: "未獲得", rarity: "unknown", description: card.unlockHint, date: "-" }));
  $("modalTitle").textContent = "人生アルバム";
  $("modalBody").innerHTML = state.cards.length
    ? `<p>収集率：${collection.acquired} / ${collection.total}（${collection.rate}%）</p><div class="card-grid">${state.cards.map(cardHtml).join("")}${unknownCards.map(cardHtml).join("")}</div>`
    : `<p>まだカードはありません。</p>`;
  showModal();
}

function collectionStats(collectedMap) {
  const acquiredIds = new Set([
    ...state.cards.map((card) => card.id || cardIdFromName(card.name)),
    ...Object.keys(collectedMap || {})
  ]);
  const total = Math.max(cardCatalog.length, acquiredIds.size);
  return { acquired: acquiredIds.size, total, rate: Math.round((acquiredIds.size / total) * 100) };
}

async function showCardCatalog(filters = {}) {
  const collected = await ensureStorageLayer().listCollectedCards();
  const collection = collectionStats(collected);
  const categories = ["all", ...new Set(cardCatalog.map((card) => card.category))];
  const rarities = ["all", "common", "rare", "epic", "legendary"];
  const category = filters.category || "all";
  const rarity = filters.rarity || "all";
  const filtered = cardCatalog.filter((card) => (category === "all" || card.category === category) && (rarity === "all" || card.rarity === rarity));
  const rarityCounts = rarities.filter((item) => item !== "all").map((item) => `${displayRarity(item)} ${cardCatalog.filter((card) => card.rarity === item && collected[card.id]).length}`).join(" / ");

  $("modalTitle").textContent = "カード図鑑";
  $("modalBody").innerHTML = `
    <p>何度も選び直すことで、少しずつ人生の図鑑が埋まっていきます。</p>
    <p>収集率：${collection.acquired} / ${collection.total}（${collection.rate}%）</p>
    <p>${escapeHtml(rarityCounts)}</p>
    <div class="filter-row">
      <label>カテゴリ <select id="catalogCategory">${categories.map((item) => `<option value="${escapeHtml(item)}" ${item === category ? "selected" : ""}>${escapeHtml(item === "all" ? "すべて" : item)}</option>`).join("")}</select></label>
      <label>レア度 <select id="catalogRarity">${rarities.map((item) => `<option value="${escapeHtml(item)}" ${item === rarity ? "selected" : ""}>${escapeHtml(item === "all" ? "すべて" : displayRarity(item))}</option>`).join("")}</select></label>
    </div>
    <div class="card-grid">${filtered.map((card) => catalogCardHtml(card, collected[card.id])).join("")}</div>
  `;
  showModal();
  $("catalogCategory").addEventListener("change", () => showCardCatalog({ category: $("catalogCategory").value, rarity: $("catalogRarity").value }));
  $("catalogRarity").addEventListener("change", () => showCardCatalog({ category: $("catalogCategory").value, rarity: $("catalogRarity").value }));
}

function catalogCardHtml(card, collected) {
  if (collected) {
    return `<div class="card catalog-card"><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(displayRarity(card.rarity))} / ${escapeHtml(card.category)}</span><p>${escapeHtml(card.description)}</p><p>初獲得：${escapeHtml(collected.firstCollectedAt || "-")} / 獲得回数：${collected.collectCount || 1}</p></div>`;
  }
  const hideName = card.rarity === "epic" || card.rarity === "legendary" || card.unlockConditionHidden;
  const hint = card.rarity === "legendary" ? "入手条件: ？？？" : card.unlockHint;
  return `<div class="card catalog-card locked-card"><strong>${hideName ? "？？？" : "？？？"}</strong><span>${escapeHtml(displayRarity(card.rarity))} / 未獲得</span><p>${escapeHtml(hint)}</p></div>`;
}

function cardHtml(card) {
  return `<div class="card"><strong>${escapeHtml(card.name)}</strong><span>${escapeHtml(displayRarity(card.rarity))} / ${escapeHtml(card.category)} / ${escapeHtml(card.date || "-")}</span><p>${escapeHtml(card.description)}</p></div>`;
}

function renderResult() {
  const result = decideType();
  const analysis = buildFinalAnalysis(result);
  const collection = collectionStats();
  if (!state.savedRun) saveCurrentRun(result);
  $("message").innerHTML = `<div class="result-title">${state.playerName}は、${result.name}</div>${result.desc}`;
  $("choices").innerHTML = `
    <div class="final-analysis">
      <h2>人生リプレイ分析</h2>
      <p>${escapeHtml(state.saveStatus || "この人生を記録しています…")}</p>
      <p>カード収集率：${collection.acquired} / ${collection.total}（${collection.rate}%）</p>
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
    <button class="choice-button" type="button" id="playAgain">もう一度、別の人生を歩む<small>図鑑は残したまま新しい周回へ</small></button>
    <button class="choice-button" type="button" id="historyResultButton">過去の人生を見る<small>記録された人生を振り返る</small></button>
    <button class="choice-button" type="button" id="catalogResultButton">カード図鑑を見る<small>${collection.acquired}枚 / ${collection.rate}%</small></button>
    <button class="choice-button" type="button" id="resultAlbum">今回の人生アルバム<small>${state.cards.length}枚の思い出</small></button>
  `;
  $("chanceBox").classList.remove("hidden");
  $("chanceBox").innerHTML = `最終ステータス：学力${rank(state.academic)}(${state.academic}) / スキル${rank(state.skill)}(${state.skill}) / 社交性${rank(state.social)}(${state.social}) / 満足度 ${moodLevels[state.mood]} / ${state.money.toLocaleString()}G`;
  $("resultAlbum").addEventListener("click", showFinalModal);
  $("historyResultButton").addEventListener("click", showPlayHistory);
  $("catalogResultButton").addEventListener("click", () => showCardCatalog());
  $("playAgain").addEventListener("click", resetGame);
}

async function saveCurrentRun(result) {
  if (state.savedRun === "saving") return;
  state.savedRun = "saving";
  const finalStats = {
    academic: state.academic,
    skill: state.skill,
    social: state.social,
    energy: state.energy,
    mood: moodLevels[state.mood],
    money: state.money
  };
  const payload = {
    display_name: state.playerName,
    final_type: result.name,
    ending_title: `${state.playerName}は、${result.name}`,
    final_stats: finalStats,
    choices_log: state.choicesLog,
    routes: state.routes,
    cards_earned: state.cards.map((card) => ({ id: card.id, name: card.name, rarity: card.rarity, category: card.category })),
    started_at: state.startedAt,
    finished_at: new Date().toISOString()
  };
  try {
    const storage = ensureStorageLayer();
    const saved = await storage.savePlayRun(payload);
    state.savedRun = saved.run;
    await storage.clearCurrentProgress?.();
    state.saveStatus = saved.source === "supabase" ? "この人生をクラウドに記録しました。" : "この人生をこの端末に記録しました。クラウド保存は未接続です。";
  } catch (error) {
    console.warn(error);
    state.savedRun = "failed";
    state.saveStatus = "記録に失敗しました。でも、この人生の結果はここに残っています。";
  }
  if (state.mode === "result") render();
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
  const collection = collectionStats();
  $("modalTitle").textContent = "最終結果";
  $("modalBody").innerHTML = `
    <h3>${state.playerName}は、${result.name}</h3>
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
    <p>獲得カード数：${collection.acquired} / ${collection.total}（収集率 ${collection.rate}%）</p>
    <div class="card-grid">${state.cards.map(cardHtml).join("") || "<p>カードなし</p>"}</div>
  `;
  showModal();
}

async function showPlayHistory() {
  $("modalTitle").textContent = "過去の人生";
  $("modalBody").innerHTML = `<p>記録された人生を読み込んでいます…</p>`;
  showModal();
  const runs = await ensureStorageLayer().listPlayRuns();
  if (!runs.length) {
    $("modalBody").innerHTML = `<p>まだ記録された人生はありません。</p><p>一度エンディングまで進むと、ここに人生の記録が残ります。</p>`;
    return;
  }
  $("modalBody").innerHTML = `
    <p>何度も選び直すことで、少しずつ人生の図鑑が埋まっていきます。</p>
    <div class="history-list">
      ${runs.map((run, index) => historyItemHtml(run, index)).join("")}
    </div>
  `;
  document.querySelectorAll("[data-run-index]").forEach((button) => {
    button.addEventListener("click", () => showRunDetail(runs[Number(button.dataset.runIndex)]));
  });
}

function historyItemHtml(run, index) {
  const stats = run.final_stats || {};
  const cards = run.cards_earned || [];
  return `<div class="history-item">
    <strong>${run.run_number || index + 1}周目：${escapeHtml(run.final_type || "記録された人生")}</strong>
    <span>${escapeHtml(formatDate(run.finished_at))}</span>
    <p>${escapeHtml(run.ending_title || "")}</p>
    <p>学力 ${stats.academic ?? "-"} / スキル ${stats.skill ?? "-"} / 社交性 ${stats.social ?? "-"} / カード ${cards.length}枚</p>
    <button class="secondary-button" type="button" data-run-index="${index}">詳細を見る</button>
  </div>`;
}

function showRunDetail(run) {
  const choices = (run.choices_log || []).slice(-12);
  const cards = run.cards_earned || [];
  $("modalTitle").textContent = run.ending_title || "人生の記録";
  $("modalBody").innerHTML = `
    <p>${escapeHtml(formatDate(run.finished_at))}</p>
    <h3>最終結果</h3>
    <p>${escapeHtml(run.final_type || "-")}</p>
    <h3>通ったルート</h3>
    <ul>${(run.routes || []).map((route) => `<li>${escapeHtml(route)}</li>`).join("") || "<li>記録なし</li>"}</ul>
    <h3>主な選択</h3>
    <ul>${choices.map((choiceItem) => `<li>${escapeHtml(choiceItem.date || "")} ${escapeHtml(choiceItem.label || "")}</li>`).join("") || "<li>記録なし</li>"}</ul>
    <h3>獲得カード</h3>
    <div class="card-grid">${cards.map((card) => cardHtml({ ...card, date: "-", description: findCatalogCard(card.id)?.description || "" })).join("") || "<p>カードなし</p>"}</div>
    <button class="secondary-button" type="button" id="backToHistory">一覧に戻る</button>
  `;
  $("backToHistory").addEventListener("click", showPlayHistory);
}

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch (_) {
    return String(value);
  }
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
  ensureStorageLayer().clearCurrentProgress?.().catch((error) => console.warn(error));
  availableCurrentSave = null;
  state = initialState();
  render();
}

async function bootstrapPersistence() {
  try {
    const storage = ensureStorageLayer();
    await storage.syncCardCatalog?.(cardCatalog);
    availableCurrentSave = await storage.getCurrentProgress?.();
  } catch (error) {
    console.warn(error);
    availableCurrentSave = null;
  }
}

$("shopButton").addEventListener("click", openShop);
$("inventoryButton").addEventListener("click", openInventory);
$("albumButton").addEventListener("click", showAlbum);
$("historyButton").addEventListener("click", showPlayHistory);
$("catalogButton").addEventListener("click", () => showCardCatalog());
$("resetButton").addEventListener("click", resetGame);
$("closeModal").addEventListener("click", closeModal);
$("modalBackdrop").addEventListener("click", (event) => {
  if (event.target === $("modalBackdrop")) closeModal();
});

async function bootstrapApp() {
  await bootstrapPersistence();
  state = initialState();
  render();
}

bootstrapApp();

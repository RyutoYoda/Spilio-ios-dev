// English Learning Content Data - Offline embedded
// All grammar patterns and native expressions

export interface Example {
  en: string;
  ja: string;
  note?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleJa: string;
  explanation: string;
  keyPoints: string[];
  examples: Example[];
}

export interface Category {
  id: string;
  title: string;
  titleJa: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  lessonId: string;
  type: "choice" | "fill" | "reorder" | "writing";
  question: string;
  questionJa?: string;
  options?: string[];
  answer: string;
  answerParts?: string[]; // for reorder
  explanation: string;
}

export const categories: Category[] = [
  {
    id: "basic-grammar",
    title: "Basic Grammar",
    titleJa: "基礎文法",
    icon: "📘",
    color: "#2563EB",
    lessons: [
      {
        id: "present-simple",
        title: "Present Simple",
        titleJa: "現在形",
        explanation: "現在形は、習慣的な動作、一般的な事実、状態を表します。主語が三人称単数の場合、動詞に-s/-esをつけます。",
        keyPoints: [
          "習慣・繰り返しの動作: I wake up at 7 every day.",
          "一般的事実: Water boils at 100°C.",
          "三人称単数: He plays / She watches / It goes",
          "否定文: do not (don't) / does not (doesn't) + 動詞原形",
          "疑問文: Do/Does + 主語 + 動詞原形?"
        ],
        examples: [
          { en: "I drink coffee every morning.", ja: "私は毎朝コーヒーを飲みます。", note: "習慣" },
          { en: "She works at a bank.", ja: "彼女は銀行で働いています。", note: "三人称単数 -s" },
          { en: "The sun rises in the east.", ja: "太陽は東から昇る。", note: "一般的事実" },
          { en: "They don't like spicy food.", ja: "彼らは辛い食べ物が好きではない。", note: "否定文" },
          { en: "Does he speak Japanese?", ja: "彼は日本語を話しますか？", note: "疑問文" },
        ],
      },
      {
        id: "past-simple",
        title: "Past Simple",
        titleJa: "過去形",
        explanation: "過去形は、過去の特定の時点で完了した動作や状態を表します。規則動詞は-edをつけ、不規則動詞は個別に覚えます。",
        keyPoints: [
          "過去の完了した動作: I visited Tokyo last week.",
          "規則動詞: play→played, watch→watched",
          "不規則動詞: go→went, see→saw, have→had",
          "否定文: did not (didn't) + 動詞原形",
          "疑問文: Did + 主語 + 動詞原形?"
        ],
        examples: [
          { en: "I went to the store yesterday.", ja: "昨日お店に行きました。", note: "不規則動詞" },
          { en: "She studied English for three hours.", ja: "彼女は3時間英語を勉強した。", note: "規則動詞" },
          { en: "We didn't see the movie.", ja: "私たちはその映画を見なかった。", note: "否定文" },
          { en: "Did you finish your homework?", ja: "宿題は終わりましたか？", note: "疑問文" },
          { en: "They lived in London for five years.", ja: "彼らは5年間ロンドンに住んでいた。", note: "期間" },
        ],
      },
      {
        id: "future",
        title: "Future Tenses",
        titleJa: "未来形",
        explanation: "未来を表す表現には、will（意志・予測）、be going to（計画・予測）、現在進行形（確定した予定）があります。",
        keyPoints: [
          "will: その場の決定・予測 - I'll help you.",
          "be going to: 計画・意図 - I'm going to study abroad.",
          "現在進行形: 確定した予定 - I'm meeting him tomorrow.",
          "否定: will not (won't) / am not going to",
          "willとbe going toの使い分けが重要"
        ],
        examples: [
          { en: "I'll call you later.", ja: "後で電話するよ。", note: "その場の決定 (will)" },
          { en: "It's going to rain tomorrow.", ja: "明日は雨が降りそうだ。", note: "根拠ある予測 (going to)" },
          { en: "We're flying to Paris next Monday.", ja: "来週の月曜にパリに飛びます。", note: "確定した予定" },
          { en: "I won't be late again.", ja: "もう遅刻しません。", note: "否定 (won't)" },
          { en: "She's going to start a new job.", ja: "彼女は新しい仕事を始める予定です。", note: "計画" },
        ],
      },
      {
        id: "progressive",
        title: "Progressive Tenses",
        titleJa: "進行形",
        explanation: "進行形（be + -ing）は、ある時点で進行中の動作を表します。現在進行形、過去進行形、未来進行形があります。",
        keyPoints: [
          "現在進行形: am/is/are + -ing（今まさに起きていること）",
          "過去進行形: was/were + -ing（過去のある時点で進行中）",
          "未来進行形: will be + -ing（未来のある時点で進行中）",
          "状態動詞は通常進行形にしない: know, like, believe",
          "一時的な状態にも使う: I'm living in Tokyo (temporarily)"
        ],
        examples: [
          { en: "I'm studying English right now.", ja: "今英語を勉強しています。", note: "現在進行形" },
          { en: "She was sleeping when I called.", ja: "私が電話した時、彼女は寝ていた。", note: "過去進行形" },
          { en: "This time tomorrow, I'll be flying to New York.", ja: "明日の今頃、NYに向かって飛んでいるだろう。", note: "未来進行形" },
          { en: "They're always complaining.", ja: "彼らはいつも文句を言っている。", note: "不満・苛立ち" },
          { en: "He was reading while she was cooking.", ja: "彼が読書している間、彼女は料理していた。", note: "同時進行" },
        ],
      },
      {
        id: "modals",
        title: "Modal Verbs",
        titleJa: "助動詞",
        explanation: "助動詞は動詞の前に置き、可能性・許可・義務・推量などのニュアンスを加えます。動詞は原形になります。",
        keyPoints: [
          "can/could: 能力・許可・可能性",
          "must/have to: 義務・必要性",
          "should/ought to: 助言・推奨",
          "may/might: 許可・推量",
          "will/would: 意志・丁寧な依頼"
        ],
        examples: [
          { en: "You can use my phone.", ja: "私の電話を使っていいよ。", note: "許可 (can)" },
          { en: "You must wear a seatbelt.", ja: "シートベルトを着用しなければならない。", note: "義務 (must)" },
          { en: "You should see a doctor.", ja: "医者に診てもらった方がいい。", note: "助言 (should)" },
          { en: "It might rain later.", ja: "後で雨が降るかもしれない。", note: "推量 (might)" },
          { en: "Would you mind closing the door?", ja: "ドアを閉めていただけますか？", note: "丁寧な依頼" },
        ],
      },
      {
        id: "articles",
        title: "Articles",
        titleJa: "冠詞",
        explanation: "英語の冠詞（a/an/the）は日本語にない概念で、名詞が特定か不特定か、数えられるかを示します。",
        keyPoints: [
          "a/an: 不特定の単数可算名詞（初出・一般的）",
          "the: 特定のもの（既知・唯一・文脈で明らか）",
          "無冠詞: 不可算名詞の一般論、複数形の一般論",
          "固有名詞は基本無冠詞（例外あり）",
          "慣用表現: go to school, in the morning"
        ],
        examples: [
          { en: "I saw a cat in the garden.", ja: "庭で猫を見た。", note: "a=初出, the=既知の庭" },
          { en: "The moon is beautiful tonight.", ja: "今夜は月が美しい。", note: "the=唯一のもの" },
          { en: "She's an engineer.", ja: "彼女はエンジニアです。", note: "an=母音の前" },
          { en: "I like music.", ja: "私は音楽が好きです。", note: "無冠詞=一般論" },
          { en: "Can you pass me the salt?", ja: "塩を取ってくれますか？", note: "the=目の前の特定のもの" },
        ],
      },
      {
        id: "prepositions",
        title: "Prepositions",
        titleJa: "前置詞",
        explanation: "前置詞は名詞の前に置き、場所・時間・方向・手段などの関係を示します。日本語の助詞に近い役割です。",
        keyPoints: [
          "場所: in（中）, on（上・接触）, at（地点）",
          "時間: in（月/年）, on（日/曜日）, at（時刻）",
          "方向: to, toward, into, out of",
          "手段: by, with, through",
          "前置詞+名詞の組み合わせを覚えることが重要"
        ],
        examples: [
          { en: "I live in Tokyo.", ja: "東京に住んでいます。", note: "in=都市の中" },
          { en: "The book is on the table.", ja: "本はテーブルの上にある。", note: "on=接触" },
          { en: "I'll meet you at the station.", ja: "駅で会いましょう。", note: "at=地点" },
          { en: "She goes to work by train.", ja: "彼女は電車で通勤する。", note: "by=手段" },
          { en: "We arrived on Monday.", ja: "月曜日に到着した。", note: "on=曜日" },
        ],
      },
      {
        id: "comparatives",
        title: "Comparatives & Superlatives",
        titleJa: "比較級・最上級",
        explanation: "形容詞・副詞の比較級（-er/more）は2つを比較し、最上級（-est/most）は3つ以上の中で最も〜を表します。",
        keyPoints: [
          "短い語: -er/-est (tall→taller→tallest)",
          "長い語: more/most (beautiful→more beautiful→most beautiful)",
          "不規則: good→better→best, bad→worse→worst",
          "比較級 + than: She is taller than me.",
          "the + 最上級: He is the smartest in the class."
        ],
        examples: [
          { en: "This book is more interesting than that one.", ja: "この本はあの本より面白い。", note: "more + 長い形容詞" },
          { en: "She runs faster than her brother.", ja: "彼女は兄より速く走る。", note: "-er + than" },
          { en: "It's the best restaurant in town.", ja: "町で一番いいレストランだ。", note: "不規則最上級" },
          { en: "Today is hotter than yesterday.", ja: "今日は昨日より暑い。", note: "-er" },
          { en: "This is the most expensive bag I've ever seen.", ja: "今まで見た中で一番高いバッグだ。", note: "most + 最上級" },
        ],
      },
    ],
  },
  {
    id: "intermediate-grammar",
    title: "Intermediate Grammar",
    titleJa: "中級文法",
    icon: "📗",
    color: "#059669",
    lessons: [
      {
        id: "present-perfect",
        title: "Present Perfect",
        titleJa: "現在完了形",
        explanation: "現在完了形（have/has + 過去分詞）は、過去の出来事が現在に影響を与えていること、経験、継続を表します。",
        keyPoints: [
          "経験: I have been to Paris. (行ったことがある)",
          "完了: I have finished my work. (終わった→今は自由)",
          "継続: I have lived here for 10 years. (10年住んでいる)",
          "結果: She has lost her key. (なくした→今持っていない)",
          "since（起点）/ for（期間）との組み合わせ"
        ],
        examples: [
          { en: "I've never eaten sushi before.", ja: "今まで寿司を食べたことがない。", note: "経験（否定）" },
          { en: "She has already left.", ja: "彼女はもう出発した。", note: "完了" },
          { en: "We've known each other since 2010.", ja: "2010年からお互いを知っている。", note: "継続 (since)" },
          { en: "He has broken his leg.", ja: "彼は足を骨折した（今も治っていない）。", note: "結果" },
          { en: "Have you ever been to Australia?", ja: "オーストラリアに行ったことはありますか？", note: "経験（疑問）" },
        ],
      },
      {
        id: "relative-clauses",
        title: "Relative Clauses",
        titleJa: "関係代名詞",
        explanation: "関係代名詞（who, which, that, whose, where, when）は、名詞を後ろから修飾する節を導きます。",
        keyPoints: [
          "who: 人（主格）- The man who called you",
          "which: 物・動物 - The book which I bought",
          "that: 人・物（制限用法）- The car that I drive",
          "whose: 所有 - The girl whose father is a doctor",
          "制限用法 vs 非制限用法（カンマの有無）"
        ],
        examples: [
          { en: "The woman who lives next door is a teacher.", ja: "隣に住んでいる女性は先生です。", note: "who（主格）" },
          { en: "This is the book that changed my life.", ja: "これは私の人生を変えた本です。", note: "that（物）" },
          { en: "I have a friend whose mother is Italian.", ja: "母親がイタリア人の友達がいる。", note: "whose（所有）" },
          { en: "The restaurant where we met is closing.", ja: "私たちが出会ったレストランが閉店する。", note: "where（場所）" },
          { en: "My sister, who lives in London, is visiting us.", ja: "ロンドンに住んでいる姉が訪ねてくる。", note: "非制限用法" },
        ],
      },
      {
        id: "passive-voice",
        title: "Passive Voice",
        titleJa: "受動態",
        explanation: "受動態（be + 過去分詞）は、動作を受ける側を主語にする表現です。行為者が不明・不要な場合に使います。",
        keyPoints: [
          "基本形: be + 過去分詞 (+ by 行為者)",
          "能動態→受動態の変換",
          "行為者が不明/一般的な場合にbyを省略",
          "各時制での受動態: is done / was done / will be done",
          "get + 過去分詞（口語的な受動態）"
        ],
        examples: [
          { en: "This book was written by Murakami.", ja: "この本は村上によって書かれた。", note: "by + 行為者" },
          { en: "English is spoken all over the world.", ja: "英語は世界中で話されている。", note: "行為者省略" },
          { en: "The window was broken.", ja: "窓が割られた。", note: "行為者不明" },
          { en: "The new bridge will be completed next year.", ja: "新しい橋は来年完成する予定だ。", note: "未来の受動態" },
          { en: "I got fired last week.", ja: "先週クビになった。", note: "get受動態（口語）" },
        ],
      },
      {
        id: "conditionals-basic",
        title: "Conditionals (Zero & First)",
        titleJa: "条件文（ゼロ・第一）",
        explanation: "条件文はif節で条件を示し、主節で結果を述べます。ゼロ条件文は事実、第一条件文は現実的な未来の条件です。",
        keyPoints: [
          "ゼロ条件文: If + 現在形, 現在形（一般的事実）",
          "第一条件文: If + 現在形, will + 動詞原形（現実的な未来）",
          "if節では未来形(will)を使わない",
          "unless = if not",
          "条件節と主節は入れ替え可能"
        ],
        examples: [
          { en: "If you heat water to 100°C, it boils.", ja: "水を100度に熱すると沸騰する。", note: "ゼロ条件文（事実）" },
          { en: "If it rains tomorrow, I'll stay home.", ja: "明日雨が降ったら家にいます。", note: "第一条件文" },
          { en: "I'll help you if you ask me.", ja: "頼んでくれたら手伝うよ。", note: "主節が先" },
          { en: "Unless you hurry, you'll miss the train.", ja: "急がないと電車に乗り遅れるよ。", note: "unless" },
          { en: "If you see her, tell her I said hi.", ja: "彼女に会ったら、よろしく伝えて。", note: "命令文との組み合わせ" },
        ],
      },
      {
        id: "infinitives-gerunds",
        title: "Infinitives & Gerunds",
        titleJa: "不定詞と動名詞",
        explanation: "動詞の後にto不定詞（to + 動詞原形）か動名詞（-ing）のどちらが来るかは動詞によって決まります。",
        keyPoints: [
          "to不定詞を取る動詞: want, decide, hope, plan, promise",
          "動名詞を取る動詞: enjoy, finish, avoid, mind, suggest",
          "両方取れる動詞: like, love, start, begin, continue",
          "意味が変わる動詞: stop, remember, forget, try",
          "目的を表すto不定詞: I went to the store to buy milk."
        ],
        examples: [
          { en: "I decided to quit my job.", ja: "仕事を辞めることに決めた。", note: "to不定詞 (decide)" },
          { en: "She enjoys reading novels.", ja: "彼女は小説を読むのを楽しんでいる。", note: "動名詞 (enjoy)" },
          { en: "I stopped smoking last year.", ja: "去年タバコをやめた。", note: "stop + -ing（やめる）" },
          { en: "I stopped to smoke.", ja: "タバコを吸うために立ち止まった。", note: "stop + to（〜するために止まる）" },
          { en: "Remember to lock the door.", ja: "ドアの鍵を忘れずにかけて。", note: "remember + to（これから）" },
        ],
      },
      {
        id: "reported-speech",
        title: "Reported Speech",
        titleJa: "間接話法",
        explanation: "間接話法は、他人の発言を自分の言葉で伝える方法です。時制の一致（バックシフト）が必要です。",
        keyPoints: [
          "時制のバックシフト: 現在→過去, 過去→過去完了",
          "代名詞の変化: I→he/she, my→his/her",
          "時・場所の変化: today→that day, here→there",
          "say vs tell: say (that)... / tell someone (that)...",
          "疑問文の間接話法: asked if/whether, asked wh-"
        ],
        examples: [
          { en: "She said she was tired.", ja: "彼女は疲れていると言った。", note: "am→was" },
          { en: "He told me he had finished.", ja: "彼は終わったと私に言った。", note: "finished→had finished" },
          { en: "She asked if I liked coffee.", ja: "彼女はコーヒーが好きか聞いた。", note: "Yes/No疑問文" },
          { en: "He asked me where I lived.", ja: "彼は私にどこに住んでいるか聞いた。", note: "Wh-疑問文" },
          { en: "They said they would come tomorrow.", ja: "彼らは明日来ると言った。", note: "will→would" },
        ],
      },
    ],
  },
  {
    id: "advanced-grammar",
    title: "Advanced Grammar",
    titleJa: "上級文法",
    icon: "📕",
    color: "#DC2626",
    lessons: [
      {
        id: "subjunctive",
        title: "Subjunctive Mood",
        titleJa: "仮定法",
        explanation: "仮定法は、事実に反する仮定や願望を表します。仮定法過去は現在の事実に反し、仮定法過去完了は過去の事実に反します。",
        keyPoints: [
          "仮定法過去: If + 過去形, would + 動詞原形（現在の非現実）",
          "仮定法過去完了: If + had + 過去分詞, would have + 過去分詞（過去の非現実）",
          "I wish + 仮定法（願望）",
          "as if/as though + 仮定法",
          "It's time + 仮定法過去"
        ],
        examples: [
          { en: "If I were rich, I would travel the world.", ja: "もし金持ちなら、世界中を旅するのに。", note: "仮定法過去" },
          { en: "If I had studied harder, I would have passed.", ja: "もっと勉強していたら、合格していたのに。", note: "仮定法過去完了" },
          { en: "I wish I could speak French.", ja: "フランス語が話せたらいいのに。", note: "wish + 仮定法" },
          { en: "She talks as if she knew everything.", ja: "彼女は何でも知っているかのように話す。", note: "as if + 仮定法" },
          { en: "It's time we left.", ja: "そろそろ出発する時間だ。", note: "It's time + 仮定法" },
        ],
      },
      {
        id: "inversion",
        title: "Inversion",
        titleJa: "倒置",
        explanation: "倒置は、強調や文体的効果のために通常の語順（主語+動詞）を逆にする構文です。否定の副詞句で頻出します。",
        keyPoints: [
          "否定副詞の倒置: Never have I seen...",
          "Not only...but also: Not only did he win...",
          "Hardly/Scarcely...when: Hardly had I arrived when...",
          "So/Such...that: So beautiful was she that...",
          "条件文のifの省略: Had I known... (= If I had known...)"
        ],
        examples: [
          { en: "Never have I seen such a beautiful sunset.", ja: "こんなに美しい夕日は見たことがない。", note: "Never + 倒置" },
          { en: "Not only did she win, but she also broke the record.", ja: "勝っただけでなく、記録も破った。", note: "Not only + 倒置" },
          { en: "Hardly had I sat down when the phone rang.", ja: "座ったとたんに電話が鳴った。", note: "Hardly...when" },
          { en: "Had I known earlier, I would have helped.", ja: "もっと早く知っていたら、助けたのに。", note: "If省略の倒置" },
          { en: "Little did he know what was coming.", ja: "彼はこれから何が起こるか全く知らなかった。", note: "Little + 倒置" },
        ],
      },
      {
        id: "participle-clauses",
        title: "Participle Clauses",
        titleJa: "分詞構文",
        explanation: "分詞構文は、接続詞+主語を省略し、分詞（-ing/-ed）で始まる副詞節です。文を簡潔にします。",
        keyPoints: [
          "現在分詞: Walking home, I saw a cat. (= While I was walking...)",
          "過去分詞: Written in English, the book was hard to read.",
          "完了分詞: Having finished work, she went home.",
          "理由・時・条件・付帯状況を表す",
          "主語が主節と一致する必要がある（懸垂分詞に注意）"
        ],
        examples: [
          { en: "Walking along the river, I found a wallet.", ja: "川沿いを歩いていたら、財布を見つけた。", note: "時（〜している時）" },
          { en: "Not knowing what to say, he remained silent.", ja: "何と言えばいいか分からず、彼は黙っていた。", note: "理由（〜なので）" },
          { en: "Having been rejected twice, she gave up.", ja: "2度断られたので、彼女は諦めた。", note: "完了分詞（理由）" },
          { en: "Seen from above, the city looks tiny.", ja: "上から見ると、街は小さく見える。", note: "過去分詞" },
          { en: "Weather permitting, we'll have a barbecue.", ja: "天気が良ければ、バーベキューをする。", note: "独立分詞構文" },
        ],
      },
      {
        id: "cleft-sentences",
        title: "Cleft Sentences",
        titleJa: "強調構文",
        explanation: "強調構文（It is...that/who）は、文の特定の要素を強調するために使います。What節による強調もあります。",
        keyPoints: [
          "It is/was + 強調部分 + that/who + 残り",
          "What節: What I need is a vacation.",
          "All節: All I want is peace.",
          "The reason why...is that...",
          "強調したい要素によって構造が変わる"
        ],
        examples: [
          { en: "It was John who broke the window.", ja: "窓を割ったのはジョンだ。", note: "人を強調" },
          { en: "It was yesterday that I met her.", ja: "彼女に会ったのは昨日だ。", note: "時を強調" },
          { en: "What I really want is some peace and quiet.", ja: "本当に欲しいのは静けさだ。", note: "What節" },
          { en: "All you need to do is ask.", ja: "頼むだけでいいんだよ。", note: "All節" },
          { en: "The reason I'm late is that the train was delayed.", ja: "遅れた理由は電車が遅延したからだ。", note: "The reason...is that" },
        ],
      },
      {
        id: "ellipsis",
        title: "Ellipsis & Substitution",
        titleJa: "省略と代用",
        explanation: "英語では繰り返しを避けるため、文の一部を省略したり代用表現（so, do, one）を使います。",
        keyPoints: [
          "助動詞での省略: I can swim and she can too.",
          "so/neither: So do I. / Neither did she.",
          "代動詞do: She works harder than I do.",
          "one/ones: I like the red one.",
          "to不定詞の省略: I'd like to. (= I'd like to go.)"
        ],
        examples: [
          { en: "A: I love sushi. B: So do I.", ja: "A: 寿司が好き。B: 私も。", note: "So + 倒置" },
          { en: "She can dance and he can too.", ja: "彼女は踊れるし、彼も踊れる。", note: "助動詞での省略" },
          { en: "I wanted to go, but I wasn't able to.", ja: "行きたかったけど、行けなかった。", note: "to不定詞の省略" },
          { en: "Which shirt? The blue one.", ja: "どのシャツ？青いやつ。", note: "one（代用）" },
          { en: "A: I don't like horror movies. B: Neither do I.", ja: "A: ホラー映画嫌い。B: 私も。", note: "Neither + 倒置" },
        ],
      },
    ],
  },
  {
    id: "native-expressions",
    title: "Native Expressions",
    titleJa: "ネイティブ表現",
    icon: "🗣️",
    color: "#7C3AED",
    lessons: [
      {
        id: "casual-speech",
        title: "Casual Speech Patterns",
        titleJa: "カジュアルな話し方",
        explanation: "ネイティブの日常会話では、教科書にない縮約形や省略が頻繁に使われます。自然な英語に近づくための表現です。",
        keyPoints: [
          "gonna = going to, wanna = want to, gotta = got to",
          "主語の省略: (I) Gotta go. / (It) Doesn't matter.",
          "フィラー: like, you know, I mean, basically",
          "応答: Totally! / For sure! / No way!",
          "短縮疑問: You coming? (= Are you coming?)"
        ],
        examples: [
          { en: "I'm gonna grab some coffee. Want some?", ja: "コーヒー買ってくるけど、いる？", note: "gonna + 省略" },
          { en: "Gotta run. See you later!", ja: "行かなきゃ。またね！", note: "gotta + 主語省略" },
          { en: "That movie was, like, so good.", ja: "あの映画、マジで良かった。", note: "フィラー (like)" },
          { en: "You know what I mean?", ja: "言いたいこと分かる？", note: "確認のフィラー" },
          { en: "No way! Are you serious?", ja: "まさか！本気で？", note: "驚きの応答" },
        ],
      },
      {
        id: "phrasal-verbs-common",
        title: "Essential Phrasal Verbs",
        titleJa: "必須句動詞",
        explanation: "句動詞（動詞+前置詞/副詞）はネイティブが最も頻繁に使う表現です。元の動詞とは異なる意味になります。",
        keyPoints: [
          "look up（調べる）, look after（世話する）, look forward to（楽しみにする）",
          "turn out（結果〜になる）, turn down（断る）, turn up（現れる）",
          "come up with（思いつく）, come across（偶然見つける）",
          "put off（延期する）, put up with（我慢する）",
          "get along with（仲良くする）, get over（乗り越える）"
        ],
        examples: [
          { en: "I need to look up this word.", ja: "この単語を調べなきゃ。", note: "look up = 調べる" },
          { en: "It turned out to be a mistake.", ja: "それは間違いだと分かった。", note: "turn out = 結果〜になる" },
          { en: "She came up with a great idea.", ja: "彼女は素晴らしいアイデアを思いついた。", note: "come up with = 思いつく" },
          { en: "I can't put up with this noise.", ja: "この騒音には我慢できない。", note: "put up with = 我慢する" },
          { en: "He finally got over his fear of flying.", ja: "彼はやっと飛行機恐怖症を克服した。", note: "get over = 乗り越える" },
        ],
      },
      {
        id: "natural-responses",
        title: "Natural Responses",
        titleJa: "自然な受け答え",
        explanation: "ネイティブは状況に応じて様々な応答パターンを使います。Yes/Noだけでなく、ニュアンスのある返答を覚えましょう。",
        keyPoints: [
          "同意: Absolutely! / Definitely! / I couldn't agree more.",
          "やんわり否定: Not really. / I'm not sure about that. / That's not quite right.",
          "驚き: You're kidding! / No way! / Seriously?",
          "共感: I know, right? / Tell me about it. / I hear you.",
          "曖昧: It depends. / Kind of. / Sort of."
        ],
        examples: [
          { en: "A: This restaurant is amazing! B: I couldn't agree more.", ja: "A: このレストラン最高！B: 本当にそう思う。", note: "強い同意" },
          { en: "A: Do you like it? B: Not really, to be honest.", ja: "A: 好き？B: 正直、あんまり。", note: "やんわり否定" },
          { en: "A: I got promoted! B: No way! Congrats!", ja: "A: 昇進した！B: まさか！おめでとう！", note: "驚き＋祝福" },
          { en: "A: Work has been so stressful. B: Tell me about it.", ja: "A: 仕事がストレスで。B: 分かるわ〜。", note: "共感" },
          { en: "A: Are you free tonight? B: It depends. What's up?", ja: "A: 今夜暇？B: 場合による。何？", note: "曖昧な返答" },
        ],
      },
      {
        id: "hedging-softening",
        title: "Hedging & Softening",
        titleJa: "婉曲表現・和らげ表現",
        explanation: "英語でも直接的すぎる表現は避けられます。ネイティブは様々な方法で表現を和らげます。",
        keyPoints: [
          "I was wondering if... (〜かなと思って)",
          "Would you mind...? (〜していただけますか)",
          "It might be better to... (〜した方がいいかも)",
          "I'm afraid... (残念ながら)",
          "kind of / sort of / a bit (ちょっと・やや)"
        ],
        examples: [
          { en: "I was wondering if you could help me.", ja: "手伝っていただけないかなと思いまして。", note: "丁寧な依頼" },
          { en: "Would you mind opening the window?", ja: "窓を開けていただけますか？", note: "丁寧な依頼" },
          { en: "I'm afraid I can't make it tomorrow.", ja: "残念ですが明日は行けません。", note: "断りの前置き" },
          { en: "It's kind of expensive, don't you think?", ja: "ちょっと高くない？", note: "和らげ (kind of)" },
          { en: "Maybe we could try a different approach?", ja: "別のやり方を試してみてはどうでしょう？", note: "提案の婉曲" },
        ],
      },
      {
        id: "collocations",
        title: "Common Collocations",
        titleJa: "よく使うコロケーション",
        explanation: "コロケーションは、自然に組み合わさる単語のペアです。正しいコロケーションを使うとネイティブらしく聞こえます。",
        keyPoints: [
          "make: make a decision, make progress, make sense",
          "do: do homework, do business, do someone a favor",
          "take: take a break, take responsibility, take place",
          "have: have a look, have a good time, have an effect",
          "get: get started, get rid of, get used to"
        ],
        examples: [
          { en: "Let's take a break.", ja: "休憩しよう。", note: "take a break（×have a break）" },
          { en: "That makes sense.", ja: "それは理にかなっている。", note: "make sense" },
          { en: "Could you do me a favor?", ja: "お願いがあるんだけど。", note: "do a favor" },
          { en: "I need to get rid of these old clothes.", ja: "この古い服を処分しなきゃ。", note: "get rid of" },
          { en: "It took place last summer.", ja: "それは去年の夏に行われた。", note: "take place = 行われる" },
        ],
      },
    ],
  },
  {
    id: "idioms",
    title: "Idioms & Phrases",
    titleJa: "イディオム・慣用句",
    icon: "💡",
    color: "#D97706",
    lessons: [
      {
        id: "body-idioms",
        title: "Body Idioms",
        titleJa: "体の部位を使ったイディオム",
        explanation: "英語には体の部位を使った慣用表現が多数あります。直訳では意味が通じないので、丸ごと覚えましょう。",
        keyPoints: [
          "keep an eye on = 見張る",
          "give someone a hand = 手伝う",
          "cost an arm and a leg = 非常に高い",
          "pull someone's leg = からかう",
          "break a leg = 頑張って（激励）"
        ],
        examples: [
          { en: "Could you keep an eye on my bag?", ja: "私のバッグを見ていてくれる？", note: "keep an eye on" },
          { en: "Can you give me a hand with this?", ja: "これ手伝ってくれる？", note: "give a hand" },
          { en: "That car cost an arm and a leg.", ja: "あの車はめちゃくちゃ高かった。", note: "cost an arm and a leg" },
          { en: "Are you pulling my leg?", ja: "からかってるの？", note: "pull someone's leg" },
          { en: "Break a leg at your audition!", ja: "オーディション頑張って！", note: "break a leg" },
        ],
      },
      {
        id: "time-idioms",
        title: "Time & Situation Idioms",
        titleJa: "時間・状況のイディオム",
        explanation: "日常会話で頻繁に使われる、時間や状況に関するイディオムです。",
        keyPoints: [
          "in the nick of time = ぎりぎり間に合って",
          "once in a blue moon = めったにない",
          "at the end of the day = 結局のところ",
          "it's about time = そろそろ〜する時だ",
          "behind the times = 時代遅れ"
        ],
        examples: [
          { en: "We arrived just in the nick of time.", ja: "ぎりぎり間に合った。", note: "in the nick of time" },
          { en: "I only see him once in a blue moon.", ja: "彼にはめったに会わない。", note: "once in a blue moon" },
          { en: "At the end of the day, it's your decision.", ja: "結局のところ、あなたの決断だ。", note: "at the end of the day" },
          { en: "It's about time you got a haircut.", ja: "そろそろ髪切った方がいいよ。", note: "it's about time + 過去形" },
          { en: "His ideas are behind the times.", ja: "彼の考えは時代遅れだ。", note: "behind the times" },
        ],
      },
      {
        id: "work-idioms",
        title: "Work & Business Idioms",
        titleJa: "仕事・ビジネスのイディオム",
        explanation: "ビジネスシーンで使われるイディオムです。会議やメールでも頻出します。",
        keyPoints: [
          "get the ball rolling = 始める",
          "think outside the box = 型にはまらず考える",
          "on the same page = 同じ認識",
          "touch base = 連絡を取る",
          "the bottom line = 要するに・最終結果"
        ],
        examples: [
          { en: "Let's get the ball rolling on this project.", ja: "このプロジェクトを始めよう。", note: "get the ball rolling" },
          { en: "We need to think outside the box.", ja: "型にはまらない発想が必要だ。", note: "think outside the box" },
          { en: "Are we all on the same page?", ja: "みんな同じ認識ですか？", note: "on the same page" },
          { en: "I'll touch base with you next week.", ja: "来週連絡するね。", note: "touch base" },
          { en: "The bottom line is we need more funding.", ja: "要するに、もっと資金が必要だ。", note: "the bottom line" },
        ],
      },
    ],
  },
  {
    id: "daily-conversation",
    title: "Daily Conversation",
    titleJa: "日常会話",
    icon: "💬",
    color: "#0891B2",
    lessons: [
      {
        id: "greetings-farewells",
        title: "Greetings & Farewells",
        titleJa: "挨拶・別れの表現",
        explanation: "ネイティブの挨拶は場面によって使い分けます。カジュアルからフォーマルまで覚えましょう。",
        keyPoints: [
          "カジュアル: Hey! / What's up? / How's it going?",
          "フォーマル: Good morning. / How do you do? / Pleased to meet you.",
          "別れ: See you! / Take care! / Catch you later!",
          "How are you?への返答: Not bad. / Can't complain. / Pretty good.",
          "久しぶり: Long time no see! / It's been ages!"
        ],
        examples: [
          { en: "Hey, what's up? — Not much, just chilling.", ja: "よう、元気？— 特に何も、ゆっくりしてる。", note: "カジュアル" },
          { en: "How's it going? — Can't complain.", ja: "調子どう？— まあまあかな。", note: "カジュアル" },
          { en: "It's been ages! How have you been?", ja: "久しぶり！元気だった？", note: "再会" },
          { en: "It was nice meeting you. Take care!", ja: "お会いできてよかったです。お元気で！", note: "初対面の別れ" },
          { en: "I'd better get going. Catch you later!", ja: "そろそろ行かなきゃ。またね！", note: "カジュアルな別れ" },
        ],
      },
      {
        id: "opinions-agreement",
        title: "Expressing Opinions",
        titleJa: "意見を言う・同意する",
        explanation: "自分の意見を述べたり、相手に同意・反対する時の自然な表現パターンです。",
        keyPoints: [
          "意見: I think / I feel / In my opinion / If you ask me",
          "強い同意: Absolutely! / Exactly! / That's so true!",
          "部分同意: I see your point, but... / That's true, however...",
          "反対: I'm not so sure about that. / I see it differently.",
          "確認: Don't you think? / Wouldn't you agree?"
        ],
        examples: [
          { en: "If you ask me, we should start earlier.", ja: "私に言わせれば、もっと早く始めるべきだ。", note: "意見を述べる" },
          { en: "I see your point, but I think there's another way.", ja: "言いたいことは分かるけど、別の方法もあると思う。", note: "部分同意" },
          { en: "I'm not so sure about that.", ja: "それはどうかな。", note: "やんわり反対" },
          { en: "That's exactly what I was thinking!", ja: "まさに私もそう思ってた！", note: "強い同意" },
          { en: "Don't you think it's a bit risky?", ja: "ちょっとリスキーだと思わない？", note: "同意を求める" },
        ],
      },
      {
        id: "requests-offers",
        title: "Requests & Offers",
        titleJa: "依頼と申し出",
        explanation: "何かを頼んだり、手伝いを申し出る時の丁寧さのレベルに応じた表現です。",
        keyPoints: [
          "カジュアル依頼: Can you...? / Could you...?",
          "丁寧な依頼: Would you mind...? / I was wondering if...",
          "申し出: Shall I...? / Would you like me to...? / Let me...",
          "承諾: Sure! / Of course! / No problem!",
          "断り: I'm sorry, but... / I'm afraid I can't..."
        ],
        examples: [
          { en: "Would you mind turning down the music?", ja: "音楽の音量を下げていただけますか？", note: "丁寧な依頼" },
          { en: "Shall I carry that for you?", ja: "それ持ちましょうか？", note: "申し出" },
          { en: "I was wondering if you could lend me your notes.", ja: "ノートを貸していただけないかと思いまして。", note: "とても丁寧" },
          { en: "Sure, no problem at all!", ja: "もちろん、全然大丈夫！", note: "快諾" },
          { en: "I'm afraid I can't make it. Sorry about that.", ja: "残念ですが行けません。すみません。", note: "丁寧な断り" },
        ],
      },
    ],
  },
  {
    id: "business-english",
    title: "Business English",
    titleJa: "ビジネス英語",
    icon: "💼",
    color: "#4338CA",
    lessons: [
      {
        id: "email-writing",
        title: "Email Writing",
        titleJa: "ビジネスメール",
        explanation: "ビジネスメールには定型表現があります。書き出し・本文・締めの基本パターンを覚えましょう。",
        keyPoints: [
          "書き出し: I hope this email finds you well. / I'm writing to...",
          "依頼: I would appreciate it if you could... / Could you please...?",
          "添付: Please find attached... / I've attached...",
          "締め: Looking forward to hearing from you. / Best regards,",
          "フォローアップ: Just following up on... / I wanted to check in about..."
        ],
        examples: [
          { en: "I hope this email finds you well.", ja: "お元気でお過ごしのことと存じます。", note: "定番の書き出し" },
          { en: "I would appreciate it if you could send me the report by Friday.", ja: "金曜日までにレポートを送っていただけると助かります。", note: "丁寧な依頼" },
          { en: "Please find attached the updated schedule.", ja: "更新されたスケジュールを添付いたします。", note: "添付" },
          { en: "I'm writing to inquire about your services.", ja: "御社のサービスについてお問い合わせいたします。", note: "目的の明示" },
          { en: "Looking forward to your reply.", ja: "お返事をお待ちしております。", note: "締め" },
        ],
      },
      {
        id: "meetings",
        title: "Meeting Language",
        titleJa: "会議の英語",
        explanation: "会議で使う英語表現です。司会進行、意見表明、質問、まとめの表現を覚えましょう。",
        keyPoints: [
          "開始: Let's get started. / Shall we begin?",
          "議題: The purpose of today's meeting is... / Let's move on to...",
          "意見: I'd like to point out that... / From my perspective...",
          "質問: Could you elaborate on that? / What do you mean by...?",
          "まとめ: To sum up... / Let's wrap up. / Action items are..."
        ],
        examples: [
          { en: "Let's get started. The purpose of today's meeting is to discuss Q3 targets.", ja: "始めましょう。今日の会議の目的はQ3の目標について話し合うことです。", note: "会議の開始" },
          { en: "I'd like to point out that our budget is limited.", ja: "予算が限られていることを指摘したいと思います。", note: "意見表明" },
          { en: "Could you elaborate on that point?", ja: "その点についてもう少し詳しく説明していただけますか？", note: "質問" },
          { en: "Let's move on to the next item on the agenda.", ja: "次の議題に移りましょう。", note: "進行" },
          { en: "To sum up, we agreed to launch by March.", ja: "まとめると、3月までにローンチすることで合意しました。", note: "まとめ" },
        ],
      },
      {
        id: "presentations",
        title: "Presentation Skills",
        titleJa: "プレゼンテーション",
        explanation: "プレゼンで使う英語表現です。導入、本論の展開、グラフの説明、質疑応答の表現を覚えましょう。",
        keyPoints: [
          "導入: Today I'd like to talk about... / I'll be covering three main points.",
          "展開: First of all... / Moving on to... / This brings me to...",
          "データ: As you can see from this graph... / The figures show that...",
          "強調: What's particularly interesting is... / I'd like to emphasize...",
          "質疑: Are there any questions? / That's a great question."
        ],
        examples: [
          { en: "Today I'd like to talk about our new marketing strategy.", ja: "本日は新しいマーケティング戦略についてお話しします。", note: "導入" },
          { en: "As you can see from this chart, sales have increased by 20%.", ja: "このグラフからお分かりのように、売上が20%増加しました。", note: "データ説明" },
          { en: "This brings me to my next point.", ja: "これで次のポイントに移ります。", note: "展開" },
          { en: "I'd like to emphasize the importance of customer feedback.", ja: "顧客フィードバックの重要性を強調したいと思います。", note: "強調" },
          { en: "That's a great question. Let me address that.", ja: "良い質問ですね。お答えします。", note: "質疑応答" },
        ],
      },
    ],
  },
];

// Generate quiz questions from content
export function generateQuizQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  let qId = 0;

  categories.forEach((category) => {
    category.lessons.forEach((lesson) => {
      // 4-choice quiz from examples
      lesson.examples.forEach((example, idx) => {
        if (idx < 3) {
          qId++;
          questions.push({
            id: `q${qId}`,
            categoryId: category.id,
            lessonId: lesson.id,
            type: "choice",
            question: `次の日本語に最も適切な英語表現を選んでください：\n「${example.ja}」`,
            options: generateOptions(example.en, category, lesson),
            answer: example.en,
            explanation: example.note || lesson.explanation.slice(0, 50),
          });
        }
      });

      // Fill-in-the-blank
      lesson.examples.forEach((example, idx) => {
        if (idx >= 1 && idx <= 2) {
          const words = example.en.split(" ");
          if (words.length >= 3) {
            const blankIdx = Math.floor(words.length / 2);
            const answer = words[blankIdx];
            const questionText = words.map((w, i) => (i === blankIdx ? "____" : w)).join(" ");
            qId++;
            questions.push({
              id: `q${qId}`,
              categoryId: category.id,
              lessonId: lesson.id,
              type: "fill",
              question: `空欄に入る適切な語を入力してください：\n${questionText}`,
              questionJa: example.ja,
              answer: answer.replace(/[.,!?]/g, ""),
              explanation: `正解: ${example.en}`,
            });
          }
        }
      });

      // Reorder
      lesson.examples.forEach((example, idx) => {
        if (idx === 0) {
          const words = example.en.replace(/[.,!?]/g, "").split(" ");
          if (words.length >= 3 && words.length <= 10) {
            qId++;
            questions.push({
              id: `q${qId}`,
              categoryId: category.id,
              lessonId: lesson.id,
              type: "reorder",
              question: `次の日本語を英語に並べ替えてください：\n「${example.ja}」`,
              answerParts: words,
              answer: example.en.replace(/[.,!?]/g, ""),
              explanation: `正解: ${example.en}`,
            });
          }
        }
      });

      // Writing
      lesson.examples.forEach((example, idx) => {
        if (idx === 3 || idx === 4) {
          qId++;
          questions.push({
            id: `q${qId}`,
            categoryId: category.id,
            lessonId: lesson.id,
            type: "writing",
            question: `次の日本語を英語に訳してください：\n「${example.ja}」`,
            answer: example.en,
            explanation: example.note || "",
          });
        }
      });
    });
  });

  return questions;
}

function generateOptions(correct: string, category: Category, currentLesson: Lesson): string[] {
  const options = [correct];
  const otherExamples = category.lessons
    .filter((l) => l.id !== currentLesson.id)
    .flatMap((l) => l.examples.map((e) => e.en));

  const sameLesson = currentLesson.examples
    .filter((e) => e.en !== correct)
    .map((e) => e.en);

  const pool = [...sameLesson, ...otherExamples];

  while (options.length < 4 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const option = pool.splice(idx, 1)[0];
    if (!options.includes(option)) {
      options.push(option);
    }
  }

  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}

// Flashcard data
export interface Flashcard {
  id: string;
  categoryId: string;
  front: string; // English
  back: string; // Japanese
  note?: string;
}

export function generateFlashcards(): Flashcard[] {
  const cards: Flashcard[] = [];
  let cardId = 0;

  categories.forEach((category) => {
    category.lessons.forEach((lesson) => {
      lesson.examples.forEach((example) => {
        cardId++;
        cards.push({
          id: `fc${cardId}`,
          categoryId: category.id,
          front: example.en,
          back: example.ja,
          note: example.note,
        });
      });
    });
  });

  return cards;
}

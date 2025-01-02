import {Question} from "../../../types"
export const questions: Question[] = [
  // E vs I
  { id: 1, text: "初対面の人と会話する際、あなたは自分から積極的に話題を提供できますか？", type: "E", weight: 1 },
  { id: 2, text: "人と会った後は、むしろ元気になるほうだと思いますか？", type: "E", weight: 1 },
  { id: 3, text: "大人数の集まりで、自分から中心的な役割を買って出ることが多いですか？", type: "E", weight: 1 },
  { id: 4, text: "イベントやパーティーなどに誘われると、予定が重ならない限り積極的に参加したいですか？", type: "E", weight: 1 },
  { id: 5, text: "休日はできるだけ友人や知人と過ごすほうが楽しいと感じますか？", type: "E", weight: 1 },
  { id: 6, text: "議論やディスカッションでは、他人の意見を待つよりも先に自分が発言したいほうですか？", type: "E", weight: 1 },
  { id: 7, text: "SNSやチャットなどでコミュニケーションを取るのは苦にならないほうですか？", type: "E", weight: 1 },
  { id: 8, text: "一人の時間が長く続くと、物足りなさや退屈さを感じやすいですか？", type: "E", weight: 1 },
  { id: 9, text: "新しいコミュニティやサークルにも抵抗なく飛び込めるタイプですか？", type: "E", weight: 1 },
  { id: 10, text: "静かな環境よりも多少のにぎやかさがあるほうが落ち着きますか？", type: "E", weight: 1 },
  { id: 11, text: "どちらかというと、会話の中で考えをまとめることが多いと感じますか？", type: "E", weight: 1 },
  { id: 12, text: "気の合う友人は数よりも幅広くたくさん欲しいと思いますか？", type: "E", weight: 1 },
  { id: 13, text: "講演やプレゼンなど、人前に立って話すことを特に緊張せずに行えますか？", type: "E", weight: 1 },
  { id: 14, text: "誘いを断るよりも、まずはとりあえず行ってみることが多いですか？", type: "E", weight: 1 },
  { id: 15, text: "周囲から「社交的だね」「友達が多いね」と言われることが多いですか？", type: "E", weight: 1 },
  { id: 16, text: "初対面の人と会話するとき、会話が途切れてもあまり気まずく感じないですか？", type: "I", weight: 1 },
  { id: 17, text: "大人数よりも、気心の知れた少人数や一人で過ごすほうが心地よいと感じますか？", type: "I", weight: 1 },
  { id: 18, text: "新しい環境や集まりに行くとき、まずは様子を見てから行動を決めることが多いですか？", type: "I", weight: 1 },
  { id: 19, text: "周りの人たちが盛り上がっていても、自分は静かに見守っていることが多いですか？", type: "I", weight: 1 },
  { id: 20, text: "自分の考えをまとめるとき、話すより書いたり頭の中で整理するほうがやりやすいですか？", type: "I", weight: 1 },
  { id: 21, text: "休みの日は、予定を詰め込むよりも家でのんびりする時間を大切にしたいですか？", type: "I", weight: 1 },
  { id: 22, text: "思ったことをすぐ口に出すより、考えてから話すことのほうが多いですか？", type: "I", weight: 1 },
  { id: 23, text: "多くの人と短く会話するよりも、少数の人とじっくり話すほうが好きですか？", type: "I", weight: 1 },
  { id: 24, text: "人の集まりに参加した後は、どっと疲れを感じることがあると思いますか？", type: "I", weight: 1 },
  { id: 25, text: "自分の意見を伝えるとき、声を張り上げるよりも落ち着いたトーンで伝えたいですか？", type: "I", weight: 1 },
  { id: 26, text: "相手に合わせて話題を切り替えるより、自分の興味ある分野を掘り下げて話したいですか？", type: "I", weight: 1 },
  { id: 27, text: "一人での作業や勉強のほうが、集中できて成果が出やすいと感じますか？", type: "I", weight: 1 },
  { id: 28, text: "「黙っていても理解してもらえるなら、それが一番楽」と思うことがありますか？", type: "I", weight: 1 },
  { id: 29, text: "周囲から「静かだね」「あまり目立たないね」と言われることが多いですか？", type: "I", weight: 1 },
  { id: 30, text: "自分だけの空間や時間が確保されていると、心が落ち着くと感じますか？", type: "I", weight: 1 },
  // S vs N
  { id: 31, text: "物事を把握するとき、まずは具体的な事実やデータをチェックするほうですか？", type: "S", weight: 1 },
  { id: 32, text: "将来のことを考えるよりも、目の前の課題に集中するほうが得意ですか？", type: "S", weight: 1 },
  { id: 33, text: "新しいアイデアよりも、既に実績のある方法を重視するほうですか？", type: "S", weight: 1 },
  { id: 34, text: "何かを学ぶ際は、わかりやすい例や体験を通じて理解するのが一番だと思いますか？", type: "S", weight: 1 },
  { id: 35, text: "普段から、細かいところによく気づくなど、注意力が高いほうだと思いますか？", type: "S", weight: 1 },
  { id: 36, text: "物事を進めるとき、ありのままの現状を重視して計画を立てるほうですか？", type: "S", weight: 1 },
  { id: 37, text: "五感で得られる情報（視覚・聴覚・触覚など）を重要視する傾向がありますか？", type: "S", weight: 1 },
  { id: 38, text: "「これはどうなるか」よりも「いま何が起きているか」を優先的に考えますか？", type: "S", weight: 1 },
  { id: 39, text: "取扱説明書やマニュアルは、細かい文章でもしっかり読むほうですか？", type: "S", weight: 1 },
  { id: 40, text: "想像力をめぐらせるよりも、実際に手を動かして確かめるほうが好きですか？", type: "S", weight: 1 },
  { id: 41, text: "未来に対する考え方は、現実的な予測を積み上げるタイプですか？", type: "S", weight: 1 },
  { id: 42, text: "創造的なアイデアよりも、具体的に実行しやすい方法に魅力を感じますか？", type: "S", weight: 1 },
  { id: 43, text: "「石橋を叩いて渡る」という言葉に共感できるほうですか？", type: "S", weight: 1 },
  { id: 44, text: "日常会話でも、抽象的な話題より具体的な話題が中心になりがちですか？", type: "S", weight: 1 },
  { id: 45, text: "記憶をたどるとき、まずはビジュアルや細部から思い出すことが多いですか？", type: "S", weight: 1 },
  { id: 46, text: "ひらめきがあったとき、すぐにその可能性や未来の展開を思い浮かべますか？", type: "N", weight: 1 },
  { id: 47, text: "パターンや関連性を見出したりするのが得意だと感じますか？", type: "N", weight: 1 },
  { id: 48, text: "日常のルーティンに対して、新しいアイデアを付け加えたくなることが多いですか？", type: "N", weight: 1 },
  { id: 49, text: "物事の本質や全体像をつかむことを優先して考えるほうですか？", type: "N", weight: 1 },
  { id: 50, text: "直感的に「これは面白いかもしれない」とひらめき、それを形にしてみたくなることがよくありますか？", type: "N", weight: 1 },
  { id: 51, text: "目の前の課題よりも、将来の可能性を想像してわくわくすることが多いですか？", type: "N", weight: 1 },
  { id: 52, text: "説明書を読むより、自分の直感で操作を始めてしまうことが多いですか？", type: "N", weight: 1 },
  { id: 53, text: "日常会話で、例え話やメタファーなど、抽象的な表現を多用するほうですか？", type: "N", weight: 1 },
  { id: 54, text: "何かを決断する際、実際のデータだけでなく、感覚的なインスピレーションを重視しますか？", type: "N", weight: 1 },
  { id: 55, text: "新しい方法を思いついたとき、たとえ前例がなくても試してみたいと思いますか？", type: "N", weight: 1 },
  { id: 56, text: "想像上の世界や空想に没頭するのが得意（好き）だと思いますか？", type: "N", weight: 1 },
  { id: 57, text: "将来の展望を考えるとき、夢やビジョンに向かって行動するのが大切だと思いますか？", type: "N", weight: 1 },
  { id: 58, text: "とっさのひらめきを信じて行動することが多いですか？", type: "N", weight: 1 },
  { id: 59, text: "現実的な話よりも、イメージや概念を膨らませるほうがモチベーションが湧きますか？", type: "N", weight: 1 },
  { id: 60, text: "何かを学ぶとき、細かい手順よりも全体の関連性をまず理解したいですか？", type: "N", weight: 1 },
  { id: 61, text: "友人が悩んでいるとき、問題解決の方法をアドバイスしたくなりますか？", type: "T", weight: 1 },
  { id: 62, text: "組織やチームでの方針を決める際、まずは合理性を最優先に考えますか？", type: "T", weight: 1 },
  { id: 63, text: "正しいかどうか分からない情報に対しては、論理的な根拠を求めずにはいられませんか？", type: "T", weight: 1 },
  { id: 64, text: "相手が望むことよりも、正確さや公正さのほうが大切だと思うことが多いですか？", type: "T", weight: 1 },
  { id: 65, text: "大事な決定をするとき、感情よりも事実を重んじる傾向がありますか？", type: "T", weight: 1 },
  { id: 66, text: "複雑なトラブルに直面したとき、まずは問題の構造を分析しようとしますか？", type: "T", weight: 1 },
  { id: 67, text: "「情に流されるより、理屈で割り切るほうが正しい」と感じることが多いですか？", type: "T", weight: 1 },
  { id: 68, text: "他人の意見を聞くとき、まずは内容の妥当性を検討してしまいますか？", type: "T", weight: 1 },
  { id: 69, text: "話し合いの場で「それは筋が通っていない」と感じたら、遠慮なく指摘できますか？", type: "T", weight: 1 },
  { id: 70, text: "客観性を重んじ、損得やメリット・デメリットの面から物事を判断しがちですか？", type: "T", weight: 1 },
  { id: 71, text: "問題が発生したとき、原因分析と対策を提示するのが得意だと思いますか？", type: "T", weight: 1 },
  { id: 72, text: "「自分はあまり感情的にはならないほうだ」と感じますか？", type: "T", weight: 1 },
  { id: 73, text: "議論で勝つことが必ずしも悪いと思わないタイプですか？", type: "T", weight: 1 },
  { id: 74, text: "自分の意見が正しいと思う場合、相手が納得するまで説明しようとしますか？", type: "T", weight: 1 },
  { id: 75, text: "重要な場面では、人情よりも規則やルールを優先すべきだと考えますか？", type: "T", weight: 1 },
  { id: 76, text: "友人が悩んでいるとき、まずは共感や励ましの言葉をかけようとしますか？", type: "F", weight: 1 },
  { id: 77, text: "他人の成功や失敗を聞くと、自分のことのように嬉しくなったり切なくなったりしますか？", type: "F", weight: 1 },
  { id: 78, text: "周囲の人と良好な関係を保つことを、多少の効率や合理性より優先させますか？", type: "F", weight: 1 },
  { id: 79, text: "相手の気持ちを考えて、はっきりと指摘する前に気を遣うタイプですか？", type: "F", weight: 1 },
  { id: 80, text: "物事を決めるとき、客観的事実だけでなく、自分や周囲の感情も大切だと思いますか？", type: "F", weight: 1 },
  { id: 81, text: "感情面での摩擦を避けるために、自分から譲ることがよくありますか？", type: "F", weight: 1 },
  { id: 82, text: "メンバー全員が満足するように、妥協点を探るのが得意ですか？", type: "F", weight: 1 },
  { id: 83, text: "誰かを傷つけてしまう可能性があると、それを避けるために遠回しな言い方をしますか？", type: "F", weight: 1 },
  { id: 84, text: "相手からの相談に対しては、解決策よりも気持ちをわかってあげることを重視しますか？", type: "F", weight: 1 },
  { id: 85, text: "自分が何か言うことで場の空気が悪くなるくらいなら黙っておこうと思うことがありますか？", type: "F", weight: 1 },
  { id: 86, text: "考え方よりも想いを共有することに価値を感じますか？", type: "F", weight: 1 },
  { id: 87, text: "人間関係において、相手の感情面のケアは最優先すべきだと思いますか？", type: "F", weight: 1 },
  { id: 88, text: "「暖かさ」や「思いやり」こそが人付き合いで重要だと思いますか？", type: "F", weight: 1 },
  { id: 89, text: "映画やドラマなどの感動的なシーンで、涙を流すことが多いですか？", type: "F", weight: 1 },
  { id: 90, text: "親しい人を批判するとき、なるべくやわらかい表現を選ぶように気を遣いますか？", type: "F", weight: 1 },
  { id: 91, text: "締め切りやスケジュールを守るため、余裕をもって行動することが多いですか？", type: "J", weight: 1 },
  { id: 92, text: "日々の予定やタスクは、リスト化して管理したいタイプですか？", type: "J", weight: 1 },
  { id: 93, text: "仕事や勉強は、計画に沿って進めるほうが安心しますか？", type: "J", weight: 1 },
  { id: 94, text: "「ゴール」を定めてそこに向けて着実に進むことにやりがいを感じますか？", type: "J", weight: 1 },
  { id: 95, text: "組織やチームで複数の人と進めるときは、まず役割や担当を明確化したいですか？", type: "J", weight: 1 },
  { id: 96, text: "何事も決められた手順どおりに進めるほうがスムーズだと感じますか？", type: "J", weight: 1 },
  { id: 97, text: "行動するときは、事前に情報収集や計画をしっかりするほうですか？", type: "J", weight: 1 },
  { id: 98, text: "予定や準備を直前になって慌てることはあまりありませんか？", type: "J", weight: 1 },
  { id: 99, text: "締め切り前にタスクを終わらせておき、ゆとりを作りたいタイプですか？", type: "J", weight: 1 },
  { id: 100, text: "人と待ち合わせるときは、時間厳守を徹底するほうですか？", type: "J", weight: 1 },
  { id: 101, text: "タスクや用事は「早めに片づけておきたい」と思うことが多いですか？", type: "J", weight: 1 },
  { id: 102, text: "「予定変更」があると少し落ち着かないほうですか？", type: "J", weight: 1 },
  { id: 103, text: "時間割やルールに沿って動くほうが得意だと思いますか？", type: "J", weight: 1 },
  { id: 104, text: "自宅の部屋やデスクは、整理整頓が行き届いているほうだと思いますか？", type: "J", weight: 1 },
  { id: 105, text: "物事の進行状況を、数値や進捗管理で把握できると安心しますか？", type: "J", weight: 1 },
  { id: 106, text: "締め切りや決まりよりも、自分のペースで動きたいタイプですか？", type: "P", weight: 1 },
  { id: 107, text: "計画を立てるより、行き当たりばったりでも柔軟に対応できる自信がありますか？", type: "P", weight: 1 },
  { id: 108, text: "直前のほうが集中できるので、タスクは後回しにすることが多いですか？", type: "P", weight: 1 },
  { id: 109, text: "プロジェクトや活動に取り組むときは、様々な可能性を残しておきたいですか？", type: "P", weight: 1 },
  { id: 110, text: "予定をきっちり決めるよりも、状況に合わせて変化させるほうが好みですか？", type: "P", weight: 1 },
  { id: 111, text: "一度決めた計画でも、途中でより良いアイデアがあればすぐ変更したいですか？", type: "P", weight: 1 },
  { id: 112, text: "旅行のスケジュールはきっちり決めるより、現地で臨機応変に楽しむほうが好きですか？", type: "P", weight: 1 },
  { id: 113, text: "自由な選択肢が多いほうが、やる気が湧きやすいと感じますか？", type: "P", weight: 1 },
  { id: 114, text: "何かを始めるとき、ルールや型に縛られたくないと思うことが多いですか？", type: "P", weight: 1 },
  { id: 115, text: "「とりあえずやってみる」がモットーで、失敗を恐れず動き出すことが多いですか？", type: "P", weight: 1 },
  { id: 116, text: "デッドライン間際に一気にエンジンがかかるタイプだと思いますか？", type: "P", weight: 1 },
  { id: 117, text: "計画通りに行かなくても、その場その場で柔軟に対応できるほうだと思いますか？", type: "P", weight: 1 },
  { id: 118, text: "ゴールや目標があいまいなほうが、逆に自由度が高くて好きだと思いますか？", type: "P", weight: 1 },
  { id: 119, text: "普段から、複数の作業を同時進行でこなしていることが多いですか？", type: "P", weight: 1 },
  { id: 120, text: "「やるべきことを決めすぎる」と逆に息苦しさを感じやすいですか？", type: "P", weight: 1 },
]
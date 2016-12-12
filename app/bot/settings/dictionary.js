const word = {
  english: {
    en: 'English',
    ja: '英語',
    kansai: '英語',
  },
  japanese: {
    en: 'Japanese',
    ja: '日本語',
    kansai: '東京弁',
  },
  kansaiBen: {
    en: 'Kansai dialect',
    ja: '関西弁',
    kansai: '関西弁',
  },
}

const command = {
  show: ['(?:show|open|bring).?(.*)', '(.*).?を?表示?(して)', '(.*).?を?見(せ|し)て', '(.*).?を?出して'],
  add: ['(?:add|create|save|register|upload|write).?(.*)', '(.*).?(置い|入れ|直し|((追加|保存|書き?込み?|アップロード|セーブ)し))といて'],
  remove: ['(?:remove|delete|trash|rm).?(.*)', '(.*).?削除して', '(.*).?消して', '(.*).?ポア'],
  list: ['list', 'ls', '一覧', 'all'],
  locale: ['speak in (.*)', '(.*)で?(喋っ|話し)て'],
  help: ['(help|hint|助けて|(分|わ)からない|教えて)']
}

const phrase = {
  yes: /(yes|yup|yeah|agree|ええで|かまへん)/i,
  no: /(no|nope|いいえ|あかん|ちゃうねん)/i,
  abort: /(bye|stop|cancel)/i,
}

const sentence = {
  fileList: {
    en: 'Here is cheat sheets list.\n',
    ja: 'チートシート一覧だ。\n',
    kansai: '全部でこんなけカンペあったで〜\n',
  },
  chooseFromList: {
    en: 'Tell me number to choose.\n\n',
    ja: '番号で選んでくれ。\n\n',
    kansai: '何番にする〜？\n\n',
  },
  fileNotFound: {
    en: 'does not exist.\n',
    ja: 'は存在しない。\n',
    kansai: 'なんかあらへんわ〜\n',
  },
  alreadyExists: {
    en: 'is already exists.\nAre you sure to overwrite existing file?\n',
    ja: 'という名前は使われている。\n既存のファイルを上書きしても構わないか？\n',
    kansai: 'って名前のんもうあんねやんか〜\n前のんの上から書いてしもてもええかな〜？\n',
  },
  askTitle: {
    en: 'Show me what new cheat sheet name is.\n',
    ja: '新しいチートシートの名前を教えてくれ。\n',
    kansai: 'サラのカンペ名前なんにする〜？\n',
  },
  postContent: {
    en: 'Write down the cheat sheet content.\n',
    ja: 'チートシートの内容を記入してくれ。\n',
    kansai: 'ほなカンペの中身書いて〜\n',
  },
  isPrivate: {
    en: 'Do you publish it the whole team?\n',
    ja: 'このチートシートをチームに公開してもいいか？\n',
    kansai: 'いま書いたやつみんな見ても大丈夫やんな〜？\n',
  },
  saved: {
    en: 'has been saved.\n',
    ja: 'を保存した。\n',
    kansai: '保存しといたで〜\n',
  },
  removed: {
    en: 'has been removed.\n',
    ja: 'を削除した。\n',
    kansai: 'ほかしといたで〜\n',
  },
  removing: {
    en: 'will be removed. Do you agree with that?\n',
    ja: 'を削除するが良いか？\n',
    kansai: 'のことほんまにほかしてまうけどええねんな〜？\n',
  },
  confirm: {
    en: 'Tell *yes* or *no*.\n',
    ja: '*yes* または *no* で答えてくれ。\n',
    kansai: 'かまへんかあかんかのどっちかで教えて〜\n',
  },
  tryAgain: {
    en: "I don't get it. Rephrase that.\n",
    ja: '分からない。言い直してくれ。\n',
    kansai: 'なんて言うたん？もっかい言うて〜\n',
  },
  roger: {
    en: 'Roger that.\n',
    ja: '承知した。\n',
    kansai: 'おっけ〜\n',
  },
  error: {
    en: "Wait a moment. I don't feel good now.\n",
    ja: '具合が悪いから少し待ってくれ。\n',
    kansai: 'なんかあかんわ…。ちょっと待ってくれへん？\n',
  },
  abort: {
    en: 'Start over from the beginning.\n',
    ja: '最初からやり直してくれないか。\n',
    kansai: 'ごめんやねんけどもっぺん初めっからやってもらわれへん〜？\n',
  },
  finish: {
    en: "Wrap it up. Good bye.\n",
    ja: '話は以上かな。それではまた。\n',
    kansai: 'ほなまた〜\n',
  },
  timeLimit: {
    en: (second) => `Answer the question in ${second} seconds.\n`,
    ja: (second) => `${second}秒以内に答えてくれ。\n`,
    kansai: (second) => `${second}秒で答えてな！はよはよ！\n`,
  },
  timeUp: {
    en: 'I cannot wait any more.\n',
    ja: 'まだ待たせるのか。\n',
    kansai: 'どんだけ待たせるん？はよしてや〜\n',
  },
  localeChanging: {
    en: (language) => `Can I speak in ${language} from now?\n`,
    ja: (language) => `今から${language}で喋るが良いな？\n`,
    kansai: (language) => `今から${language}で喋ってもええか〜？\n`,
  },
  localeChanged: {
    en: 'Ok, speaking in English from now.\n',
    ja: 'それでは今から日本語で喋ろう。\n',
    kansai: 'ほな関西弁で喋るわ〜\n',
  },
}

module.exports = { word, command, phrase, sentence }

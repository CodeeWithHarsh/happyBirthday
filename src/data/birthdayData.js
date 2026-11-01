/* ═══════════════════════════════════════════════════════════════════════════
   ♡  PERSONALIZE EVERYTHING HERE  ♡
   ---------------------------------------------------------------------------
   This is the ONLY file you need to edit to make the website yours.

   • Photos  → put your images inside  /public/images/  and keep the same
               file names (or change the paths below).
   • Music   → put your song at        /public/music/1.mp3
   • Text    → edit any string below. Use {name} anywhere and it will be
               replaced with `girlfriendName`.
   ═══════════════════════════════════════════════════════════════════════════ */

export const birthdayData = {
  // ── Basics ───────────────────────────────────────────────────────────────
  girlfriendName: 'Beautiful', // ← change this to her name (or a nickname)
  yourName: 'Me', // ← how you sign the letter
  birthday: '11 November',

  // Shown in the browser tab
  pageTitle: 'For {name} ♡',

  // ── Music ────────────────────────────────────────────────────────────────
  music: '/music/1.mp3',
  musicTitle: 'Our Song',
  // The song tries to start by itself as soon as the page opens. Most browsers
  // block sound until the first tap/click/key press, so if that happens it
  // starts on her very first touch anywhere on the page.
  // Set to false if you'd rather it waits for "Open My Surprise".
  autoplayMusic: true,
  // The song starts softly when she clicks "Open My Surprise".
  // Set to false (together with autoplayMusic) if you'd rather she starts it herself.
  startMusicOnOpen: true,

  // ── Chapter covers ───────────────────────────────────────────────────────
  // Every section opens with its own cover page: a few teaser lines and an
  // "Open" button. The cover splits from the centre (like a letter opening)
  // and the chapter rises up behind it.
  chapters: {
    portrait: {
      label: 'Chapter One',
      title: 'The Birthday Girl',
      lines: ['Before anything else...', 'let me show you my favourite view in the whole world.'],
    },
    about: {
      label: 'Chapter Two',
      title: 'What Makes You Special',
      lines: ['I tried to make a list.', 'It got very long, so here are the best parts.'],
    },
    gallery: {
      label: 'Chapter Three',
      title: 'Our Little Memories',
      lines: ['Some moments are too precious', 'to only keep in my head.'],
    },
    reveal: {
      label: 'Chapter Four',
      title: 'A Little Secret',
      lines: ['I have been hiding a few little frames of us...', 'are you ready to see them?'],
    },
    shayari: {
      label: 'Chapter Five',
      title: 'Dil Ki Baatein',
      lines: ['Kuch baatein seedhe kahi nahi jaati...', 'isliye maine unhe shayari bana diya.'],
    },
    letter: {
      label: 'Chapter Six',
      title: 'A Letter For You',
      lines: ['Some things are better said slowly,', 'and written straight from the heart.'],
    },
    question: {
      label: 'Chapter Seven',
      title: 'One Tiny Question',
      lines: ['Before the last surprise...', 'I need to ask you something important.'],
    },
  },

  // Buttons used to move between pages
  navigation: {
    begin: 'Begin our story ♡', // on the birthday page
    open: 'Open ♡', // on every chapter cover
    upNext: 'Up next',
    next: 'Turn the page ♡', // at the end of every chapter
    toFinal: 'One last surprise ♡', // after she says YES
    back: 'Back',
    again: 'Read it all again ♡', // at the very end
    scroll: 'Scroll', // the hint shown when a page continues below
    // Top status bar: chapters unlock one by one
    locked: 'Finish “{chapter}” first to unlock this one ♡',
    lockedFinal: 'Answer the big question first ♡',
  },

  // ── Loading screen ───────────────────────────────────────────────────────
  loadingText: 'Preparing something special',

  // ── Intro (the mysterious opening) ───────────────────────────────────────
  intro: {
    lines: ['Hey, Beautiful... ♡', 'I made something special for you...', 'But first...'],
    button: 'Open My Surprise ♡',
  },

  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'A little world made only for {name}',
    title: 'Happy Birthday, My Love ♡',
    date: '11 • November',
    subtitle: 'Today is special because the most beautiful soul entered this world.',
  },

  // ── Her portrait ─────────────────────────────────────────────────────────
  heroPhoto: '/photos/1.jpeg',
  portrait: {
    eyebrow: 'The birthday girl',
    quote: 'If I could give you one thing, it would be the ability to see yourself through my eyes.',
    caption: 'My favourite view in the whole world.',
  },

  // ── "Do you know what makes you special?" ────────────────────────────────
  // icon options: smile, heart, sparkles, laugh, sun, star, flower, moon, feather
  // image: a portrait photo for each card (put it in /public/photos/)
  // position (optional): which part of the photo stays in frame, e.g. 'center 20%'
  qualities: {
    title: 'Do you know what makes you special? ♡',
    subtitle: 'I could write a whole book. Here are just a few pages.',
    items: [
      {
        icon: 'smile', title: 'Your Smile',
        text: 'That sweet, shy smile fixes my worst days without even trying.',
        image: '/photos/2.jpeg', position: 'center 25%',
      },
      {
        icon: 'flower', title: 'Your Eyes',
        text: 'Soft as the flowers in your hand, and twice as lovely. One look and I forget what I was saying.',
        image: '/photos/3.jpeg', position: 'center 20%',
      },
      {
        icon: 'sparkles', title: 'Your Cute Side',
        text: 'Even with a helmet on, you are the most adorable rider I have ever seen.',
        image: '/photos/4.jpeg', position: 'center 10%',
      },
      {
        icon: 'laugh', title: 'Your Silly Side',
        text: 'Tongue out, peace sign up. You never let life get too serious, and I love you for it.',
        image: '/photos/5.jpeg', position: 'center 15%',
      },
      {
        icon: 'sun', title: 'Your Glow',
        text: 'Colours, sunshine and that smile. You turn any ordinary day into a festival.',
        image: '/photos/6.jpeg', position: 'center 30%',
      },
      {
        icon: 'heart', title: 'Us',
        text: 'My favourite thing about you? That out of the whole world, you chose me.',
        image: '/photos/7.jpeg', position: 'center 30%',
      },
    ],
  },

  // ── Memory gallery (scrapbook) ───────────────────────────────────────────
  // The layout is designed for 9 photos (more will repeat the layout).
  // caption:  optional, shown on polaroids and in the full-screen viewer
  // frame:    optional — 'polaroid' | 'tape' | 'plain' | 'corners'
  // position: optional — which part of the photo stays in frame, e.g. 'center 30%'
  // Similar-looking shots are spread apart on purpose so the page never repeats itself.
  gallery: {
    title: 'Our Little Memories ♡',
    subtitle: 'Some moments are too precious to only keep in my head.',
    photos: [
      { src: '/photos/8.jpeg', frame: 'polaroid', caption: 'Cheek to cheek ♡', position: 'center 38%' },
      { src: '/photos/15-upright.jpeg', frame: 'plain', caption: "That laugh. I'd do anything for it.", position: 'center 40%' },
      { src: '/photos/10.jpeg', frame: 'tape', caption: 'Ciao, but never goodbye ♡', position: 'center 42%' },
      { src: '/photos/9.jpeg', frame: 'corners', caption: 'Safe in my arms.', position: 'center 30%' },
      { src: '/photos/7.jpeg', frame: 'polaroid', caption: 'Flowers for my flower ♡', position: 'center 45%' },
      { src: '/photos/11.jpeg', frame: 'tape', caption: 'My favourite person.', position: 'center 30%' },
      { src: '/photos/16.jpeg', frame: 'polaroid', caption: 'Pizza dates with you ♡', position: 'center 35%' },
      { src: '/photos/14.jpeg', frame: 'plain', caption: 'You + me.', position: 'center 40%' },
      { src: '/photos/12.jpeg', frame: 'corners', caption: 'Stolen kisses.', position: 'center 45%' },
    ],
  },

  // ── The blurred "reveal" photo ───────────────────────────────────────────
  reveal: {
    photo: '/photos/17.jpeg',
    title: 'Six little moments are hiding behind this blur...',
    button: 'Reveal it ♡',
    messageTitle: 'Six frames, one favourite day.',
    message:
      'Glasses on, glasses off, a silly face, a cheeky tongue out, and that soft little smile at the end. Every frame is a different you, and I fell for every single one. This is the life journey I want: you and me, one frame after another.',
  },

  // ── Shayari (a little mehfil under a golden moon) ────────────────────────
  // One shayari at a time. Each is locked behind a little moment:
  //   ask.type 'choice' → pick an answer (each answer has its own reaction)
  //   ask.type 'dodge'  → `stay` is a normal button, `run` runs away from her
  //   ask.type 'hold'   → press and hold the heart until it opens
  // After she answers: "Irshaad..." → the lines appear one by one → "Wah! Wah!"
  // `highlight`: lines that read exactly like this glow in gold script.
  // A line written twice is recited twice (like the "×2" in a mushaira).
  shayari: {
    eyebrow: 'Ek chhoti si mehfil',
    title: 'Kuch Shayari, Sirf Tumhare Liye ♡',
    subtitle: 'Har shayari ke peeche ek sawaal chhupa hai. Jawaab do... tabhi khulegi.',
    counter: 'Shayari {n} / {total}',
    irshaad: 'Irshaad...',
    wah: 'Wah! Wah! 👏',
    last: 'Wah! Wah! Wah! 👏👏',
    finale: 'Bas... ab dil ki saari baatein tumhare paas hain ♡',
    reread: 'Kisi bhi dil pe tap karke dobara padho',
    poems: [
      {
        title: 'Radha Rani',
        ask: {
          type: 'choice',
          question: 'Ek sawaal... agar main Krishn hoon, toh tum kaun?',
          options: [
            { label: 'Radha 🦚', reaction: 'Radha... ya shayad Parvati? Suno 👇' },
            { label: 'Parvati 🔱', reaction: 'Parvati? Toh main Shiv. Par pehle kahani suno 👇' },
          ],
        },
        lines: [
          'Ki logo ko tere bare me boli huyi har chij ek kahani lgti h',
          'Usme mai krishn aur tu meri radha rani lgti h',
          'Ki kash vo kahani puri hoti',
          'Tu adhuri nhi puri meri hoti',
          'Ki agar vo kahani puri hoti to',
          'Usme mai shiv aur tu meri parvati hoti',
        ],
      },
      {
        title: 'Ek Muskaan',
        ask: {
          type: 'dodge',
          question: 'Sach batao... tumhari ek muskaan kitni khatarnak hai?',
          stay: { label: 'Bahut zyada 😌', reaction: 'Bilkul. Poora jahaan hila deti hai... suno 👇' },
          run: 'Bilkul nahi 🙄',
          chased: 'Ye button bhi jhooth nahi bolne dega 😏',
        },
        lines: [
          'Tere kahn te fuk du is jahan ne',
          'Kahar dha rakhya hai teri ak muskan ne',
          'Teri gel rahunga mai acche aur bure me bhi',
          'Aur btaa ke chahiye meri jaan ne',
        ],
      },
      {
        title: 'Til Wala Gaal',
        ask: {
          type: 'choice',
          question: 'Mirror mirror on the wall... sabse khubsurat kaun?',
          options: [
            { label: 'Chand 🌙', reaction: 'Chand? Woh toh tumse jalta hai 🙄 Suno...' },
            { label: 'Main 🙈', reaction: 'Bilkul sahi jawaab ✨ Aur suno...' },
          ],
        },
        lines: [
          'Chehra jaise chand liye firti ho',
          'Kadmo me aasman liye firti ho',
          'Ak to najre vaise tumse hatati nhi',
          'Ak to najre vaise tumse hatati nhi',
          'Upper se til vala gal liye firti ho',
        ],
      },
      {
        title: 'Jaise Krishn Ko Radha',
        ask: {
          type: 'choice',
          question: 'Tum hamesha poochti ho na... "main tumhe kaisi lagti hoon?"',
          options: [
            { label: 'Haan, kai baar 🙈', reaction: 'Toh aaj jawaab sun hi lo...' },
            { label: 'Kabhi nahi 😇', reaction: 'Jhooth! 😏 Khair... jawaab sun lo.' },
          ],
        },
        lines: [
          'Vo chand bhi tumhare samne sadda lage',
          'Hoor fikki tumhari noor jada lge',
          'Mat pucha Karo kaise lagte ho tum mujhe',
          'Tum aise lagte ho jaise krishn ko radha lge',
        ],
      },
      {
        title: 'Sindoor Ki Dibiya',
        ask: {
          type: 'dodge',
          question: 'Ek baat batani hai... dil thaam ke. Batane dogi?',
          stay: { label: 'Haan, batao ♡', reaction: 'Dhadkan tez ho rahi hai... suno 👇' },
          run: 'Nahi 😤',
          chased: 'Aaj "nahi" ka option band hai 😌',
        },
        lines: [
          'Bat Btane ki to nhi h magar Btane dogi kya',
          'Bat Btane ki to nhi h magar Btane dogi kya',
          'Ishq ho gya hai tumse jatane dogi kya',
          'Ki tum nadi tum pahad tum titli tum asman ho mera',
          'Ak dibiya rakhi hai sindoor ki maine tum lgane dogi kya',
        ],
      },
      {
        title: 'Aaina',
        ask: {
          type: 'choice',
          question: 'Aaj kuch bhi maang lo. Kya chahiye tumhe?',
          options: [
            { label: 'Chand 🌙', reaction: 'Chand? Uska bhi intezaam hai... suno 👇' },
            { label: 'Payal ✨', reaction: 'Bas payal? Main toh sab kuch le aaunga...' },
            { label: 'Sirf tum ♡', reaction: 'Woh toh pehle se tumhara hoon. Phir bhi suno...' },
          ],
        },
        lines: [
          'Tum pahno agar payal to mai le aaunga',
          'Tum lgao agar bindi to mai le aaunga',
          'Tum mango to ak bar kuch',
          'Mai apna dekr sab kuch tumhare liye sab kuch le aaunga',
          'Aur ye jo chand , tare tod k lane k hote hain vade',
          'Ye sab hote hain fizul',
          'Magar phir bhi tumhe dekhna ho chand',
          'To mai tumhare liye aayina le aaunga',
        ],
      },
      {
        title: 'Pehli Mulakat Se Zyada',
        ask: {
          type: 'choice',
          question: 'Hamari pehli mulakat yaad hai?',
          options: [
            { label: 'Haan ♡', reaction: 'Mujhe bhi. Par ek raaz ki baat kahun?' },
            { label: 'Thodi thodi 🙈', reaction: 'Koi baat nahi... main yaad dilata hoon.' },
          ],
        },
        lines: [
          'Bahut nur hai tumhare chehre me',
          'Tum chand se kya kaiksha se bhi achi lagti ho',
          'Thodi nadan ho , harkato se masum bacchi lagti ho',
          'Tumhari har ak ada mujhe apni si lagti h',
          'Mastana jadu h tumhari aankho me',
          'Yah bat jamane ko sacchi si lagti h',
          'Aur kya kahu tumhari tarif me',
          'Har dfa pahli mulakat se bhi jada haseen lagti ho',
        ],
      },
      {
        title: 'Dil Ka Daraz',
        ask: {
          type: 'hold',
          question: 'Mere dil mein ek daraz hai... dekhna hai usme kya rakha hai?',
          hint: 'Dil ko dabaa ke rakho, daraz khulega 🔐',
          reaction: 'Khul gaya... 🗝️',
        },
        lines: [
          'Mere dil k daraz me teri yado ka ak khacha bnaya hoga',
          'Kamaal ka kalakar hoga wo',
          'Jisne is tarike ka dhacha bnaya hoga',
          'Or jee karta h katva du hath us karigar k mai',
          'Jisne swarg me baithe teri surat ka sacha bnaya hoga',
        ],
      },
      {
        title: 'Kamal Lagogi',
        ask: {
          type: 'choice',
          question: 'Aakhri sawaal... aaj kya pehnogi?',
          options: [
            { label: 'Ghaghra 💃', reaction: 'Jo bhi pehno... ek baat pakki hai 👇' },
            { label: 'Saari 🌸', reaction: 'Jo bhi pehno... ek baat pakki hai 👇' },
            { label: 'Suit Salwar ✨', reaction: 'Jo bhi pehno... ek baat pakki hai 👇' },
          ],
        },
        highlight: ['Kamal lagogi', 'Kmal lagogi'],
        lines: [
          'Pairo ko payal',
          'to hatho ko chuddiyo se sajana',
          'Kamal lagogi',
          'Aankho pe kajal',
          'To mathe pe bindiya lagana',
          'Kamal lagogi',
          'Is chamkti chand me',
          'Us chand ki chandni se jyada chamkna',
          'Kmal lagogi',
          'Vahan khankhnate payal ki khankhanahat se bhi jada khankhna',
          'Kmal lagogi',
          'Mere dil ki khwahish aankho ka sukoon or saaso ki tum jarurat ho',
          'Kabhi meri najar se dekho khud ko',
          'Tum wakai me khubsurat ho',
          'Husn ki apsara hur ki pari kuch bhi kah lo Kamal lagogi',
          'Ghaghra saari suit salwar tum jo man pahno',
          'Kamal lagogi',
        ],
      },
    ],
  },

  // ── The letter ───────────────────────────────────────────────────────────
  // Each string is one line. Use '' for an empty line (a pause).
  letter: {
    title: 'A Letter For You ♡',
    envelopeHint: 'Tap the seal to open',
    salutation: 'My dearest {name},',
    lines: [
      'Sometimes I wonder how one person can make such a huge difference in another person’s life.',
      '',
      'And then I think about you.',
      '',
      'Your smile.',
      'Your voice.',
      'Your little habits.',
      'The way you make ordinary days feel special.',
      '',
      'I’m genuinely grateful that you’re part of my life.',
      '',
      'And today, more than anything...',
      '',
      'I just want you to know how incredibly special you are to me.',
    ],
    signoff: 'Forever yours,',
    signature: '{you}',
  },

  // ── The big question (with the runaway NO button) ────────────────────────
  question: {
    eyebrow: 'One tiny question',
    title: 'Will you stay with me forever? ♡',
    yes: 'YES 💗',
    no: 'NO 😏',
    // At first only the NO button is shown. After she tries to press it this
    // many times (hover or tap), the YES button appears. 2 or 3 works best.
    showYesAfter: 3,
    yesAppears: 'Maybe you were looking for this one? 💗',
    // What appears each time she tries to press NO (it cycles through them)
    reactions: [
      'No? Are you sure? 👀',
      'Think again... 😏',
      'Nice try 😂',
      'That button doesn’t seem to like being clicked.',
      'Why are you running after it? 😭',
      'It’s scared of you, honestly.',
      'The pink one is right there... 💗',
      'Okay this is getting a little embarrassing 🙈',
    ],
    hint: 'psst... the pink button works perfectly 💗',
    accepted: 'She said yes 💗',
    lockedHint: 'Answer the question to unlock the last surprise ♡',
  },

  // ── The YES celebration ──────────────────────────────────────────────────
  celebration: {
    title: 'I KNEW IT! ❤️',
    line1: 'You just made me the happiest person. 🥹',
    line2: 'Okay... now I have one more surprise for you.',
    button: 'Show me ♡',
  },

  // ── Final surprise ───────────────────────────────────────────────────────
  // Shown inside a heart; finalPhotoPosition keeps her face in the middle of it
  finalPhoto: '/photos/13.jpeg',
  finalPhotoPosition: 'center 25%',
  final: {
    intro: 'One Last Thing...',
    title: 'Happy Birthday, My Love ♡',
    wishes: [
      'May your smile always stay this beautiful.',
      'May your dreams come true.',
      'And may this new year of your life be filled with happiness, love and unforgettable memories.',
    ],
    love: 'I Love You. ❤️',
    ps: 'P.S. There’s a tiny hidden heart hiding somewhere in our little memories. Did you find it? 👀',
    footer: 'Made with all my love, only for you · 11.11',
  },

  // ── The secret hidden heart ──────────────────────────────────────────────
  secret: {
    line1: 'You found my secret... ❤️',
    line2: 'Okay, fine... I love you a little more than I said.',
  },
}

/** Replaces {name} / {you} tokens with the values above. */
export const fill = (text = '') =>
  text.replaceAll('{name}', birthdayData.girlfriendName).replaceAll('{you}', birthdayData.yourName)

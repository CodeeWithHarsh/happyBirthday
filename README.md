# Happy Birthday, My Love ♡

A romantic, cinematic birthday microsite built with React, Vite, Tailwind CSS 4 and Framer Motion.

**How it works:** the site is a storybook, not one long page. Every chapter starts with a **cover**: a gold crest, the chapter title, a couple of teaser lines and an **Open ♡** button, all in front of a pair of 3D gate doors. Pressing Open swings the doors inward and the chapter's own page rises up behind them. At the end of each chapter, **Turn the page ♡** swings the next chapter's gate shut over it. The ‹ button (top left) goes back.

**The status bar (top):** one step per chapter plus the final heart. A chapter counts as finished once she scrolls to its "Up next" ending. That gives it a ✓ and unlocks the next chapter (🔒 → its numeral). The current chapter shows a glowing heart. She can tap any unlocked chapter to revisit it. Tapping a locked one shakes it and tells her which chapter to finish first. The final heart unlocks only after she says YES.

**Scroll hint:** whenever a page continues below the screen, a small "Scroll ↓" pill appears at the bottom. Tapping it scrolls down, and it disappears once she reaches the end.

**The chapters:**
Loading heart → intro ("Open My Surprise") → Happy Birthday page → I. The Birthday Girl → II. What Makes You Special → III. Our Little Memories → IV. A Little Secret → V. Dil Ki Baatein (shayari) → VI. A Letter For You → VII. One Tiny Question → YES celebration → final surprise.

---

## 1. Install dependencies

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
```

## 2. Run it locally

```bash
npm run dev
```

Open the URL it prints (usually http://localhost:5173). To test on your phone, run `npm run dev -- --host` and open the "Network" URL on a phone that's on the same Wi-Fi.

## 3. Add her photos

All photos live in **`public/images/`**. The folder already has pink placeholder images. Each one says which file it is, so you can see where every photo appears. To use your own photo, **replace the file and keep its name**:

| File | Where it appears | Best shape |
|---|---|---|
| `hero.jpg` | Her big portrait (arch frame) | Portrait (4:5) |
| `special1.jpg` … `special5.jpg` | One photo on each "what makes you special" card | Portrait (4:5) |
| `photo1.jpg` … `photo10.jpg` | Scrapbook gallery | Any |
| `reveal.jpg` | The blurred "Reveal it ♡" photo | Landscape on desktop, cropped on mobile |
| `final.jpg` | Final heart-shaped reveal: use her best photo | Square, face centred |

- JPG, PNG and WebP all work. If you use another extension, update the path in `src/data/birthdayData.js`.
- Keep each image under about 500 KB (resize to roughly 1600px on the long side) so the site loads quickly. [squoosh.app](https://squoosh.app) is free and works well for this.
- **To add or remove gallery photos**, edit the `gallery.photos` list in `src/data/birthdayData.js`. The scrapbook layout adjusts automatically. Photos that have a `caption` are shown as polaroids.

## 4. Change her name

Open **`src/data/birthdayData.js`**:

```js
girlfriendName: 'Beautiful', // ← her name or nickname
yourName: 'Me',              // ← how you sign the letter
```

You can type `{name}` in any text in that file and it will be replaced with her name.

## 5. Edit the romantic messages

**Every piece of text on the site is in `src/data/birthdayData.js`.** You never need to touch the components. The file is organized in the same order as the site:

- `chapters`: each chapter cover's label, title and teaser lines
- `navigation`: the text on the Begin / Open / Turn the page / Back buttons
- `intro`: the opening lines and the button
- `hero`, `portrait`: the birthday headline, the quote and the caption
- `qualities.items`: the "what makes you special" cards. Icon options are `smile, heart, sparkles, laugh, sun, star, flower, moon, feather`
- `reveal`: the message behind the blurred photo
- `shayari.poems`: the shayari chapter, one poem at a time, each behind a question (`choice`), a runaway button (`dodge`) or a press-and-hold heart (`hold`)
- `letter.lines`: the letter, one string per line. Use `''` for a pause or blank line
- `question.reactions`: what the NO button says each time it runs away
- `celebration`, `final`, `secret`: the ending and the hidden heart

## 6. Add your song

Put your song at **`public/music/1.mp3`** (or change `music` in `birthdayData.js`).

- Music **autoplays** (`autoplayMusic: true`). It tries to fade in as soon as the page opens. Most browsers block sound until the visitor interacts with the page. When that happens, the song starts on her very first tap, click or key press anywhere.
- To make it wait for the "Open My Surprise ♡" click instead, set `autoplayMusic: false`.
- If you'd rather she starts it herself, set both `autoplayMusic: false` and `startMusicOnOpen: false`.
- The floating 🎵 button (bottom right) plays and pauses the music at any point.
- To remove music completely, set `music: ''`. The button then disappears.

## 7. Test the NO button

1. Go to Chapter VII, "One Tiny Question". At first **only the NO button** is shown.
2. **Desktop:** move your mouse toward NO. It runs away before you can reach it.
3. **Phone:** tap NO. It jumps somewhere else the moment you touch it.
4. Each attempt shows a new reaction, and NO shrinks and tilts.
5. After 3 attempts (set `showYesAfter` in the data file), the YES button pops into the centre with confetti. It grows a little with every further NO attempt.
6. A few tries later, a small hint appears: "the pink button works perfectly 💗".

The NO button always stays inside the visible part of the screen. It never covers YES or the music button, and it never causes sideways scrolling.

The final surprise stays locked until she presses YES.

**The hidden secret heart** is in Chapter III, "Our Little Memories". Scroll to the very end of the scrapbook: it's the small pink heart at the bottom-left, just under the last photos. Every few seconds it pulses and glints. Clicking it opens a secret message. The P.S. on the final page hints that it's "somewhere in our little memories".

## 8. Build the production version

```bash
npm run build      # creates the dist/ folder
npm run preview    # check the built version locally
```

## 9. Deploy it online (free)

**Option A: Netlify Drop (easiest, no account setup needed)**
1. Run `npm run build`.
2. Go to https://app.netlify.com/drop.
3. Drag the **`dist`** folder onto the page. You get a link right away. You can rename it in site settings, e.g. `happy-birthday-yourname.netlify.app`.

**Option B: Vercel**
1. Push this project to a GitHub repository.
2. Go to https://vercel.com/new and import the repo. Vercel detects Vite automatically.
3. Click **Deploy**.

**Option C: GitHub Pages**
Add `base: '/<repo-name>/'` to `vite.config.js`, then publish the `dist` folder with a tool like `gh-pages`.

> Privacy tip: anyone with the link can see the site. Don't post the link publicly, and use an unguessable name.

---

## Project structure

```
src/
├── data/birthdayData.js      ← ALL text, photos & music paths (edit this)
├── App.jsx                   ← the story order
├── index.css                 ← theme colours, fonts, shared styles
├── context/                  ← music play/pause, story page navigation
├── hooks/                    ← media queries, scroll lock
├── utils/                    ← confetti bursts, particle sprites
└── components/
    ├── LoadingScreen.jsx   IntroScreen.jsx     Hero.jsx
    ├── HerPortrait.jsx     AboutYou.jsx        PhotoGallery.jsx
    ├── RevealPhoto.jsx     ShayariSection.jsx  LoveLetter.jsx
    ├── QuestionSection.jsx Celebration.jsx     FinalSurprise.jsx
    ├── SecretSurprise.jsx  MusicPlayer.jsx     FloatingParticles.jsx
    ├── CursorTrail.jsx     ScrollProgress.jsx
    ├── story/              ← GateCover (3D doors), ChapterCover, ContentPage, ChapterEnd, StoryNav
    └── ui/                 ← GlowButton, SmartImage, HeartBurst, reveals…
```

**Performance and accessibility:** animations use transform and opacity. Particles are drawn on a single canvas that pauses when the tab is hidden. Images lazy-load. The cursor trail only runs on desktop. If her device has "reduce motion" turned on, the site automatically switches to a calmer version.

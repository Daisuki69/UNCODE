# ⚡ QIEZKA

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Android%2010%2B-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Bridge](https://img.shields.io/badge/Bridge-Capacitor%207-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![AI Engine](https://img.shields.io/badge/AI%20Evaluation-Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![API Model](https://img.shields.io/badge/API-Bring%20Your%20Own%20Key%20(BYOK)-FF9800?style=for-the-badge)
![Offline Support](https://img.shields.io/badge/Offline-Resources%20%26%20Lockdown-2196F3?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**The uncompromising, AI-evaluated study lockdown & focus enforcement system for Android.**

[Philosophy](#-philosophy-procrastination-prevention) • [Blocked & Allowed Apps](#-complete-application-reference-blocked--allowed) • [Overview](#-overview) • [Connectivity & BYOK](#-online-architecture--offline-resources-byok) • [Key Features](#-key-features) • [Setup Guide](#-setup-guide) • [qiezka.bat Configuration](#%EF%B8%8F-customizing-qiezkabat) • [Security Model](#-security--anti-cheat-architecture) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 Philosophy: Procrastination Prevention

> ### *"We just want students to finish their homework. We didn't say prevent them from using modern tools — the sole enemy is procrastination."*

<div align="center">

```
   ╔═══════════════════════════════════════════════════════════════════════════════╗
   ║                        THE ENEMY IS PROCRASTINATION                           ║
   ║                         NOT RESEARCH, NOTES, OR AI                            ║
   ╚═══════════════════════════════════════════════════════════════════════════════╝
```

</div>

Most productivity blockers fail because they fall into one of two extremes:
1. **Too Soft**: A polite reminder dialog that users swipe away in half a second.
2. **Blindly Restrictive**: They turn the smartphone into an unusable brick, locking students out of their lecture slides, school portals, notes, or cutting-edge study tools.

**QIEZKA rejects both.** 

Our guiding directive is simple: **Eliminate the black holes of wasted time, while keeping the full homework and research arsenal permanently armed.**

---

### 🛑 What We Obliterate (The Distraction Pit)
Algorithmically engineered dopamine traps that hijack human psychology and steal hours of student productivity:

* 📱 **Short-Form Doomscrolling**: TikTok, Instagram Reels, YouTube Shorts, X/Twitter, Reddit, Facebook, Threads, CapCut.
* 🍿 **Streaming & Piracy Black Holes**: Bilibili, KissKH (`id.kisskh.twa`), Netflix, Disney+, WeTV, iQIYI, Crunchyroll, Loklok, CloudStream, Mihon, and micro-drama reels (ReelShort, DramaBox, ShortMax).
* 📖 **Web Novels & Fanfic Sinks**: Wattpad, Webnovel, MangaToon, NovelToon, Wuxiaworld, Shosetsu.
* 📹 **Live Video Feeds & Stranger Chats**: OmeTV, Bigo Live, Tango, 17LIVE, Yubo.
* 💬 **Dating & Hookup Apps**: Tinder, Bumble, Hinge, Badoo, Omi, Grindr.
* 🎲 **Gambling & Sports Betting**: Stake, 1xBet, Bet365, DraftKings, FanDuel, PokerStars.
* 🎮 **Competitive Games & Gachas**: Roblox, Mobile Legends, Genshin Impact, Honkai: Star Rail, PUBG, Free Fire, Supercell titles, Candy Crush.
* 🌀 **Hyper-Casual & .IO Time-Wasters**: Hole.io, Woodturning 3D, Paper.io 2, Helix Jump, Crowd City, Aquapark.io, Slither.io, Agar.io, Snake.io, Survivor!.io, Stumble Guys, Bridge Race, Tiles Hop, Magic Tiles 3, Blockudoku, and VOODOO / SayGames titles.
* 🛍️ **Impulsive Shopping & Resale**: Shopee, Lazada, Amazon, Temu, Shein, AliExpress, Carousell, Vinted, Depop.
* 💉 **Modded Clients & Game Hacks**: Lucky Patcher, InstaPrime, GameGuardian, ReVanced, Instander, AeroInsta.
* 📦 **Virtual OS & Sandbox Bypassers**: VMOS, F1 VM, VPhoneGaGa, X8 Sandbox, Island, Shelter, MT Manager, NP Manager.

---

### ⚡ What We Empower ("ALWAYS" Allowed Arsenal)
During lockdown, students need tools to learn, calculate, write, and submit assignments. These tools are **hardcoded as always allowed** and given priority placement in the app drawer:

| Category | Permitted Tools | Why It's Hardcoded Allowed |
|---|---|---|
| 🤖 **AI Study Assistants** | **Google Gemini, ChatGPT, Claude, Microsoft Copilot, Perplexity, DeepSeek, Poe, Pi AI** | **Why AI?** AI is the ultimate 24/7 personal tutor. If an AI helps you grasp complex physics, explain calculus, draft an outline, or debug code so you finish your homework on time, **that is a win**. The goal is conquering procrastination, not denying modern intelligence. |
| 📄 **Document Scanners & PDF Worksheets** | **Adobe Acrobat Reader, CamScanner, Adobe Scan, WPS Office, Microsoft Lens, ReadEra, Xodo PDF** | Essential for viewing homework sheets, reading textbooks, and scanning handwritten pages for submission. |
| 🌐 **Translation & Language Learning** | **Google Translate, DeepL Translate, Duolingo, Merriam-Webster, Oxford & Cambridge Dictionaries** | Seamless translation of source materials and foreign language homework. |
| 📝 **All Notes Apps** | **Google Keep, Samsung Notes, Microsoft OneNote, Notion, Obsidian, Evernote, ColorNote, Squid, Simplenote** | Students must always be able to jot ideas, review lecture outlines, and brainstorm without obstacles. |
| 🎓 **Student Platforms & Storage** | **Google Classroom, Drive, Docs, Sheets, Slides, Canvas Student, Blackboard Learn, Schoology, Quizlet, AnkiDroid** | Your textbooks, problem sets, syllabi, and submission portals must never be blocked. |
| 🧮 **STEM Solvers & Hubs** | **Khan Academy, Symbolab, Mathway, Chegg Study, Desmos Graphing, GeoGebra, Photomath, WolframAlpha, Brilliant, Periodic Table** | Step-by-step problem solving, calculus derivations, and science lesson reviews. |
| ☁️ **Cloud Storage & Sync** | **Microsoft OneDrive, Dropbox, Box** | Immediate access to school cloud accounts and project repositories. |
| 💻 **CS & Coding Environments** | **Termux, Acode, Pydroid 3, GitHub** | Full-fledged Linux terminal, code editor, and Python environment for Computer Science coursework. |
| 🛡️ **2FA Authenticators** | **Google Authenticator, Microsoft Authenticator, Duo Mobile, Authy, 2FAS, Aegis, Bitwarden** | Zero lockouts. Signing into university portals and Google accounts must remain frictionless. |
| 🎵 **Deep Focus Audio & Browsers** | **Spotify, YouTube Music, Apple Music, Tidal, Chrome, Firefox, Brave** | Deep work requires a flow state. Background binaural beats, lo-fi study tracks, and web research are always accessible. |

---

## 📋 Complete Application Reference (Blocked & Allowed)

QIEZKA enforces focus using a two-layer defense: **Exact Package ID Matching** and **Dynamic Substring / Signature Heuristics**. Below is the complete catalog of all hardcoded applications recognized by both the TypeScript UI and native Android Accessibility engine (`BlacklistConstants.java`, `LockAccessibilityService.java`, and `LockPlugin.java`).

---

### 🟢 Hardcoded Allowed Applications ("ALWAYS" Accessible)

These applications are permanently whitelisted during lockdown. They appear in the app drawer and are never routed Home or blocked.

<details open>
<summary><b>🤖 1. AI Study Assistants (8 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Google Gemini** | `com.google.android.apps.bard` | Native Google multimodal AI assistant |
| **ChatGPT** | `com.openai.chatgpt` | OpenAI homework & concept tutor |
| **Claude** | `com.anthropic.claude` | Anthropic reasoning & writing tutor |
| **Microsoft Copilot** | `com.microsoft.copilot` | Microsoft GPT-4 & Bing search assistant |
| **Perplexity AI** | `ai.perplexity.app.android` | Citation-backed research engine |
| **DeepSeek** | `com.deepseek.chat` | DeepSeek AI assistant & math reasoning |
| **Poe** | `com.poe.android` | Multi-bot AI ecosystem by Quora |
| **Pi AI** | `ai.inflection.pi` | Conversational study coach |

</details>

<details open>
<summary><b>📄 2. Document Scanners & PDF Worksheets (8 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Adobe Acrobat Reader** | `com.adobe.reader` | PDF viewing, annotations, and worksheets |
| **Adobe Scan** | `com.adobe.scan.android` | Camera document scanning with OCR |
| **CamScanner** | `com.intsig.camscanner` | Document capture & homework PDF export |
| **WPS Office** | `cn.wps.moffice_eng` | Complete office suite (Word, Excel, PPT, PDF) |
| **Microsoft Lens** | `com.microsoft.office.officelens` | Whiteboard & document photo scanning |
| **ReadEra** | `org.readera` | Offline PDF, EPUB, and textbook reader |
| **Xodo PDF Reader** | `com.xodo.pdf.reader` | PDF worksheet form-filling & drawing |
| **Foxit PDF Reader** | `com.foxit.mobile.pdf.lite` | Lightweight PDF reading and annotating |

</details>

<details open>
<summary><b>🌐 3. Translation & Language Dictionaries (6 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Google Translate** | `com.google.android.apps.translate` | Multilingual text, speech, and camera translation |
| **DeepL Translate** | `com.deepl.mobiletranslator` | High-accuracy neural translation |
| **Duolingo** | `com.duolingo` | Foreign language vocabulary & grammar practice |
| **Merriam-Webster Dictionary** | `com.merriamwebster` | English vocabulary, definitions, and thesaurus |
| **Oxford Dictionary of English** | `com.mobisystems.msdict.embedded.wireless.oxford.dictionaryofenglish` | Academic English reference |
| **Cambridge Dictionary** | `org.cambridge.cclae` | Learner vocabulary and collocations |

</details>

<details open>
<summary><b>📝 4. Note-Taking & Brainstorming (15 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Google Keep** | `com.google.android.keep` | Quick notes, lists, and audio memos |
| **Samsung Notes** | `com.samsung.android.app.notes` | Handwritten stylus notes and lecture scribbles |
| **Microsoft OneNote** | `com.microsoft.office.onenote` | Multi-subject binder & notebook organizer |
| **Notion** | `notion.id` | Project planning, lecture databases, and wikis |
| **Obsidian** | `md.obsidian` | Markdown knowledge base & networked thought |
| **Evernote** | `com.evernote` | Cross-platform note archive |
| **Simplenote** | `com.automattic.simplenote` | Clean, distraction-free markdown notes |
| **ColorNote** | `com.socialnmobile.dictapps.notepad.color.note` | Simple sticky notes and checklists |
| **Zoho Notebook** | `com.zoho.notebook` | Visual card-based notebook system |
| **Squid** | `com.steadfastinnovation.android.pencilbook` | Handwritten PDF markup & vector paper |
| **Goodnotes** | `com.goodnotes.goodnotes` | Digital notebook and handwriting suite |
| **Nebo** | `com.myscript.nebo` | Handwriting-to-digital-text conversion |
| **UpNote** | `com.upnote.app` | Elegant rich-text note editor |
| **Standard Notes** | `com.standardnotes` | Encrypted, future-proof notes |
| **Noteshelf** | `com.fluidtouch.noteshelf3` | Digital planner & handwriting |

</details>

<details open>
<summary><b>🎓 5. Student Platforms, LMS & Office Suites (20 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Google Classroom** | `com.google.android.apps.classroom` | School assignments, announcements, and submissions |
| **Google Drive** | `com.google.android.apps.docs` | Cloud file management and lecture slides |
| **Google Docs** | `com.google.android.apps.docs.editors.docs` | Word processing and essay drafting |
| **Google Sheets** | `com.google.android.apps.docs.editors.sheets` | Spreadsheets, data analysis, and graphing |
| **Google Slides** | `com.google.android.apps.docs.editors.slides` | Presentation creation and lecture decks |
| **Google PDF Viewer** | `com.google.android.apps.pdfviewer` | Direct PDF viewing utility |
| **Canvas Student** | `com.instructure.cstudent` | University/school LMS portal and quiz hub |
| **Canvas Teacher** | `com.instructure.cancan` | Instructor grading and module inspection |
| **Blackboard Learn** | `com.blackboard.android.bbstudent` | University LMS portal & course syllabus |
| **Schoology** | `com.schoology.app` | K-12 and collegiate learning management |
| **Quizlet** | `com.quizlet.quizletandroid` | Flashcards, study sets, and memorization |
| **AnkiDroid** | `com.ichi2.anki` | Spaced repetition flashcard engine |
| **Brainly** | `co.brainly` | Peer-to-peer homework question & answer |
| **Photomath** | `com.photomath.android` | Step-by-step math solver with camera scanning |
| **Desmos Graphing Calculator** | `com.desmos.calculator` | Interactive graphing and Cartesian curves |
| **GeoGebra** | `org.geogebra.android` | Geometry, 3D graphing, and calculus models |
| **WolframAlpha** | `com.wolfram.android.alpha` | Computational knowledge & symbolic math engine |
| **Microsoft 365 (Office)** | `com.microsoft.office.officehubrow` | Integrated Word, Excel, and PowerPoint suite |
| **Microsoft Word** | `com.microsoft.office.word` | Academic essay and report editing |
| **Microsoft Excel** | `com.microsoft.office.excel` | Advanced formulas, tables, and statistics |
| **Microsoft PowerPoint** | `com.microsoft.office.powerpoint` | Slide deck review and presentation prep |

</details>

<details open>
<summary><b>🧮 6. STEM Solvers & Learning Hubs (7 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Khan Academy** | `org.khanacademy.android` | Free comprehensive courses in math, science, history |
| **Symbolab** | `com.devsense.symbolab` | Step-by-step calculus, algebra, and matrix solver |
| **Mathway** | `com.bagatrix.mathway.android` | Instant math problem step-by-step solver |
| **Chegg Study** | `com.chegg` | Textbook solutions and expert Q&A |
| **Brilliant** | `org.brilliant.android` | Interactive STEM, logic, and CS problem solving |
| **Periodic Table 2024** | `mendeleev.redlime` | Chemistry element data, isotopes, and properties |
| **Cymath** | `com.cymath.cymath` | Math problem solver with step derivations |

</details>

<details open>
<summary><b>☁️ 7. Cloud Storage & Sync (3 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Microsoft OneDrive** | `com.microsoft.skydrive` | University 365 cloud file storage |
| **Dropbox** | `com.dropbox.android` | Cloud file sharing and document archive |
| **Box** | `net.box.android` | Enterprise and collegiate cloud storage |

</details>

<details open>
<summary><b>💻 8. CS & Coding Environments (4 Packages)</b></summary>

| Application | Android Package ID | Academic Role |
|---|---|---|
| **Termux** | `com.termux` | Full-fledged Linux terminal emulator and package manager |
| **Acode** | `com.foxdebug.acode` | Powerful mobile code editor for web, JS, and Python |
| **Pydroid 3** | `ru.iiec.pydroid3` | Offline educational Python 3 IDE with pip |
| **GitHub** | `com.github.android` | Code repository review, issues, and pull requests |

</details>

<details open>
<summary><b>🛡️ 9. 2FA Authenticators (10 Packages)</b></summary>

| Application | Android Package ID | Security Role |
|---|---|---|
| **Google Authenticator** | `com.google.android.apps.authenticator2` | 2FA OTP codes for Google and academic portals |
| **Microsoft Authenticator** | `com.azure.authenticator` | University Single Sign-On (SSO) and 2FA |
| **Duo Mobile** | `com.duosecurity.duomobile` | Campus two-factor authentication push prompts |
| **Twilio Authy** | `com.authy.authy` | Multi-device cloud 2FA tokens |
| **2FAS Authenticator** | `com.twofasapp` | Open-source privacy-focused 2FA |
| **Aegis Authenticator** | `com.beemdevelopment.aegis` | Secure, open-source Android 2FA client |
| **Bitwarden Authenticator** | `com.bitwarden.authenticator` | Integrated password & TOTP generator |
| **LastPass Authenticator** | `com.lastpass.authenticator` | Two-factor verification tool |
| **FreeOTP** | `org.fedorahosted.freeotp` | Red Hat open-source 2FA |
| **Yubico Authenticator** | `com.yubico.yubioath` | Hardware security key companion |

</details>

<details open>
<summary><b>🌐 10. Web Browsers (9 Packages)</b></summary>

| Application | Android Package ID | Function |
|---|---|---|
| **Google Chrome** | `com.android.chrome`, `com.google.chrome` | General web research & portal access |
| **Mozilla Firefox** | `org.mozilla.firefox` | Independent web browser |
| **Samsung Internet** | `com.sec.android.app.sbrowser` | Optimized Samsung browser |
| **Microsoft Edge** | `com.microsoft.emmx` | Web research & Copilot sync |
| **Opera Browser** | `com.opera.browser` | Web browser |
| **Opera Mini** | `com.opera.mini.native` | Data-saving web browser |
| **Brave Browser** | `com.brave.browser` | Privacy-centric web browser |
| **DuckDuckGo** | `com.duckduckgo.mobile.android` | Tracker-free search browser |

</details>

<details open>
<summary><b>🎵 11. Deep Focus Music & Audio (9 Packages)</b></summary>

| Application | Android Package ID | Function |
|---|---|---|
| **Spotify** | `com.spotify.music` | Lo-Fi study beats, white noise, and focus playlists |
| **YouTube Music** | `com.google.android.apps.youtube.music` | Background study music streaming |
| **Apple Music** | `com.apple.android.music` | High-fidelity focus audio streaming |
| **Amazon Music** | `com.amazon.mp3` | Audio streaming |
| **Tidal** | `com.aspiro.tidal` | Lossless focus audio |
| **Deezer** | `deezer.android.app` | Music & podcast streaming |
| **SoundCloud** | `com.soundcloud.android` | Independent artist tracks and study mixes |
| **Samsung Music** | `com.sec.android.app.music` | Offline local audio player |
| **MIUI Music Player** | `com.miui.player` | Offline Xiaomi audio player |

</details>

<details open>
<summary><b>📸 12. System Camera Applications (13 Packages)</b></summary>

*Camera apps are permitted so students can photograph physical paper homework for AI evaluation without getting kicked to Home.*

| Vendor / ROM | Android Package ID |
|---|---|
| **AOSP / Generic Camera** | `com.android.camera`, `com.android.camera2` |
| **Google Pixel Camera** | `com.google.android.GoogleCamera` |
| **Samsung Camera** | `com.sec.android.app.camera`, `com.samsung.android.camera` |
| **Huawei Camera** | `com.huawei.camera` |
| **Oppo / Realme Camera** | `com.oppo.camera` |
| **OnePlus Camera** | `com.oneplus.camera` |
| **Xiaomi / Redmi / POCO Camera** | `com.xiaomi.camera` |
| **Motorola Camera** | `com.motorola.camera`, `com.motorola.camera2` |
| **Sony Xperia Camera** | `com.sonyericsson.android.camera` |
| **LineageOS Snap** | `org.lineageos.snap` |

</details>

<details>
<summary><b>⚙️ 13. System Keyboards & IMEs (Under-the-Hood Exemptions - 18 Packages)</b></summary>

*These packages are native input-method infrastructure. They are automatically permitted so students can type in search boxes and notes, but are hidden from the UI app drawer:*
`com.google.android.inputmethod.latin` (Gboard), `com.samsung.android.honeyboard` (Samsung Keyboard), `com.touchtype.swiftkey` & `com.touchtype.swiftkey.beta` (SwiftKey), `com.android.inputmethod.latin` (AOSP), `com.syntellia.fleksy.keyboard` (Fleksy), `org.dslul.openboard.inputmethod.latin` (OpenBoard), `com.menny.android.anysoftkeyboard` (AnySoftKeyboard), `com.grammarly.android.keyboard` (Grammarly), `com.oppo.keyboard`, `com.coloros.keyboard`, `com.vivo.keyboard`, `com.huawei.ohos.inputmethod`, `com.sohu.inputmethod.sogou`, `com.baidu.input`, `com.google.android.tts`.

</details>

---

### 🔴 Hardcoded Blacklisted Applications (Strictly Blocked)

These applications represent high-dopamine distractions, bypass vectors, or cracking utilities. Any attempt to open them immediately triggers the native accessibility service to fire an `ACTION_HOME` intent and collapse the interface within milliseconds.

<details open>
<summary><b>🍿 1. Asian Dramas, Anime & Streaming (26 Packages)</b></summary>

| Application | Android Package ID | Category |
|---|---|---|
| **KissKH TWA** | `id.kisskh.twa` | Pirated drama streaming PWA/TWA wrapper |
| **KissKH App** | `com.kisskh.app` | Asian drama streaming client |
| **KissAsian** | `com.kissasian.app` | Asian drama streaming portal |
| **Bilibili (Mainland China)** | `tv.danmaku.bili` | Video streaming & Danmaku community |
| **Bilibili Global / SEA** | `com.bstar.intl` | International Bilibili anime platform |
| **Bilibili India** | `com.bilibili.app.in` | Bilibili regional client |
| **Bilibili HD** | `tv.danmaku.bilibilihd` | Bilibili tablet edition |
| **Bilibili Comics** | `com.bilibili.comic`, `com.bilibili.comic.intl` | Manga & comic reader |
| **Bilibili Studio** | `com.bilibili.studio` | Content creator studio |
| **iQIYI / iQIYI International** | `com.iqiyi`, `com.iqiyi.i18n`, `com.qiyi.video` | Chinese drama & variety shows |
| **WeTV / Tencent Video** | `com.tencent.qqlivei18n`, `com.tencent.qqlive` | Asian drama streaming |
| **Viu** | `com.vuclip.viu` | Korean & Asian drama streaming |
| **Viki (Rakuten)** | `com.viki.android` | Asian drama streaming & community subs |
| **Youku / Youku International** | `com.youku.phone`, `com.youku.international` | Chinese video streaming |
| **Mango TV / MGTV** | `com.hunantv.imgo.activity`, `com.mgtv.tv` | Variety & entertainment streaming |
| **Crunchyroll** | `com.crunchyroll.crunchyroid` | Anime streaming service |
| **Funimation** | `com.funimation.funimationnow` | Anime streaming platform |
| **HIDIVE** | `com.hidive.android` | Anime streaming service |
| **RetroCrush** | `tv.cinedigm.retrocrush` | Classic retro anime streaming |

</details>

<details open>
<summary><b>🏴‍☠️ 2. Unofficial / Piracy / Third-Party Streaming (10 Packages)</b></summary>

| Application | Android Package ID | Threat Type |
|---|---|---|
| **Loklok** | `com.artem.scotepio`, `com.darmiu.folasia`, `com.tarparos.phigaea` | Pirated movie & drama aggregator |
| **CloudStream 3** | `com.lagradost.cloudstream3` | Open-source modular piracy streaming client |
| **MovieBoxPro** | `com.movieboxpro.android` | Third-party movie & series streaming |
| **Anilab** | `com.anilab.android`, `com.anilab.animtvappr` | Unofficial anime streaming app |
| **Stremio** | `com.stremio.one` | Torrent-based media streaming aggregator |
| **OnStream** | `com.onstream.app` | Third-party film & TV streaming client |
| **Popcorn Time** | `com.popcorntime` | Peer-to-peer torrent video player |

</details>

<details open>
<summary><b>📖 3. Webtoons, Manga & Light Novels (10 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **Line Webtoon** | `com.naver.linewebtoon` | Infinite-scroll Korean comic reader |
| **Tapas** | `com.tapastic` | Web comics and novel app |
| **KakaoPage / Kakao Webtoon** | `com.kakao.page`, `com.kakaowebtoon.app` | Webtoon reading portal |
| **Manga Plus by Shueisha** | `jp.co.shueisha.mangaplus` | Official Shonen Jump manga reader |
| **Tappytoon** | `com.contentsfirst.tappytoon` | Comics and light novel reader |
| **Tachiyomi** | `eu.kanade.tachiyomi` | Modular open-source manga reader |
| **Mihon** | `app.mihon` | Modern successor to Tachiyomi |
| **Aniyomi** | `eu.kanade.tachiyomi.anime`, `app.aniyomi` | Manga & anime fork of Tachiyomi |

</details>

<details open>
<summary><b>🎬 4. Micro-Drama & Vertical Short Series (6 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **ReelShort** | `com.newleaf.app.android.victor` | 1-minute episodic addictive drama reels |
| **DramaBox** | `com.storymatrix.drama` | Micro-drama vertical streaming |
| **ShortMax** | `live.shorttv.apps` | Short TV series and dramatic reels |
| **GoodShort** | `com.goodreels.app` | Micro-episodes & romance video drama |
| **MoboReels** | `com.chao.novel.moboreels` | Vertical mini-drama player |
| **TopShort** | `com.topshort.video` | Short drama entertainment |

</details>

<details open>
<summary><b>📺 5. Global Video Streaming & OTT (26 Packages)</b></summary>

| Application | Android Package ID |
|---|---|
| **Netflix** | `com.netflix.mediaclient`, `com.netflix.ninja` |
| **Disney+ / Hotstar** | `com.disney.disneyplus`, `in.startv.hotstar` |
| **Twitch** | `tv.twitch.android.app` |
| **Kick Streaming** | `com.kick.app` |
| **Amazon Prime Video** | `com.amazon.avod.thirdpartyclient`, `com.amazon.amazonvideo.livingroom` |
| **Hulu** | `com.hulu.plus` |
| **Max / HBO** | `com.wbd.stream`, `com.hbo.hbonow`, `com.hbo.gobro` |
| **Peacock TV** | `com.peacocktv.peacockandroid` |
| **Paramount+** | `com.cbs.app`, `com.cbs.ott` |
| **Apple TV** | `com.apple.atve.androidtv.appletv` |
| **Tubi TV** | `com.tubitv` |
| **Pluto TV** | `tv.pluto.android` |
| **Dailymotion** | `com.dailymotion.videoplayer` |
| **Vimeo** | `com.vimeo.android.videoapp` |
| **Plex** | `com.plexapp.android` |
| **JioCinema** | `com.jio.media.ondemand` |
| **Zee5** | `com.graymatrix.did` |
| **SonyLIV** | `com.sonyliv` |
| **MX Player** | `com.mxtech.videoplayer.ad` |

</details>

<details open>
<summary><b>💉 6. Game Modding, Memory Editors & Cracking (10 Packages)</b></summary>

| Application | Android Package ID | Bypass / Threat Vector |
|---|---|---|
| **Lucky Patcher** | `com.chelpus.luckypatcher`, `ru.chelpus.patcher`, `com.forpda.lp`, `com.dimonvideo.luckypatcher` | APK patching, in-app billing spoofing, signature removal |
| **GameGuardian** | `catch_.me_.if_.you_.can_`, `com.gameguardian` | Live process memory modification & speedhack |
| **SB Game Hacker** | `org.sbtools.gamehack` | Memory value scanner & trainer |
| **Creehack** | `org.cree.creehack` | Offline in-app purchase emulation |
| **Freedom APK** | `madkite.freedom`, `cc.madkite.freedom` | Google Play billing bypass daemon |

</details>

<details open>
<summary><b>📦 7. Virtual OS, Containers & Sandbox Bypass Tools (13 Packages)</b></summary>

*These utilities create virtualized parallel Android environments with isolated roots, which can be abused to run unmonitored apps outside of QIEZKA's accessibility scope.*

| Application | Android Package ID | Bypass Mechanism |
|---|---|---|
| **VMOS / VMOS Pro** | `com.vmos.app`, `com.vmos.pro`, `com.vmos.vmospro` | Complete guest Android OS with independent root & zygote |
| **F1 VM** | `com.f1player.f1vm`, `com.f1vm.android` | Virtual machine sandbox bypassing system services |
| **VPhoneGaGa** | `com.vphonegaga.titan` | Parallel virtual Android runtime container |
| **X8 Sandbox** | `com.x8zs.sandbox` | Sandboxed Android environment with speed hacks |
| **Island** | `com.oasisfeng.island` | Managed work profile container |
| **Shelter** | `net.typeblog.shelter` | Work profile sandbox isolator |
| **MT Manager** | `bin.mt.plus` | Advanced APK editor, dex decompiler, signature cloner |
| **NP Manager** | `com.mcal.np` | Dex string decryptor, APK modding tool |
| **Apktool M** | `ru.maximoff.apktool` | Mobile decompilation & resource re-packager |
| **APK Editor** | `com.google.android.apps.apkeditor` | On-device manifest and byte modification |

</details>

<details open>
<summary><b>🛒 8. Modded App Stores & Cloners (11 Packages)</b></summary>

| Application | Android Package ID |
|---|---|
| **HappyMod** | `com.happymod.apk` |
| **Aptoide** | `cm.aptoide.pt` |
| **ACMarket** | `net.appx.acmarket` |
| **Mobilism** | `org.mobilism.android` |
| **Androeed** | `com.androeed` |
| **TutuApp** | `com.tutuapp.android` |
| **Parallel Space** | `com.lbe.parallel.intl` |
| **Dual Space** | `com.excelliance.dualaid`, `clone.app.dualspace` |
| **Super Clone** | `com.polestar.super.clone` |
| **App Cloner** | `com.applisto.appcloner` |

</details>

<details open>
<summary><b>✨ 9. Modded Social Media & Third-Party Clients (14 Packages)</b></summary>

| Application | Android Package ID | Base App / Target |
|---|---|---|
| **InstaPrime** | `com.instaprime.android` | Modded Instagram with media downloaders |
| **Instander** | `com.instander.android` | Modded Instagram client |
| **AeroInsta** | `com.aeroinsta.android` | Modded Instagram suite |
| **Honista** | `com.honista.app` | Modded Instagram client |
| **YouTube ReVanced** | `app.revanced.android.youtube` | Modded YouTube client |
| **ReVanced Extended** | `app.rvx.android.youtube` | Extended YouTube ReVanced fork |
| **NewPipe** | `org.schabi.newpipe` | Lightweight third-party YouTube player |
| **SmartTube** | `com.teamsmart.videomanager.tv` | Unofficial YouTube TV client |
| **YouTube Vanced (Legacy)** | `com.vanced.android.youtube` | Discontinued modded YouTube client |
| **GBWhatsApp** | `com.gbwhatsapp` | Modded WhatsApp client |
| **FMWhatsApp** | `com.fmwhatsapp` | Modded WhatsApp client |
| **YoWhatsApp** | `com.yowhatsapp` | Modded WhatsApp client |
| **Aero WhatsApp** | `com.aerowhatsapp` | Modded WhatsApp client |
| **Plus Messenger** | `org.telegram.plus` | Modded Telegram client |

</details>

<details open>
<summary><b>📱 10. Social Media & Short-Form Video (38 Packages)</b></summary>

| Application | Android Package ID |
|---|---|
| **TikTok** | `com.zhiliaoapp.musically`, `com.ss.android.ugc.trill` |
| **Douyin / Douyin Lite** | `com.ss.android.ugc.aweme`, `com.ss.android.ugc.aweme.lite` |
| **Kwai / Kuaishou** | `com.kwai.video`, `com.smile.gifmaker`, `com.kuaishou.nebula` |
| **Likee** | `video.like` |
| **CapCut (Video Editor)** | `com.lemon.lvoverseas`, `com.lemon.lv` |
| **Instagram / Instagram Lite** | `com.instagram.android`, `com.instagram.lite` |
| **Threads** | `com.instagram.barcelona` |
| **YouTube** | `com.google.android.youtube`, `com.google.android.apps.youtube.kids`, `com.google.android.apps.youtube.creator` |
| **Snapchat** | `com.snapchat.android` |
| **Facebook / Facebook Lite** | `com.facebook.katana`, `com.facebook.lite` |
| **X / Twitter / Twitter Lite** | `com.twitter.android`, `com.twitter.android.lite` |
| **Reddit** | `com.reddit.frontpage`, `com.rubenmayayo.reddit` (Infinity), `me.ccrama.redditslide` (Slide) |
| **Pinterest** | `com.pinterest` |
| **Tumblr** | `com.tumblr` |
| **BeReal** | `com.bereal.ft` |
| **Bluesky** | `xyz.blueskyweb.app` |
| **Mastodon** | `org.joinmastodon.android` |
| **Sina Weibo** | `com.sina.weibo` |
| **Xiaohongshu (RED)** | `com.xingin.xhs` |
| **Lemon8** | `com.bd.nproject` |
| **Amino** | `com.narvii.amino.master` |
| **9GAG** | `com.ninegag.android.app` |
| **Imgur** | `com.imgur.mobile` |
| **iFunny** | `mobi.ifunny` |

</details>

<details open>
<summary><b>🎮 11. Games, Gachas & Platforms (48 Packages)</b></summary>

| Application / Studio | Android Package ID |
|---|---|
| **Roblox** | `com.roblox.client` |
| **Discord** | `com.discord` |
| **Steam** | `com.valvesoftware.android.steam.community` |
| **HoYoverse Titles** | `com.mihoyo.genshinimpact`, `com.cognosphere.genshinimpact.oversea` (Genshin), `com.hoyoverse.hkrpgoversea`, `com.mihoyo.hkrpg` (Star Rail), `com.hoyoverse.nap`, `com.cognosphere.nap.oversea` (Zenless Zone Zero) |
| **Shooters & Battle Royales** | `com.tencent.ig`, `com.pubg.krmobile`, `com.pubg.imobile`, `com.vng.pubgmobile` (PUBG), `com.dts.freefireth`, `com.dts.freefiremax` (Free Fire), `com.activision.callofduty.shooter`, `com.activision.callofduty.warzone` (Call of Duty) |
| **MOBAs** | `com.mobile.legends` (Mobile Legends: Bang Bang), `com.riotgames.league.wildrift` (Wild Rift), `com.riotgames.league.teamfighttactics` (TFT), `com.garena.game.kgid` (Arena of Valor) |
| **Supercell Titles** | `com.supercell.brawlstars`, `com.supercell.clashofclans`, `com.supercell.clashroyale`, `com.supercell.squad`, `com.supercell.hayday`, `com.supercell.boombeach` |
| **Casual & Runners** | `com.king.candycrushsaga`, `com.king.candycrushsodasaga`, `com.king.farmheroessaga`, `com.kiloo.subwaysurf`, `com.imangi.templerun`, `com.imangi.templerun2`, `com.innersloth.spacemafia` (Among Us), `com.mojang.minecraftpe` (Minecraft) |
| **Sports & AR** | `com.ea.gp.fifamobile` (FC Mobile), `jp.konami.pesam` (eFootball), `com.nianticlabs.pokemongo`, `jp.pokemon.pokemonunite` |
| **Stores & Emulators** | `com.taptap`, `com.taptap.global`, `com.epicgames.portal`, `org.ppsspp.ppsspp`, `org.ppsspp.ppssppgold`, `com.retroarch`, `org.dolphinemu.dolphinemu`, `xyz.aethersx2.android` |

</details>

<details open>
<summary><b>🛍️ 12. Shopping & E-Commerce (19 Packages)</b></summary>

| Store | Android Package ID |
|---|---|
| **Shopee** | `com.shopee.ph`, `com.shopee.id`, `com.shopee.my`, `com.shopee.sg`, `com.shopee.th`, `com.shopee.vn`, `com.shopee.tw`, `com.shopee.br` |
| **Lazada** | `com.lazada.android` |
| **Amazon Shopping** | `com.amazon.mshop.android.shopping` |
| **Shein** | `com.zzkko` |
| **Temu** | `com.einnovation.temu` |
| **AliExpress / Taobao** | `com.alibaba.aliexpresshd`, `com.taobao.taobao` |
| **eBay** | `com.ebay.mobile` |
| **Tokopedia / Bukalapak** | `com.tokopedia.tkpd`, `com.bukalapak.android` |
| **Mercado Libre** | `com.mercadolibre` |

</details>

<details open>
<summary><b>📚 13. Fanfic, Web Novels & Light Novels (6 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **Wattpad** | `wp.wattpad` | Social storytelling and fanfiction platform |
| **Webnovel** | `com.qidian.Int.reader` | Serialized web novels and light novels |
| **MangaToon / NovelToon** | `mobi.mangatoon.novel`, `mobi.mangatoon.noveltoon` | Comics and light fiction reading |
| **Wuxiaworld** | `com.wuxiaworld.mobile` | Chinese/Korean martial arts & cultivation web novels |
| **Shosetsu** | `com.shosetsu.android` | Open-source novel aggregator |

</details>

<details open>
<summary><b>📹 14. Live Video Feeds & Stranger Chats (6 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **OmeTV** | `video.chat.ometv`, `com.duoduo.ometv` | Live video roulette with random strangers |
| **Bigo Live** | `sg.bigo.live` | Live streaming and virtual gifting broadcasts |
| **Tango** | `com.sgiggle.production` | Interactive live streaming and stranger chat |
| **17LIVE** | `com.machipopo.media17` | Live video social platform |
| **Yubo** | `co.yubo.mobile` | Social live streaming and friend discovery |

</details>

<details open>
<summary><b>💬 15. Dating & Swiping Apps (6 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **Tinder** | `com.tinder` | Swiping & dating app |
| **Bumble** | `com.bumble.app` | Dating, friends, and networking |
| **Hinge** | `co.hinge.app` | Relationship-oriented dating app |
| **Badoo** | `com.badoo.mobile` | Global dating community |
| **Omi** | `com.zenmen.omi` | Asian social dating app |
| **Grindr** | `com.grindrapp.android` | Location-based dating and chat |

</details>

<details open>
<summary><b>🎲 16. Gambling & Sports Betting (6 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **DraftKings** | `com.draftkings.dknative` | Sportsbook, casino, and daily fantasy |
| **FanDuel** | `com.fanduel.sportsbook` | Sportsbook & racing app |
| **PokerStars** | `com.pokerstars.android` | Real money poker and card tournaments |
| **Bet365** | `com.bet365Wrapper.Bet365` | Sports betting and live match odds |
| **1xBet** | `com.xbet.android` | Online sports betting client |
| **Stake** | `com.stake.mobile` | Crypto casino and sports betting |

</details>

<details open>
<summary><b>🏷️ 17. Resale & Second-Hand Bidding (4 Packages)</b></summary>

| Application | Android Package ID | Description |
|---|---|---|
| **Carousell** | `com.thecarousell.Carousell` | Classifieds marketplace for preloved goods |
| **Vinted** | `fr.vinted` | Second-hand clothes shopping & resale |
| **Depop** | `io.depop` | Vintage fashion marketplace |
| **Pinduoduo** | `com.xunmeng.pinduoduo` | Group-buying social shopping app |

</details>

<details open>
<summary><b>🌀 18. Hyper-Casual, .IO & Satisfying Time-Wasters (46 Packages)</b></summary>

| Application | Android Package ID | Publisher / Type |
|---|---|---|
| **Hole.io** | `io.voodoo.holeio` | VOODOO physics black-hole devourer |
| **Woodturning 3D** | `com.furunwang.woodturning`, `com.voodoo.woodturning` | VOODOO ASMR lathe carving simulator |
| **Paper.io & Paper.io 2** | `io.voodoo.paperio`, `io.voodoo.paper2` | VOODOO territory claiming .io game |
| **Helix Jump** | `com.h8games.helixjump` | VOODOO endless bouncy ball drop |
| **Crowd City** | `io.voodoo.crowdcity` | VOODOO crowd gathering .io battle |
| **Aquapark.io** | `com.cassette.aquapark` | VOODOO water slide racing .io |
| **Flappy Dunk** | `io.voodoo.flappydunk` | VOODOO winged basketball tapper |
| **Slither.io** | `air.com.hypah.io.slither` | Original snake multiplayer .io |
| **Agar.io / Diep.io** | `com.miniclip.agar.io`, `com.miniclip.diep.io` | Miniclip classic cellular & tank .io |
| **Snake.io** | `com.amelosinteractive.snake` | Modern arcade worm battle .io |
| **Survivor!.io** | `com.gorilla.boltrend.survivorio`, `com.habby.survivorio` | Habby roguelite zombie wave horde |
| **Archero** | `com.habby.archero` | Habby dungeon crawler shooter |
| **Join Clash 3D** | `com.freeplay.clash3d`, `com.superpow.snake` | Supersonic crowd runner battle |
| **Bridge Race** | `com.garawell.bridgerace` | Garawell brick collecting runner |
| **Going Balls** | `com.pronetis.ironball` | Supersonic rolling ball obstacle platformer |
| **Tall Man Run** | `com.supersonic.tallmanrun` | Supersonic scaling runner game |
| **Stumble Guys** | `com.kitkagames.fallbuddies` | Knockout multiplayer party royale |
| **Tiles Hop: EDM Rush!** | `com.amanotes.pamadiscodancing` | Amanotes rhythm ball hopper |
| **Magic Tiles 3** | `com.youmusic.magictiles` | Amanotes piano tile rhythm tapper |
| **Color Switch** | `com.fortafygames.colorswitch` | Color matching geometry reflex tapper |
| **Crossy Road** | `com.yodo1.crossyroad` | Endless road crossing arcade |
| **Fruit Ninja** | `com.halfbrick.fruitninjafree` | Halfbrick blade slashing reflex arcade |
| **Cut the Rope** | `com.zeptolab.ctr.ads` | ZeptoLab physics puzzle |
| **Blockudoku** | `com.easybrain.block.puzzle.game` | Easybrain addictive block puzzle |
| **2048** | `com.androbaby.game2048` | Sliding tile math puzzle |
| **Stack / Knife Hit / Rider** | `com.ketchapp.stack`, `com.ketchapp.knifehit`, `com.ketchapp.rider` | Ketchapp minimalist reflex games |
| **Sand Balls** | `com.mhappsgaming.sandballs` | SayGames sand digging physics puzzle |
| **Johnny Trigger** | `com.saygames.johnnytrigger` | SayGames slow-motion platform shooter |
| **My Perfect Hotel** | `com.redfox.myhotel` | SayGames idle hotel tycoon runner |
| **Race Master 3D** | `com.saygames.racemaster` | SayGames high-octane mini racer |
| **Hair Challenge / High Heels!** | `com.rolllic.hairchallenge`, `com.zynga.highheels` | Rollic / Zynga endless fashion runners |
| **Tie Dye / ASMR Slicing / Soap Cutting** | `com.crazylabs.tiedye`, `com.crazylabs.asmr.slicing`, `com.crazylabs.soapcutting` | CrazyLabs satisfying ASMR simulations |
| **Happy Glass / Save The Girl / Mr Bullet** | `com.lionstudios.happyglass`, `com.lionstudios.savethegirl`, `com.lionstudios.mrbullet`, `com.lionstudios.pullhimout` | Lion Studios puzzle & pin-pulling teasers |

</details>

---

### 🛡️ Dynamic Substring & Heuristic Defense

In addition to exact package ID matching, QIEZKA runs real-time **substring signature evaluation** on every foreground window change in [`blacklistedApps.ts`](file:///c:/Users/CxAdmin/Desktop/qiezka/uncode/src/constants/blacklistedApps.ts) and [`BlacklistConstants.java`](file:///c:/Users/CxAdmin/Desktop/qiezka/uncode/android/app/src/main/java/com/uncode/app/BlacklistConstants.java).

Any application whose package identifier contains any of the following substrings is **automatically recognized as hostile and blocked**, neutralizing rebranded clones, third-party APK forks, and modded sideloads:

`kisskh` • `bilibili` • `danmaku.bili` • `chelpus` • `luckypatcher` • `instaprime` • `instander` • `aeroinsta` • `honista` • `gameguardian` • `happymod` • `acmarket` • `dramabox` • `reelshort` • `shortmax` • `goodshort` • `moboreels` • `loklok` • `cloudstream` • `movieboxpro` • `anilab` • `stremio` • `onstream` • `revanced` • `gbwhatsapp` • `fmwhatsapp` • `yowhatsapp` • `vmos` • `f1vm` • `vphonegaga` • `x8zs` • `wattpad` • `webnovel` • `wuxiaworld` • `ometv` • `bigo` • `tinder` • `bumble` • `pokerstars` • `bet365` • `draftkings` • `fanduel` • `carousell` • `vinted` • `depop` • `holeio` • `woodturning` • `paperio` • `helixjump` • `crowdcity` • `aquapark` • `slither` • `agar.io` • `snake.io` • `survivorio` • `bridgerace` • `stumbleguys` • `voodoo` • `saygames` • `lionstudios` • `crazylabs` • `ketchapp`

---

## 📖 Overview

**QIEZKA** is an uncompromising productivity and study-enforcement tool built for Android. Unlike generic timer apps that can be bypassed in two clicks, and unlike rigid enterprise kiosk lockdowns that break phone essentials, QIEZKA strikes a surgical balance using a **selective app-filtering architecture with native self-protection**:

- 📱 **Normal Phone Capabilities Preserved**: Navigation buttons (Home, Back, Recents) continue to work normally. You are not trapped in a broken full-screen jail.
- 🚫 **Instant Distraction Redirection**: Any attempt to open a non-whitelisted app or system settings immediately sends the user back to the Home screen in milliseconds.
- ⚡ **Quick Settings Tile Collapse**: The notification shade remains accessible for reading urgent messages, but the Quick Settings tile expansion is collapsed in real time to prevent toggling Wi-Fi, Airplane mode, or system toggles.
- 🌐 **Online AI-Verified Early Unlock (BYOK)**: No "give up" button or soft timers. The only way to unlock early is to write your homework or notes on physical paper, photograph it, and have **Google Gemini AI** evaluate your handwriting against your study rubric in real time using your own API key.
- 📴 **Offline Resource & Lockdown Capability**: All study resources, document ingestion (`.docx`, `.txt`, `.md`), notes management, timers, and Android native app blocking work **100% offline** without any internet connection.
- 📸 **Camera & File Picker Exemptions**: When taking photos or selecting documents for AI homework grading, QIEZKA's native accessibility engine intelligently recognizes system camera intents and file pickers, preventing false-positive lockouts.

---

## 🌐 Online Architecture & Offline Resources (BYOK)

QIEZKA is designed as a **hybrid online/offline system** with a strict **Bring Your Own Key (BYOK)** privacy model:

```
                                  QIEZKA SYSTEM
                                        │
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼                                                               ▼
[ ONLINE FEATURES ]                                             [ OFFLINE FEATURES ]
Requires Internet + Personal API Key                            Works 100% Without Internet
 • Handwritten Homework AI Evaluation (Gemini)                   • Study Resource Library & Notes Editor
 • Real-time Photo OCR Transcription (OCR.space)                 • Local Document Parsing (.docx, .txt, .md)
 • AI Prompt Refinement & Dynamic Rubrics                        • Focus Session Timers & Countdown
 • Cloud Model Selection (Gemini 2.5/2.0/Flash/Pro)              • Selective App Blocking (Accessibility)
                                                                 • Quick Settings Shield & Recents Guard
                                                                 • Device Admin Anti-Uninstall Protection
                                                                 • Full JSON Data Backup & Restore
```

### 1. What Works Offline (Resources & Lockdown Only)
- **Local Study Resources**: You can create, edit, search, organize, and review all your notes, syllabi, and study materials with zero internet connection.
- **Client-Side Document Parsing**: Ingestion of `.txt`, `.md`, and Microsoft Word `.docx` documents is processed directly inside your browser/WebView using local in-memory engines ([Mammoth](https://github.com/mwilliamson/mammoth.js)).
- **Focus Enforcement & Lockdown Engine**: Android Accessibility service app-blocking, Quick Settings tile collapse, Device Administrator uninstall prevention, and boot recovery operate strictly on-device via native Android OS APIs.
- **Data Backups**: Export and import complete JSON backups of your settings, resources, and schedules offline.

### 2. What Requires an Online Connection & Your Own API Key (BYOK)
- **AI Homework Evaluation**: Grading your handwritten homework photo against your study rubric requires connecting to the Google Gemini API.
- **Photo OCR Transcription**: Extracting text from photographed papers requires connecting to the OCR.space API.
- **Users Must Provide Their Own API Key (BYOK)**:
  - **Zero Central Servers**: QIEZKA has no middleman servers, no proxy backends, and no proprietary accounts.
  - **100% Private**: Your API keys and homework photos travel directly from your phone to Google / OCR.space over encrypted HTTPS.
  - **Always Free**: Both Google Gemini and OCR.space provide generous **free tiers** that require no payment.

---

## 🔑 How to Get Your Free API Keys

QIEZKA takes 1 minute to configure with free keys:

### 1. Google Gemini API Key (Required for AI Evaluation)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with any Google account.
3. Click **"Create API Key"** and copy the generated key (starts with `AIzaSy...`).
4. In QIEZKA, tap the **Settings (gear icon)** at the top right, paste it into **Gemini API Key**, and tap **Save**.

### 2. OCR.space API Key (Required for Image Transcription)
1. Visit [OCR.space Free API Registration](https://ocr.space/ocrapi/freekey).
2. Enter your email and name; your free API key will be delivered instantly.
3. In QIEZKA, paste it into **Simple OCR API Key** or **Formatted OCR API Key** under Settings and tap **Save**.

---

## ✨ Key Features

| Feature | Details | Network Requirement |
|---|---|:---:|
| 🎯 **Selective App Filtering** | Whitelist required tools (Calculator, Notes, Dictionary, Music, PDF Reader). All non-approved apps are immediately suppressed and routed to Home via Android Accessibility. | 📴 **Offline** |
| 🛡️ **Quick Settings Defense** | Allows the notification shade for reading text alerts while collapsing Quick Settings tiles to prevent bypass via status toggles. | 📴 **Offline** |
| 🔄 **Anti-Cheat Boot Persistence** | Restarting the phone will not break the lockdown session—`BootReceiver` detects active timers and immediately re-engages QIEZKA upon system boot. | 📴 **Offline** |
| 🔒 **Uninstall Protection** | Activated as a standard **Device Administrator**. Android blocks uninstallation until administrator privileges are revoked; because QIEZKA blocks Android Settings during lockdown, deactivation is impossible. | 📴 **Offline** |
| 📚 **Resource Library** | Create, view, edit, and organize lecture notes, study outlines, syllabi, and local `.docx`/`.txt` files client-side. | 📴 **Offline** |
| 🤖 **AI Homework Evaluation** | Built-in OCR pipeline connected with Google Gemini models (Gemini 2.5, Gemini 2.0, Gemini 1.5) that inspects work quality against a custom rubric before allowing an unlock. | 🌐 **Online (BYOK)** |
| 📑 **Dual Submission Flow** | Choose between capturing physical handwritten pages with your live camera (`capture="environment"`) or selecting files/photos from your device gallery. | 🌐 **Online (BYOK)** |
| 🔋 **Doze & Battery Saver Immunity** | Whitelists QIEZKA from aggressive Android Doze and OEM power managers (Samsung OneUI, Xiaomi MIUI/HyperOS, Pixel) to prevent timers from being killed. | 📴 **Offline** |
| 🛠️ **Dual Setup Pathways** | Complete configuration 100% on-device via guided interactive prompts, or automate the entire setup in seconds with `qiezka.bat` over USB debugging. | 📴 **Offline** |

---

## 🚀 Setup Guide

QIEZKA offers two distinct setup paths. Both yield the exact same security and app-blocking capabilities:

```
                            Choose Your Setup Path
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
      [ Method A: On-Device ]                     [ Method B: PC ADB Script ]
       • 100% on your phone                        • Automated via qiezka.bat
       • No PC or USB cable needed                 • Takes 5 seconds
       • Step-by-step guided UI                    • Pre-grants all permissions
```

---

### Method A: On-Device Setup (No PC Required)

Ideal for everyday use. Complete all 4 steps inside the in-app **Permission Walkthrough** screen:

1. **Step 1: Enable Accessibility Service (Required)**
   - Tap **Open Accessibility Settings**.
   - Navigate to *Installed Apps* / *Downloaded Services*.
   - Tap **QIEZKA** and toggle it **ON**.
2. **Step 2: Activate Device Administrator (Recommended)**
   - Tap **Activate Device Admin**.
   - Confirm the system prompt to prevent uninstallation during a lockdown session.
   - *(If the direct prompt does not open on your OEM ROM, tap "Open Device Admin Apps list" and toggle QIEZKA on manually).*
3. **Step 3: Unrestricted Battery / Background (Recommended)**
   - Tap **Allow Unrestricted Background Usage**.
   - Tap **Allow** on Android's native battery optimization exemption prompt (`ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`) to stop OEM task killers from freezing timers.
4. **Step 4: Allow Notifications (Recommended)**
   - Tap **Allow Notifications** to enable persistent timer alerts and lock completion alerts.
5. **Tap "Proceed to Dashboard"** to finish setup!

> [!TIP]
> #### Android 13/14+ "Restricted setting" Bypass Guide
> Android 13 and 14+ automatically mark sideloaded apps with a *"Restricted setting"* warning for Accessibility and Device Admin. You can unlock it in 10 seconds:
> 1. In the QIEZKA walkthrough, tap **Step 1** or **Step 2** once (this triggers Android to register the restriction attempt).
> 2. Tap the **Open App Info** button inside the walkthrough banner.
> 3. In the top-right corner of QIEZKA's App Info page, tap the **3 dots (⋮)** menu.
> 4. Tap **Allow restricted settings** and confirm with your device PIN or fingerprint.
> 5. Return to QIEZKA and complete the steps normally!

---

### Method B: PC Automated Setup (`qiezka.bat`)

Ideal for power users, developers, or anyone with a PC who wants an instant, 1-click setup:

1. Enable **Developer Options** on your Android phone (Go to *Settings > About Phone* and tap *Build Number* 7 times).
2. Go to *Settings > Developer Options* and turn on **USB Debugging**.
3. Connect your phone to your PC via USB cable and allow the USB Debugging authorization prompt on your phone screen.
4. Double-click **`qiezka.bat`** (or execute it in Command Prompt / PowerShell).
5. The script automatically verifies your device, checks if QIEZKA is installed (or installs a local APK), unlocks restricted settings, whitelists battery, enables accessibility, activates device admin, and launches QIEZKA!

---

## ⚙️ Customizing `qiezka.bat`

[`qiezka.bat`](file:///c:/Users/CxAdmin/Desktop/qiezka/uncode/qiezka.bat) includes a **User Configuration Section** at the very top. You can open `qiezka.bat` in any text editor (Notepad, VS Code) to customize every function using simple `true` or `false` flags:

```bat
:: ============================================================================
::                     USER CONFIGURATION / PREFERENCES
::  Edit the values below (true or false) to tailor the setup to your needs.
:: ============================================================================

:: 1. Force re-install local APK even if already installed on device (default: false)
set "FORCE_REINSTALL_APK=false"

:: 2. Unlock Android 13/14+ Restricted Settings automatically via ADB
set "BYPASS_RESTRICTED_SETTINGS=true"

:: 3. Grant elevated system permissions (WRITE_SECURE_SETTINGS, DUMP, POST_NOTIFICATIONS)
set "GRANT_SECURE_PERMISSIONS=true"

:: 4. Whitelist QIEZKA from aggressive OS battery savers (Samsung, Xiaomi, etc.)
set "WHITELIST_BATTERY=true"

:: 5. Automatically enable QIEZKA's Accessibility Service via ADB
set "ENABLE_ACCESSIBILITY=true"

:: 6. Activate Device Administrator to prevent uninstallation during lockdown
::    (100% realistic: works with all personal Google accounts logged in, no wipe needed)
set "ACTIVATE_DEVICE_ADMIN=true"

:: 7. Attempt Enterprise Device Owner mode (DEFAULT: false)
::    (Unrealistic for everyday devices: requires root or removing all Google accounts)
set "TRY_DEVICE_OWNER=false"

:: 8. Automatically launch QIEZKA on your phone after setup completes
set "LAUNCH_APP_ON_FINISH=true"
```

---

### Function Reference & Options Guide

| Function | Default | Value | What It Does & When To Use It |
|---|:---:|:---:|---|
| **`FORCE_REINSTALL_APK`** | `false` | `false`<br>`true` | **`false` (Recommended)**: The script checks `pm path com.uncode.app`. If QIEZKA is already installed on your device, it skips the install step and jumps straight to provisioning permissions.<br>**`true`**: Forces an `adb install -r` of the local APK file, overwriting the app on your phone even if already present. Use this when you built a new debug APK and want to push the latest code. |
| **`BYPASS_RESTRICTED_SETTINGS`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Runs `appops set com.uncode.app ACCESS_RESTRICTED_SETTINGS allow`. Bypasses Android 13/14's sideload restrictions instantly without needing to enter App Info or tap the 3-dot menu manually.<br>**`false`**: Skips the ADB appops call (requires manual permission granting on device). |
| **`GRANT_SECURE_PERMISSIONS`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Pre-grants `WRITE_SECURE_SETTINGS`, `DUMP`, and `POST_NOTIFICATIONS`. Enables seamless background system control without in-app dialog popups.<br>**`false`**: Skips secure permission granting. |
| **`WHITELIST_BATTERY`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Runs `dumpsys deviceidle whitelist +com.uncode.app`. Whitelists QIEZKA from Android Doze mode and OEM battery task killers (e.g. Samsung Device Care, Xiaomi MIUI Battery Saver).<br>**`false`**: Skips battery whitelisting. |
| **`ENABLE_ACCESSIBILITY`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Automatically registers and enables `LockAccessibilityService` in Android secure settings. Eliminates having to find QIEZKA under Accessibility menus.<br>**`false`**: Skips enabling Accessibility via ADB. |
| **`ACTIVATE_DEVICE_ADMIN`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Runs `dpm set-active-admin com.uncode.app/.AdminReceiver`. Makes QIEZKA an active Device Administrator. Android blocks uninstallation while active. Because QIEZKA blocks Settings during lockdown, you cannot uninstall during study sessions. Works on all phones with all accounts logged in.<br>**`false`**: Leaves Device Admin inactive. |
| **`TRY_DEVICE_OWNER`** | `false` | `false`<br>`true` | **`false` (Recommended)**: Device Owner is an enterprise MDM mode meant for factory-reset corporate devices. If personal Google/WhatsApp accounts exist, Android rejects it. Standard Device Admin + Settings blocking provides full protection without removing accounts.<br>**`true`**: Attempts `dpm set-device-owner`. Only succeeds on fresh/wiped devices with 0 accounts or rooted devices. |
| **`LAUNCH_APP_ON_FINISH`** | `true` | `true`<br>`false` | **`true` (Recommended)**: Sends an `am start` command to bring QIEZKA to the foreground on your phone screen immediately after script execution.<br>**`false`**: Leaves the phone in its current state without launching the app. |

---

## 🛡️ Security & Anti-Cheat Architecture

```
                            ┌────────────────────────┐
                            │   Active Lock Session  │
                            └───────────┬────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
  [ App Interception ]          [ SystemUI Defense ]          [ Anti-Bypass Guard ]
   • Window events monitored     • Quick Settings collapsed    • Device Admin prevents
   • Whitelisted: Allowed          in real time                  uninstallation
   • Blacklisted: Routed Home    • Notification shade stays    • Settings app: Blocked
   • Camera & File Pickers:        accessible for alerts       • BootReceiver: Resumes
     Exempt for homework         • Recents overview: Auto        lock after reboot
     submission without kick       re-launches if swiped
```

### Why Standard Device Administrator Over Device Owner?
- **Enterprise Device Owner Limitation**: Android requires that **zero** accounts (Google, WhatsApp, Telegram, etc.) exist on the device before setting a Device Owner (`IllegalStateException: Not allowed to set the device owner because there are already some accounts on the device`). Forcing users to delete their personal accounts or factory reset is impractical.
- **The QIEZKA Solution**: Standard **Device Administrator** (`DeviceAdminReceiver`):
  1. Once active, Android strictly prohibits the application from being uninstalled until the user deactivates administrator permissions in Android Settings.
  2. Because QIEZKA's accessibility engine **blocks the Android Settings app** during lockdown, the user cannot access the menu to deactivate Device Admin or uninstall the app.
  3. All personal accounts remain completely intact, and no root or wipe is required.

---

## 💻 Tech Stack

- **Core & Runtime**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Mobile Native Bridge**: [Capacitor 7](https://capacitorjs.com/) (`@capacitor/android`, `@capacitor/filesystem`)
- **Native Android Engine**: Java (Accessibility Service, DevicePolicyManager, BroadcastReceiver, ContentResolver SAF)
- **AI & Evaluation**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini 2.5 / 2.0 / 1.5 Flash & Pro) + OCR.space
- **Styling & UI**: [Tailwind CSS 4](https://tailwindcss.com/), [Motion / Framer Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)

---

## 🛠️ Development & Building

### Prerequisites
- Node.js 18+ & npm
- Android Studio (Ladybug or newer) & Android SDK 34+
- Android platform-tools (ADB) in your system PATH

### Commands
```bash
# Install dependencies
npm install

# Run web dev server
npm run dev

# Build web distribution bundle
npm run build

# Sync web bundle and native plugins to Android
npx cap sync android

# Open Android project in Android Studio
npx cap open android
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

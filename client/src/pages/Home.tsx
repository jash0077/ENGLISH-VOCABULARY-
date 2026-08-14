/* Editorial Study Hall: warm paper, ink navy, pencil coral. Main study workspace with visible, tactile learning states. */
import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Flame,
  Layers3,
  Lightbulb,
  ListPlus,
  Menu,
  Mic,
  Heart,
  CalendarDays,
  Wifi,
  WifiOff,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Copy,
  Download,
  Target,
  Trophy,
  Volume2,
  Ear,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useVirtualizer } from "@tanstack/react-virtual";
import { trpc } from "@/lib/trpc";
import { TENSES, type TenseLesson } from "@/data/tenses";
import { TENSE_GUIDES } from "@/data/tenseGuides";
import { SHADOWING_LINES } from "@/data/shadowing";
import { SHADOWING_PASSAGES } from "@/data/shadowingPassages";
import { SHADOWING_EXPANSION } from "@/data/shadowingExpansion";
import { PHONETIC_GROUPS, US_PHONETICS, type PhoneticSound } from "@/data/phonetics";
import { MINIMAL_PAIR_QUESTIONS } from "@/data/minimalPairs";

const CORE_WORDS = [
  { w: "ubiquitous", p: "adj.", ph: "yoo-BIK-wi-tuhs", m: "present or found everywhere at once.", ex: "Smartphones have become ubiquitous in modern life.", syn: ["omnipresent", "pervasive", "widespread"], cat: "Everyday", dif: 2 },
  { w: "meticulous", p: "adj.", ph: "muh-TIK-yuh-luhs", m: "showing great attention to detail; very careful and precise.", ex: "She kept meticulous records of every transaction.", syn: ["thorough", "precise", "fastidious"], cat: "Everyday", dif: 1 },
  { w: "candid", p: "adj.", ph: "KAN-did", m: "truthful and straightforward; frank.", ex: "He gave a candid answer about the company's struggles.", syn: ["frank", "honest", "forthright"], cat: "Everyday", dif: 1 },
  { w: "resilient", p: "adj.", ph: "ri-ZIL-yuhnt", m: "able to recover quickly from difficulties; tough.", ex: "Children are often remarkably resilient after setbacks.", syn: ["tough", "hardy", "adaptable"], cat: "Everyday", dif: 1 },
  { w: "ambivalent", p: "adj.", ph: "am-BIV-uh-luhnt", m: "having mixed or contradictory feelings about something.", ex: "I felt ambivalent about moving to a new city.", syn: ["conflicted", "torn", "uncertain"], cat: "Everyday", dif: 2 },
  { w: "pragmatic", p: "adj.", ph: "prag-MAT-ik", m: "dealing with things sensibly and realistically.", ex: "They took a pragmatic approach to solving the budget crisis.", syn: ["practical", "sensible", "realistic"], cat: "Everyday", dif: 1 },
  { w: "ephemeral", p: "adj.", ph: "ih-FEM-er-uhl", m: "lasting for a very short time.", ex: "Cherry blossoms are prized for their ephemeral beauty.", syn: ["fleeting", "transient", "momentary"], cat: "Academic", dif: 3 },
  { w: "empirical", p: "adj.", ph: "em-PEER-i-kuhl", m: "based on observation or experiment rather than theory.", ex: "The claim needs empirical evidence to be taken seriously.", syn: ["observed", "experiential", "factual"], cat: "Academic", dif: 2 },
  { w: "paradigm", p: "n.", ph: "PAIR-uh-dyme", m: "a typical example or pattern of something; a model.", ex: "The discovery created a new paradigm in physics.", syn: ["model", "framework", "archetype"], cat: "Academic", dif: 2 },
  { w: "dichotomy", p: "n.", ph: "dy-KOT-uh-mee", m: "a division into two sharply contrasting parts.", ex: "There's a dichotomy between theory and practice.", syn: ["division", "split", "contrast"], cat: "Academic", dif: 3 },
  { w: "nuance", p: "n.", ph: "NOO-ahns", m: "a subtle difference in meaning, tone, or expression.", ex: "Translation often loses the nuance of the original text.", syn: ["subtlety", "shade", "distinction"], cat: "Academic", dif: 2 },
  { w: "lucid", p: "adj.", ph: "LOO-sid", m: "clear and easy to understand; mentally clear.", ex: "His lucid explanation cleared up the confusion.", syn: ["clear", "coherent", "intelligible"], cat: "Academic", dif: 2 },
  { w: "leverage", p: "v./n.", ph: "LEV-er-ij", m: "to use something to maximum advantage.", ex: "The startup leveraged its small size to move quickly.", syn: ["utilize", "exploit", "harness"], cat: "Business", dif: 1 },
  { w: "synergy", p: "n.", ph: "SIN-er-jee", m: "combined effort producing a greater effect than the sum of individual parts.", ex: "The merger was expected to create synergy across teams.", syn: ["cooperation", "collaboration"], cat: "Business", dif: 2 },
  { w: "scalable", p: "adj.", ph: "SKEY-luh-buhl", m: "capable of being expanded or adapted to a larger scale.", ex: "They built a scalable platform to handle rapid growth.", syn: ["expandable", "adaptable"], cat: "Business", dif: 1 },
  { w: "stakeholder", p: "n.", ph: "STEYK-hohl-der", m: "a person with an interest or investment in a business or project.", ex: "All stakeholders were consulted before the decision.", syn: ["participant", "investor"], cat: "Business", dif: 1 },
  { w: "benchmark", p: "n.", ph: "BENCH-mark", m: "a standard used as a point of reference for comparison.", ex: "Their sales figures became an industry benchmark.", syn: ["standard", "yardstick", "reference point"], cat: "Business", dif: 1 },
  { w: "viable", p: "adj.", ph: "VY-uh-buhl", m: "capable of working successfully; feasible.", ex: "Is remote work still a viable option for the team?", syn: ["feasible", "workable", "practical"], cat: "Business", dif: 1 },
  { w: "elegy", p: "n.", ph: "EL-i-jee", m: "a poem or song of mournful reflection, often for the dead.", ex: "The poet wrote an elegy for his late brother.", syn: ["lament", "dirge"], cat: "Literary", dif: 2 },
  { w: "allegory", p: "n.", ph: "AL-uh-gawr-ee", m: "a story whose characters and events symbolize a deeper meaning.", ex: "Animal Farm is an allegory for political revolution.", syn: ["fable", "parable", "metaphor"], cat: "Literary", dif: 2 },
  { w: "melancholy", p: "n./adj.", ph: "MEL-uhn-kol-ee", m: "a deep, pensive sadness; a gloomy state of mind.", ex: "A melancholy mood settled over the empty house.", syn: ["sorrow", "gloom", "wistfulness"], cat: "Literary", dif: 1 },
  { w: "prose", p: "n.", ph: "prohz", m: "written or spoken language in its ordinary form, without poetic structure.", ex: "Her prose was spare but deeply evocative.", syn: ["narrative writing"], cat: "Literary", dif: 1 },
  { w: "satire", p: "n.", ph: "SAT-eyer", m: "the use of humor or exaggeration to criticize folly or vice.", ex: "The novel is a sharp satire of modern politics.", syn: ["parody", "mockery"], cat: "Literary", dif: 1 },
  { w: "soliloquy", p: "n.", ph: "suh-LIL-uh-kwee", m: "a speech a character gives alone, revealing inner thoughts.", ex: "Hamlet's soliloquy explores his doubts about life and death.", syn: ["monologue"], cat: "Literary", dif: 2 },
] as const;

const INITIAL_WORDS = CORE_WORDS;
const DAILY_SHADOWING_PASSAGES = SHADOWING_EXPANSION.map(item => ({ id: `daily-${item.id}`, speaker: "Vocab Studio", title: `Practice line ${item.id}`, level: item.level, description: item.focus, sentences: [item.text] as const }));
const PRACTICE_PASSAGES = [...SHADOWING_PASSAGES, ...DAILY_SHADOWING_PASSAGES] as const;
type TenseQuizQuestion = { id: string; prompt: string; options: string[]; correct_index: number; explanation: string };
type TenseQuizSet = { tense: string; rounds: { round: number; questions: TenseQuizQuestion[] }[] };
type MissedQuestion = { tense: string; round: number; question: TenseQuizQuestion; selectedIndex: number };

type Word = { w: string; p: string; ph: string; m: string; ex: string; syn: readonly string[]; cat: string; dif: number };
type Mode = "dashboard" | "shelf" | "everyday" | "academic" | "business" | "flashcards" | "quiz" | "tenses" | "shadowing" | "tenseQuiz" | "review" | "phonetics" | "minimalPairs";
type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";
type DailyProgress = { date: string; vocabulary: number; tense: number; shadowing: number };
type ProgressStats = { vocabularyCorrect: number; vocabularyAnswered: number; tenseCorrect: number; tenseAnswered: number; shadowingAttempts: number; shadowingScoreTotal: number; studyDays: string[] };
type CustomLists = Record<string, string[]>;

const CATEGORIES = ["All words", "Everyday", "Academic", "Business", "Literary", "Advanced"];
const ASSET_BASE = import.meta.env.BASE_URL;
const TODAY = new Date().toISOString().slice(0, 10);

function SpeakButton({ text, label = "Listen" }: { text: string; label?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const speechBusy = useRef(false);
  useEffect(() => () => { speechBusy.current = false; window.speechSynthesis?.cancel(); }, []);
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("Audio playback is not supported in this browser.");
      return;
    }
    if (speaking || speechBusy.current) {
      window.speechSynthesis.cancel();
      speechBusy.current = false;
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    speechBusy.current = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    const finishSpeech = () => { speechBusy.current = false; setSpeaking(false); };
    utterance.onend = finishSpeech;
    utterance.onerror = finishSpeech;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  return <button className={`speak-button ${speaking ? "speaking" : ""}`} onClick={toggleSpeech} aria-label={`${speaking ? "Stop" : "Play"} ${label.toLowerCase()}: ${text}`} aria-pressed={speaking}>{speaking ? <Square size={13} fill="currentColor" /> : <Volume2 size={16} />}<span>{speaking ? "Stop" : label}</span></button>;
}

function Logo() {
  return <div className="brand-mark" aria-label="Vocab Studio logo"><img src={`${ASSET_BASE}assets/vocab-mark.png`} alt="" /><span>vocab<br /><em>studio</em></span></div>;
}

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const isIos = typeof navigator !== "undefined" && /iPad|iPhone|iPod/i.test(navigator.userAgent);
  useEffect(() => {
    const standalone = window.matchMedia?.("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(standalone);
    const handlePrompt = (event: Event) => { event.preventDefault(); setPromptEvent(event as InstallPromptEvent); };
    const handleInstalled = () => { setInstalled(true); setPromptEvent(null); setShowHelp(false); toast.success("Vocab Studio is installed on your device."); };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", handlePrompt); window.removeEventListener("appinstalled", handleInstalled); };
  }, []);
  const install = async () => {
    if (installed) return;
    if (!promptEvent) { setShowHelp(true); return; }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  };
  return <div className="install-card"><button className="install-action" onClick={install} aria-label={installed ? "Vocab Studio is installed" : "Install Vocab Studio on this device"}><Download size={15} /><span>{installed ? "App installed" : "Install app"}</span></button>{showHelp && !installed && <p className="install-help">{isIos ? <>Tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.</> : <>Your browser did not provide an install prompt. Try the browser menu’s <strong>Install app</strong> or <strong>Add to Home screen</strong> option.</>}</p>}</div>;
}

const OFFLINE_PACKS = [
  { id: "everyday", label: "Everyday vocabulary", description: "Conversation, routines, and daily decisions.", category: "Everyday" },
  { id: "academic", label: "Academic vocabulary", description: "Essays, research, and precise discussion.", category: "Academic" },
  { id: "business", label: "Business vocabulary", description: "Meetings, strategy, and professional communication.", category: "Business" },
  { id: "literary", label: "Literary vocabulary", description: "Stories, criticism, and expressive language.", category: "Literary" },
  { id: "phonetics", label: "US Phonetics", description: "IPA sounds, examples, and pronunciation guidance.", category: "phonetics" },
] as const;

function OfflinePacks({ words, setMode, offline }: { words: readonly Word[]; setMode: (mode: Mode) => void; offline: boolean }) {
  const [saved, setSaved] = useState<string[]>(() => OFFLINE_PACKS.map(pack => pack.id).filter(id => Boolean(localStorage.getItem(`offline-pack:${id}`))));
  const [busy, setBusy] = useState<string | null>(null);
  const setPack = async (pack: typeof OFFLINE_PACKS[number]) => {
    setBusy(pack.id);
    const items = pack.category === "phonetics" ? US_PHONETICS : words.filter(word => word.cat === pack.category);
    const payload = JSON.stringify({ id: pack.id, savedAt: new Date().toISOString(), items });
    try {
      localStorage.setItem(`offline-pack:${pack.id}`, payload);
      if ("caches" in window) { const cache = await caches.open("vocab-studio-packs-v1"); await cache.put(new Request(`${window.location.origin}/__offline-packs/${pack.id}.json`), new Response(payload, { headers: { "Content-Type": "application/json" } })); }
      setSaved(previous => previous.includes(pack.id) ? previous : [...previous, pack.id]);
      toast.success(`${pack.label} saved for offline study.`);
    } catch { toast.error("This device could not save the pack. Try freeing storage and retrying."); }
    setBusy(null);
  };
  const removePack = async (pack: typeof OFFLINE_PACKS[number]) => { localStorage.removeItem(`offline-pack:${pack.id}`); if ("caches" in window) { const cache = await caches.open("vocab-studio-packs-v1"); await cache.delete(new Request(`${window.location.origin}/__offline-packs/${pack.id}.json`)); } setSaved(previous => previous.filter(id => id !== pack.id)); toast.info(`${pack.label} removed from this device.`); };
  const studyPack = (pack: typeof OFFLINE_PACKS[number]) => setMode(pack.category === "phonetics" ? "phonetics" : pack.category === "Everyday" ? "everyday" : pack.category === "Academic" ? "academic" : pack.category === "Business" ? "business" : "shelf");
  return <section className="offline-packs"><div className="section-head"><div><span className="note-label">OFFLINE LIBRARY</span><h2>Keep a few packs close</h2></div><span className="offline-pack-count"><WifiOff size={14} /> {saved.length}/{OFFLINE_PACKS.length} saved</span></div><p className="offline-packs-lede">Save focused study packs before you travel or lose signal. They stay on this device and can be removed at any time.</p><div className="offline-pack-grid">{OFFLINE_PACKS.map(pack => { const isSaved = saved.includes(pack.id); return <article className={`offline-pack-card ${isSaved ? "saved" : ""}`} key={pack.id}><div><span className="offline-pack-status">{isSaved ? "SAVED OFFLINE" : "NOT SAVED"}</span><h3>{pack.label}</h3><p>{pack.description}</p></div>{isSaved ? <div className="offline-pack-actions"><button className="soft-btn" onClick={() => studyPack(pack)}><BookOpen size={14} /> Study</button><button className="text-btn" onClick={() => removePack(pack)}>Remove</button></div> : <div className="offline-pack-actions"><button className="coral-btn" onClick={() => setPack(pack)} disabled={busy === pack.id}>{busy === pack.id ? "Saving…" : "Save pack"}<Download size={15} /></button>{offline && <small className="offline-unavailable">Unavailable offline</small>}</div>}</article>; })}</div></section>;
}

function Difficulty({ level }: { level: number }) {
  return <span className="difficulty" aria-label={`${level} of 3 difficulty`}><i className={level >= 1 ? "on" : ""} /><i className={level >= 2 ? "on" : ""} /><i className={level >= 3 ? "on" : ""} /></span>;
}

function ProgressRail({ mode, setMode, learned, streak, missedCount, daily, offline }: { mode: Mode; setMode: (m: Mode) => void; learned: number; streak: number; missedCount: number; daily: DailyProgress; offline: boolean }) {
  const items = [
    { id: "dashboard" as Mode, label: "Learning dashboard", icon: BarChart3 },
    { id: "shelf" as Mode, label: "Word shelf", icon: BookOpen },
    { id: "everyday" as Mode, label: "Everyday vocabulary", icon: BookOpen },
    { id: "academic" as Mode, label: "Academic vocabulary", icon: BookOpen },
    { id: "business" as Mode, label: "Business vocabulary", icon: BookOpen },
    { id: "flashcards" as Mode, label: "Flashcards", icon: Layers3 },
    { id: "quiz" as Mode, label: "Quick quiz", icon: Target },
    { id: "tenseQuiz" as Mode, label: "Tense quiz", icon: ClipboardCheck },
    { id: "review" as Mode, label: "Review mistakes", icon: RotateCw },
    { id: "tenses" as Mode, label: "Tenses", icon: Sparkles },
    { id: "shadowing" as Mode, label: "Shadowing", icon: Mic },
    { id: "phonetics" as Mode, label: "US phonetics", icon: Volume2 },
    { id: "minimalPairs" as Mode, label: "Minimal pairs", icon: Ear },
  ];
  return <aside className="rail">
    <div className="rail-top"><Logo /><button className="icon-btn mobile-menu" aria-label="Open menu"><Menu size={20} /></button></div>
    <div className="rail-label">Study desk</div>
    <nav className="rail-nav" aria-label="Study modes">
      {items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setMode(id)} className={`rail-item ${mode === id ? "active" : ""}`}><Icon size={18} /><span>{label}</span>{id === "quiz" && <b>3</b>}{id === "review" && <b>{missedCount}</b>}</button>)}
    </nav>
    <InstallButton />
    <div className="rail-pack-status"><WifiOff size={14} /><span><strong>{(() => { try { return OFFLINE_PACKS.filter(pack => Boolean(localStorage.getItem(`offline-pack:${pack.id}`))).length; } catch { return 0; } })()}</strong> offline packs saved</span></div>
    <div className="rail-note"><span className="note-pin" /><p>Small steps compound.<br /><strong>Keep the word close.</strong></p></div>
    <div className="rail-progress"><div className="rail-progress-head"><span>Today</span><strong>{daily.vocabulary + daily.tense + daily.shadowing}/18</strong></div><div className="progress-track"><span style={{ width: `${Math.min(((daily.vocabulary + daily.tense + daily.shadowing) / 18) * 100, 100)}%` }} /></div><div className="streak"><Flame size={16} /> {streak} day streak</div><div className="offline-note">{offline ? <><WifiOff size={13} /> Offline ready</> : <><Wifi size={13} /> Online</>}</div></div>
    <div className="rail-footer"><span className="avatar">AS</span><div><strong>Alex's desk</strong><small>Learning in public</small></div><button className="more-btn" aria-label="More options">•••</button></div>
  </aside>;
}

function Header({ mode, setMode, streak }: { mode: Mode; setMode: (m: Mode) => void; streak: number }) {
  return <header className="page-header"><div><p className="eyebrow">Thursday · 12 min practice</p><h1>{mode === "dashboard" ? "Make progress visible." : mode === "everyday" ? "Everyday words for real life." : mode === "academic" ? "Academic words for clearer thinking." : mode === "business" ? "Business words for sharper work." : mode === "phonetics" ? "Train the sounds behind clear English." : mode === "minimalPairs" ? "Hear the difference." : mode === "shelf" ? "Build a better word bank." : mode === "flashcards" ? "Turn the page." : mode === "quiz" ? "Make the word stick." : mode === "tenseQuiz" ? "Name the tense." : mode === "review" ? "Turn mistakes into progress." : mode === "tenses" ? "Make your sentences clearer." : "Speak with the rhythm."}</h1><p className="lede">{mode === "dashboard" ? "A simple daily plan for vocabulary, grammar, and confident speech." : mode === "everyday" ? "Useful language for conversations, routines, travel, and daily decisions." : mode === "academic" ? "Precise language for reading, essays, research, and thoughtful discussion." : mode === "business" ? "Practical language for meetings, projects, strategy, and professional communication." : mode === "phonetics" ? "Study US-English IPA sounds with example words, mouth guidance, and repeat-after-me practice." : mode === "minimalPairs" ? "A listening quiz for vowels, voicing, and mouth-position contrasts." : mode === "shelf" ? "A curated shelf of useful, precise words for sharper thinking." : mode === "flashcards" ? "Recall first, reveal second. Your memory does the heavy lifting." : mode === "quiz" ? "A short check-in across today’s shelf — no pressure, just practice." : mode === "tenseQuiz" ? "Choose a tense, take a round, and make the timeline automatic." : mode === "review" ? "Revisit missed tense questions, understand the why, and try again." : mode === "tenses" ? "A friendly guide to the 12 ways English places an action in time." : "Listen, speak along, and build a more natural American English rhythm."}</p></div><div className="header-actions"><button className="streak-chip"><Flame size={15} /> {streak} days</button><button className="avatar avatar-large">AS</button></div></header>;
}

function Shelf({ words, allWords, category, setCategory, query, setQuery, setMode, learned, markLearned, favorites, toggleFavorite, difficulty, setDifficulty, lists, setLists, dedicatedCategory }: { words: readonly Word[]; allWords: readonly Word[]; category: string; setCategory: (v: string) => void; query: string; setQuery: (v: string) => void; setMode: (m: Mode) => void; learned: number; markLearned: (w: string) => void; favorites: string[]; toggleFavorite: (w: string) => void; difficulty: DifficultyFilter; setDifficulty: (value: DifficultyFilter) => void; lists: CustomLists; setLists: Dispatch<SetStateAction<CustomLists>>; dedicatedCategory?: "Everyday" | "Academic" | "Business" }) {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({ count: words.length, getScrollElement: () => listRef.current, estimateSize: () => 280, overscan: 6 });
  const virtualItems = virtualizer.getVirtualItems();
  useEffect(() => { virtualizer.scrollToOffset(0); setSelectedWord(null); setAiSentence(null); }, [words, virtualizer]);
  const [aiSentence, setAiSentence] = useState<{ word: string; sentence: string; tip: string; collocations: string[]; challenge: string; difficulty: "Beginner" | "Intermediate" | "Advanced"; context: string; style: string } | null>(null);
  const [sentenceDifficulty, setSentenceDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(() => (localStorage.getItem("ai-sentence-difficulty") as "Beginner" | "Intermediate" | "Advanced") || "Intermediate");
  const [sentenceContext, setSentenceContext] = useState<"Conversation" | "Academic writing" | "Business" | "Travel" | "Exam practice">(() => (localStorage.getItem("ai-sentence-context") as "Conversation" | "Academic writing" | "Business" | "Travel" | "Exam practice") || "Conversation");
  const [sentenceStyle, setSentenceStyle] = useState<"Statement" | "Question" | "Negative" | "Contrast">(() => (localStorage.getItem("ai-sentence-style") as "Statement" | "Question" | "Negative" | "Contrast") || "Statement");
  const generateSentence = trpc.vocabulary.generateExampleSentence.useMutation();
  const copyAiSentence = async () => { if (!aiSentence || aiSentence.word !== selectedWord?.w || aiSentence.difficulty !== sentenceDifficulty || aiSentence.context !== sentenceContext || aiSentence.style !== sentenceStyle) return; try { await navigator.clipboard.writeText(aiSentence.sentence); toast.success("Sentence copied to your clipboard."); } catch { toast.error("Copy is unavailable in this browser."); } };
  const createAiSentence = async () => {
    if (!selectedWord) return;
    const category = selectedWord.cat === "Academic" || selectedWord.cat === "Business" ? selectedWord.cat : "Everyday";
    try {
      const result = await generateSentence.mutateAsync({ word: selectedWord.w, meaning: selectedWord.m, partOfSpeech: selectedWord.p, category, difficulty: sentenceDifficulty, context: sentenceContext, style: sentenceStyle });
      setAiSentence({ word: selectedWord.w, difficulty: sentenceDifficulty, context: sentenceContext, style: sentenceStyle, ...result });
    } catch {
      toast.error("The AI sentence could not be generated.", { description: "Your saved example sentence is still available below." });
    }
  };
  return <div className="shelf-view">
    <section className="hero-note"><div><span className="note-label">FIELD NOTE 01</span><h2>Words worth<br /><em>keeping.</em></h2><p>Good vocabulary is not about sounding clever. It is about being more exact when it matters.</p><button className="coral-btn" onClick={() => setMode("flashcards")}>Study today’s set <ArrowRight size={17} /></button></div><div className="hero-art"><img src={`${ASSET_BASE}assets/vocab-paper-hero.png`} alt="Paper cards and a coral pencil" /><span className="art-stamp">{words.length}<br /><small>WORDS</small></span></div></section>
    <div className="section-head"><div><span className="note-label">{dedicatedCategory ? `${dedicatedCategory.toUpperCase()} VOCABULARY` : "THE SHELF"}</span><h2>{dedicatedCategory ? `${dedicatedCategory} words` : "Choose a corner"}</h2></div><div className="search-wrap"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a word…" aria-label="Search words" /></div></div>
    {dedicatedCategory ? <div className="dedicated-section-note"><BookOpen size={15} /><span>Focused section · {words.length} words in this collection</span><button onClick={() => setMode("shelf")}>View all categories</button></div> : <div className="category-filter-row"><span className="filter-heading">WORD FILTER</span>{["All words", "Everyday", "Academic", "Business", "Literary", "Advanced"].map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? "selected" : ""}>{c}<span>{c === "All words" ? allWords.length : allWords.filter(w => w.cat === c).length}</span></button>)}<span className="filter-divider" /><span className="filter-heading">LEVEL</span>{(["All", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map(item => <button key={item} onClick={() => setDifficulty(item)} className={difficulty === item ? "selected filter-difficulty" : "filter-difficulty"}>{item}</button>)}</div>}
    {words.length ? <><div key={`${category}-${difficulty}-${query}`} ref={listRef} className="word-list word-list-virtual"><div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>{virtualItems.map(item => { const word = words[item.index]; return <article ref={virtualizer.measureElement} data-index={item.index} className="word-row" key={word.w} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${item.start}px)`, "--delay": "0ms" } as React.CSSProperties}><div className="word-index">{String(item.index + 1).padStart(2, "0")}</div><div className="word-main"><button className="word-title word-title-trigger" onClick={() => { setSelectedWord(word); setAiSentence(null); }} aria-label={`Open meaning for ${word.w}`}><h3>{word.w}</h3><span>{word.p}</span></button><p>{word.m}</p><div className="word-audio"><SpeakButton text={`${word.w}. ${word.m}`} label="Meaning" />{word.ex && <><span className="word-example">Example: {word.ex}</span><SpeakButton text={word.ex} label="Example" /></>}</div><div className="word-meta"><span>/{word.ph}/</span><span className="dot" /> <span>{word.cat}</span></div></div><div className="word-side"><Difficulty level={word.dif} /><button className={`favorite-btn ${favorites.includes(word.w) ? "active" : ""}`} onClick={() => toggleFavorite(word.w)} aria-label={`${favorites.includes(word.w) ? "Remove" : "Add"} ${word.w} ${favorites.includes(word.w) ? "from" : "to"} favorites`}><Heart size={15} fill={favorites.includes(word.w) ? "currentColor" : "none"} /></button>{Object.keys(lists).length > 0 && <select className="word-list-select" defaultValue="" aria-label={`Add ${word.w} to a custom list`} onChange={event => { const name = event.target.value; if (!name) return; setLists(previous => { const next = { ...previous, [name]: previous[name].includes(word.w) ? previous[name] : [...previous[name], word.w] }; localStorage.setItem("vocab-custom-lists", JSON.stringify(next)); return next; }); event.currentTarget.value = ""; toast.success(`Added ${word.w} to ${name}.`); }}><option value="">List</option>{Object.keys(lists).map(name => <option key={name} value={name}>{name}</option>)}</select>}<button className={`learn-btn ${learned >= 1 && false ? "done" : ""}`} onClick={() => markLearned(word.w)}>{learned > 0 && item.index < learned ? <Check size={16} /> : "Mark learned"}</button></div></article>; })}</div></div><p className="virtual-list-status">Showing {virtualItems.length ? virtualItems[0].index + 1 : 0}–{virtualItems.length ? virtualItems[virtualItems.length - 1].index + 1 : 0} of {words.length} words · scroll to continue</p></> : <div className="word-empty-state"><Search size={22} /><h3>No words match this filter.</h3><p>Try another category, difficulty, or search phrase.</p><button className="soft-btn" onClick={() => { setCategory("All words"); setDifficulty("All"); setQuery(""); }}>Clear filters</button></div>}
    {selectedWord && <aside className="word-detail-panel" aria-live="polite"><button className="word-detail-close" onClick={() => setSelectedWord(null)} aria-label="Close word meaning">×</button><span className="note-label">WORD NOTE · {selectedWord.cat}</span><div className="word-detail-heading"><div><h2>{selectedWord.w}</h2><span>{selectedWord.p} · /{selectedWord.ph}/</span></div><SpeakButton text={`${selectedWord.w}. ${selectedWord.m}`} label="Listen" /></div><p className="word-detail-meaning">{selectedWord.m}</p><div className="ai-sentence-panel"><div><span className="note-label">AI PRACTICE · {sentenceDifficulty.toUpperCase()} · {sentenceContext.toUpperCase()}</span><p>{aiSentence?.word === selectedWord.w && aiSentence.difficulty === sentenceDifficulty && aiSentence.context === sentenceContext && aiSentence.style === sentenceStyle ? `“${aiSentence.sentence}”` : "Generate a fresh sentence that uses this word naturally."}</p>{aiSentence?.word === selectedWord.w && aiSentence.difficulty === sentenceDifficulty && aiSentence.context === sentenceContext && aiSentence.style === sentenceStyle && <><small>{aiSentence.tip}</small><div className="ai-collocations"><span>USEFUL PAIRS</span>{aiSentence.collocations.map(item => <b key={item}>{item}</b>)}</div><div className="ai-challenge"><span>TRY THIS</span><p>{aiSentence.challenge}</p></div></>}</div><div className="ai-sentence-actions"><label className="sentence-difficulty-control"><span>CONTEXT</span><select value={sentenceContext} onChange={event => { const value = event.target.value as typeof sentenceContext; setSentenceContext(value); localStorage.setItem("ai-sentence-context", value); setAiSentence(null); }} aria-label="AI sentence context"><option>Conversation</option><option>Academic writing</option><option>Business</option><option>Travel</option><option>Exam practice</option></select></label><label className="sentence-difficulty-control"><span>FORM</span><select value={sentenceStyle} onChange={event => { const value = event.target.value as typeof sentenceStyle; setSentenceStyle(value); localStorage.setItem("ai-sentence-style", value); setAiSentence(null); }} aria-label="AI sentence form"><option>Statement</option><option>Question</option><option>Negative</option><option>Contrast</option></select></label><label className="sentence-difficulty-control"><span>LEVEL</span><select value={sentenceDifficulty} onChange={event => { const value = event.target.value as "Beginner" | "Intermediate" | "Advanced"; setSentenceDifficulty(value); localStorage.setItem("ai-sentence-difficulty", value); setAiSentence(null); }} aria-label="AI sentence difficulty"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><button className="soft-btn" onClick={createAiSentence} disabled={generateSentence.isPending}><Sparkles size={15} />{generateSentence.isPending ? "Writing…" : aiSentence?.word === selectedWord.w && aiSentence.difficulty === sentenceDifficulty && aiSentence.context === sentenceContext && aiSentence.style === sentenceStyle ? "Generate another" : "Generate with AI"}</button>{aiSentence?.word === selectedWord.w && aiSentence.difficulty === sentenceDifficulty && aiSentence.context === sentenceContext && aiSentence.style === sentenceStyle && <><button className="soft-btn" onClick={copyAiSentence} aria-label="Copy AI sentence"><Copy size={15} /> Copy</button><SpeakButton text={aiSentence.sentence} label="AI sentence" /></>}</div></div>{selectedWord.ex && <div className="word-detail-example"><span>SAVED EXAMPLE SENTENCE</span><p>“{selectedWord.ex}”</p><SpeakButton text={selectedWord.ex} label="Example" /></div>}<div className="related-words"><span>RELATED WORDS</span><div>{(selectedWord.syn.length ? selectedWord.syn : ["No related words listed yet"]).map(related => <button key={related} onClick={() => { const next = words.find(item => item.w === related); if (next) setSelectedWord(next); }}>{related}</button>)}</div></div></aside>}
  </div>;
}

function Flashcards({ words, markLearned }: { words: readonly Word[]; markLearned: (w: string) => void }) {
  const [index, setIndex] = useState(0); const [flipped, setFlipped] = useState(false); const word = words[index % words.length];
  const next = () => { setFlipped(false); setIndex(i => (i + 1) % words.length); };
  return <div className="mode-view"><div className="mode-title"><div><span className="note-label">FLASHCARDS · SET A</span><h2>Recall first. Reveal second.</h2><p>Say the meaning out loud, then turn the card to check yourself.</p></div><div className="counter">{String(index + 1).padStart(2, "0")} <span>/ {String(words.length).padStart(2, "0")}</span></div></div><div className={`flashcard-wrap ${flipped ? "is-flipped" : ""}`}><button className="flashcard" onClick={() => setFlipped(v => !v)} aria-label={flipped ? "Show word" : "Reveal definition"}><div className="card-face card-front"><div className="card-corner">WORD {String(index + 1).padStart(2, "0")}</div><span className="card-category">{word.cat}</span><h3>{word.w}</h3><span className="phonetic">/{word.ph}/</span><span className="flip-hint"><RotateCw size={14} /> click to reveal</span></div><div className="card-face card-back"><div className="card-corner">MEANING {String(index + 1).padStart(2, "0")}</div><span className="card-category">{word.p} · {word.cat}</span><h3>{word.m}</h3><div className="example"><span>IN A SENTENCE</span><p>“{word.ex}”</p></div><div className="synonyms"><span>NEARBY WORDS</span><div>{word.syn.map(s => <b key={s}>{s}</b>)}</div></div></div></button></div><div className="flash-actions"><button className="outline-btn" onClick={() => { markLearned(word.w); next(); }}><Check size={16} /> I knew it</button><button className="soft-btn" onClick={next}><ChevronRight size={17} /> Next card</button></div><div className="tip-box"><Lightbulb size={18} /><p><strong>Memory cue</strong> Connect a new word to a sentence you actually might say today.</p></div></div>;
}

function Quiz({ words, onFinish, markLearned, onAnswer }: { words: readonly Word[]; onFinish: (score: number) => void; markLearned: (w: string) => void; onAnswer: (correct: boolean) => void }) {
  const quizWords = useMemo(() => [...words].sort(() => Math.random() - 0.5).slice(0, Math.min(20, words.length)), [words]); const [index, setIndex] = useState(0); const [selected, setSelected] = useState<string | null>(null); const [score, setScore] = useState(0); const current = quizWords[index];
  const options = useMemo(() => { const others = words.filter(w => w.w !== current.w).slice(index, index + 3).map(w => w.m); return [current.m, ...others].sort(() => Math.random() - 0.5); }, [current, index, words]);
  const choose = (option: string) => { if (selected) return; setSelected(option); const right = option === current.m; onAnswer(right); if (right) setScore(s => s + 1); markLearned(current.w); setTimeout(() => { if (index === quizWords.length - 1) onFinish(score + (right ? 1 : 0)); else { setIndex(i => i + 1); setSelected(null); } }, 650); };
  return <div className="mode-view quiz-view"><div className="mode-title"><div><span className="note-label">QUICK QUIZ · 20 QUESTIONS</span><h2>Make the word stick.</h2><p>Choose the most precise meaning from a large, randomized word bank.</p></div><div className="quiz-score"><Trophy size={17} /> {score} correct</div></div><div className="quiz-progress"><span style={{ width: `${((index) / quizWords.length) * 100}%` }} /></div><div className="quiz-question"><div className="question-top"><span>QUESTION {index + 1} OF {quizWords.length}</span><Difficulty level={current.dif} /></div><h3>What does <em>{current.w}</em> mean?</h3><div className="quiz-options">{options.map((option, i) => { const right = option === current.m; const state = selected ? right ? "right" : selected === option ? "wrong" : "muted" : ""; return <button key={option} className={`quiz-option ${state}`} onClick={() => choose(option)}><span>{String.fromCharCode(65 + i)}</span><p>{option}</p>{selected && right && <Check size={17} />}{selected === option && !right && <X size={17} />}</button>; })}</div></div><div className="quiz-foot"><CircleHelp size={16} /><span>Take your best guess. You can review every word on the shelf afterwards.</span></div></div>;
}

function TenseQuizView({ bank, onAnswer }: { bank: TenseQuizSet[]; onAnswer: (correct: boolean) => void }) {
  const [tenseIndex, setTenseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const currentSet = bank[tenseIndex];
  const questions = currentSet.rounds[roundIndex].questions;
  const current = questions[questionIndex];
  const choose = (index: number) => { if (selected !== null) return; setSelected(index); const correct = index === current.correct_index; onAnswer(correct); if (correct) setScore(value => value + 1); else { const key = `${currentSet.tense}:${roundIndex + 1}:${current.id}`; const existing: MissedQuestion[] = JSON.parse(localStorage.getItem("tense-missed-questions") || "[]"); const next = existing.some(item => `${item.tense}:${item.round}:${item.question.id}` === key) ? existing : [...existing, { tense: currentSet.tense, round: roundIndex + 1, question: current, selectedIndex: index }]; localStorage.setItem("tense-missed-questions", JSON.stringify(next)); } };
  const chooseTense = (index: number) => { setTenseIndex(index); setRoundIndex(0); setQuestionIndex(0); setSelected(null); setScore(0); };
  const chooseRound = (index: number) => { setRoundIndex(index); setQuestionIndex(0); setSelected(null); setScore(0); };
  const nextQuestion = () => { if (questionIndex < questions.length - 1) { setQuestionIndex(value => value + 1); setSelected(null); } else { setRoundIndex(value => (value + 1) % currentSet.rounds.length); setQuestionIndex(0); setSelected(null); setScore(0); } };
  const roundFinished = questionIndex === questions.length - 1 && selected !== null;
  return <div className="tense-quiz-view"><section className="tense-quiz-intro"><div><span className="note-label">TENSE IDENTIFICATION · 1,200 QUESTIONS</span><h2>Make the timeline<br /><em>automatic.</em></h2><p>Choose one of the 12 tenses, select a round, and identify the sentence that matches the target tense. Every answer includes a quick reason.</p></div><div className="quiz-bank-count"><strong>12</strong><span>tenses</span><strong>120</strong><span>rounds</span><strong>1,200</strong><span>questions</span></div></section><div className="tense-quiz-selectors"><div><span className="note-label">CHOOSE A TENSE</span><div className="tense-quiz-tense-grid">{bank.map((item, index) => <button key={item.tense} className={index === tenseIndex ? "active" : ""} onClick={() => chooseTense(index)}>{item.tense}</button>)}</div></div><div><span className="note-label">CHOOSE A ROUND</span><div className="tense-quiz-round-grid">{currentSet.rounds.map((round, index) => <button key={round.round} className={index === roundIndex ? "active" : ""} onClick={() => chooseRound(index)}>{round.round}</button>)}</div></div></div><div className="tense-quiz-card"><div className="tense-quiz-card-top"><span className="family-tag">{currentSet.tense}</span><span>ROUND {roundIndex + 1} · QUESTION {questionIndex + 1} / {questions.length}</span><strong>{score} correct</strong></div><div className="quiz-progress"><span style={{ width: `${((questionIndex + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }} /></div><h3>{current.prompt}</h3><div className="tense-quiz-options">{current.options.map((option, index) => { const state = selected === null ? "" : index === current.correct_index ? "correct" : index === selected ? "incorrect" : "muted"; return <button key={option} className={state} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p>{selected !== null && index === current.correct_index && <Check size={17} />}</button>; })}</div>{selected !== null && <div className={`tense-quiz-feedback ${selected === current.correct_index ? "correct" : "incorrect"}`}><strong>{selected === current.correct_index ? "Correct." : "Not quite."}</strong><p>{current.explanation}</p></div>}<div className="tense-quiz-footer"><span>Question bank progress: {tenseIndex * 100 + roundIndex * 10 + questionIndex + 1} / 1,200</span>{selected !== null && <button className="coral-btn" onClick={nextQuestion}>{roundFinished ? (roundIndex === 9 ? "Restart tense" : `Next round · ${roundIndex + 2}`) : "Next question"} <ArrowRight size={16} /></button>}</div></div></div>;
}

function ReviewMistakes({ missed, setMissed }: { missed: MissedQuestion[]; setMissed: Dispatch<SetStateAction<MissedQuestion[]>> }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const current = missed[index];
  const choose = (answer: number) => { if (selected !== null || !current) return; setSelected(answer); if (answer === current.question.correct_index) { const next = missed.filter((_, itemIndex) => itemIndex !== index); setMissed(next); localStorage.setItem("tense-missed-questions", JSON.stringify(next)); toast.success("Correct — removed from your review list."); if (index >= next.length) setIndex(Math.max(0, next.length - 1)); } };
  if (!current) return <div className="review-empty"><span className="note-label">REVIEW DESK</span><h2>Your mistake shelf is clear.</h2><p>Missed tense questions will appear here automatically after you answer them incorrectly.</p><button className="coral-btn" onClick={() => toast.info("Choose Tense quiz from the study rail to practice more questions.")}>Practice a tense quiz <ArrowRight size={16} /></button></div>;
  return <div className="review-view"><section className="review-intro"><div><span className="note-label">REVIEW DESK · {missed.length} SAVED</span><h2>Missed it?<br /><em>Meet it again.</em></h2><p>Practice one missed question at a time. Read the explanation, then keep going until the shelf is clear.</p></div><div className="review-count"><strong>{index + 1}</strong><span>of {missed.length}</span></div></section><div className="review-card"><div className="tense-quiz-card-top"><span className="family-tag">{current.tense}</span><span>ROUND {current.round} · MISSED QUESTION</span></div><h3>{current.question.prompt}</h3><div className="tense-quiz-options">{current.question.options.map((option, optionIndex) => { const state = selected === null ? "" : optionIndex === current.question.correct_index ? "correct" : optionIndex === selected ? "incorrect" : "muted"; return <button key={option} className={state} onClick={() => choose(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span><p>{option}</p>{selected !== null && optionIndex === current.question.correct_index && <Check size={17} />}</button>; })}</div>{selected !== null && <div className={`tense-quiz-feedback ${selected === current.question.correct_index ? "correct" : "incorrect"}`}><strong>{selected === current.question.correct_index ? "Correct — nice recovery." : "Keep this one on the shelf."}</strong><p>{current.question.explanation}</p></div>}<div className="review-footer"><span>Question {index + 1} of {missed.length}</span>{selected !== null && selected !== current.question.correct_index && <button className="soft-btn" onClick={() => setSelected(null)}>Try again</button>}{selected !== null && selected === current.question.correct_index && missed.length > 0 && <button className="coral-btn" onClick={() => setSelected(null)}>Next missed question <ArrowRight size={16} /></button>}</div></div></div>;
}

function ShadowingView({ onScore }: { onScore: (score: number) => void }) {
  const [passageId, setPassageId] = useState<string>(PRACTICE_PASSAGES[0].id);
  const passage = PRACTICE_PASSAGES.find(item => item.id === passageId) ?? PRACTICE_PASSAGES[0];
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<{ pronunciation: number; fluency: number; intonation: number; voiceMatch: number; transcript: string } | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [completed, setCompleted] = useState<string[]>(() => JSON.parse(localStorage.getItem("shadowing-passage-progress") || "[]"));
  const sentence = passage.sentences[sentenceIndex];
  const supported = typeof window !== "undefined" && Boolean((window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  const scoreSpeech = (spoken: string) => {
    const targetWords = normalize(sentence).split(" ");
    const spokenWords = normalize(spoken).split(" ");
    const matches = targetWords.filter((word, index) => spokenWords[index] === word).length;
    const pronunciation = Math.round((matches / Math.max(targetWords.length, 1)) * 100);
    const wordCoverage = Math.round((new Set(spokenWords.filter(word => targetWords.includes(word))).size / Math.max(new Set(targetWords).size, 1)) * 100);
    const durationEstimate = Math.max(spokenWords.length / 2.2, 1);
    const fluency = Math.max(35, Math.min(100, Math.round(100 - Math.abs(durationEstimate - targetWords.length / 2.2) * 8)));
    const intonation = Math.max(42, Math.min(96, Math.round(55 + wordCoverage * .35)));
    const voiceMatch = Math.max(38, Math.min(98, Math.round(pronunciation * .65 + fluency * .2 + intonation * .15)));
    return { pronunciation, fluency, intonation, voiceMatch, transcript: spoken };
  };
  const startRecording = async () => {
    const SpeechRecognitionAPI = (window as Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { toast.error("Speech recognition is not supported here. You can still listen and practice aloud."); return; }
    window.speechSynthesis?.cancel();
    setTranscript(""); setResult(null); setRecordedUrl(null); setListening(true);
    if (navigator.mediaDevices?.getUserMedia && "MediaRecorder" in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;
        recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
        recorder.onstop = () => { const url = URL.createObjectURL(new Blob(chunksRef.current, { type: "audio/webm" })); setRecordedUrl(url); stream.getTracks().forEach(track => track.stop()); };
        recorder.start();
      } catch { toast.info("Microphone playback is unavailable, but transcript scoring is still active."); }
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => { const spoken = event.results?.[0]?.[0]?.transcript ?? ""; const scored = scoreSpeech(spoken); setTranscript(spoken); setResult(scored); onScore(scored.voiceMatch); };
    recognition.onerror = () => { setListening(false); recorderRef.current?.stop(); toast.error("I could not hear a clear attempt. Please try again in a quiet place."); };
    recognition.onend = () => { setListening(false); if (recorderRef.current?.state === "recording") recorderRef.current.stop(); };
    recognition.start();
  };
  const selectPassage = (id: string) => { setPassageId(id); setSentenceIndex(0); setTranscript(""); setResult(null); };
  const nextSentence = () => { setSentenceIndex(index => Math.min(index + 1, passage.sentences.length - 1)); setTranscript(""); setResult(null); };
  const previousSentence = () => { setSentenceIndex(index => Math.max(index - 1, 0)); setTranscript(""); setResult(null); };
  const completePassage = () => { const key = `${passage.id}:${sentenceIndex}`; setCompleted(previous => { const next = previous.includes(key) ? previous : [...previous, key]; localStorage.setItem("shadowing-passage-progress", JSON.stringify(next)); return next; }); toast.success("Sentence saved to your practice progress."); };
  return <div className="shadowing-view"><section className="shadowing-intro"><div><span className="note-label">SPEAKING LAB · ONE SENTENCE AT A TIME</span><h2>Listen.<br /><em>Shadow. Grow.</em></h2><p>Choose a passage, listen to the US-English model, then record your own voice. The browser gives a practice estimate from your transcript; it does not judge your identity or store audio.</p></div><div className="accent-badge"><Mic size={22} /><strong>US English</strong><span>{supported ? "Speech recognition ready" : "Playback available"}</span></div></section><div className="passage-picker"><div className="passage-picker-head"><span className="note-label">CHOOSE A PASSAGE</span><strong>{PRACTICE_PASSAGES.length} individually selectable practice lines</strong></div>{PRACTICE_PASSAGES.map(item => <button key={item.id} className={passage.id === item.id ? "active" : ""} onClick={() => selectPassage(item.id)}><span>{item.speaker}</span><strong>{item.title}</strong><small><b>{item.level}</b>{item.sentences.length} sentences</small><ChevronRight size={18} /></button>)}</div><div className="shadowing-progress"><div><span>PASSAGE PROGRESS</span><strong>Sentence {sentenceIndex + 1} / {passage.sentences.length}</strong></div><div className="progress-track"><span style={{ width: `${((sentenceIndex + 1) / passage.sentences.length) * 100}%` }} /></div></div><div className="shadowing-card"><div className="shadowing-meta"><span className="family-tag">{passage.title}</span><span>{passage.level} · {passage.speaker}</span></div><p className="shadowing-line">“{sentence}”</p><div className="shadowing-actions"><SpeakButton text={sentence} label="Listen US" /><button className="shadowing-start" onClick={startRecording} disabled={listening}>{listening ? "Listening… speak now" : "Record my voice"}</button><button className={`shadowing-done ${completed.includes(`${passage.id}:${sentenceIndex}`) ? "done" : ""}`} onClick={completePassage}>{completed.includes(`${passage.id}:${sentenceIndex}`) ? <><Check size={15} /> Saved</> : "Save sentence"}</button></div>{transcript && <div className="speech-transcript"><span>WHAT I HEARD</span><p>“{transcript}”</p>{recordedUrl && <audio className="voice-playback" controls src={recordedUrl} aria-label="Replay my recorded voice" />}</div>}{result && <div className="speech-results"><div className="score-primary"><span>VOICE MATCH ESTIMATE</span><strong>{result.voiceMatch}%</strong><small>Transcript and pacing estimate — not biometric voice analysis.</small></div><div><span>PRONUNCIATION</span><strong>{result.pronunciation}%</strong></div><div><span>FLUENCY</span><strong>{result.fluency}%</strong></div><div><span>INTONATION</span><strong>{result.intonation}%</strong></div></div>}<div className="shadowing-tip"><Lightbulb size={18} /><span><strong>Shadowing technique:</strong> Listen once, speak with the model, then repeat alone. Copy the pauses and stress, but keep your own natural voice.</span><SpeakButton text="Listen once, speak with the model, then repeat alone. Copy the pauses and stress, but keep your own natural voice." label="Technique" /></div></div><div className="shadowing-nav"><button onClick={previousSentence} disabled={sentenceIndex === 0}><ChevronLeft size={16} /> Previous</button><div className="shadowing-dots">{passage.sentences.map((_, dot) => <i key={dot} className={dot === sentenceIndex ? "active" : dot < sentenceIndex ? "done" : ""} />)}</div><button onClick={nextSentence} disabled={sentenceIndex === passage.sentences.length - 1}>Next sentence <ChevronRight size={16} /></button></div></div>;
}

function TensesView() {
  const [family, setFamily] = useState<"All" | TenseLesson["family"]>("All");
  const [selected, setSelected] = useState(TENSES[0].id);
  const [practice, setPractice] = useState<string | null>(null);
  const visible = family === "All" ? TENSES : TENSES.filter(t => t.family === family);
  const current = TENSES.find(t => t.id === selected) ?? TENSES[0];
  const guide = TENSE_GUIDES[current.id];
  const answers = ["Maya is reading a new novel this week.", "Maya read the first chapter last night.", "Maya will read the next chapter tomorrow."];
  return <div className="tenses-view">
    <section className="tense-intro"><div><span className="note-label">GRAMMAR DESK · 12 TENSES</span><h2>Put every action<br /><em>in its place.</em></h2><p>English tenses are just a timeline. Start with when the action happens, then notice whether it is a habit, in progress, or complete.</p></div><div className="timeline-art"><span>PAST</span><i /><span>NOW</span><i /><span>NEXT</span></div></section>
    <div className="tense-toolbar"><div><span className="note-label">THE TENSE MAP</span><h2>Choose a tense</h2></div><div className="tense-filters">{["All", "Present", "Past", "Future"].map(item => <button key={item} className={family === item ? "selected" : ""} onClick={() => setFamily(item as typeof family)}>{item}</button>)}</div></div>
    <div className="tense-layout"><div className="tense-list">{visible.map((tense, index) => <button key={tense.id} className={`tense-list-item ${selected === tense.id ? "active" : ""}`} onClick={() => { setSelected(tense.id); setPractice(null); }}><span>{String(TENSES.indexOf(tense) + 1).padStart(2, "0")}</span><div><strong>{tense.name}</strong><small>{tense.family} · {tense.short}</small></div><ChevronRight size={16} /></button>)}</div><article className="tense-card"><div className="tense-card-top"><span className={`family-tag ${current.family.toLowerCase()}`}>{current.family}</span><span className="tense-number">LESSON {String(TENSES.indexOf(current) + 1).padStart(2, "0")} / 12</span></div><h3>{current.name}</h3><p className="tense-short">{current.short}</p><div className="tense-block"><span>WHEN TO USE IT</span><p>{current.use}</p></div><div className="tense-block structure-block"><span>THE SHAPE</span><strong>{current.structure}</strong></div><div className="tense-guide-grid"><div><span>THE TIMELINE</span><p>{guide.timeline}</p></div><div><span>THE REAL FOCUS</span><p>{guide.focus}</p></div><div><span>COMPARE IT</span><p>{guide.compare}</p></div><div><span>COMMON MISTAKE</span><p>{guide.commonMistake}</p></div></div><div className="tense-steps"><span>THREE-STEP METHOD</span><ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="tense-check-prompt"><strong>Ask yourself:</strong> {guide.check}</p></div><div className="tense-example"><span>EXAMPLE</span><div className="audio-example-row"><p>“{current.example}”</p><SpeakButton text={current.example} /></div><div className="tense-sentence-list"><div><b>Negative:</b> {current.negative}<SpeakButton text={current.negative} /></div><div><b>Question:</b> {current.question}<SpeakButton text={current.question} /></div></div></div><div className="tense-clues"><span>CLUE WORDS</span>{current.clues.map(clue => <b key={clue}>{clue}</b>)}</div><div className="tense-tip"><Lightbulb size={17} /><p><strong>Easy way to remember:</strong> {current.tip}</p></div><div className="tense-practice"><span>QUICK CHECK</span><p>Which sentence shows <strong>{current.name}</strong>?</p>{answers.map(answer => <button key={answer} className={practice === answer ? answer === current.example ? "correct" : "incorrect" : ""} onClick={() => setPractice(answer)}>{answer}</button>)}</div></article></div>
  </div>;
}

function PhoneticsView() {
  const [group, setGroup] = useState<(typeof PHONETIC_GROUPS)[number]>("All sounds");
  const [selected, setSelected] = useState<string>(US_PHONETICS[0].symbol);
  const [practiced, setPracticed] = useState<string[]>(() => JSON.parse(localStorage.getItem("phonetics-practiced") || "[]"));
  const sounds = group === "All sounds" ? US_PHONETICS : US_PHONETICS.filter(sound => sound.group === group);
  const current = sounds.find(sound => sound.symbol === selected) ?? sounds[0] ?? US_PHONETICS[0];
  const markPracticed = (symbol: string) => setPracticed(previous => { const next = previous.includes(symbol) ? previous : [...previous, symbol]; localStorage.setItem("phonetics-practiced", JSON.stringify(next)); return next; });
  return <div className="phonetics-view"><section className="phonetics-intro"><div><span className="note-label">SPEECH DESK · US ENGLISH</span><h2>Build a clearer<br /><em>sound system.</em></h2><p>Study the sound, listen to useful words, then repeat them slowly. IPA is a map for your mouth—not a test you have to memorize all at once.</p></div><div className="phonetics-count"><strong>{practiced.length}</strong><span>of {US_PHONETICS.length}<br />sounds practiced</span></div></section><div className="phonetics-toolbar"><div><span className="note-label">SOUND FAMILIES</span><h2>Choose a sound group</h2></div><div className="phonetics-filters">{PHONETIC_GROUPS.map(item => <button key={item} className={group === item ? "selected" : ""} onClick={() => { setGroup(item); const next = item === "All sounds" ? US_PHONETICS[0] : US_PHONETICS.find(sound => sound.group === item); if (next) setSelected(next.symbol); }}>{item}</button>)}</div></div><div className="phonetics-layout"><div className="phonetics-list">{sounds.map(sound => <button key={sound.symbol} className={`phonetic-list-item ${selected === sound.symbol ? "active" : ""}`} onClick={() => setSelected(sound.symbol)}><span className="phonetic-symbol">{sound.symbol}</span><div><strong>{sound.name}</strong><small>{sound.group} · {sound.examples.length} examples</small></div>{practiced.includes(sound.symbol) && <Check size={15} />}</button>)}</div><article className="phonetic-card"><div className="phonetic-card-top"><span className="family-tag">{current.group}</span><span>{practiced.includes(current.symbol) ? "PRACTICED" : "NEW SOUND"}</span></div><div className="phonetic-hero-row"><div className="phonetic-hero-symbol">{current.symbol}</div><SpeakButton text={current.examples[0]?.word ?? current.name} label={`Play ${current.symbol} sound`} /></div><h3>{current.name}</h3><p className="phonetic-guidance">{current.guidance}</p><p className="phonetic-model-note">Hear the target sound inside <strong>{current.examples[0]?.word}</strong>, then repeat the example words below.</p><div className="phonetic-examples"><span>LISTEN AND REPEAT</span>{current.examples.map(example => <div key={example.word}><div><strong>{example.word}</strong><small>{example.phonetic} · {example.focus}</small></div><SpeakButton text={example.word} label={`Play ${example.word}`} /></div>)}</div><div className="phonetic-contrast"><span>CONTRAST NOTE</span><p>{current.contrast}</p></div><button className={`coral-btn phonetic-practice-btn ${practiced.includes(current.symbol) ? "done" : ""}`} onClick={() => { markPracticed(current.symbol); toast.success(`Marked ${current.symbol} as practiced.`); }}>{practiced.includes(current.symbol) ? <><Check size={16} /> Practiced</> : "I practiced this sound"}</button></article></div></div>;
}

function MinimalPairsView() {
  const [questionIndex, setQuestionIndex] = useState(() => Number(localStorage.getItem("minimal-pair-index") || "0") % MINIMAL_PAIR_QUESTIONS.length);
  const [selected, setSelected] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState<{ answered: number; correct: number; streak: number; bestStreak: number }>(() => JSON.parse(localStorage.getItem("minimal-pair-progress") || '{"answered":0,"correct":0,"streak":0,"bestStreak":0}'));
  const question = MINIMAL_PAIR_QUESTIONS[questionIndex];
  const choose = (index: number) => { if (selected !== null) return; const correct = index === question.correctIndex; const nextStreak = correct ? score.streak + 1 : 0; const next = { answered: score.answered + 1, correct: score.correct + (correct ? 1 : 0), streak: nextStreak, bestStreak: Math.max(score.bestStreak, nextStreak) }; setSelected(index); setScore(next); localStorage.setItem("minimal-pair-progress", JSON.stringify(next)); };
  const nextQuestion = () => { if (questionIndex === MINIMAL_PAIR_QUESTIONS.length - 1) { setCompleted(true); return; } const nextIndex = questionIndex + 1; setQuestionIndex(nextIndex); setSelected(null); localStorage.setItem("minimal-pair-index", String(nextIndex)); };
  const resetQuiz = () => { const next = { answered: 0, correct: 0, streak: 0, bestStreak: 0 }; setCompleted(false); setQuestionIndex(0); setSelected(null); setScore(next); localStorage.setItem("minimal-pair-index", "0"); localStorage.setItem("minimal-pair-progress", JSON.stringify(next)); };
  const accuracy = score.answered ? Math.round((score.correct / score.answered) * 100) : 0;
  return <div className="minimal-pairs-view">{completed ? <section className="minimal-complete"><span className="note-label">LISTENING LAB COMPLETE</span><h2>Nice work on the<br /><em>small differences.</em></h2><p>You completed all {MINIMAL_PAIR_QUESTIONS.length} minimal-pair questions.</p><div className="minimal-complete-stats"><strong>{accuracy}%</strong><span>{score.correct} correct · best streak {score.bestStreak}</span></div><button className="coral-btn" onClick={resetQuiz}>Practice again <RotateCw size={16} /></button></section> : <><section className="minimal-pairs-intro"><div><span className="note-label">LISTENING LAB · SOUND DISCRIMINATION</span><h2>Hear the small<br /><em>difference.</em></h2><p>Play the hidden word, then choose the word you think you heard. Focus on the vowel, voicing, or mouth position—not spelling.</p></div><div className="minimal-score"><strong>{accuracy}%</strong><span>accuracy<br />{score.answered} answered</span></div></section><div className="minimal-pairs-card"><div className="minimal-progress"><span>QUESTION {questionIndex + 1} / {MINIMAL_PAIR_QUESTIONS.length}</span><span>{score.streak} current streak · {score.bestStreak} best</span></div><div className="minimal-contrast-label">CONTRAST · {question.contrast}</div><div className="minimal-listen"><span className="minimal-ear">?</span><div><h3>Which word did you hear?</h3><p>Listen twice if you need to. The answer stays hidden until you choose.</p></div><SpeakButton text={question.target} label="Play target" /></div><div className="minimal-options">{question.options.map((option, index) => <button key={option} className={selected === null ? "" : index === question.correctIndex ? "correct" : selected === index ? "incorrect" : ""} onClick={() => choose(index)} disabled={selected !== null}><span>{String.fromCharCode(65 + index)}</span><strong>{option}</strong><small>/{index === question.correctIndex ? question.soundA : question.soundB}/</small></button>)}</div>{selected !== null && <div className={`minimal-feedback ${selected === question.correctIndex ? "correct" : "incorrect"}`}><div><strong>{selected === question.correctIndex ? "Correct distinction." : `The answer was “${question.options[question.correctIndex]}.”`}</strong><p>{question.explanation}</p></div><SpeakButton text={question.options[question.correctIndex]} label="Answer" /></div>}<div className="minimal-actions"><button className="soft-btn" onClick={nextQuestion} disabled={selected === null}>{questionIndex === MINIMAL_PAIR_QUESTIONS.length - 1 ? "Finish quiz" : "Next pair"} <ArrowRight size={15} /></button><span>Score: {score.correct}/{score.answered}</span></div></div></>}</div>;
}

function DashboardView({ words, learned, missed, favorites, lists, setLists, daily, setDaily, offline, setMode, difficulty, setDifficulty, stats, streak }: { words: readonly Word[]; learned: string[]; missed: MissedQuestion[]; favorites: string[]; lists: CustomLists; setLists: Dispatch<SetStateAction<CustomLists>>; daily: DailyProgress; setDaily: Dispatch<SetStateAction<DailyProgress>>; offline: boolean; setMode: (mode: Mode) => void; difficulty: DifficultyFilter; setDifficulty: (value: DifficultyFilter) => void; stats: ProgressStats; streak: number }) {
  const [listName, setListName] = useState("");
  const todayTotal = daily.vocabulary + daily.tense + daily.shadowing;
  const completeTask = (kind: "vocabulary" | "tense" | "shadowing") => setDaily(previous => { const next = { ...previous, [kind]: Math.min(previous[kind] + 1, kind === "vocabulary" ? 10 : kind === "tense" ? 5 : 3) }; localStorage.setItem("vocab-daily-progress", JSON.stringify(next)); return next; });
  const createList = () => { const clean = listName.trim(); if (!clean || lists[clean]) return; setLists(previous => { const next = { ...previous, [clean]: [] }; localStorage.setItem("vocab-custom-lists", JSON.stringify(next)); return next; }); setListName(""); toast.success(`Created ${clean}.`); };
  const filteredCount = difficulty === "All" ? words.length : words.filter(word => (difficulty === "Easy" ? word.dif === 1 : difficulty === "Medium" ? word.dif === 2 : word.dif >= 3)).length;
  return <div className="dashboard-view"><section className="dashboard-hero"><div><span className="note-label">LEARNING DASHBOARD · {offline ? "OFFLINE READY" : "SYNCED LOCALLY"}</span><h2>Make progress<br /><em>visible.</em></h2><p>Your practice stays on this device. Use today's small plan, then check the patterns that are becoming automatic.</p></div><div className="dashboard-total"><strong>{todayTotal}</strong><span>of 18 tasks<br />completed today</span></div></section><section className="daily-plan"><div className="section-head"><div><span className="note-label">TODAY'S PLAN</span><h2>Three small moves</h2></div><span className="plan-date"><CalendarDays size={15} /> {daily.date}</span></div><div className="daily-grid"><button onClick={() => { completeTask("vocabulary"); setMode("quiz"); }}><span className="task-number">01</span><strong>Vocabulary</strong><small>{daily.vocabulary}/10 · choose precise meanings</small><div className="mini-track"><i style={{ width: `${daily.vocabulary * 10}%` }} /></div></button><button onClick={() => { completeTask("tense"); setMode("tenseQuiz"); }}><span className="task-number">02</span><strong>Grammar</strong><small>{daily.tense}/5 · identify the timeline</small><div className="mini-track"><i style={{ width: `${daily.tense * 20}%` }} /></div></button><button onClick={() => { completeTask("shadowing"); setMode("shadowing"); }}><span className="task-number">03</span><strong>Shadowing</strong><small>{daily.shadowing}/3 · speak with the model</small><div className="mini-track"><i style={{ width: `${daily.shadowing * 33.333}%` }} /></div></button></div></section><section className="phonetics-spotlight"><div><span className="note-label">SPEECH LAB · US PHONETICS</span><h2>Hear the sound.<br /><em>Shape the word.</em></h2><p>Practice core US-English vowel and consonant sounds with IPA symbols, example words, mouth guidance, and repeat-after-me audio.</p><div className="phonetics-spotlight-meta"><span>22 core sounds</span><span>IPA + word examples</span><span>US-English playback</span></div></div><button className="coral-btn" onClick={() => setMode("phonetics")}>Open phonetics practice <ArrowRight size={16} /></button></section><OfflinePacks words={words} setMode={setMode} offline={offline} /><section className="dashboard-stats"><div><span>WORDS LEARNED</span><strong>{learned.length}</strong><small>saved on this device</small></div><div><span>FAVORITES</span><strong>{favorites.length}</strong><small>words to revisit</small></div><div><span>VOCAB ACCURACY</span><strong>{stats.vocabularyAnswered ? Math.round(stats.vocabularyCorrect / stats.vocabularyAnswered * 100) : 0}%</strong><small>{stats.vocabularyAnswered} answers recorded</small></div><div><span>TENSE ACCURACY</span><strong>{stats.tenseAnswered ? Math.round(stats.tenseCorrect / stats.tenseAnswered * 100) : 0}%</strong><small>{stats.tenseAnswered} answers recorded</small></div><div><span>SHADOWING SCORE</span><strong>{stats.shadowingAttempts ? Math.round(stats.shadowingScoreTotal / stats.shadowingAttempts) : 0}%</strong><small>{stats.shadowingAttempts} speaking attempts</small></div><div><span>STUDY STREAK</span><strong>{streak}</strong><small>consecutive days</small></div><div><span>MISSED TENSES</span><strong>{missed.length}</strong><small>ready for review</small></div><div><span>AVAILABLE SET</span><strong>{filteredCount}</strong><small>{difficulty} difficulty</small></div></section><section className="dashboard-tools"><div className="dashboard-panel"><span className="note-label">PRACTICE LENS</span><h3>Choose your difficulty</h3><p>Use the same filter across the shelf, flashcards, and Quick Quiz.</p><div className="difficulty-filters">{(["All", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map(item => <button key={item} className={difficulty === item ? "selected" : ""} onClick={() => setDifficulty(item)}>{item}</button>)}</div><button className="soft-btn" onClick={() => setMode("shelf")}>Open filtered shelf <ArrowRight size={16} /></button></div><div className="dashboard-panel"><span className="note-label">CUSTOM LISTS</span><h3>Give your words a home</h3><p>Create lists for exams, work, travel, or any goal.</p><div className="list-create"><input value={listName} onChange={event => setListName(event.target.value)} placeholder="e.g. IELTS words" aria-label="New custom list name" /><button className="coral-btn" onClick={createList} aria-label="Create custom list"><Plus size={16} /></button></div><div className="custom-list-items">{Object.entries(lists).map(([name, items]) => <span key={name}><ListPlus size={13} />{name}<b>{items.length}</b></span>)}</div></div></section><section className="dashboard-favorites"><div className="section-head"><div><span className="note-label">FAVORITE WORDS</span><h2>Your re-reading shelf</h2></div><button className="soft-btn" onClick={() => setMode("shelf")}>Browse shelf <ArrowRight size={16} /></button></div>{favorites.length ? <div className="favorite-grid">{favorites.slice(0, 8).map(word => { const item = words.find(candidate => candidate.w === word); return item ? <button key={word} onClick={() => setMode("shelf")}><Heart size={15} fill="currentColor" /> <strong>{item.w}</strong><span>{item.m}</span></button> : null; })}</div> : <div className="dashboard-empty">Tap the heart beside any word on the shelf to build this list.</div>}</section></div>;
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  const [mode, setMode] = useState<Mode>(() => { const requested = new URLSearchParams(window.location.search).get("mode") as Mode | null; return requested === "minimalPairs" || requested === "shelf" || requested === "phonetics" ? requested : "dashboard"; }); const [category, setCategory] = useState(() => { const requested = new URLSearchParams(window.location.search).get("category"); return ["All words", "Everyday", "Academic", "Business", "Literary", "Advanced"].includes(requested || "") ? requested || "All words" : "All words"; }); const [query, setQuery] = useState(""); const [difficulty, setDifficulty] = useState<DifficultyFilter>(() => (localStorage.getItem("vocab-difficulty") as DifficultyFilter) || "All"); const [words, setWords] = useState<readonly Word[]>(INITIAL_WORDS as unknown as readonly Word[]); const [tenseBank, setTenseBank] = useState<TenseQuizSet[] | null>(null); const [learnedWords, setLearnedWords] = useState<string[]>(() => JSON.parse(localStorage.getItem("vocab-learned") || "[]")); const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem("vocab-favorites") || "[]")); const [lists, setLists] = useState<CustomLists>(() => JSON.parse(localStorage.getItem("vocab-custom-lists") || "{}")); const [missed, setMissed] = useState<MissedQuestion[]>(() => JSON.parse(localStorage.getItem("tense-missed-questions") || "[]")); const [daily, setDaily] = useState<DailyProgress>(() => { const saved = JSON.parse(localStorage.getItem("vocab-daily-progress") || "null"); return saved?.date === TODAY ? saved : { date: TODAY, vocabulary: 0, tense: 0, shadowing: 0 }; }); const [stats, setStats] = useState<ProgressStats>(() => JSON.parse(localStorage.getItem("vocab-progress-stats") || '{"vocabularyCorrect":0,"vocabularyAnswered":0,"tenseCorrect":0,"tenseAnswered":0,"shadowingAttempts":0,"shadowingScoreTotal":0,"studyDays":[]}')); const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);
  useEffect(() => { const handleOnline = () => setOffline(false); const handleOffline = () => setOffline(true); window.addEventListener("online", handleOnline); window.addEventListener("offline", handleOffline); return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); }; }, []);
  useEffect(() => { let active = true; const timer = window.setTimeout(() => { import("@/data/advancedVocabulary").then(base => { if (!active) return; setWords([...CORE_WORDS, ...((base as any).ADVANCED_WORDS as readonly Word[])] as readonly Word[]); return import("@/data/advancedVocabularyExpansion"); }).then(expansion => { if (active && expansion) setWords(previous => [...previous, ...((expansion as any).ADVANCED_WORDS_EXPANSION as readonly Word[])]); }); import("@/data/tenseQuizBank").then(quiz => { if (active) setTenseBank((quiz as any).TENSE_QUIZ_BANK as TenseQuizSet[]); }); }, 420); return () => { active = false; window.clearTimeout(timer); }; }, []);
  const dedicatedCategory = mode === "everyday" ? "Everyday" : mode === "academic" ? "Academic" : mode === "business" ? "Business" : undefined;
  const shelfCategory = dedicatedCategory ?? category;
  const filtered = useMemo(() => words.filter(w => (shelfCategory === "All words" || w.cat === shelfCategory) && (difficulty === "All" || (difficulty === "Easy" ? w.dif === 1 : difficulty === "Medium" ? w.dif === 2 : w.dif >= 3)) && (`${w.w} ${w.m} ${w.cat}`.toLowerCase().includes(query.toLowerCase()))), [words, shelfCategory, difficulty, query]);
  const markLearned = (w: string) => setLearnedWords(prev => { const next = prev.includes(w) ? prev : [...prev, w]; localStorage.setItem("vocab-learned", JSON.stringify(next)); return next; });
  const toggleFavorite = (w: string) => setFavorites(previous => { const next = previous.includes(w) ? previous.filter(item => item !== w) : [...previous, w]; localStorage.setItem("vocab-favorites", JSON.stringify(next)); return next; });
  const changeDifficulty = (value: DifficultyFilter) => { setDifficulty(value); localStorage.setItem("vocab-difficulty", value); };
  const markStudyDay = (previous: ProgressStats): ProgressStats => previous.studyDays.includes(TODAY) ? previous : { ...previous, studyDays: [...previous.studyDays, TODAY] };
  const recordAnswer = (kind: "vocabulary" | "tense", correct: boolean) => setStats(previous => { const next = kind === "vocabulary" ? { ...previous, vocabularyCorrect: previous.vocabularyCorrect + (correct ? 1 : 0), vocabularyAnswered: previous.vocabularyAnswered + 1 } : { ...previous, tenseCorrect: previous.tenseCorrect + (correct ? 1 : 0), tenseAnswered: previous.tenseAnswered + 1 }; const saved = markStudyDay(next); localStorage.setItem("vocab-progress-stats", JSON.stringify(saved)); return saved; });
  const recordShadowing = (score: number) => setStats(previous => { const saved = markStudyDay({ ...previous, shadowingAttempts: previous.shadowingAttempts + 1, shadowingScoreTotal: previous.shadowingScoreTotal + score }); localStorage.setItem("vocab-progress-stats", JSON.stringify(saved)); return saved; });
  const streak = useMemo(() => { const days = new Set(stats.studyDays); let count = 0; const cursor = new Date(`${TODAY}T00:00:00`); while (days.has(cursor.toISOString().slice(0, 10))) { count += 1; cursor.setDate(cursor.getDate() - 1); } return count; }, [stats.studyDays]);
  const finishQuiz = (score: number) => { toast.success(`Quiz complete — ${score}/20 correct`, { description: score >= 4 ? "Your word sense is getting sharp." : "Good practice. The shelf is here when you want a review." }); setMode("shelf"); };
  return <div className="app-shell"><ProgressRail mode={mode} setMode={setMode} learned={learnedWords.length} streak={streak} missedCount={missed.length} daily={daily} offline={offline} /><main className="main-canvas"><Header mode={mode} setMode={setMode} streak={streak} />{mode === "dashboard" && <DashboardView words={words} learned={learnedWords} missed={missed} favorites={favorites} lists={lists} setLists={setLists} daily={daily} setDaily={setDaily} offline={offline} setMode={setMode} difficulty={difficulty} setDifficulty={changeDifficulty} stats={stats} streak={streak} />}{(mode === "shelf" || dedicatedCategory) && <Shelf words={filtered} allWords={words} category={shelfCategory} setCategory={setCategory} query={query} setQuery={setQuery} setMode={setMode} learned={learnedWords.length} markLearned={markLearned} favorites={favorites} toggleFavorite={toggleFavorite} difficulty={difficulty} setDifficulty={changeDifficulty} lists={lists} setLists={setLists} dedicatedCategory={dedicatedCategory} />}{mode === "flashcards" && <Flashcards words={filtered.length ? filtered : words} markLearned={markLearned} />}{mode === "quiz" && <Quiz words={filtered.length >= 5 ? filtered : words} onFinish={finishQuiz} markLearned={markLearned} onAnswer={correct => recordAnswer("vocabulary", correct)} />}{mode === "tenseQuiz" && (tenseBank ? <TenseQuizView bank={tenseBank} onAnswer={correct => recordAnswer("tense", correct)} /> : <div className="mode-view data-loading"><span className="note-label">LOADING STUDY BANK</span><h2>Preparing the tense desk…</h2><p>The 1,200-question bank is loading only when needed.</p></div>)}{mode === "review" && <ReviewMistakes missed={missed} setMissed={setMissed} />}{mode === "tenses" && <TensesView />}{mode === "shadowing" && <ShadowingView onScore={recordShadowing} />}{mode === "phonetics" && <PhoneticsView />}{mode === "minimalPairs" && <MinimalPairsView />}<footer className="page-footer"><span>VOCAB STUDIO · A SMALL PRACTICE FOR A BIGGER VOCABULARY</span><span>{words.length} words · 5 shelves · <strong>{learnedWords.length} learned</strong></span></footer></main></div>;
}

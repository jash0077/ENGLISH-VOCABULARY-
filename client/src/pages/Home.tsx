/* Editorial Study Hall: warm paper, ink navy, pencil coral. Main study workspace with visible, tactile learning states. */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Flame,
  Layers3,
  Lightbulb,
  Menu,
  RotateCw,
  Search,
  Sparkles,
  Target,
  Trophy,
  Volume2,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ADVANCED_WORDS } from "@/data/advancedVocabulary";
import { TENSES, type TenseLesson } from "@/data/tenses";

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

const WORDS = [...CORE_WORDS, ...ADVANCED_WORDS] as const;

type Word = (typeof WORDS)[number];
type Mode = "shelf" | "flashcards" | "quiz" | "tenses";

const CATEGORIES = ["All words", "Everyday", "Academic", "Business", "Literary", "Advanced"];
const ASSET_BASE = import.meta.env.BASE_URL;

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("Audio playback is not supported in this browser.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  return <button className={`speak-button ${speaking ? "speaking" : ""}`} onClick={toggleSpeech} aria-label={`${speaking ? "Stop" : "Play"} pronunciation: ${text}`} aria-pressed={speaking}>{speaking ? <Square size={13} fill="currentColor" /> : <Volume2 size={16} />}<span>{speaking ? "Stop" : "Listen"}</span></button>;
}

function Logo() {
  return <div className="brand-mark" aria-label="Vocab Studio logo"><img src={`${ASSET_BASE}assets/vocab-mark.png`} alt="" /><span>vocab<br /><em>studio</em></span></div>;
}

function Difficulty({ level }: { level: number }) {
  return <span className="difficulty" aria-label={`${level} of 3 difficulty`}><i className={level >= 1 ? "on" : ""} /><i className={level >= 2 ? "on" : ""} /><i className={level >= 3 ? "on" : ""} /></span>;
}

function ProgressRail({ mode, setMode, learned, streak }: { mode: Mode; setMode: (m: Mode) => void; learned: number; streak: number }) {
  const items = [
    { id: "shelf" as Mode, label: "Word shelf", icon: BookOpen },
    { id: "flashcards" as Mode, label: "Flashcards", icon: Layers3 },
    { id: "quiz" as Mode, label: "Quick quiz", icon: Target },
    { id: "tenses" as Mode, label: "Tenses", icon: Sparkles },
  ];
  return <aside className="rail">
    <div className="rail-top"><Logo /><button className="icon-btn mobile-menu" aria-label="Open menu"><Menu size={20} /></button></div>
    <div className="rail-label">Study desk</div>
    <nav className="rail-nav" aria-label="Study modes">
      {items.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setMode(id)} className={`rail-item ${mode === id ? "active" : ""}`}><Icon size={18} /><span>{label}</span>{id === "quiz" && <b>3</b>}</button>)}
    </nav>
    <div className="rail-note"><span className="note-pin" /><p>Small steps compound.<br /><strong>Keep the word close.</strong></p></div>
    <div className="rail-progress"><div className="rail-progress-head"><span>Today</span><strong>{learned}/10</strong></div><div className="progress-track"><span style={{ width: `${Math.min(learned * 10, 100)}%` }} /></div><div className="streak"><Flame size={16} /> {streak} day streak</div></div>
    <div className="rail-footer"><span className="avatar">AS</span><div><strong>Alex's desk</strong><small>Learning in public</small></div><button className="more-btn" aria-label="More options">•••</button></div>
  </aside>;
}

function Header({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return <header className="page-header"><div><p className="eyebrow">Thursday · 12 min practice</p><h1>{mode === "shelf" ? "Build a better word bank." : mode === "flashcards" ? "Turn the page." : mode === "quiz" ? "Make the word stick." : "Make your sentences clearer."}</h1><p className="lede">{mode === "shelf" ? "A curated shelf of useful, precise words for sharper thinking." : mode === "flashcards" ? "Recall first, reveal second. Your memory does the heavy lifting." : mode === "quiz" ? "A short check-in across today’s shelf — no pressure, just practice." : "A friendly guide to the 12 ways English places an action in time."}</p></div><div className="header-actions"><button className="streak-chip"><Flame size={15} /> 4 days</button><button className="avatar avatar-large">AS</button></div></header>;
}

function Shelf({ words, category, setCategory, query, setQuery, setMode, learned, markLearned }: { words: readonly Word[]; category: string; setCategory: (v: string) => void; query: string; setQuery: (v: string) => void; setMode: (m: Mode) => void; learned: number; markLearned: (w: string) => void }) {
  return <div className="shelf-view">
    <section className="hero-note"><div><span className="note-label">FIELD NOTE 01</span><h2>Words worth<br /><em>keeping.</em></h2><p>Good vocabulary is not about sounding clever. It is about being more exact when it matters.</p><button className="coral-btn" onClick={() => setMode("flashcards")}>Study today’s set <ArrowRight size={17} /></button></div><div className="hero-art"><img src={`${ASSET_BASE}assets/vocab-paper-hero.png`} alt="Paper cards and a coral pencil" /><span className="art-stamp">{WORDS.length}<br /><small>WORDS</small></span></div></section>
    <div className="section-head"><div><span className="note-label">THE SHELF</span><h2>Choose a corner</h2></div><div className="search-wrap"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a word…" aria-label="Search words" /></div></div>
    <div className="category-row">{CATEGORIES.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? "selected" : ""}>{c}<span>{c === "All words" ? WORDS.length : WORDS.filter(w => w.cat === c).length}</span></button>)}</div>
    <div className="word-list">{words.map((word, index) => <article className="word-row" key={word.w} style={{ "--delay": `${index * 35}ms` } as React.CSSProperties}><div className="word-index">{String(index + 1).padStart(2, "0")}</div><div className="word-main"><div className="word-title"><h3>{word.w}</h3><span>{word.p}</span></div><p>{word.m}</p><div className="word-meta"><span>/{word.ph}/</span><span className="dot" /> <span>{word.cat}</span></div></div><div className="word-side"><Difficulty level={word.dif} /><button className={`learn-btn ${learned >= 1 && false ? "done" : ""}`} onClick={() => markLearned(word.w)}>{learned > 0 && index < learned ? <Check size={16} /> : "Mark learned"}</button></div></article>)}</div>
    </div>;
}

function Flashcards({ words, markLearned }: { words: readonly Word[]; markLearned: (w: string) => void }) {
  const [index, setIndex] = useState(0); const [flipped, setFlipped] = useState(false); const word = words[index % words.length];
  const next = () => { setFlipped(false); setIndex(i => (i + 1) % words.length); };
  return <div className="mode-view"><div className="mode-title"><div><span className="note-label">FLASHCARDS · SET A</span><h2>Recall first. Reveal second.</h2><p>Say the meaning out loud, then turn the card to check yourself.</p></div><div className="counter">{String(index + 1).padStart(2, "0")} <span>/ {String(words.length).padStart(2, "0")}</span></div></div><div className={`flashcard-wrap ${flipped ? "is-flipped" : ""}`}><button className="flashcard" onClick={() => setFlipped(v => !v)} aria-label={flipped ? "Show word" : "Reveal definition"}><div className="card-face card-front"><div className="card-corner">WORD {String(index + 1).padStart(2, "0")}</div><span className="card-category">{word.cat}</span><h3>{word.w}</h3><span className="phonetic">/{word.ph}/</span><span className="flip-hint"><RotateCw size={14} /> click to reveal</span></div><div className="card-face card-back"><div className="card-corner">MEANING {String(index + 1).padStart(2, "0")}</div><span className="card-category">{word.p} · {word.cat}</span><h3>{word.m}</h3><div className="example"><span>IN A SENTENCE</span><p>“{word.ex}”</p></div><div className="synonyms"><span>NEARBY WORDS</span><div>{word.syn.map(s => <b key={s}>{s}</b>)}</div></div></div></button></div><div className="flash-actions"><button className="outline-btn" onClick={() => { markLearned(word.w); next(); }}><Check size={16} /> I knew it</button><button className="soft-btn" onClick={next}><ChevronRight size={17} /> Next card</button></div><div className="tip-box"><Lightbulb size={18} /><p><strong>Memory cue</strong> Connect a new word to a sentence you actually might say today.</p></div></div>;
}

function Quiz({ words, onFinish, markLearned }: { words: readonly Word[]; onFinish: (score: number) => void; markLearned: (w: string) => void }) {
  const quizWords = words.slice(0, 5); const [index, setIndex] = useState(0); const [selected, setSelected] = useState<string | null>(null); const [score, setScore] = useState(0); const current = quizWords[index];
  const options = useMemo(() => { const others = words.filter(w => w.w !== current.w).slice(index, index + 3).map(w => w.m); return [current.m, ...others].sort(() => Math.random() - 0.5); }, [current, index, words]);
  const choose = (option: string) => { if (selected) return; setSelected(option); const right = option === current.m; if (right) setScore(s => s + 1); markLearned(current.w); setTimeout(() => { if (index === quizWords.length - 1) onFinish(score + (right ? 1 : 0)); else { setIndex(i => i + 1); setSelected(null); } }, 650); };
  return <div className="mode-view quiz-view"><div className="mode-title"><div><span className="note-label">QUICK QUIZ · 5 QUESTIONS</span><h2>Make the word stick.</h2><p>Choose the definition that feels most precise.</p></div><div className="quiz-score"><Trophy size={17} /> {score} correct</div></div><div className="quiz-progress"><span style={{ width: `${((index) / quizWords.length) * 100}%` }} /></div><div className="quiz-question"><div className="question-top"><span>QUESTION {index + 1} OF {quizWords.length}</span><Difficulty level={current.dif} /></div><h3>What does <em>{current.w}</em> mean?</h3><div className="quiz-options">{options.map((option, i) => { const right = option === current.m; const state = selected ? right ? "right" : selected === option ? "wrong" : "muted" : ""; return <button key={option} className={`quiz-option ${state}`} onClick={() => choose(option)}><span>{String.fromCharCode(65 + i)}</span><p>{option}</p>{selected && right && <Check size={17} />}{selected === option && !right && <X size={17} />}</button>; })}</div></div><div className="quiz-foot"><CircleHelp size={16} /><span>Take your best guess. You can review every word on the shelf afterwards.</span></div></div>;
}

function TensesView() {
  const [family, setFamily] = useState<"All" | TenseLesson["family"]>("All");
  const [selected, setSelected] = useState(TENSES[0].id);
  const [practice, setPractice] = useState<string | null>(null);
  const visible = family === "All" ? TENSES : TENSES.filter(t => t.family === family);
  const current = TENSES.find(t => t.id === selected) ?? TENSES[0];
  const answers = ["Maya is reading a new novel this week.", "Maya read the first chapter last night.", "Maya will read the next chapter tomorrow."];
  return <div className="tenses-view">
    <section className="tense-intro"><div><span className="note-label">GRAMMAR DESK · 12 TENSES</span><h2>Put every action<br /><em>in its place.</em></h2><p>English tenses are just a timeline. Start with when the action happens, then notice whether it is a habit, in progress, or complete.</p></div><div className="timeline-art"><span>PAST</span><i /><span>NOW</span><i /><span>NEXT</span></div></section>
    <div className="tense-toolbar"><div><span className="note-label">THE TENSE MAP</span><h2>Choose a tense</h2></div><div className="tense-filters">{["All", "Present", "Past", "Future"].map(item => <button key={item} className={family === item ? "selected" : ""} onClick={() => setFamily(item as typeof family)}>{item}</button>)}</div></div>
    <div className="tense-layout"><div className="tense-list">{visible.map((tense, index) => <button key={tense.id} className={`tense-list-item ${selected === tense.id ? "active" : ""}`} onClick={() => { setSelected(tense.id); setPractice(null); }}><span>{String(TENSES.indexOf(tense) + 1).padStart(2, "0")}</span><div><strong>{tense.name}</strong><small>{tense.family} · {tense.short}</small></div><ChevronRight size={16} /></button>)}</div><article className="tense-card"><div className="tense-card-top"><span className={`family-tag ${current.family.toLowerCase()}`}>{current.family}</span><span className="tense-number">LESSON {String(TENSES.indexOf(current) + 1).padStart(2, "0")} / 12</span></div><h3>{current.name}</h3><p className="tense-short">{current.short}</p><div className="tense-block"><span>WHEN TO USE IT</span><p>{current.use}</p></div><div className="tense-block structure-block"><span>THE SHAPE</span><strong>{current.structure}</strong></div><div className="tense-example"><span>EXAMPLE</span><div className="audio-example-row"><p>“{current.example}”</p><SpeakButton text={current.example} /></div><div className="tense-sentence-list"><div><b>Negative:</b> {current.negative}<SpeakButton text={current.negative} /></div><div><b>Question:</b> {current.question}<SpeakButton text={current.question} /></div></div></div><div className="tense-clues"><span>CLUE WORDS</span>{current.clues.map(clue => <b key={clue}>{clue}</b>)}</div><div className="tense-tip"><Lightbulb size={17} /><p><strong>Easy way to remember:</strong> {current.tip}</p></div><div className="tense-practice"><span>QUICK CHECK</span><p>Which sentence shows <strong>{current.name}</strong>?</p>{answers.map(answer => <button key={answer} className={practice === answer ? answer === current.example ? "correct" : "incorrect" : ""} onClick={() => setPractice(answer)}>{answer}</button>)}</div></article></div>
  </div>;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("shelf"); const [category, setCategory] = useState("All words"); const [query, setQuery] = useState(""); const [learnedWords, setLearnedWords] = useState<string[]>(() => JSON.parse(localStorage.getItem("vocab-learned") || "[]")); const [streak] = useState(4);
  const filtered = useMemo(() => WORDS.filter(w => (category === "All words" || w.cat === category) && (`${w.w} ${w.m} ${w.cat}`.toLowerCase().includes(query.toLowerCase()))), [category, query]);
  const markLearned = (w: string) => setLearnedWords(prev => { const next = prev.includes(w) ? prev : [...prev, w]; localStorage.setItem("vocab-learned", JSON.stringify(next)); return next; });
  const finishQuiz = (score: number) => { toast.success(`Quiz complete — ${score}/5 correct`, { description: score >= 4 ? "Your word sense is getting sharp." : "Good practice. The shelf is here when you want a review." }); setMode("shelf"); };
  return <div className="app-shell"><ProgressRail mode={mode} setMode={setMode} learned={learnedWords.length} streak={streak} /><main className="main-canvas"><Header mode={mode} setMode={setMode} />{mode === "shelf" && <Shelf words={filtered} category={category} setCategory={setCategory} query={query} setQuery={setQuery} setMode={setMode} learned={learnedWords.length} markLearned={markLearned} />}{mode === "flashcards" && <Flashcards words={filtered.length ? filtered : WORDS} markLearned={markLearned} />}{mode === "quiz" && <Quiz words={filtered.length >= 5 ? filtered : WORDS} onFinish={finishQuiz} markLearned={markLearned} />}{mode === "tenses" && <TensesView />}<footer className="page-footer"><span>VOCAB STUDIO · A SMALL PRACTICE FOR A BIGGER VOCABULARY</span><span>{WORDS.length} words · 5 shelves · <strong>{learnedWords.length} learned</strong></span></footer></main></div>;
}

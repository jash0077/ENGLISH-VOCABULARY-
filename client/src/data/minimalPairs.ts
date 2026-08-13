export type MinimalPairQuestion = {
  id: string;
  contrast: string;
  soundA: string;
  soundB: string;
  target: string;
  options: readonly [string, string];
  correctIndex: 0 | 1;
  explanation: string;
};

const pairs = [
  ["sheep / ship", "/i/ vs /ɪ/", "sheep", "ship", "The long /i/ in sheep is held longer than the relaxed /ɪ/ in ship."],
  ["leave / live", "/i/ vs /ɪ/", "leave", "live", "Leave uses the tense long /i/; live uses the shorter /ɪ/."],
  ["bed / bad", "/ɛ/ vs /æ/", "bed", "bad", "Bed has a mid-open /ɛ/; bad has the wider, lower /æ/."],
  ["men / man", "/ɛ/ vs /æ/", "men", "man", "Men uses /ɛ/ while man uses the wider /æ/ vowel."],
  ["full / fool", "/ʊ/ vs /u/", "full", "fool", "Full has the short relaxed /ʊ/; fool has the longer rounded /u/."],
  ["pull / pool", "/ʊ/ vs /u/", "pull", "pool", "Pull uses /ʊ/ and pool uses the longer /u/ sound."],
  ["cut / cot", "/ʌ/ vs /ɑ/", "cut", "cot", "Cut uses the central /ʌ/; cot uses the open back /ɑ/ in many US accents."],
  ["luck / lock", "/ʌ/ vs /ɑ/", "luck", "lock", "Luck has the central stressed uh /ʌ/; lock has open back /ɑ/."],
  ["thin / then", "/θ/ vs /ð/", "thin", "then", "Thin begins with voiceless /θ/; then begins with voiced /ð/."],
  ["thought / fought", "/θ/ vs /f/", "thought", "fought", "Thought starts with the tongue-between-teeth /θ/; fought starts with lip-to-teeth /f/."],
  ["sip / ship", "/s/ vs /ʃ/", "sip", "ship", "Sip starts with the sharper front /s/; ship starts with the farther-back /ʃ/."],
  [" Sue / shoe", "/s/ vs /ʃ/", "Sue", "shoe", "Sue begins with /s/; shoe begins with the rounded, farther-back /ʃ/."],
  ["cheap / jeep", "/tʃ/ vs /dʒ/", "cheap", "jeep", "Cheap begins with voiceless /tʃ/; jeep begins with voiced /dʒ/."],
  ["choke / joke", "/tʃ/ vs /dʒ/", "choke", "joke", "Choke starts with /tʃ/; joke starts with the voiced /dʒ/."],
  ["fan / van", "/f/ vs /v/", "fan", "van", "Fan begins voiceless; van uses the same lip-to-teeth position with voice turned on."],
  ["rice / rise", "/s/ vs /z/", "rice", "rise", "Rice ends with voiceless /s/; rise ends with voiced /z/."],
  ["cap / cab", "/p/ vs /b/", "cap", "cab", "Cap ends with voiceless /p/; cab ends with voiced /b/."],
  ["coat / code", "/t/ vs /d/", "coat", "code", "Coat ends with voiceless /t/; code ends with voiced /d/."],
  ["light / right", "/l/ vs /r/", "light", "right", "Light begins with /l/; right begins with the American approximant /r/."],
  ["west / vest", "/w/ vs /v/", "west", "vest", "West starts with rounded-lip /w/; vest starts with lip-to-teeth /v/."],
] as const;

export const MINIMAL_PAIR_QUESTIONS: readonly MinimalPairQuestion[] = pairs.map(([contrast, sounds, soundA, soundB, explanation], index) => ({
  id: `minimal-pair-${index + 1}`,
  contrast,
  soundA,
  soundB,
  target: index % 2 === 0 ? soundA : soundB,
  options: index % 2 === 0 ? [soundA, soundB] : [soundB, soundA],
  correctIndex: index % 2 === 0 ? 0 : 1,
  explanation,
}));

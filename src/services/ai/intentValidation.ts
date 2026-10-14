// Comprehensive intent validation & gibberish detection for Ask Gather and form generation

const COMMON_ENGLISH_WORDS = new Set([
  "a", "about", "above", "add", "after", "again", "all", "also", "an", "and",
  "another", "any", "application", "apply", "are", "as", "ask", "at", "availability",
  "background", "be", "because", "been", "before", "better", "birth", "both",
  "build", "builder", "but", "by", "can", "change", "check", "choice", "clear",
  "collect", "community", "conference", "contact", "create", "current", "date",
  "delete", "describe", "description", "details", "do", "does", "dropdown",
  "edit", "education", "email", "event", "experience", "explain", "feedback",
  "field", "fields", "file", "for", "form", "forms", "from", "gather", "generate",
  "give", "good", "have", "help", "here", "hi", "how", "i", "if", "improve",
  "in", "info", "information", "input", "interests", "into", "is", "it", "item",
  "job", "label", "leadership", "like", "link", "list", "longer", "make", "many",
  "me", "message", "more", "motivation", "move", "much", "multiple", "my", "name",
  "need", "new", "no", "not", "number", "of", "off", "on", "one", "only", "open",
  "optional", "options", "or", "order", "other", "out", "people", "phone", "please",
  "portfolio", "purpose", "question", "questions", "registration", "remove",
  "reorder", "required", "role", "roles", "save", "section", "sections", "set",
  "short", "shorter", "should", "show", "simple", "single", "skills", "so",
  "some", "something", "student", "students", "summary", "survey", "tell",
  "text", "than", "that", "the", "their", "them", "then", "there", "these",
  "they", "this", "time", "title", "to", "type", "types", "undo", "update",
  "upload", "url", "user", "validate", "volunteer", "volunteers", "want", "we",
  "what", "when", "where", "which", "why", "will", "with", "wording", "work",
  "workshop", "would", "you", "your"
]);

/**
 * Detects whether a string is meaningless keyboard mash, random characters,
 * or non-word repetitions (e.g. "werwer", "sdf", "asdfgh", "qweqwe", "zxcv").
 */
export function isGibberishText(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "");
  if (!clean) return true;

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  // Single word evaluation
  if (words.length === 1) {
    const word = words[0];

    // Too short and not a known word
    if (word.length <= 4 && !COMMON_ENGLISH_WORDS.has(word)) {
      return true;
    }

    // Repeated syllable pattern: e.g. "werwer", "asdasd", "qwqw", "lalala"
    if (/^([a-z]{2,4})\1+$/i.test(word)) {
      return true;
    }

    // High consonant cluster: 4 or more consecutive consonants (e.g. "asdfgh", "bcdfgh")
    if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(word)) {
      return true;
    }

    // 3 or more repeated identical characters (e.g. "aaa", "zzzz")
    if (/([a-z])\1{2,}/i.test(word)) {
      return true;
    }

    // If single word is not in dictionary or known vocabulary
    if (!COMMON_ENGLISH_WORDS.has(word)) {
      return true;
    }
  }

  // Multi-word evaluation: if most words are not in dictionary
  const knownCount = words.filter((w) => COMMON_ENGLISH_WORDS.has(w)).length;
  if (knownCount === 0 && words.length <= 3) {
    return true;
  }

  return false;
}

/**
 * Checks if a message is a simple conversational greeting
 */
export function isGreetingText(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[!.,?]/g, "");
  const greetings = new Set([
    "hi", "hello", "hey", "hola", "howdy", "sup", "greetings",
    "good morning", "good evening", "good afternoon", "yo"
  ]);
  return greetings.has(clean);
}

/**
 * Checks if a message is an off-topic question / trivia / joke request
 */
export function isOffTopicText(text: string): boolean {
  const clean = text.trim().toLowerCase();
  const offTopicPhrases = [
    "two line dog",
    "tell me a joke",
    "what is a dog",
    "what is a cat",
    "who is",
    "what is the weather",
    "what is ux",
    "write a poem",
    "how old is",
    "capital of",
    "who won",
    "calculate",
    "solve this"
  ];
  return offTopicPhrases.some((phrase) => clean.includes(phrase));
}

/**
 * Checks if a message is an ambiguous form edit instruction
 */
export function isAmbiguousText(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[.!?,]/g, "");
  const ambiguousPhrases = new Set([
    "make it better",
    "make it good",
    "improve it",
    "change this",
    "fix it",
    "update it",
    "fix the form",
    "update the form",
    "make changes",
    "do something",
    "improve"
  ]);
  return ambiguousPhrases.has(clean);
}

/**
 * Validates whether a message is an actual valid form creation prompt
 */
export function isValidFormCreationPrompt(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (isGibberishText(clean) || isGreetingText(clean) || isOffTopicText(clean)) {
    return false;
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;

  const creationIndicators = [
    "create", "build", "generate", "make a form", "make an application",
    "need a form", "need an application", "new form", "new application",
    "application for", "form for", "registration for", "survey for", "feedback form"
  ];
  const hasCreationIndicator = creationIndicators.some((ci) => clean.includes(ci));

  const domainIndicators = [
    "volunteer", "job", "event", "conference", "workshop", "feedback",
    "registration", "membership", "scholarship", "internship", "survey",
    "intake", "evaluation", "contact", "order", "signup", "sign up", "application",
    "hiring", "candidate", "student", "community", "patient", "client", "customer",
    "experience", "skills", "availability", "questions"
  ];
  const hasDomain = domainIndicators.some((di) => clean.includes(di));

  return hasCreationIndicator || (words.length >= 4 && hasDomain);
}

/**
 * Validates whether a message is an actionable form edit instruction
 */
export function isValidFormEditInstruction(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (isGibberishText(clean) || isGreetingText(clean) || isOffTopicText(clean) || isAmbiguousText(clean)) {
    return false;
  }

  // Quick suggestions
  const knownSuggestions = [
    "add a portfolio question",
    "make these questions shorter",
    "add a leadership question",
    "make this suitable for students",
    "improve these questions",
    "remove date of birth",
    "make email optional",
    "make email required",
    "change phone number to optional",
    "move motivation before experience"
  ];
  if (knownSuggestions.includes(clean)) return true;

  const actionVerbs = [
    "add", "remove", "delete", "insert", "change", "update", "modify",
    "rename", "convert", "move", "reorder", "shorten", "expand", "require",
    "optional", "make", "set", "replace", "split", "merge"
  ];
  const formNouns = [
    "question", "questions", "section", "sections", "field", "fields",
    "input", "dropdown", "checkbox", "choice", "option", "options",
    "label", "placeholder", "title", "required", "optional", "email",
    "phone", "name", "date", "birth", "portfolio", "experience", "skills",
    "address", "resume", "description", "file", "url", "number", "text"
  ];

  const hasActionVerb = actionVerbs.some((verb) => clean.includes(verb));
  const hasFormNoun = formNouns.some((noun) => clean.includes(noun));

  return hasActionVerb && hasFormNoun;
}

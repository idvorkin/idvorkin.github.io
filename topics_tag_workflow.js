export const meta = {
  name: 'tag-all',
  description: 'Deep-dive topic card for every blog post (336): summary, tags, entities',
  phases: [{ title: 'Tag', detail: 'one agent per post -> topic card' }],
}

const URLS = ["/22", "/40yo", "/42", "/4dx", "/7-habits", "/7h-concepts", "/90days", "/Canadian-Spotting", "/Immutable-Laws-Of-Hard", "/The-Genesis-Node", "/act", "/activation", "/adblocker-trojan", "/addiction", "/advertising", "/advice", "/affirmations", "/agency", "/ai", "/ai-art", "/ai-bestie", "/ai-bm", "/ai-cockpit", "/ai-developer", "/ai-faq", "/ai-feed", "/ai-hiring", "/ai-image", "/ai-journal", "/ai-native-manager", "/ai-operator", "/ai-optimism", "/ai-paper", "/ai-relationships", "/ai-second-brain", "/ai-security", "/ai-testing", "/ai-training", "/amazon", "/anger", "/anxiety", "/anxiety-management", "/appreciate", "/ar", "/asciinema", "/ast-grep", "/awareness", "/back-pain", "/balance", "/balloon", "/bc", "/be-proactive", "/being-a-great-manager", "/bike", "/bike-tesla-identity", "/blueprint", "/bmy", "/books-that-defined-me", "/breath", "/brompton-toys", "/browsers-for-machines", "/brython", "/bucket-list", "/build-bubble-bike", "/build-life-you-want", "/cache", "/caring", "/cert-error", "/changelog", "/chapters", "/chasing-daylight", "/chop", "/chow", "/class-act", "/claw", "/coaching", "/coe", "/comp", "/content-audience", "/content-creation", "/covid", "/curious", "/d/2016-02-03-positive-computing-survey", "/d/2016-05-09-lost-interview", "/d/2016-2-14-Health-In-The-Head", "/d/2016-2-15-Seth-Godin-Notes", "/d/2016-7-14-Customer-Service", "/d/2016-8-1-Twelve-Tech-Forces", "/d/2017-07-22-vacationphotos", "/d/2017-09-10-software-rot", "/d/2017-11-04-clean-architecture", "/d/2018-02-10-you-do-want-your-favorite-app-to-be-a-service", "/d/2018-09-23-mind-lines", "/d/apollo", "/d/habits", "/d/management_interviews", "/d/resistance", "/d/where-have-all-the-bugs-gone", "/day-in-the-life", "/death", "/decisive", "/defi", "/delegate", "/depression", "/design", "/diet", "/dip", "/docker", "/e1", "/elder", "/emotional-health", "/emotional-lives", "/emotions", "/enable", "/end-in-mind", "/enemy", "/energy", "/energy-abundance", "/essentialism", "/eulogy", "/explainers", "/facebook", "/fail", "/first-things-first", "/first-understand", "/fortune-cookies", "/four-healths", "/frog", "/gap-year", "/gap-year-igor", "/gas-city", "/gas-city-home", "/genai-talk", "/get-to-yes-with-yourself", "/goals", "/google-photos", "/gpt", "/grammerly", "/grateful", "/greek-orthodox", "/groupchat", "/gtd", "/happy", "/hill-climbing", "/hobby", "/how-igor-chops", "/human-meetings", "/humans-are-underrated", "/hyper-personal", "/idle", "/igors-claws", "/insecure", "/insomnia", "/interviewsarehard", "/ios-accessibility", "/irl", "/job", "/job-hunt-stress", "/joy", "/kayak", "/kettlebell", "/keyboard", "/knee-pain", "/larry", "/last-year", "/laws-of-power", "/learn-code", "/life-as-business", "/life-journal", "/like-switch", "/lonely", "/magic", "/manager-book", "/manager-book-appendix", "/mania", "/mental-pain", "/mermaid", "/micro-economics", "/mind-at-work", "/mind-monsters", "/mitzvahs", "/ml", "/modal", "/moments", "/moments-at-work", "/monetize", "/money", "/mood", "/mortality-software", "/mosh", "/negative-mitzvahs", "/negotiate", "/neovim", "/new-skills", "/nlp", "/nurture", "/operating-manual", "/osx", "/outsourcing", "/overload", "/pandas", "/parkinson", "/partner-trouble", "/pet-projects", "/physical-health", "/physical-pain", "/planning", "/podcast", "/positive-mitzvahs", "/pride", "/process-journal", "/produce-consume", "/product", "/productive", "/prompts", "/psychic-shadows", "/psychic-weight", "/quip", "/raccoon-history", "/random-idea", "/recent", "/recommend", "/regrets", "/religion", "/remote-work", "/retire", "/roblox-dev", "/save-the-soup", "/save-the-souse", "/screencast", "/seattle", "/self-ego", "/sell", "/shame", "/sharpen-the-saw", "/shoulder-pain", "/sicp", "/side-quests", "/siy", "/sleep", "/sleeping-bag-sacrifices", "/sleight-of-mouth", "/slow", "/smilebox", "/snjb", "/software-leadership-roles", "/spiritual-health", "/stock-concentration", "/stoicism", "/strategy", "/strengths", "/structure", "/sublime", "/suicide", "/sustainable-work", "/switch", "/synergize", "/system-design", "/taas", "/taxes", "/td/alexa-skill", "/td/back_ref", "/td/better-security-design", "/td/cloud-first-applications", "/td/data-systems", "/td/dump_imessage_history", "/td/fix_ssh", "/td/hack-web", "/td/ios", "/td/ios-nomad", "/td/linqpad_from_redshift", "/td/minecraft", "/td/private_web_site", "/td/ring-video-download", "/td/slow_zsh", "/td/sqlalchemy-redshift", "/td/stats", "/td/streaks", "/td/usbtech", "/td/virtual-desktops", "/td/visual-vocabulary", "/td/windbg", "/tech-health-toys", "/tech-rituals", "/terzepatide", "/tesla", "/test-auto-sunburst", "/testing", "/the-recruiter-does-not-think-you-are-hot", "/time-traveler", "/timeoff", "/timeoff-2020-03", "/timeoff-2020-12", "/timeoff-2021-11", "/timeoff-2021-12", "/timeoff-2022-02", "/timeoff-2022-07", "/timeoff-2022-11", "/timeoff-2022-12", "/timeoff-2023-04", "/timeoff-2023-08", "/timeoff-2023-11", "/timeoff-2024-02", "/timeoff-2024-04", "/timeoff-2024-08", "/timeoff-2025-08", "/timeoff-2026-07", "/todo_enjoy", "/tools", "/tori", "/touching", "/toysfortots", "/tribe", "/untangled", "/upstream", "/vibing", "/vim", "/vim-for-writing", "/viz", "/vlc", "/voices", "/walking-with-god", "/wally", "/warm", "/weeks", "/welcome-to-holland", "/what-makes-a-leader", "/why-is-no-one-referring", "/win-win", "/words-we-dont-have", "/work-satisfaction", "/write-book", "/writing", "/y24", "/y25", "/y26"]

const CARD = {
  type: 'object',
  required: ['summary', 'tags', 'entities'],
  additionalProperties: false,
  properties: {
    summary: { type: 'string', description: '1-2 sentences: what the post is about' },
    tags: { type: 'array', items: { type: 'string' }, minItems: 6, maxItems: 12,
            description: 'lowercase-hyphenated topic tags, e.g. emotional-intelligence' },
    entities: { type: 'array', items: { type: 'string' },
                description: 'named books, people, tools, companies, concepts' },
  },
}

phase('Tag')
const cards = (await parallel(URLS.map((url) => () =>
  agent(
    `You are assigning topic tags to one blog post (permalink "${url}") on Igor's personal blog.\n\n` +
    `Get the post's cleaned text (capped at 16k chars) by running this exact command from the repo root:\n` +
    `  python3 -c "import json; print(json.load(open('tmp/topics/corpus.json'))['${url}'][:16000])"\n\n` +
    `Read that text, then return a topic card:\n` +
    `- summary: 1-2 sentences on what the post is actually about\n` +
    `- tags: 6-12 lowercase-hyphenated topic tags (e.g. emotional-intelligence, career-growth, ai-tooling)\n` +
    `- entities: named books, people, tools, companies, or concepts the post discusses\n` +
    `Tag the substance, not the format. Be consistent and reusable across posts.`,
    { label: `tag:${url}`, phase: 'Tag', schema: CARD }
  ).then((c) => (c ? { url, ...c } : null))
))).filter(Boolean)

log(`tagged ${cards.length}/${URLS.length} posts`)
return { count: cards.length, cards }
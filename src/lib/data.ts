export type StoryFace = { id: string; label: string; glyph: string }

// Nine story-dice categories. Each die shows one face per roll.
export const STORY_DICE: { name: string; faces: StoryFace[] }[] = [
  {
    name: 'Character',
    faces: [
      { id: 'knight', label: 'a weary knight', glyph: '♞' },
      { id: 'orphan', label: 'a clever orphan', glyph: '☺' },
      { id: 'witch', label: 'a reluctant witch', glyph: '✡' },
      { id: 'captain', label: 'a disgraced captain', glyph: '⚓' },
      { id: 'inventor', label: 'a mad inventor', glyph: '⚙' },
      { id: 'stranger', label: 'a masked stranger', glyph: '◈' },
    ],
  },
  {
    name: 'Setting',
    faces: [
      { id: 'lighthouse', label: 'a storm-battered lighthouse', glyph: '✇' },
      { id: 'market', label: 'a floating night market', glyph: '⌂' },
      { id: 'ruins', label: 'sunken ruins', glyph: '⛪' },
      { id: 'train', label: 'a train that never stops', glyph: '✈' },
      { id: 'forest', label: 'a forest of glass trees', glyph: '⚘' },
      { id: 'station', label: 'an abandoned space station', glyph: '✦' },
    ],
  },
  {
    name: 'Object',
    faces: [
      { id: 'key', label: 'a key with no lock', glyph: '⚷' },
      { id: 'map', label: 'a map that redraws itself', glyph: '⚑' },
      { id: 'clock', label: 'a clock running backward', glyph: '⏱' },
      { id: 'letter', label: 'an unopened letter', glyph: '✉' },
      { id: 'mirror', label: 'a mirror that lies', glyph: '◫' },
      { id: 'lantern', label: 'a lantern that burns cold', glyph: '☀' },
    ],
  },
  {
    name: 'Goal',
    faces: [
      { id: 'find', label: 'must find someone lost', glyph: '⌖' },
      { id: 'escape', label: 'must escape before dawn', glyph: '↯' },
      { id: 'protect', label: 'must protect a secret', glyph: '⛨' },
      { id: 'undo', label: 'must undo a mistake', glyph: '↺' },
      { id: 'deliver', label: 'must deliver a warning', glyph: '✉' },
      { id: 'prove', label: 'must prove the truth', glyph: '⚖' },
    ],
  },
  {
    name: 'Obstacle',
    faces: [
      { id: 'storm', label: 'a gathering storm', glyph: '⛈' },
      { id: 'betrayal', label: 'a friend’s betrayal', glyph: '⚔' },
      { id: 'curse', label: 'an old curse', glyph: '☠' },
      { id: 'clock2', label: 'a shrinking deadline', glyph: '⌛' },
      { id: 'rival', label: 'a cunning rival', glyph: '♚' },
      { id: 'silence', label: 'a wall of silence', glyph: 'ᴑ0' },
    ],
  },
  {
    name: 'Mood',
    faces: [
      { id: 'eerie', label: 'eerie and hushed', glyph: '☽' },
      { id: 'joyful', label: 'defiantly joyful', glyph: '☀' },
      { id: 'tense', label: 'wire-tight tense', glyph: '⚡' },
      { id: 'tender', label: 'aching and tender', glyph: '❤' },
      { id: 'absurd', label: 'gleefully absurd', glyph: '❤' },
      { id: 'melancholy', label: 'soft melancholy', glyph: '☁' },
    ],
  },
  {
    name: 'Twist',
    faces: [
      { id: 'notdead', label: 'the dead aren’t dead', glyph: '☥' },
      { id: 'ally', label: 'the enemy is an ally', glyph: '⚜' },
      { id: 'dream', label: 'none of it was real', glyph: '☾' },
      { id: 'price', label: 'success has a price', glyph: '⚖' },
      { id: 'double', label: 'there are two of them', glyph: '⚛' },
      { id: 'gift', label: 'the curse was a gift', glyph: '❀' },
    ],
  },
  {
    name: 'Sense',
    faces: [
      { id: 'smell', label: 'the smell of rain on stone', glyph: '☁' },
      { id: 'sound', label: 'a distant bell', glyph: 'ὑ4' },
      { id: 'taste', label: 'the taste of iron', glyph: '☢' },
      { id: 'touch', label: 'cold glass underfoot', glyph: '❄' },
      { id: 'sight', label: 'light through torn cloth', glyph: '☀' },
      { id: 'quiet', label: 'a silence too complete', glyph: '○' },
    ],
  },
  {
    name: 'Wildcard',
    faces: [
      { id: 'door', label: 'a door appears', glyph: '⌸' },
      { id: 'song', label: 'a song no one wrote', glyph: '♫' },
      { id: 'guest', label: 'an uninvited guest', glyph: '☗' },
      { id: 'debt', label: 'an old debt comes due', glyph: '⛀' },
      { id: 'weather', label: 'the weather changes sides', glyph: '☂' },
      { id: 'name', label: 'someone remembers your name', glyph: '✎' },
    ],
  },
]

// Would-you-rather dilemmas.
export const WYR: [string, string][] = [
  ['always know when someone is lying', 'always get away with lying yourself'],
  ['relive the same great day forever', 'live every day new but forget it by night'],
  ['speak every language but never read', 'read every language but never speak'],
  ['be invisible for a day', 'be able to fly for a day'],
  ['have a rewind button for your life', 'have a pause button for the world'],
  ['know how you die', 'know when you die'],
  ['be famous but never rich', 'be rich but never known'],
  ['teleport but only to places you’ve been', 'time-travel but only to watch'],
  ['always have to tell the truth', 'never be believed'],
  ['lose all your old memories', 'never make new ones'],
  ['control fire but never feel warm', 'control water but never feel thirst'],
  ['hear everyone’s thoughts for an hour', 'have everyone hear yours for a minute'],
]

// This-or-that quickfire pairs.
export const THIS_OR_THAT: [string, string][] = [
  ['Mountains', 'Ocean'],
  ['Sunrise', 'Sunset'],
  ['Coffee', 'Tea'],
  ['Books', 'Films'],
  ['Cats', 'Dogs'],
  ['City', 'Countryside'],
  ['Sweet', 'Savoury'],
  ['Early bird', 'Night owl'],
  ['Plan it', 'Wing it'],
  ['Window seat', 'Aisle seat'],
  ['Handwritten', 'Typed'],
  ['Rain', 'Snow'],
  ['Fiction', 'True stories'],
  ['Call', 'Text'],
  ['Comedy', 'Drama'],
  ['Spicy', 'Mild'],
]

// Writing-prompt fragments recombined into a single-line prompt.
export const PROMPT_PARTS = {
  opener: [
    'Write about the last',
    'Tell the story of the first',
    'Describe a world where',
    'Begin with a character who',
    'Imagine a town in which',
    'Open on the morning after',
  ],
  subject: [
    'lighthouse keeper on Earth',
    'lie ever told',
    'gravity works only on Tuesdays',
    'can taste other people’s memories',
    'everyone shares one dream',
    'a war nobody won',
  ],
  turn: [
    'until a letter arrives.',
    'and it changes everything.',
    'but no one believes it.',
    'the day the sky went quiet.',
    'when the maps stopped matching.',
    'and the clocks all struck thirteen.',
  ],
}

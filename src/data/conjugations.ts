export const persons = ['yo', 'tú', 'él/ella/usted', 'nosotros/as', 'vosotros/as', 'ellos/ellas/ustedes'] as const
export type Person = (typeof persons)[number]

export const tenses = [
  { id: 'presente', label: 'Presente de indicativo' },
  { id: 'preterito', label: 'Pretérito indefinido' },
  { id: 'imperfecto', label: 'Pretérito imperfecto' },
  { id: 'futuro', label: 'Futuro simple' },
  { id: 'condicional', label: 'Condicional simple' },
  { id: 'perfecto', label: 'Pretérito perfecto compuesto' },
  { id: 'subjuntivo', label: 'Presente de subjuntivo' },
  { id: 'subjuntivoImperfecto', label: 'Imperfecto de subjuntivo' },
] as const
export type TenseId = (typeof tenses)[number]['id']

type Verb = {
  infinitive: string
  hint: string
  irregular: boolean
  present?: string[]
  preterite?: string[]
  imperfect?: string[]
  futureStem?: string
  participle?: string
  subjunctive?: string[]
  imperfectSubjStem?: string
}

export const verbs: Verb[] = [
  { infinitive: 'ser', hint: 'Identidad o característica', irregular: true, present: ['soy','eres','es','somos','sois','son'], preterite: ['fui','fuiste','fue','fuimos','fuisteis','fueron'], imperfect: ['era','eras','era','éramos','erais','eran'], participle: 'sido', subjunctive: ['sea','seas','sea','seamos','seáis','sean'], imperfectSubjStem: 'fue' },
  { infinitive: 'estar', hint: 'Estado o ubicación', irregular: true, present: ['estoy','estás','está','estamos','estáis','están'], preterite: ['estuve','estuviste','estuvo','estuvimos','estuvisteis','estuvieron'], subjunctive: ['esté','estés','esté','estemos','estéis','estén'], imperfectSubjStem: 'estuvie' },
  { infinitive: 'tener', hint: 'Poseer o experimentar', irregular: true, present: ['tengo','tienes','tiene','tenemos','tenéis','tienen'], preterite: ['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'], futureStem: 'tendr', subjunctive: ['tenga','tengas','tenga','tengamos','tengáis','tengan'], imperfectSubjStem: 'tuvie' },
  { infinitive: 'ir', hint: 'Desplazarse a un lugar', irregular: true, present: ['voy','vas','va','vamos','vais','van'], preterite: ['fui','fuiste','fue','fuimos','fuisteis','fueron'], imperfect: ['iba','ibas','iba','íbamos','ibais','iban'], participle: 'ido', subjunctive: ['vaya','vayas','vaya','vayamos','vayáis','vayan'], imperfectSubjStem: 'fue' },
  { infinitive: 'hacer', hint: 'Realizar o crear', irregular: true, present: ['hago','haces','hace','hacemos','hacéis','hacen'], preterite: ['hice','hiciste','hizo','hicimos','hicisteis','hicieron'], futureStem: 'har', participle: 'hecho', subjunctive: ['haga','hagas','haga','hagamos','hagáis','hagan'], imperfectSubjStem: 'hicie' },
  { infinitive: 'poder', hint: 'Tener capacidad o permiso', irregular: true, present: ['puedo','puedes','puede','podemos','podéis','pueden'], preterite: ['pude','pudiste','pudo','pudimos','pudisteis','pudieron'], futureStem: 'podr', subjunctive: ['pueda','puedas','pueda','podamos','podáis','puedan'], imperfectSubjStem: 'pudie' },
  { infinitive: 'querer', hint: 'Desear o amar', irregular: true, present: ['quiero','quieres','quiere','queremos','queréis','quieren'], preterite: ['quise','quisiste','quiso','quisimos','quisisteis','quisieron'], futureStem: 'querr', subjunctive: ['quiera','quieras','quiera','queramos','queráis','quieran'], imperfectSubjStem: 'quisie' },
  { infinitive: 'venir', hint: 'Moverse hacia aquí', irregular: true, present: ['vengo','vienes','viene','venimos','venís','vienen'], preterite: ['vine','viniste','vino','vinimos','vinisteis','vinieron'], futureStem: 'vendr', subjunctive: ['venga','vengas','venga','vengamos','vengáis','vengan'], imperfectSubjStem: 'vinie' },
  { infinitive: 'decir', hint: 'Expresar con palabras', irregular: true, present: ['digo','dices','dice','decimos','decís','dicen'], preterite: ['dije','dijiste','dijo','dijimos','dijisteis','dijeron'], futureStem: 'dir', participle: 'dicho', subjunctive: ['diga','digas','diga','digamos','digáis','digan'], imperfectSubjStem: 'dije' },
  { infinitive: 'poner', hint: 'Colocar en un lugar', irregular: true, present: ['pongo','pones','pone','ponemos','ponéis','ponen'], preterite: ['puse','pusiste','puso','pusimos','pusisteis','pusieron'], futureStem: 'pondr', participle: 'puesto', subjunctive: ['ponga','pongas','ponga','pongamos','pongáis','pongan'], imperfectSubjStem: 'pusie' },
  { infinitive: 'salir', hint: 'Ir de dentro hacia fuera', irregular: true, present: ['salgo','sales','sale','salimos','salís','salen'], futureStem: 'saldr', subjunctive: ['salga','salgas','salga','salgamos','salgáis','salgan'] },
  { infinitive: 'saber', hint: 'Tener conocimiento', irregular: true, present: ['sé','sabes','sabe','sabemos','sabéis','saben'], preterite: ['supe','supiste','supo','supimos','supisteis','supieron'], futureStem: 'sabr', subjunctive: ['sepa','sepas','sepa','sepamos','sepáis','sepan'], imperfectSubjStem: 'supie' },
  { infinitive: 'dar', hint: 'Entregar u ofrecer', irregular: true, present: ['doy','das','da','damos','dais','dan'], preterite: ['di','diste','dio','dimos','disteis','dieron'], subjunctive: ['dé','des','dé','demos','deis','den'], imperfectSubjStem: 'die' },
  { infinitive: 'ver', hint: 'Percibir con la vista', irregular: true, present: ['veo','ves','ve','vemos','veis','ven'], preterite: ['vi','viste','vio','vimos','visteis','vieron'], imperfect: ['veía','veías','veía','veíamos','veíais','veían'], participle: 'visto', subjunctive: ['vea','veas','vea','veamos','veáis','vean'], imperfectSubjStem: 'vie' },
  { infinitive: 'hablar', hint: 'Comunicarse con palabras', irregular: false },
  { infinitive: 'comer', hint: 'Tomar alimentos', irregular: false },
  { infinitive: 'vivir', hint: 'Tener vida o residir', irregular: false },
  { infinitive: 'trabajar', hint: 'Realizar una actividad profesional', irregular: false },
  { infinitive: 'aprender', hint: 'Adquirir conocimientos', irregular: false },
  { infinitive: 'escribir', hint: 'Representar palabras con letras', irregular: true, participle: 'escrito' },
]

const endings = {
  ar: {
    presente: ['o','as','a','amos','áis','an'], preterito: ['é','aste','ó','amos','asteis','aron'],
    imperfecto: ['aba','abas','aba','ábamos','abais','aban'], subjuntivo: ['e','es','e','emos','éis','en'],
  },
  er: {
    presente: ['o','es','e','emos','éis','en'], preterito: ['í','iste','ió','imos','isteis','ieron'],
    imperfecto: ['ía','ías','ía','íamos','íais','ían'], subjuntivo: ['a','as','a','amos','áis','an'],
  },
  ir: {
    presente: ['o','es','e','imos','ís','en'], preterito: ['í','iste','ió','imos','isteis','ieron'],
    imperfecto: ['ía','ías','ía','íamos','íais','ían'], subjuntivo: ['a','as','a','amos','áis','an'],
  },
} as const

const futureEndings = ['é','ás','á','emos','éis','án']
const conditionalEndings = ['ía','ías','ía','íamos','íais','ían']
const haber = ['he','has','ha','hemos','habéis','han']

function accentLastVowel(value: string) {
  const index = Math.max(...['a','e','i','o','u'].map((letter) => value.lastIndexOf(letter)))
  const accents: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' }
  return index < 0 ? value : `${value.slice(0, index)}${accents[value[index]]}${value.slice(index + 1)}`
}

export function conjugate(infinitive: string, tense: TenseId, personIndex: number): string[] {
  const verb = verbs.find((item) => item.infinitive === infinitive)
  if (!verb || personIndex < 0 || personIndex > 5) return []
  const group = infinitive.slice(-2) as 'ar' | 'er' | 'ir'
  const stem = infinitive.slice(0, -2)
  if (tense === 'presente') return [verb.present?.[personIndex] ?? stem + endings[group].presente[personIndex]]
  if (tense === 'preterito') return [verb.preterite?.[personIndex] ?? stem + endings[group].preterito[personIndex]]
  if (tense === 'imperfecto') return [verb.imperfect?.[personIndex] ?? stem + endings[group].imperfecto[personIndex]]
  if (tense === 'futuro') return [(verb.futureStem ?? infinitive) + futureEndings[personIndex]]
  if (tense === 'condicional') return [(verb.futureStem ?? infinitive) + conditionalEndings[personIndex]]
  if (tense === 'perfecto') {
    const participle = verb.participle ?? stem + (group === 'ar' ? 'ado' : 'ido')
    return [`${haber[personIndex]} ${participle}`]
  }
  if (tense === 'subjuntivo') return [verb.subjunctive?.[personIndex] ?? stem + endings[group].subjuntivo[personIndex]]
  const preteritePlural = verb.preterite?.[5] ?? stem + endings[group].preterito[5]
  const imperfectStem = verb.imperfectSubjStem ?? preteritePlural.slice(0, -3)
  const ra = ['ra','ras','ra','ramos','rais','ran']
  const se = ['se','ses','se','semos','seis','sen']
  const base = personIndex === 3 ? accentLastVowel(imperfectStem) : imperfectStem
  return [base + ra[personIndex], base + se[personIndex]]
}

export type VerbQuestion = { verb: string; tense: TenseId; personIndex: number; answers: string[] }

export function makeVerbQuestions(selectedVerbs: string[], selectedTenses: TenseId[], selectedPersons: number[]) {
  return selectedVerbs.flatMap((verb) => selectedTenses.flatMap((tense) => selectedPersons.map((personIndex) => ({
    verb, tense, personIndex, answers: conjugate(verb, tense, personIndex),
  })))).filter((question) => question.answers.length > 0)
}

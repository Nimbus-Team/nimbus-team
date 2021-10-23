const prepositions  = [
    'a',
    'ante',
    'bajo',
    'cabe',
    'con',
    'contra',
    'de',
    'desde',
    'durante',
    'en',
    'entre',
    'hacia',
    'hasta',
    'mediante',
    'para',
    'por',
    'según',
    'sin',
    'so',
    'sobre',
    'tras',
    'versus',
    'vía'
]

const articles = [
    'al',
    'del',
    'el',
    'la',
    'las',
    'le',
    'les',
    'hay',
    'te',
    'los',
    'lo',
    'es',
    'me',
    'mi',
    'se',
    'que',
    'qué',
    'cual',
    'ni',
    'un',
    'una',
    'tu',
    'su',
    'sus',
    'son',
    'co'
]

const special_words = ['https', 'rt'];

module.exports = [...prepositions, ...articles, ...special_words];

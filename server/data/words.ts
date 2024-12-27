interface WordCategories {
  [key: string]: string[];
}

export const WORD_CATEGORIES: WordCategories = {
  HAYVANLAR: [
    'ASLAN',
    'KÖPEK',
    'KEDİ',
    'PENGUEN',
    'ZÜRAFA',
    'KAPLAN',
    'KARTAL',
    'PANDA',
    'TİMSAH',
    'MAYMUN'
  ],
  FUTBOLCULAR: [
    'RONALDO',
    'MESSİ',
    'HAALAND',
    'MÜLLER',
    'MBAPPE',
    'NEYMAR',
    'LEWANDOWSKI',
    'MODRIC',
    'BENZEMA',
    'SALAH'
  ],
  ÜLKELER: [
    'TÜRKİYE',
    'JAPONYA',
    'BREZİLYA',
    'FRANSA',
    'İTALYA',
    'İSPANYA',
    'ALMANYA',
    'PORTEKİZ',
    'ARJANTİN',
    'HIRVATİSTAN'
  ],
  MESLEKLER: [
    'DOKTOR',
    'ÖĞRETMEN',
    'AŞÇI',
    'MÜHENDİS',
    'PİLOT',
    'AVUKAT',
    'DİŞÇİ',
    'BERBER',
    'ŞOFÖR',
    'POLİS'
  ]
}

export const getRandomWord = (category: string): string => {
  const words = WORD_CATEGORIES[category];
  return words[Math.floor(Math.random() * words.length)];
} 
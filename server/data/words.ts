export const WORD_CATEGORIES = {
  HAYVANLAR: [
    'ASLAN', 'KAPLAN', 'ZEBRA', 'FİL', 'ZÜRAFA', 'PENGUEN', 'KANGURU',
    'KOALA', 'PANDA', 'MAYMUN', 'TİMSAH', 'YILAN', 'KARTAL', 'PAPAĞAN'
  ],
  MESLEKLER: [
    'DOKTOR', 'ÖĞRETMEN', 'MÜHENDİS', 'AVUKAT', 'AŞÇI', 'POLİS',
    'İTFAİYECİ', 'BERBER', 'ŞOFÖR', 'GARSON', 'PİLOT', 'HEMŞİRE'
  ],
  MEYVELER: [
    'ELMA', 'ARMUT', 'MUZ', 'PORTAKAL', 'MANDALİNA', 'ÇİLEK', 'KARPUZ',
    'KAVUN', 'ÜZÜM', 'KİRAZ', 'VİŞNE', 'ŞEFTALİ', 'KAYISI'
  ],
  ÜLKELER: [
    'TÜRKİYE', 'ALMANYA', 'FRANSA', 'İTALYA', 'İSPANYA', 'İNGİLTERE',
    'JAPONYA', 'BREZİLYA', 'ARJANTİN', 'KANADA', 'MISIR', 'ÇİN'
  ]
}

export const getRandomCategory = (): string => {
  const categories = Object.keys(WORD_CATEGORIES)
  return categories[Math.floor(Math.random() * categories.length)]
}

export const getRandomWord = (category: string): string => {
  const words = WORD_CATEGORIES[category as keyof typeof WORD_CATEGORIES]
  return words[Math.floor(Math.random() * words.length)]
} 
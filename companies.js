// المصنعية بالجنيه لكل جرام (أرقام تقديرية - عدّلها بالحقيقية)
const companies = [
  { name: 'BTC',          gold: 60, silver: 5 },
  { name: 'ElGalla Gold', gold: 55, silver: 5 },
  { name: 'GFG',          gold: 60, silver: 5 },
  { name: 'Gold ERA',     gold: 55, silver: 5 },
  { name: 'MB Gold',      gold: 60, silver: 5 },
  { name: 'ME GOLD',      gold: 55, silver: 5 },
  { name: 'SAM',          gold: 50, silver: 5 },
  { name: 'Selema',       gold: 60, silver: 5 },
  { name: 'Swiss Gold',   gold: 65, silver: 5 }
];

const barWeights = {
  gold:   [1, 2.5, 5, 10, 20, 31.1],
  silver: [5, 10, 20, 50, 100, 1000]
};

function barLabel(w) {
  return w >= 1000 ? (w / 1000) + ' كيلو' : w + ' جرام';
}

// سعر السبيكة = (سعر الجرام + مصنعية الشركة) × الوزن
function barTotal(metal, companyIndex, grams) {
  const base = metal === 'gold' ? price24 : silver999;
  return (base + companies[companyIndex][metal]) * grams;
}
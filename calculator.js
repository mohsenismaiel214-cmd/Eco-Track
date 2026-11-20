// ===== حاسبة العملات =====
const codes = ['EGP', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'KWD', 'CHF', 'CNY'];
const fromSel = document.getElementById('from');
const toSel   = document.getElementById('to');

codes.forEach(code => {
  fromSel.add(new Option(code, code));
  toSel.add(new Option(code, code));
});
fromSel.value = 'USD';
toSel.value   = 'EGP';

document.getElementById('convert-btn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('amount').value);
  const out = document.getElementById('currency-result');

  if (isNaN(amount) || amount < 0) { out.textContent = 'اكتب مبلغ صحيح'; return; }

  const inUsd  = amount / market.rates[fromSel.value];
  const result = inUsd * market.rates[toSel.value];
  out.textContent = `${fmt(amount, 2)} ${fromSel.value} = ${fmt(result, 2)} ${toSel.value}`;
});

// ===== حاسبة الذهب =====
document.getElementById('gold-btn').addEventListener('click', () => {
  const grams = parseFloat(document.getElementById('grams').value);
  const karat = parseInt(document.getElementById('karat').value);
  const out   = document.getElementById('gold-result');

  if (isNaN(grams) || grams <= 0) { out.textContent = 'اكتب وزن صحيح'; return; }
  out.textContent = `${fmt(grams, 2)} جرام عيار ${karat} = ${fmt(karatPrice(karat) * grams)} جنيه`;
});

// ===== حاسبة السبائك =====
const barMetal   = document.getElementById('bar-metal');
const barCompany = document.getElementById('bar-company');
const barWeight  = document.getElementById('bar-weight');

companies.forEach((c, i) => barCompany.add(new Option(c.name, i)));

function fillWeights() {
  barWeight.innerHTML = '';
  barWeights[barMetal.value].forEach(w => barWeight.add(new Option(barLabel(w), w)));
}
barMetal.addEventListener('change', fillWeights);
fillWeights();

document.getElementById('bar-btn').addEventListener('click', () => {
  const w = parseFloat(barWeight.value);
  const total = barTotal(barMetal.value, parseInt(barCompany.value), w);
  document.getElementById('bar-result').textContent =
    `سبيكة ${barLabel(w)} من ${companies[barCompany.value].name} = ${fmt(total)} جنيه`;
});
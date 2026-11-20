const currencies = [
  { code: 'USD', name: 'دولار أمريكي',  flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو',          flag: '🇪🇺' },
  { code: 'GBP', name: 'جنيه إسترليني', flag: '🇬🇧' },
  { code: 'SAR', name: 'ريال سعودي',    flag: '🇸🇦' },
  { code: 'AED', name: 'درهم إماراتي',  flag: '🇦🇪' },
  { code: 'KWD', name: 'دينار كويتي',   flag: '🇰🇼' },
  { code: 'CHF', name: 'فرنك سويسري',   flag: '🇨🇭' },
  { code: 'CNY', name: 'يوان صيني',     flag: '🇨🇳' }
];

const grid = document.getElementById('currency-grid');

onPrices(m => {
  grid.innerHTML = currencies.map(c => {
    // سعر العملة بالجنيه = سعر الجنيه ÷ سعر العملة (كلهم مقابل الدولار)
    const inEgp = m.rates.EGP / m.rates[c.code];
    return `
      <div class="card">
        <h2>${c.flag} ${c.name}</h2>
        <p class="price">${fmt(inEgp, 2)}</p>
        <span>جنيه مصري</span>
      </div>`;
  }).join('');

  document.getElementById('update-time').textContent = m.ratesLive
    ? 'آخر تحديث للعملات: ' + new Date(m.ratesTime).toLocaleString('ar-EG')
    : 'أسعار تقريبية (تعذر التحديث الحي)';
});
// مصنعية سبيكة الفضة بالجنيه لكل جرام (تقديري)
const silverBarFee = 5;
const silverWeights = [5, 10, 20, 50, 100, 1000];

onPrices(() => {
  [999, 925, 800].forEach(p => {
    document.getElementById('s' + p).textContent = fmt(silverPrice(p), 2);
    document.getElementById('b' + p).textContent = fmt(silverBuy(p), 2);
  });

  document.getElementById('bar-fee-note').textContent =
    `المصنعية التقديرية ${silverBarFee} جنيه / جرام`;

  document.getElementById('silver-bars').innerHTML = silverWeights.map(w => {
    const total = (silver999 + silverBarFee) * w;
    const label = w >= 1000 ? (w / 1000) + ' كيلو' : w + ' جرام';
    return `
      <div class="bar-card">
        <i class="fa-solid fa-cubes"></i>
        <h3>سبيكة ${label}</h3>
        <p class="price">${fmt(total)}</p>
        <span>جنيه</span>
      </div>`;
  }).join('');
});
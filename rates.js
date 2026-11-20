// لو الـ API فشل، بنستخدم الأسعار دي (مقابل الدولار) - عدّلها بالتقريب
const fallbackRates = {
  USD: 1, EGP: 48.5, EUR: 0.92, GBP: 0.79,
  SAR: 3.75, AED: 3.67, KWD: 0.31
};

// بترجّع { rates, live }  (live = true لو الأسعار حية)
async function getRates() {
  try {
    const res  = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data.result === 'success') {
      return { rates: data.rates, live: true };
    }
  } catch (err) {
    console.error('تعذر جلب الأسعار:', err);
  }
  return { rates: fallbackRates, live: false };
}
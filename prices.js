// ===== إعدادات (عدّلها هنا) =====
const CONFIG = {
  REFRESH_SECONDS: 30,          // تحديث الذهب والفضة (الـ API بيطلب 30 على الأقل)
  RATES_REFRESH_SECONDS: 300,   // تحديث العملات
  GOLD_PREMIUM: 1.046,          // فرق السوق المحلي للذهب (+4.6%)
  GOLD_BUY_DISCOUNT: 0.0053,    // الشراء أقل من البيع
  SILVER_PREMIUM: 1.09,         // فرق السوق المحلي للفضة (+9%)
  SILVER_BUY_DISCOUNT: 0.05,
  // أسعار احتياطية لو الـ API فشل (عدّلها بأرقام قريبة)
  FALLBACK_GOLD24: 6440,
  FALLBACK_SILVER999: 79,
  FALLBACK_RATES: {   // مقابل الدولار
    USD: 1, EGP: 53.85, EUR: 0.908, GBP: 0.759, SAR: 3.75,
    AED: 3.673, KWD: 0.309, CHF: 0.842, CNY: 6.665
  }
};

// الأسعار الحالية (بيع)
let price24   = CONFIG.FALLBACK_GOLD24;      // جرام ذهب 24
let silver999 = CONFIG.FALLBACK_SILVER999;   // جرام فضة 999
let goldLive  = false;

const market = {
  rates: { ...CONFIG.FALLBACK_RATES },
  ratesTime: 0,
  ratesLive: false,
  ounceGold: 0,
  ounceSilver: 0,
  lastUpdate: 0,
  problems: [],
  firstDone: false
};

// ===== دوال مساعدة =====
function fmt(n, digits = 0) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}
function karatPrice(k)   { return price24 * k / 24; }
function karatBuy(k)     { return karatPrice(k) * (1 - CONFIG.GOLD_BUY_DISCOUNT); }
function silverPrice(p)  { return silver999 * p / 999; }
function silverBuy(p)    { return silverPrice(p) * (1 - CONFIG.SILVER_BUY_DISCOUNT); }

// ===== الصفحات بتسجّل نفسها هنا وبتتنادى مع كل تحديث =====
const listeners = [];
function onPrices(fn) {
  listeners.push(fn);
  fn(market);                       // اعرض الأرقام الحالية فوراً
}
function emit() {
  listeners.forEach(fn => fn(market));
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

let busy = false;
async function update() {
  if (busy) return;
  busy = true;
  const problems = [];

  // العملات (كل 5 دقايق)
  if (Date.now() - market.ratesTime > CONFIG.RATES_REFRESH_SECONDS * 1000) {
    try {
      const fx = await getJson('https://open.er-api.com/v6/latest/USD');
      if (fx.rates && fx.rates.EGP > 0) {
        market.rates = fx.rates;
        market.ratesTime = Date.now();
        market.ratesLive = true;
      }
    } catch (e) { problems.push('العملات: ' + e.message); }
  }
  const usdEgp = market.rates.EGP;

  // الذهب والفضة (أونصة بالدولار)
  const [g, s] = await Promise.allSettled([
    getJson('https://api.gold-api.com/price/XAU'),
    getJson('https://api.gold-api.com/price/XAG')
  ]);

  if (g.status === 'fulfilled' && g.value.price > 0) {
    market.ounceGold = g.value.price;
    price24 = (g.value.price / 31.1035) * usdEgp * CONFIG.GOLD_PREMIUM;
    goldLive = true;
    market.lastUpdate = Date.now();
  } else {
    problems.push('الذهب: ' + (g.reason ? g.reason.message : 'رد غير صالح'));
  }

  if (s.status === 'fulfilled' && s.value.price > 0) {
    market.ounceSilver = s.value.price;
    silver999 = (s.value.price / 31.1035) * usdEgp * CONFIG.SILVER_PREMIUM;
  } else {
    problems.push('الفضة: ' + (s.reason ? s.reason.message : 'رد غير صالح'));
  }

  market.problems = problems;
  market.firstDone = true;
  busy = false;
  emit();
}

// نص الحالة
function statusText() {
  if (!market.lastUpdate) {
    return market.problems.length
      ? 'سعر تقريبي (تعذر التحديث الحي): ' + market.problems.join(' | ')
      : 'جاري تحميل السعر الحي...';
  }
  const secs = Math.round((Date.now() - market.lastUpdate) / 1000);
  return `سعر حي | آخر تحديث منذ ${secs} ثانية`;
}
const goldStatusText = statusText;   // للصفحات القديمة

// ===== التشغيل =====
const firstLoad = update();
setInterval(update, CONFIG.REFRESH_SECONDS * 1000);

// بيحدّث نص الحالة كل ثانية
setInterval(() => {
  const t = statusText();
  document.querySelectorAll('.live-status, #gold-date, #bars-status, #silver-date')
    .forEach(el => { el.textContent = t; });
}, 1000);

function loadPrices() { return firstLoad; }   // للصفحات القديمة
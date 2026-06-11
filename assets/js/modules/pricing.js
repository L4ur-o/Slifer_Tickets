const BASE_PRICE = 189.90;

const COUPONS = {
  darkmagician: { discount: 0.10, label: 'Dark Magician — 10% off' },
  redeyes:      { discount: 0.20, label: 'Red-Eyes B. Dragon — 20% off' },
  yubel:        { discount: 0.50, label: 'Yubel — 50% off' },
};

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function initPricing() {
  const couponInput  = document.getElementById('coupon-input');
  const applyBtn     = document.getElementById('coupon-apply');
  const couponMsg    = document.getElementById('coupon-msg');
  const totalEl      = document.getElementById('price-total');
  const originalEl   = document.getElementById('price-original');
  const discountEl   = document.getElementById('price-discount');
  const discountRow  = document.getElementById('price-discount-row');

  let activeCoupon    = null;
  let passengersCount = 1;
  let tripType        = 'ida';

  function multiplier() { return tripType === 'ida-volta' ? 2 : 1; }
  function subtotal()   { return BASE_PRICE * passengersCount * multiplier(); }

  function render() {
    const sub   = subtotal();
    const disc  = activeCoupon ? sub * activeCoupon.discount : 0;
    const total = sub - disc;
    originalEl.textContent = formatBRL(sub);
    totalEl.textContent    = formatBRL(total);
    if (disc > 0) {
      discountEl.textContent    = '− ' + formatBRL(disc);
      discountRow.style.display = '';
    } else {
      discountRow.style.display = 'none';
    }
  }

  function applyOrRemove() {
    if (applyBtn.textContent.trim() === 'Remover') {
      activeCoupon            = null;
      couponMsg.textContent   = '';
      couponMsg.className     = 'coupon-msg';
      couponInput.value       = '';
      couponInput.disabled    = false;
      applyBtn.textContent    = 'Aplicar';
      render();
      return;
    }

    const code  = couponInput.value.trim().toLowerCase();
    if (!code) return;
    const found = COUPONS[code];
    if (found) {
      activeCoupon              = found;
      couponMsg.textContent     = `✅ Cupom "${code}" aplicado — ${found.label}`;
      couponMsg.className       = 'coupon-msg success';
      applyBtn.textContent      = 'Remover';
      couponInput.disabled      = true;
    } else {
      couponMsg.textContent = '❌ Cupom inválido.';
      couponMsg.className   = 'coupon-msg error';
    }
    render();
  }

  applyBtn.addEventListener('click', applyOrRemove);

  couponInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); applyOrRemove(); }
  });

  document.querySelectorAll('.coupon-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (couponInput.disabled) return;
      couponInput.value = chip.dataset.code;
      applyOrRemove();
    });
  });

  render();

  return {
    update(pax, tipo) {
      passengersCount = pax;
      tripType = tipo;
      render();
    },
    getTotal() {
      const sub  = subtotal();
      const disc = activeCoupon ? sub * activeCoupon.discount : 0;
      return { total: sub - disc, original: sub, discount: disc, coupon: activeCoupon };
    },
    getBasePrice() { return BASE_PRICE; },
  };
}

export function initPassengers(getCount) {
  const container = document.getElementById('passengers-list');

  function renderCards(count) {
    const existing = container.querySelectorAll('.passenger-card');
    const current  = existing.length;

    if (count > current) {
      for (let i = current; i < count; i++) {
        const card = document.createElement('div');
        card.className = 'passenger-card';
        card.setAttribute('data-index', i);
        card.innerHTML = `
          <div class="passenger-card-header">
            <span class="passenger-badge">${i + 1}º passageiro</span>
          </div>
          <div class="field-row">
            <div class="field-group">
              <label for="pax-nome-${i}">
                <span class="field-icon">👤</span> Nome completo
              </label>
              <div class="input-wrapper">
                <input type="text" id="pax-nome-${i}" placeholder="Nome do passageiro" autocomplete="off" required>
              </div>
            </div>
            <div class="field-group">
              <label for="pax-cpf-${i}">
                <span class="field-icon">🪪</span> CPF
              </label>
              <div class="input-wrapper">
                <input type="text" id="pax-cpf-${i}" placeholder="000.000.000-00" maxlength="14" autocomplete="off" required>
              </div>
            </div>
          </div>
        `;

        const cpfInput = card.querySelector(`#pax-cpf-${i}`);
        cpfInput.addEventListener('input', () => {
          let v = cpfInput.value.replace(/\D/g, '').slice(0, 11);
          if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
          else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
          else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
          cpfInput.value = v;
        });

        container.appendChild(card);
      }
    } else {
      for (let i = current - 1; i >= count; i--) {
        const card = container.querySelector(`.passenger-card[data-index="${i}"]`);
        if (card) {
          card.classList.add('removing');
          card.addEventListener('animationend', () => card.remove(), { once: true });
        }
      }
    }
  }

  renderCards(1);

  return {
    sync(count) { renderCards(count); },
    collect() {
      const cards = container.querySelectorAll('.passenger-card');
      const result = [];
      for (const card of cards) {
        const idx  = card.getAttribute('data-index');
        const nome = card.querySelector(`#pax-nome-${idx}`).value.trim();
        const cpf  = card.querySelector(`#pax-cpf-${idx}`).value.trim();
        result.push({ nome, cpf });
      }
      return result;
    },
    validate() {
      const cards = container.querySelectorAll('.passenger-card');
      for (const card of cards) {
        const idx  = card.getAttribute('data-index');
        const nome = card.querySelector(`#pax-nome-${idx}`).value.trim();
        const cpf  = card.querySelector(`#pax-cpf-${idx}`).value.replace(/\D/g, '');
        if (!nome) return `Informe o nome do ${+idx + 1}º passageiro.`;
        if (cpf.length !== 11) return `CPF inválido para o ${+idx + 1}º passageiro.`;
      }
      return null;
    }
  };
}

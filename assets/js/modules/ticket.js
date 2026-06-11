function uid() {
  return 'ST' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${d} ${months[+m - 1]} ${y}`;
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function barcode() {
  const heights = [28, 20, 32, 18, 28, 22, 30, 16, 28, 20, 34, 18, 26, 22, 32, 20, 28, 16, 30, 22];
  return heights.map(h => `<span style="height:${h}px"></span>`).join('');
}

export function renderTicket({
  cidadeOrigem, ufOrigem,
  cidadeDestino, ufDestino,
  data, dataRetorno, tipo, passageiros,
  passageirosDados, preco
}) {
  const id   = uid();
  const trip = tipo === 'ida-volta' ? 'Ida e volta' : 'Somente ida';

  const paxRows = passageirosDados.map((p, i) => `
    <div class="ticket-pax-item">
      <span class="pax-num">${i + 1}</span>
      <span class="pax-nome">${p.nome}</span>
      <span class="pax-cpf">${p.cpf}</span>
    </div>
  `).join('');

  const discountRow = preco.discount > 0 ? `
    <div class="ticket-price-row discount">
      <span>Desconto (${preco.coupon ? preco.coupon.label : ''})</span>
      <span>− ${formatBRL(preco.discount)}</span>
    </div>
  ` : '';

  const ticketEl = document.getElementById('ticket-result');
  ticketEl.innerHTML = `
    <div class="ticket">
      <div class="ticket-header">
        <div class="ticket-brand">
          <div class="t-logo">🎫</div>
          <div>
            <div class="t-name">SliferTickets</div>
            <div class="t-sub">Passagem confirmada</div>
          </div>
        </div>
        <div class="ticket-status">Emitido</div>
      </div>

      <div class="ticket-body">
        <div class="ticket-route">
          <div class="route-city">
            <span class="city-code">${ufOrigem}</span>
            <span class="city-name">${cidadeOrigem}</span>
          </div>
          <div class="route-arrow">
            <div class="arrow-line">✈</div>
            <div class="trip-type">${trip}</div>
          </div>
          <div class="route-city dest">
            <span class="city-code">${ufDestino}</span>
            <span class="city-name">${cidadeDestino}</span>
          </div>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-meta">
          <div class="meta-item">
            <span class="meta-label">Partida</span>
            <span class="meta-value">${formatDate(data)}</span>
          </div>
          ${dataRetorno ? `
          <div class="meta-item">
            <span class="meta-label">Retorno</span>
            <span class="meta-value">${formatDate(dataRetorno)}</span>
          </div>` : `
          <div class="meta-item">
            <span class="meta-label">Tipo</span>
            <span class="meta-value">${trip}</span>
          </div>`}
          <div class="meta-item">
            <span class="meta-label">Passageiros</span>
            <span class="meta-value">${passageiros} pessoa${passageiros > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-pax-list">
          <div class="ticket-pax-header">
            <span>Passageiros</span>
            <span>CPF</span>
          </div>
          ${paxRows}
        </div>

        <div class="ticket-divider"></div>

        <div class="ticket-price-summary">
          <div class="ticket-price-row subtotal">
            <span>${passageiros}x ${formatBRL(preco.original / passageiros / (tipo === 'ida-volta' ? 2 : 1))}${tipo === 'ida-volta' ? ' × 2 trechos' : ''}</span>
            <span>${formatBRL(preco.original)}</span>
          </div>
          ${discountRow}
          <div class="ticket-price-row total">
            <span>Total</span>
            <span>${formatBRL(preco.total)}</span>
          </div>
        </div>
      </div>

      <div class="ticket-footer">
        <div class="ticket-id">
          <span class="id-label">Código</span>
          <span class="id-value">#${id}</span>
        </div>
        <div class="ticket-barcode">${barcode()}</div>
      </div>
    </div>
  `;

  ticketEl.classList.add('visible');
  ticketEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

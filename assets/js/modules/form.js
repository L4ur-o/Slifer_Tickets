import { toast }          from './toast.js';
import { renderTicket }   from './ticket.js';
import { initPassengers } from './passengers.js';
import { initPricing }    from './pricing.js';

export function initForm() {
  const form             = document.getElementById('ticket-form');
  const minusBtn         = document.getElementById('qty-minus');
  const plusBtn          = document.getElementById('qty-plus');
  const qtyDisplay       = document.getElementById('qty-display');
  const ticketResult     = document.getElementById('ticket-result');
  const dataRetornoGroup = document.getElementById('data-retorno-group');
  const dataInput        = document.getElementById('data');
  const dataRetornoInput = document.getElementById('data-retorno');
  const cidOrigem        = document.getElementById('cidade-origem');
  const cidDestino       = document.getElementById('cidade-destino');

  let passengers = 1;

  const paxManager = initPassengers();
  const pricing    = initPricing();

  function currentTipo() {
    return document.querySelector('input[name="tipo"]:checked').value;
  }

  function updateQty() {
    qtyDisplay.textContent  = passengers;
    qtyDisplay.setAttribute('aria-label', `${passengers} passageiro${passengers > 1 ? 's' : ''}`);
    minusBtn.disabled       = passengers <= 1;
    plusBtn.disabled        = passengers >= 9;
    minusBtn.setAttribute('aria-disabled', passengers <= 1 ? 'true' : 'false');
    plusBtn.setAttribute('aria-disabled', passengers >= 9 ? 'true' : 'false');
    paxManager.sync(passengers);
    pricing.update(passengers, currentTipo());
  }

  minusBtn.addEventListener('click', () => {
    if (passengers > 1) { passengers--; updateQty(); }
  });

  plusBtn.addEventListener('click', () => {
    if (passengers < 9) { passengers++; updateQty(); }
  });

  updateQty();

  // Sincroniza aria-disabled nos selects de cidade
  document.getElementById('uf-origem').addEventListener('change', () => {
    const disabled = !document.getElementById('uf-origem').value;
    cidOrigem.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  });
  document.getElementById('uf-destino').addEventListener('change', () => {
    const disabled = !document.getElementById('uf-destino').value;
    cidDestino.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  });

  document.querySelectorAll('input[name="tipo"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isIdaVolta = radio.value === 'ida-volta';
      dataRetornoGroup.style.display  = isIdaVolta ? '' : 'none';
      dataRetornoInput.required       = isIdaVolta;
      dataRetornoInput.setAttribute('aria-required', isIdaVolta ? 'true' : 'false');
      if (!isIdaVolta) dataRetornoInput.value = '';
      // Atualiza label do botão de tema para dark/light
      pricing.update(passengers, radio.value);
    });
  });

  dataInput.addEventListener('change', () => {
    if (dataInput.value) {
      dataRetornoInput.min = dataInput.value;
      if (dataRetornoInput.value && dataRetornoInput.value < dataInput.value) {
        dataRetornoInput.value = '';
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const ufOrigem    = document.getElementById('uf-origem').value;
    const cidadeOrigem   = cidOrigem.value;
    const ufDestino   = document.getElementById('uf-destino').value;
    const cidadeDestino  = cidDestino.value;
    const data        = dataInput.value;
    const tipo        = currentTipo();
    const dataRetorno = dataRetornoInput.value;

    if (!ufOrigem || !cidadeOrigem) {
      toast('Selecione a cidade de origem.', 'error'); return;
    }
    if (!ufDestino || !cidadeDestino) {
      toast('Selecione a cidade de destino.', 'error'); return;
    }
    if (ufOrigem === ufDestino && cidadeOrigem === cidadeDestino) {
      toast('Origem e destino não podem ser iguais.', 'error'); return;
    }
    if (!data) {
      toast('Escolha a data de partida.', 'error'); return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    if (data < hoje) {
      toast('A data de partida não pode ser no passado.', 'error'); return;
    }

    if (tipo === 'ida-volta') {
      if (!dataRetorno) {
        toast('Escolha a data de retorno.', 'error'); return;
      }
      if (dataRetorno <= data) {
        toast('A data de retorno deve ser após a partida.', 'error'); return;
      }
    }

    const paxError = paxManager.validate();
    if (paxError) { toast(paxError, 'error'); return; }

    const paxData   = paxManager.collect();
    const priceData = pricing.getTotal();

    ticketResult.classList.remove('visible');
    ticketResult.innerHTML = '';

    setTimeout(() => {
      renderTicket({
        cidadeOrigem,
        ufOrigem,
        cidadeDestino,
        ufDestino,
        data,
        dataRetorno: tipo === 'ida-volta' ? dataRetorno : null,
        tipo,
        passageiros: passengers,
        passageirosDados: paxData,
        preco: priceData,
      });
      toast('Passagem emitida com sucesso!', 'success');
    }, 80);
  });
}

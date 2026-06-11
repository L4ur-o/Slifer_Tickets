import { BRASIL } from '../../css/brasil.js';

function populateUF(selectEl) {
  BRASIL.forEach(({ uf, estado }) => {
    const opt = document.createElement('option');
    opt.value = uf;
    opt.textContent = `${uf} — ${estado}`;
    selectEl.appendChild(opt);
  });
}

function populateCidades(selectEl, uf) {
  selectEl.innerHTML = '<option value="">Selecione a cidade</option>';
  selectEl.disabled = !uf;

  if (!uf) return;

  const entry = BRASIL.find(b => b.uf === uf);
  if (!entry) return;

  entry.cidades.sort().forEach(cidade => {
    const opt = document.createElement('option');
    opt.value = cidade;
    opt.textContent = cidade;
    selectEl.appendChild(opt);
  });

  selectEl.disabled = false;
}

export function initSelects() {
  const ufOrigem     = document.getElementById('uf-origem');
  const cidOrigem    = document.getElementById('cidade-origem');
  const ufDestino    = document.getElementById('uf-destino');
  const cidDestino   = document.getElementById('cidade-destino');

  [ufOrigem, ufDestino].forEach(sel => populateUF(sel));

  ufOrigem.addEventListener('change',  () => populateCidades(cidOrigem,  ufOrigem.value));
  ufDestino.addEventListener('change', () => populateCidades(cidDestino, ufDestino.value));
}

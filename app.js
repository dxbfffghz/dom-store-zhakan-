import { Store } from './Store.js';

// ---- 1. Initial data -------------------------------------------------
const store = new Store([
  { name: 'Book',     price: 4500, qty: 2 },
  { name: 'Notebook', price: 1200, qty: 5 },
]);

// ---- 2. DOM references ----------------------------------------------
const form     = document.getElementById('product-form');
const listEl   = document.getElementById('product-list');
const totalEl  = document.getElementById('total');
const emptyMsg = document.getElementById('empty-msg');

const fields = {
  name:  { input: document.getElementById('name'),  error: document.getElementById('name-error') },
  price: { input: document.getElementById('price'), error: document.getElementById('price-error') },
  qty:   { input: document.getElementById('qty'),   error: document.getElementById('qty-error') },
};

// ---- 3. Render ------------------------------------------------------
function render() {
  listEl.innerHTML = '';

  for (const item of store.items) {
    const tr = document.createElement('tr');
    tr.dataset.name = item.name;

    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${item.price.toLocaleString('ru-RU')} ₸</td>
      <td>
        <input type="number" class="qty-input" value="${item.qty}" min="1" step="1"
               data-action="update" aria-label="Quantity for ${escapeHtml(item.name)}">
      </td>
      <td>${(item.price * item.qty).toLocaleString('ru-RU')} ₸</td>
      <td>
        <button type="button" class="btn-remove" data-action="remove">Delete</button>
      </td>
    `;
    listEl.appendChild(tr);
  }

  emptyMsg.hidden = store.size > 0;
  totalEl.textContent = store.total().toLocaleString('ru-RU');
}

// ---- 4. Validation --------------------------------------------------
function clearErrors() {
  for (const { input, error } of Object.values(fields)) {
    input.classList.remove('invalid');
    error.textContent = '';
  }
}

function validate() {
  clearErrors();
  let ok = true;

  const name     = fields.name.input.value.trim();
  const priceRaw = fields.price.input.value.trim();
  const qtyRaw   = fields.qty.input.value.trim();
  const price    = Number(priceRaw);
  const qty      = Number(qtyRaw);

  if (name === '') {
    fields.name.error.textContent = 'Name cannot be empty.';
    fields.name.input.classList.add('invalid');
    ok = false;
  } else if (store.find(name)) {
    fields.name.error.textContent = 'Product with this name already exists.';
    fields.name.input.classList.add('invalid');
    ok = false;
  }

  if (priceRaw === '' || Number.isNaN(price) || price <= 0) {
    fields.price.error.textContent = 'Price must be a number greater than 0.';
    fields.price.input.classList.add('invalid');
    ok = false;
  }

  if (qtyRaw === '' || Number.isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
    fields.qty.error.textContent = 'Quantity must be a positive integer.';
    fields.qty.input.classList.add('invalid');
    ok = false;
  }

  return ok ? { name, price, qty } : null;
}

// ---- 5. Events ------------------------------------------------------
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = validate();
  if (!data) return;

  store.add(data);
  form.reset();
  clearErrors();
  render();
});

listEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-action="remove"]');
  if (!btn) return;

  const row = btn.closest('tr');
  store.remove(row.dataset.name);
  render();
});

listEl.addEventListener('change', (event) => {
  const input = event.target.closest('input[data-action="update"]');
  if (!input) return;

  const row  = input.closest('tr');
  const name = row.dataset.name;
  const qty  = Number(input.value);

  if (!Number.isInteger(qty) || qty <= 0) {
    input.value = store.find(name).qty;
    return;
  }

  store.updateQty(name, qty);
  render();
});

// ---- 6. Utility -----------------------------------------------------
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// ---- 7. First render ------------------------------------------------
render();
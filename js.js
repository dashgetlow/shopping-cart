'use strict';
const products = [
  { id: 'notebook', name: 'The Everyday Notebook', category: 'paper', description: 'A5 dotted pages · Terracotta', price: 1800, image: 'notebook', badge: 'STUDIO FAVOURITE', colours: ['#c65032', '#a5a080', '#42483e'] },
  { id: 'pencils', name: 'Ideas in Colour', category: 'desk', description: 'Set of 6 · Coloured pencils', price: 1200, image: 'pencils', badge: '', colours: ['#e05a34', '#dfb745', '#45635c'] },
  { id: 'planner', name: 'A Little More Intentional', category: 'paper', description: 'Undated weekly planner · Lilac', price: 2400, image: 'planner', badge: 'MAKE IT YOURS', colours: ['#afa0ca', '#7a9068'] },
  { id: 'cup', name: 'The Desk Companion', category: 'desk', description: 'Pencil pot · Cobalt blue', price: 2200, image: 'cup', badge: '', colours: ['#334bb1', '#dc8d52', '#dfd8c6'] }
];
const storageKey = 'studio-supply-bag-v1';
const money = value => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value / 100);
let cart = {};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const product of products) {
      if (Number.isInteger(saved[product.id]) && saved[product.id] > 0) cart[product.id] = Math.min(saved[product.id], 99);
    }
  }
} catch { /* The bag remains usable if browser storage is unavailable. */ }
const dialog = document.querySelector('#cart-dialog');
const toast = document.querySelector('#toast');
let toastTimer;
function announce(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}
function saveCart() {
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* Storage is optional. */ }
}
function renderProducts(filter = 'all') {
  const visible = products.filter(product => filter === 'all' || product.category === filter);
  document.querySelector('#product-count').textContent = `${visible.length} objects`;
  document.querySelector('#products').innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-picture">
        ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
        <img src="assets/${product.image}.svg" alt="${product.name}, ${product.description}" width="360" height="400">
        <button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>
      </div>
      <div class="product-meta"><h3>${product.name}</h3><span class="price">${money(product.price)}</span></div>
      <p class="product-description">${product.description}</p>
      <div class="swatches" aria-hidden="true">${product.colours.map(colour => `<span class="swatch" style="--swatch:${colour}"></span>`).join('')}<small>Studio palette</small></div>
    </article>`).join('');
}
function renderCart() {
  const selected = products.filter(product => cart[product.id]);
  document.querySelector('#cart-count').textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  document.querySelector('#subtotal').textContent = money(selected.reduce((sum, product) => sum + product.price * cart[product.id], 0));
  document.querySelector('#checkout').disabled = selected.length === 0;
  document.querySelector('#cart-items').innerHTML = selected.length ? selected.map(product => `
    <article class="cart-line">
      <img src="assets/${product.image}.svg" alt="" width="80" height="89">
      <div><h3>${product.name}</h3><p>${money(product.price * cart[product.id])}</p>
        <div class="quantity"><button data-change="${product.id}" data-delta="-1" aria-label="Decrease ${product.name} quantity">−</button><span aria-label="Quantity">${cart[product.id]}</span><button data-change="${product.id}" data-delta="1" aria-label="Increase ${product.name} quantity" ${cart[product.id] >= 99 ? 'disabled' : ''}>+</button></div>
      </div>
      <button class="remove" data-remove="${product.id}" aria-label="Remove ${product.name}">Remove</button>
    </article>`).join('') : '<div class="empty-bag"><span aria-hidden="true"><svg class="star-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 1v38M1 20h38M6.6 6.6l26.8 26.8M6.6 33.4L33.4 6.6"/></svg></span><h3>Room for something good.</h3><p>Your bag is empty.<br>Find a little inspiration in the collection.</p></div>';
}
document.querySelector('#products').addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const product = products.find(item => item.id === button.dataset.add);
  if ((cart[product.id] || 0) >= 99) return announce('You can add up to 99 of each object.');
  cart[product.id] = (cart[product.id] || 0) + 1;
  saveCart(); renderCart(); announce(`${product.name} added to your bag.`);
});
document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  renderProducts(button.dataset.filter);
});
document.querySelector('#cart-items').addEventListener('click', event => {
  const button = event.target.closest('[data-change], [data-remove]');
  if (!button) return;
  const id = button.dataset.change || button.dataset.remove;
  if (button.dataset.remove) delete cart[id];
  else {
    cart[id] = Math.min(99, cart[id] + Number(button.dataset.delta));
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart(); renderCart();
  const replacement = document.querySelector(`[data-change="${id}"][data-delta="${button.dataset.delta}"]`);
  (replacement && !replacement.disabled ? replacement : document.querySelector('#close-cart')).focus();
});
document.querySelector('#open-cart').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-cart').addEventListener('click', () => dialog.close());
document.querySelector('#continue-shopping').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog && event.clientX < dialog.getBoundingClientRect().left) dialog.close(); });
document.querySelector('#checkout').addEventListener('click', () => {
  if (!Object.keys(cart).length) return;
  cart = {}; saveCart(); renderCart();
  document.querySelector('#cart-items').innerHTML = '<div class="empty-bag"><span aria-hidden="true"><svg class="star-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 1v38M1 20h38M6.6 6.6l26.8 26.8M6.6 33.4L33.4 6.6"/></svg></span><h3>Good ideas are on the way.</h3><p>Your demo order is complete.<br>No payment was taken and nothing will be shipped.</p></div>';
  document.querySelector('#continue-shopping').focus();
});
renderProducts();
renderCart();

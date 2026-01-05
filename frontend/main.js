const API_URL = 'http://localhost:3001/api/products';

const listEl = document.getElementById('product-list');
const form = document.getElementById('product-form');

async function loadProducts() {
  const res = await fetch(API_URL);
  const result = await res.json();

  listEl.innerHTML = '';

  result.data.forEach(product => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
    `;
    listEl.appendChild(tr);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newProduct = {
    name: document.getElementById('name').value,
    price: Number(document.getElementById('price').value),
    stock: Number(document.getElementById('stock').value)
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });

  form.reset();
  loadProducts();
});

loadProducts();

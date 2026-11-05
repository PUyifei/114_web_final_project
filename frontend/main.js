const API_URL = 'http://localhost:3001/api/products';

const listEl = document.getElementById('product-list');
const form = document.getElementById('product-form');
const searchInput = document.getElementById('product-search');
const statusMessage = document.getElementById('status-message');
const resultsCount = document.getElementById('results-count');
const submitButton = form.querySelector('button[type="submit"]');
const products = [];
const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 2
});

function showNotice(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('error', isError);
  statusMessage.hidden = false;
}

function addCell(row, content, className = '') {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  if (content instanceof Node) {
    cell.appendChild(content);
  } else {
    cell.textContent = content;
  }
  row.appendChild(cell);
  return cell;
}

function addEmptyRow(message) {
  const row = document.createElement('tr');
  row.className = 'empty-row';
  const cell = document.createElement('td');
  cell.colSpan = 4;
  cell.textContent = message;
  row.appendChild(cell);
  listEl.appendChild(row);
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredProducts = products.filter(product =>
    product.name.toLocaleLowerCase().includes(query)
  );

  listEl.replaceChildren();

  if (!filteredProducts.length) {
    addEmptyRow(query ? '找不到符合的商品，試試其他關鍵字。' : '目前還沒有商品，新增一件商品開始管理吧。');
    resultsCount.textContent = query ? '沒有符合的商品' : '共 0 件商品';
    return;
  }

  filteredProducts.forEach(product => {
    const row = document.createElement('tr');
    const productName = document.createElement('div');
    const initial = document.createElement('span');
    const name = document.createElement('span');
    const stock = Number(product.stock) || 0;
    const badge = document.createElement('span');

    productName.className = 'product-name-cell';
    initial.className = 'product-initial';
    initial.setAttribute('aria-hidden', 'true');
    initial.textContent = product.name.trim().charAt(0) || '品';
    name.textContent = product.name;
    productName.append(initial, name);

    addCell(row, productName);
    addCell(row, currencyFormatter.format(Number(product.price) || 0), 'price-value');
    addCell(row, `${stock} 件`, 'stock-value');

    if (stock === 0) {
      badge.className = 'stock-badge out-of-stock';
      badge.textContent = '已售完';
    } else if (stock < 6) {
      badge.className = 'stock-badge low-stock';
      badge.textContent = '庫存偏低';
    } else {
      badge.className = 'stock-badge in-stock';
      badge.textContent = '庫存充足';
    }
    addCell(row, badge);
    listEl.appendChild(row);
  });

  resultsCount.textContent = query
    ? `顯示 ${filteredProducts.length} / ${products.length} 件商品`
    : `共 ${products.length} 件商品`;
}

function updateSummary() {
  const totalStock = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);
  const lowStockCount = products.filter(product => {
    const stock = Number(product.stock) || 0;
    return stock < 6;
  }).length;

  document.getElementById('total-products').textContent = products.length.toLocaleString('zh-TW');
  document.getElementById('total-stock').textContent = totalStock.toLocaleString('zh-TW');
  document.getElementById('low-stock-count').textContent = lowStockCount.toLocaleString('zh-TW');
}

async function loadProducts() {
  resultsCount.textContent = '載入商品中…';
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || '無法載入商品清單。');
    }
    if (!Array.isArray(result.data)) {
      throw new Error('商品資料格式不正確，請稍後再試。');
    }

    products.splice(0, products.length, ...result.data);
    updateSummary();
    renderProducts();
  } catch (error) {
    listEl.replaceChildren();
    addEmptyRow('暫時無法載入商品，請確認後端服務是否已啟動。');
    resultsCount.textContent = '載入失敗';
    const message = error instanceof TypeError
      ? '無法連線至商品服務，請確認後端服務是否已啟動。'
      : error.message || '無法載入商品，請稍後再試。';
    showNotice(message, true);
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = '建立中…';

  const newProduct = {
    name: document.getElementById('name').value.trim(),
    price: Number(document.getElementById('price').value),
    stock: Number(document.getElementById('stock').value || 0)
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || '商品建立失敗，請檢查填寫內容。');
    }

    form.reset();
    document.getElementById('stock').value = '0';
    showNotice('商品已成功加入清單。');
    await loadProducts();
  } catch (error) {
    const message = error instanceof TypeError
      ? '無法連線至商品服務，請確認後端服務是否已啟動。'
      : error.message || '商品建立失敗，請稍後再試。';
    showNotice(message, true);
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = '建立商品';
  }
});

searchInput.addEventListener('input', renderProducts);

loadProducts();

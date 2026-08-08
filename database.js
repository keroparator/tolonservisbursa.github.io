/**
 * BH Teknik Servis - Static Client Database Module (LocalStorage + Default Products)
 */

window.DATABASE_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Test-Ürün',
    category: 'Yedek Parçalar',
    description: 'Test-Description',
    price: 'Fiyat Alınız',
    image: 'sprites/tolon_logo.webp',
    isFeatured: true
  },
  
];

function getStoredProducts() {
  const stored = localStorage.getItem('bh_static_products');
  if (!stored) {
    localStorage.setItem('bh_static_products', JSON.stringify(window.DATABASE_PRODUCTS));
    return window.DATABASE_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('bh_static_products', JSON.stringify(window.DATABASE_PRODUCTS));
      return window.DATABASE_PRODUCTS;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('bh_static_products', JSON.stringify(window.DATABASE_PRODUCTS));
    return window.DATABASE_PRODUCTS;
  }
}

function saveStoredProducts(products) {
  localStorage.setItem('bh_static_products', JSON.stringify(products));
}

async function fetchProducts() {
  return Promise.resolve(getStoredProducts());
}

async function apiCreateProduct(productData) {
  const products = getStoredProducts();
  const newProduct = {
    id: 'prod-' + Date.now(),
    title: productData.title ? productData.title.trim() : '',
    description: productData.description ? productData.description.trim() : '',
    category: productData.category ? productData.category.trim() : 'Makineler',
    image: productData.image ? productData.image.trim() : 'sprites/logo.webp',
    isFeatured: Boolean(productData.isFeatured)
  };
  products.unshift(newProduct);
  saveStoredProducts(products);
  return Promise.resolve(newProduct);
}

async function apiUpdateProduct(id, productData) {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Ürün bulunamadı.');
  }
  const updatedProduct = {
    ...products[index],
    title: productData.title !== undefined ? productData.title.trim() : products[index].title,
    description: productData.description !== undefined ? productData.description.trim() : products[index].description,
    category: productData.category !== undefined ? productData.category.trim() : products[index].category,
    image: productData.image !== undefined ? productData.image.trim() : products[index].image,
    isFeatured: productData.isFeatured !== undefined ? Boolean(productData.isFeatured) : products[index].isFeatured
  };
  products[index] = updatedProduct;
  saveStoredProducts(products);
  return Promise.resolve(updatedProduct);
}

async function apiDeleteProduct(id) {
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  if (products.length === filtered.length) {
    throw new Error('Ürün bulunamadı.');
  }
  saveStoredProducts(filtered);
  return Promise.resolve({ success: true, id });
}

function renderProductCards(products, containerElement) {
  if (!containerElement) return;

  if (!products || products.length === 0) {
    containerElement.innerHTML = '';
    return;
  }

  containerElement.innerHTML = products.map(product => {
    const whatsappUrl = typeof getWhatsAppUrl === 'function' 
      ? getWhatsAppUrl(product.title) 
      : `https://wa.me/905510007069?text=${encodeURIComponent(product.title + ' hakkında bilgi almak istiyorum.')}`;

    const badgeHtml = product.isFeatured 
      ? `<span class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1"><svg class="fa-solid fa-star text-[9px] w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 576 512" aria-hidden="true"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.6-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg> Öne Çıkan</span>` 
      : '';

    const imgSrc = product.image || 'sprites/logo.webp';

    return `
      <div class="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden group">
        <div class="relative h-48 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
          <img src="${imgSrc}" alt="${escapeHtml(product.title)}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" onerror="this.src='sprites/logo.webp'">
          ${badgeHtml}
          <div class="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
            ${escapeHtml(product.category)}
          </div>
        </div>
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition line-clamp-2">
              ${escapeHtml(product.title)}
            </h3>
            <p class="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-3">
              ${escapeHtml(product.description)}
            </p>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100">
              Stokta Var
            </span>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shadow-sm">
              <svg class="fa-brands fa-whatsapp text-sm w-[1em] h-[1em] inline-block align-middle" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.6 66.4 14 10.6-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              <span>Teklif Al</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

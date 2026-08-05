/**
 * BH Teknik Servis - Static Client Database Module (LocalStorage + Default Products)
 */

window.DATABASE_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Tolkar Smartex HY 60 Endüstriyel Yıkama Sıkma Makinesi',
    category: 'Makineler',
    description: '60 kg kapasiteli, akıllı titreşim sönümleme sistemli, yüksek devirli endüstriyel yıkama ve sıkma makinesi.',
    price: 'Fiyat Alınız',
    image: 'sprites/tolkar_logo.png',
    isFeatured: true
  },
  {
    id: 'prod-2',
    title: 'Tolon TD 40 Endüstriyel Kurutma Makinesi',
    category: 'Makineler',
    description: '40 kg tam paslanmaz çelik tamburlu, yüksek nem sensörlü ve enerji tasarruflu profesyonel kurutma makinesi.',
    price: 'Fiyat Alınız',
    image: 'sprites/tolon_logo.webp',
    isFeatured: true
  },
  {
    id: 'prod-3',
    title: 'Girbau HS-6013 Endüstriyel Yıkama Makinesi',
    category: 'Makineler',
    description: '13 kg kapasiteli, otel ve hastane kullanımı için ağır hizmet tipi, yüksek sıkma performanslı yıkama makinesi.',
    price: 'Fiyat Alınız',
    image: 'sprites/logo.png',
    isFeatured: true
  },
  {
    id: 'prod-4',
    title: 'Electrolux Professional IC43316 Silindir Ütü',
    category: 'Makineler',
    description: '3.15 metre silindir genişliği ile yüksek kapasiteli otel nevresim ve masa örtüsü silindir ütüleme sistemi.',
    price: 'Fiyat Alınız',
    image: 'sprites/logo.png',
    isFeatured: true
  },
  {
    id: 'prod-5',
    title: 'Tolkar Smartex Inverter Sürücü Kartı (OEM)',
    category: 'Yedek Parçalar',
    description: 'Orijinal Tolkar Smartex serisi yıkama makineleri ile %100 uyumlu mikroişlemcili motor hız kontrol kartı.',
    price: '18.500 ₺',
    image: 'sprites/tolkar_logo.png',
    isFeatured: false
  },
  {
    id: 'prod-6',
    title: 'Tolon Su Giriş Ventili Grubu (3/4" Çiftli)',
    category: 'Yedek Parçalar',
    description: 'Tolon endüstriyel çamaşırhaneler için yüksek basınca dayanıklı pirinç gövdeli selenoid su vanası.',
    price: '2.450 ₺',
    image: 'sprites/tolon_logo.webp',
    isFeatured: false
  },
  {
    id: 'prod-7',
    title: 'Girbau & Electrolux Tambur Rulman Seti & Keçe',
    category: 'Yedek Parçalar',
    description: 'Ağır hizmet şartlarına uygun SKF rulman ve yüksek ısıya dayanıklı viton sızdırmazlık keçe takımı.',
    price: '4.800 ₺',
    image: 'sprites/logo.png',
    isFeatured: false
  },
  {
    id: 'prod-8',
    title: 'Endüstriyel Kireç Çözücü & Hijyenik Yıkama Deterjanı (20L)',
    category: 'Sarf Malzemeleri',
    description: 'Yüksek ısılı yıkama sistemleri için rezistans koruyucu profesyonel sıvı yıkama ve kireç önleyici kimyasal.',
    price: '1.250 ₺',
    image: 'sprites/logo.png',
    isFeatured: false
  }
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
    image: productData.image ? productData.image.trim() : 'sprites/logo.png',
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
      ? `<span class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1"><i class="fa-solid fa-star text-[9px]"></i> Öne Çıkan</span>` 
      : '';

    const imgSrc = product.image || 'sprites/logo.png';

    return `
      <div class="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden group">
        <div class="relative h-48 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
          <img src="${imgSrc}" alt="${escapeHtml(product.title)}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" onerror="this.src='sprites/logo.png'">
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
              <i class="fa-brands fa-whatsapp text-sm"></i>
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

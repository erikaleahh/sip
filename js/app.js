/**
 * SIP AVENUE — Specialty Coffee Roasters & Tea Merchants
 * Frontend Application Logic & State Architecture
 * 
 * Features:
 * - Product filtering (by category and real-time query)
 * - Sorting by price, rating, and title
 * - Product customization modal with size, milk, and preparation styles
 * - Shopping cart drawer with quantity adjustments and dynamic subtotal calculations
 * - Favorites / Wishlist drawer and heart toggles
 * - Persistent storage with localStorage for cart, favorites, and guestbook entries
 * - Checkout modal with client-side validation and fulfillment selection
 * - Paper receipt order confirmation modal
 * - Editorial toast notification system
 */

// Application State
const appState = {
  products: PRODUCTS_DATA,
  cart: [],
  favorites: [],
  testimonials: [],
  activeCategory: 'all',
  searchQuery: '',
  sortBy: 'featured',
  appliedVoucher: null,
  activeModalItem: null,
  modalSelections: {
    selectedSize: null,
    selectedMilk: null,
    selectedSweetness: null,
    selectedTemperature: null,
    quantity: 1
  },
  fulfillmentType: 'delivery',
  paymentMethod: 'gcash'
};

// Storage Keys
const STORAGE_KEYS = {
  CART: 'sip_avenue_cart_editorial_v2',
  FAVORITES: 'sip_avenue_favorites_editorial_v2',
  TESTIMONIALS: 'sip_avenue_testimonials_editorial_v2'
};

// SVG Icon Helpers (Zero Emojis in Interface)
const ICONS = {
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  bindUIEvents();
  renderCatalog();
  renderCartDrawer();
  renderFavoritesBadge();
  renderTestimonials();
});

/* ==========================================================================
   STORAGE SYNCHRONIZATION
   ========================================================================== */
function initStorage() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) appState.cart = JSON.parse(savedCart);

    const savedFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (savedFavs) appState.favorites = JSON.parse(savedFavs);

    const savedReviews = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (savedReviews) {
      appState.testimonials = JSON.parse(savedReviews);
    } else {
      appState.testimonials = [...INITIAL_TESTIMONIALS];
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(appState.testimonials));
    }
  } catch (err) {
    console.error('Storage initialization notice:', err);
  }
}

function persistCart() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(appState.cart));
  } catch (err) {
    console.error('Failed to persist cart:', err);
  }
}

function persistFavorites() {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(appState.favorites));
  } catch (err) {
    console.error('Failed to persist favorites:', err);
  }
}

function persistTestimonials() {
  try {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(appState.testimonials));
  } catch (err) {
    console.error('Failed to persist testimonials:', err);
  }
}

/* ==========================================================================
   EVENT LISTENERS & NAVIGATION
   ========================================================================== */
function bindUIEvents() {
  // Mobile Nav Toggle
  const mobileBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
    mobileDrawer.querySelectorAll('.nav-anchor').forEach(link => {
      link.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    });
  }

  // Quick Search Focus from Header
  const navSearchTrigger = document.getElementById('navSearchTrigger');
  const searchInput = document.getElementById('catalogSearchInput');
  if (navSearchTrigger && searchInput) {
    navSearchTrigger.addEventListener('click', () => {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => searchInput.focus(), 300);
    });
  }

  // Cart Drawer Triggers
  const cartBtn = document.getElementById('navCartBtn');
  const closeCartBtn = document.getElementById('closeCartDrawerBtn');
  const cartBackdrop = document.getElementById('cartDrawerBackdrop');
  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

  // Favorites Drawer Triggers
  const favBtn = document.getElementById('navFavBtn');
  const closeFavBtn = document.getElementById('closeFavDrawerBtn');
  const favBackdrop = document.getElementById('favDrawerBackdrop');
  if (favBtn) favBtn.addEventListener('click', openFavoritesDrawer);
  if (closeFavBtn) closeFavBtn.addEventListener('click', closeFavoritesDrawer);
  if (favBackdrop) favBackdrop.addEventListener('click', closeFavoritesDrawer);

  // Category Tabs
  const catButtons = document.querySelectorAll('.cat-tab-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.activeCategory = btn.dataset.category;
      renderCatalog();
    });
  });

  // Search Input & Clear
  const clearBtn = document.getElementById('searchClearBtn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.classList.toggle('visible', appState.searchQuery.length > 0);
      }
      renderCatalog();
    });
  }
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      appState.searchQuery = '';
      clearBtn.classList.remove('visible');
      searchInput.focus();
      renderCatalog();
    });
  }

  // Sort Dropdown
  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      renderCatalog();
    });
  }

  // Voucher Code Application
  const applyVoucherBtn = document.getElementById('applyVoucherBtn');
  const voucherInput = document.getElementById('cartVoucherInput');
  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener('click', () => {
      applyVoucherCode(voucherInput.value.trim());
    });
    voucherInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyVoucherCode(voucherInput.value.trim());
    });
  }

  // Copy Campaign Vouchers
  document.querySelectorAll('.copy-campaign-code').forEach(el => {
    el.addEventListener('click', (e) => {
      const code = e.currentTarget.dataset.code || 'RITUAL15';
      navigator.clipboard.writeText(code).then(() => {
        showEditorialToast(`Voucher code "${code}" copied to clipboard.`);
      }).catch(() => {
        showEditorialToast(`Voucher code: ${code}`);
      });
    });
  });

  // Product Customization Modal Controls
  const closeDetailsBtn = document.getElementById('closeDetailsModalBtn');
  const detailsBackdrop = document.getElementById('detailsModalBackdrop');
  if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', closeDetailsModal);
  if (detailsBackdrop) detailsBackdrop.addEventListener('click', closeDetailsModal);

  const modalQtyMinus = document.getElementById('modalQtyMinus');
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  if (modalQtyMinus) {
    modalQtyMinus.addEventListener('click', () => {
      if (appState.modalSelections.quantity > 1) {
        appState.modalSelections.quantity--;
        document.getElementById('modalQtyVal').innerText = appState.modalSelections.quantity;
        updateModalCalculatedPrice();
      }
    });
  }
  if (modalQtyPlus) {
    modalQtyPlus.addEventListener('click', () => {
      appState.modalSelections.quantity++;
      document.getElementById('modalQtyVal').innerText = appState.modalSelections.quantity;
      updateModalCalculatedPrice();
    });
  }

  const modalConfirmAddBtn = document.getElementById('modalConfirmAddBtn');
  if (modalConfirmAddBtn) {
    modalConfirmAddBtn.addEventListener('click', submitModalAdd);
  }

  // Checkout Triggers
  const openCheckoutBtn = document.getElementById('openCheckoutModalBtn');
  const closeCheckoutBtn = document.getElementById('closeCheckoutModalBtn');
  const checkoutBackdrop = document.getElementById('checkoutModalBackdrop');
  if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', openCheckoutModal);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckoutModal);

  // Fulfillment Buttons in Checkout
  const fulfillmentBtns = document.querySelectorAll('.fulfillment-btn');
  fulfillmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fulfillmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.fulfillmentType = btn.dataset.type;
      const addrSection = document.getElementById('checkoutAddressSection');
      if (addrSection) {
        addrSection.style.display = appState.fulfillmentType === 'pickup' ? 'none' : 'block';
      }
      renderCheckoutReview();
    });
  });

  // Payment Selection in Checkout
  const paymentTiles = document.querySelectorAll('.payment-tile');
  paymentTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      paymentTiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      appState.paymentMethod = tile.dataset.method;
    });
  });

  // Checkout Form Submission
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleOrderSubmission);
  }

  // Order Confirmation Modal Close
  const closeConfirmBtn = document.getElementById('closeConfirmationBtn');
  const confirmBackdrop = document.getElementById('confirmationModalBackdrop');
  if (closeConfirmBtn) closeConfirmBtn.addEventListener('click', closeConfirmationModal);
  if (confirmBackdrop) confirmBackdrop.addEventListener('click', closeConfirmationModal);

  // Guestbook Modal Triggers
  const openReviewBtn = document.getElementById('openReviewModalBtn');
  const closeReviewBtn = document.getElementById('closeReviewModalBtn');
  const reviewBackdrop = document.getElementById('reviewModalBackdrop');
  if (openReviewBtn) openReviewBtn.addEventListener('click', openGuestbookModal);
  if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeGuestbookModal);
  if (reviewBackdrop) reviewBackdrop.addEventListener('click', closeGuestbookModal);

  // Guestbook Form Submission
  const reviewForm = document.getElementById('guestbookReviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleGuestbookSubmit);
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('footerNewsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmailInput');
      if (emailInput && emailInput.value) {
        showEditorialToast('You are subscribed to The Morning Dispatch.');
        emailInput.value = '';
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailsModal();
      closeCartDrawer();
      closeFavoritesDrawer();
      closeCheckoutModal();
      closeConfirmationModal();
      closeGuestbookModal();
    }
  });
}

/* ==========================================================================
   CATALOG RENDERING, FILTERING & SEARCH
   ========================================================================== */
function getFilteredOfferings() {
  let list = [...appState.products];

  // Category Filter
  if (appState.activeCategory !== 'all') {
    list = list.filter(item => item.category === appState.activeCategory);
  }

  // Query Search
  if (appState.searchQuery) {
    list = list.filter(item => 
      item.name.toLowerCase().includes(appState.searchQuery) ||
      item.description.toLowerCase().includes(appState.searchQuery) ||
      (item.tastingNotes && item.tastingNotes.toLowerCase().includes(appState.searchQuery)) ||
      (item.origin && item.origin.toLowerCase().includes(appState.searchQuery))
    );
  }

  // Sorting
  switch (appState.sortBy) {
    case 'price-low':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Featured / default catalog order
      break;
  }

  return list;
}

function renderCatalog() {
  const container = document.getElementById('productsGrid');
  const countNote = document.getElementById('catalogCounterNote');
  if (!container) return;

  const items = getFilteredOfferings();

  if (countNote) {
    countNote.innerText = `Displaying ${items.length} of ${appState.products.length} offerings`;
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty-notice">
        <h3>No offerings matching your inquiry</h3>
        <p>Try searching for a different note or reset your filter parameters.</p>
        <button type="button" class="btn-editorial-primary" onclick="resetCatalogFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(product => {
    const isFavorited = appState.favorites.includes(product.id);

    return `
      <article class="product-item" data-id="${product.id}">
        <div class="product-media-wrap" onclick="openDetailsModal('${product.id}')">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="product-badge-pill">${product.badge}</span>` : ''}
          <button type="button" class="product-fav-trigger ${isFavorited ? 'favorited' : ''}" 
                  onclick="event.stopPropagation(); toggleFavoriteItem('${product.id}')" 
                  aria-label="${isFavorited ? 'Remove from saved' : 'Save offering'}" 
                  title="${isFavorited ? 'Remove from saved' : 'Save offering'}">
            ${ICONS.heart}
          </button>
        </div>

        <div class="product-details">
          <div class="product-meta-sub">
            <span>${product.category.toUpperCase()}</span>
            <span class="rating-inline">
              ${ICONS.star}
              <span>${product.rating.toFixed(1)}</span>
            </span>
          </div>

          <h3 class="product-name-title" onclick="openDetailsModal('${product.id}')">
            ${product.name}
          </h3>

          <p class="product-tasting-notes">
            ${product.tastingNotes || product.description.slice(0, 70) + '...'}
          </p>

          <div class="product-action-row">
            <span class="price-text">₱${product.price.toLocaleString()}</span>
            <button type="button" class="btn-card-add" onclick="openDetailsModal('${product.id}')">
              Select &amp; Brew
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function resetCatalogFilters() {
  appState.activeCategory = 'all';
  appState.searchQuery = '';
  appState.sortBy = 'featured';

  const searchInput = document.getElementById('catalogSearchInput');
  const sortSelect = document.getElementById('catalogSortSelect');
  const clearBtn = document.getElementById('searchClearBtn');

  if (searchInput) searchInput.value = '';
  if (sortSelect) sortSelect.value = 'featured';
  if (clearBtn) clearBtn.classList.remove('visible');

  document.querySelectorAll('.cat-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === 'all');
  });

  renderCatalog();
}

/* ==========================================================================
   FAVORITES / WISHLIST OPERATIONS
   ========================================================================== */
function toggleFavoriteItem(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  const idx = appState.favorites.indexOf(productId);
  if (idx > -1) {
    appState.favorites.splice(idx, 1);
    showEditorialToast(`Removed "${product.name}" from saved offerings.`);
  } else {
    appState.favorites.push(productId);
    showEditorialToast(`Saved "${product.name}" to your list.`);
  }

  persistFavorites();
  renderFavoritesBadge();
  renderCatalog();
  renderFavoritesDrawer();
}

function renderFavoritesBadge() {
  const tag = document.getElementById('favoritesCountTag');
  if (tag) {
    tag.innerText = appState.favorites.length;
    tag.style.display = appState.favorites.length > 0 ? 'inline-flex' : 'none';
  }
}

function openFavoritesDrawer() {
  renderFavoritesDrawer();
  document.getElementById('favoritesDrawer').classList.add('open');
  document.getElementById('favDrawerBackdrop').classList.add('active');
}

function closeFavoritesDrawer() {
  document.getElementById('favoritesDrawer').classList.remove('open');
  document.getElementById('favDrawerBackdrop').classList.remove('active');
}

function renderFavoritesDrawer() {
  const container = document.getElementById('favoritesContainer');
  if (!container) return;

  const favoritedItems = appState.products.filter(p => appState.favorites.includes(p.id));

  if (favoritedItems.length === 0) {
    container.innerHTML = `
      <div class="drawer-empty-state">
        <h4>No saved offerings</h4>
        <p>Bookmark your preferred roasts or seasonal preparations for easy access.</p>
        <button type="button" class="btn-editorial-primary" onclick="closeFavoritesDrawer(); document.getElementById('catalog').scrollIntoView({behavior: 'smooth'});">
          Browse the Counter
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = favoritedItems.map(item => `
    <div class="cart-product-entry">
      <div class="cart-entry-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-entry-info">
        <div class="cart-entry-title">${item.name}</div>
        <div class="cart-entry-variant">₱${item.price.toLocaleString()} · ${item.category.toUpperCase()}</div>
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.4rem;">
          <button type="button" class="btn-card-add" onclick="openDetailsModal('${item.id}'); closeFavoritesDrawer();">
            Select &amp; Brew
          </button>
          <button type="button" class="cart-entry-remove" onclick="toggleFavoriteItem('${item.id}')">
            Remove
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   PRODUCT CUSTOMIZATION MODAL
   ========================================================================== */
function openDetailsModal(productId) {
  const product = appState.products.find(p => p.id === productId);
  if (!product) return;

  appState.activeModalItem = product;
  appState.modalSelections.selectedSize = product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : null;
  appState.modalSelections.selectedMilk = product.milkOptions && product.milkOptions.length > 0 ? product.milkOptions[0] : null;
  appState.modalSelections.selectedSweetness = product.sweetnessOptions && product.sweetnessOptions.length > 0 ? product.sweetnessOptions[0] : null;
  appState.modalSelections.selectedTemperature = product.temperatureOptions && product.temperatureOptions.length > 0 ? product.temperatureOptions[0] : null;
  appState.modalSelections.quantity = 1;

  document.getElementById('modalItemImg').src = product.image;
  document.getElementById('modalItemImg').alt = product.name;
  document.getElementById('modalItemBadge').innerText = product.badge || 'House Selection';
  document.getElementById('modalItemTitle').innerText = product.name;
  document.getElementById('modalItemDesc').innerText = product.description;
  document.getElementById('modalQtyVal').innerText = '1';

  // Render Sizes
  const sizeBox = document.getElementById('modalSizeSegment');
  const sizePills = document.getElementById('modalSizePills');
  if (product.availableSizes && product.availableSizes.length > 0) {
    sizeBox.style.display = 'block';
    sizePills.innerHTML = product.availableSizes.map(size => `
      <button type="button" class="option-select-btn ${size.name === appState.modalSelections.selectedSize.name ? 'selected' : ''}"
              onclick="chooseModalAttribute('size', '${size.name}')">
        ${size.name} ${size.extra > 0 ? `(+₱${size.extra})` : ''}
      </button>
    `).join('');
  } else {
    sizeBox.style.display = 'none';
  }

  // Render Temperature / Style
  const tempBox = document.getElementById('modalTempSegment');
  const tempPills = document.getElementById('modalTempPills');
  if (product.temperatureOptions && product.temperatureOptions.length > 0) {
    tempBox.style.display = 'block';
    tempPills.innerHTML = product.temperatureOptions.map(temp => `
      <button type="button" class="option-select-btn ${temp === appState.modalSelections.selectedTemperature ? 'selected' : ''}"
              onclick="chooseModalAttribute('temperature', '${temp}')">
        ${temp}
      </button>
    `).join('');
  } else {
    tempBox.style.display = 'none';
  }

  // Render Milk Options
  const milkBox = document.getElementById('modalMilkSegment');
  const milkPills = document.getElementById('modalMilkPills');
  if (product.milkOptions && product.milkOptions.length > 0) {
    milkBox.style.display = 'block';
    milkPills.innerHTML = product.milkOptions.map(milk => `
      <button type="button" class="option-select-btn ${milk === appState.modalSelections.selectedMilk ? 'selected' : ''}"
              onclick="chooseModalAttribute('milk', '${milk}')">
        ${milk}
      </button>
    `).join('');
  } else {
    milkBox.style.display = 'none';
  }

  // Render Sweetness Options
  const sweetBox = document.getElementById('modalSweetSegment');
  const sweetPills = document.getElementById('modalSweetPills');
  if (product.sweetnessOptions && product.sweetnessOptions.length > 0) {
    sweetBox.style.display = 'block';
    sweetPills.innerHTML = product.sweetnessOptions.map(sweet => `
      <button type="button" class="option-select-btn ${sweet === appState.modalSelections.selectedSweetness ? 'selected' : ''}"
              onclick="chooseModalAttribute('sweetness', '${sweet}')">
        ${sweet}
      </button>
    `).join('');
  } else {
    sweetBox.style.display = 'none';
  }

  updateModalCalculatedPrice();

  document.getElementById('productDetailsModal').classList.add('open');
  document.getElementById('detailsModalBackdrop').classList.add('active');
}

function chooseModalAttribute(kind, val) {
  const p = appState.activeModalItem;
  if (!p) return;

  if (kind === 'size') {
    appState.modalSelections.selectedSize = p.availableSizes.find(s => s.name === val);
    document.querySelectorAll('#modalSizePills .option-select-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.innerText.includes(val));
    });
  } else if (kind === 'milk') {
    appState.modalSelections.selectedMilk = val;
    document.querySelectorAll('#modalMilkPills .option-select-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.innerText === val);
    });
  } else if (kind === 'sweetness') {
    appState.modalSelections.selectedSweetness = val;
    document.querySelectorAll('#modalSweetPills .option-select-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.innerText === val);
    });
  } else if (kind === 'temperature') {
    appState.modalSelections.selectedTemperature = val;
    document.querySelectorAll('#modalTempPills .option-select-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.innerText === val);
    });
  }

  updateModalCalculatedPrice();
}

function computeModalUnitCost() {
  const p = appState.activeModalItem;
  if (!p) return 0;
  let unit = p.price;
  if (appState.modalSelections.selectedSize && appState.modalSelections.selectedSize.extra) {
    unit += appState.modalSelections.selectedSize.extra;
  }
  if (appState.modalSelections.selectedMilk && appState.modalSelections.selectedMilk.includes('+₱')) {
    const match = appState.modalSelections.selectedMilk.match(/\+₱(\d+)/);
    if (match) unit += parseInt(match[1], 10);
  }
  return unit;
}

function updateModalCalculatedPrice() {
  const unit = computeModalUnitCost();
  const total = unit * appState.modalSelections.quantity;
  const priceDisplay = document.getElementById('modalItemPrice');
  if (priceDisplay) {
    priceDisplay.innerText = `₱${total.toLocaleString()}`;
  }
}

function closeDetailsModal() {
  document.getElementById('productDetailsModal').classList.remove('open');
  document.getElementById('detailsModalBackdrop').classList.remove('active');
  appState.activeModalItem = null;
}

function submitModalAdd() {
  const product = appState.activeModalItem;
  if (!product) return;

  const unitCost = computeModalUnitCost();
  const sizeName = appState.modalSelections.selectedSize ? appState.modalSelections.selectedSize.name : '';
  const milkName = appState.modalSelections.selectedMilk || '';
  const sweetness = appState.modalSelections.selectedSweetness || '';
  const temp = appState.modalSelections.selectedTemperature || '';

  const itemKey = `${product.id}|${sizeName}|${milkName}|${sweetness}|${temp}`;
  const existing = appState.cart.find(i => i.itemKey === itemKey);

  if (existing) {
    existing.quantity += appState.modalSelections.quantity;
  } else {
    appState.cart.push({
      itemKey,
      id: product.id,
      name: product.name,
      price: unitCost,
      image: product.image,
      size: sizeName,
      milk: milkName,
      sweetness: sweetness,
      temperature: temp,
      quantity: appState.modalSelections.quantity
    });
  }

  persistCart();
  renderCartDrawer();
  closeDetailsModal();
  openCartDrawer();
  showEditorialToast(`Added ${appState.modalSelections.quantity}x "${product.name}" to your bag.`);
}

/* ==========================================================================
   CART OPERATIONS & SLIDE-OVER DRAWER
   ========================================================================== */
function adjustCartItemQty(itemKey, delta) {
  const item = appState.cart.find(i => i.itemKey === itemKey);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    appState.cart = appState.cart.filter(i => i.itemKey !== itemKey);
    showEditorialToast(`Removed "${item.name}" from bag.`);
  }

  persistCart();
  renderCartDrawer();
}

function removeCartItemByKey(itemKey) {
  const item = appState.cart.find(i => i.itemKey === itemKey);
  appState.cart = appState.cart.filter(i => i.itemKey !== itemKey);
  persistCart();
  renderCartDrawer();
  if (item) {
    showEditorialToast(`Removed "${item.name}" from bag.`);
  }
}

function computeOrderTotals() {
  const subtotal = appState.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  
  // Complimentary delivery over ₱800 or FREESHIP
  let deliveryFee = subtotal >= 800 || (appState.appliedVoucher && appState.appliedVoucher.code === 'FREESHIP') ? 0 : (subtotal > 0 ? 65 : 0);

  if (appState.fulfillmentType === 'pickup') {
    deliveryFee = 0;
  }

  let discount = 0;
  if (appState.appliedVoucher && subtotal > 0) {
    if (appState.appliedVoucher.type === 'percent') {
      discount = Math.round(subtotal * (appState.appliedVoucher.value / 100));
    } else if (appState.appliedVoucher.type === 'fixed') {
      discount = Math.min(subtotal, appState.appliedVoucher.value);
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);
  return { subtotal, deliveryFee, discount, grandTotal };
}

function renderCartDrawer() {
  const listContainer = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotalText');
  const deliveryEl = document.getElementById('cartDeliveryText');
  const totalEl = document.getElementById('cartGrandTotalText');
  const countTag = document.getElementById('cartCountTag');
  const discountRow = document.getElementById('discountLineRow');
  const discountEl = document.getElementById('cartDiscountText');
  const voucherChip = document.getElementById('appliedVoucherChip');
  const voucherText = document.getElementById('appliedVoucherText');
  const noticeText = document.getElementById('freeDeliveryNoticeText');
  const checkoutBtn = document.getElementById('openCheckoutModalBtn');

  const { subtotal, deliveryFee, discount, grandTotal } = computeOrderTotals();
  const totalCount = appState.cart.reduce((sum, i) => sum + i.quantity, 0);

  if (countTag) {
    countTag.innerText = totalCount;
  }

  // Delivery Notice
  if (noticeText) {
    if (subtotal >= 800) {
      noticeText.innerHTML = `Your order qualifies for <strong>Complimentary Metro Manila Delivery</strong>.`;
    } else {
      const remaining = 800 - subtotal;
      noticeText.innerHTML = `Add <strong>₱${remaining.toLocaleString()}</strong> more for complimentary delivery.`;
    }
  }

  // Voucher Chip
  if (voucherChip && voucherText) {
    if (appState.appliedVoucher) {
      voucherChip.style.display = 'flex';
      voucherText.innerText = `${appState.appliedVoucher.code} (${appState.appliedVoucher.description})`;
    } else {
      voucherChip.style.display = 'none';
    }
  }

  // Discount Row
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.innerText = `-₱${discount.toLocaleString()}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  // Subtotal & Totals
  if (subtotalEl) subtotalEl.innerText = `₱${subtotal.toLocaleString()}`;
  if (deliveryEl) {
    deliveryEl.innerText = deliveryFee === 0 ? 'Complimentary' : `₱${deliveryFee.toLocaleString()}`;
  }
  if (totalEl) totalEl.innerText = `₱${grandTotal.toLocaleString()}`;

  // Checkout Button
  if (checkoutBtn) {
    checkoutBtn.disabled = appState.cart.length === 0;
    checkoutBtn.style.opacity = appState.cart.length === 0 ? '0.5' : '1';
    checkoutBtn.style.cursor = appState.cart.length === 0 ? 'not-allowed' : 'pointer';
  }

  if (!listContainer) return;

  if (appState.cart.length === 0) {
    listContainer.innerHTML = `
      <div class="drawer-empty-state">
        <h4>Your bag is currently empty</h4>
        <p>Explore our seasonal single origins, cold steep preparations, and morning pastries.</p>
        <button type="button" class="btn-editorial-primary" onclick="closeCartDrawer(); document.getElementById('catalog').scrollIntoView({behavior: 'smooth'});">
          Explore Offerings
        </button>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = appState.cart.map(item => {
    const variantParts = [item.size, item.temperature, item.milk, item.sweetness].filter(Boolean);
    const variantStr = variantParts.join(' · ');

    return `
      <div class="cart-product-entry">
        <div class="cart-entry-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-entry-info">
          <div class="cart-entry-title">${item.name}</div>
          ${variantStr ? `<div class="cart-entry-variant">${variantStr}</div>` : ''}
          <div class="cart-entry-controls">
            <div class="stepper-ui">
              <button type="button" class="stepper-btn" onclick="adjustCartItemQty('${item.itemKey}', -1)">-</button>
              <span class="stepper-val">${item.quantity}</span>
              <button type="button" class="stepper-btn" onclick="adjustCartItemQty('${item.itemKey}', 1)">+</button>
            </div>
            <span class="cart-entry-price">₱${(item.price * item.quantity).toLocaleString()}</span>
            <button type="button" class="cart-entry-remove" onclick="removeCartItemByKey('${item.itemKey}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartDrawerBackdrop').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartDrawerBackdrop').classList.remove('active');
}

/* ==========================================================================
   PROMOTIONAL VOUCHERS
   ========================================================================== */
function applyVoucherCode(rawCode) {
  if (!rawCode) {
    showEditorialToast('Please enter a voucher code.');
    return;
  }

  const code = rawCode.toUpperCase();
  const voucher = PROMO_CODES[code];

  if (!voucher) {
    showEditorialToast(`Voucher code "${code}" is invalid. Try RITUAL15 or FREESHIP.`);
    return;
  }

  appState.appliedVoucher = { code, ...voucher };
  renderCartDrawer();
  showEditorialToast(`Voucher "${code}" applied to order.`);

  const input = document.getElementById('cartVoucherInput');
  if (input) input.value = '';
}

function removeVoucher() {
  appState.appliedVoucher = null;
  renderCartDrawer();
  showEditorialToast('Voucher removed from order.');
}

/* ==========================================================================
   CHECKOUT & PAPER RECEIPT CONFIRMATION
   ========================================================================== */
function openCheckoutModal() {
  if (appState.cart.length === 0) {
    showEditorialToast('Your bag is empty.');
    return;
  }
  closeCartDrawer();
  renderCheckoutReview();
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutModalBackdrop').classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutModalBackdrop').classList.remove('active');
}

function renderCheckoutReview() {
  const container = document.getElementById('checkoutReviewTray');
  if (!container) return;

  const { subtotal, deliveryFee, discount, grandTotal } = computeOrderTotals();

  container.innerHTML = `
    <div style="font-weight: 600; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.6rem; color: var(--c-espresso);">
      Order Manifest (${appState.cart.reduce((s, i) => s + i.quantity, 0)} items)
    </div>
    <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.8rem; font-size: 0.85rem;">
      ${appState.cart.map(i => `
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--c-espresso-muted);">${i.quantity}x ${i.name} ${i.size ? `(${i.size.split(' ')[0]})` : ''}</span>
          <span style="font-weight: 500;">₱${(i.price * i.quantity).toLocaleString()}</span>
        </div>
      `).join('')}
    </div>
    <div style="border-top: 1px solid var(--c-oat-border); padding-top: 0.6rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem;">
      <div style="display: flex; justify-content: space-between;">
        <span>Subtotal</span>
        <span>₱${subtotal.toLocaleString()}</span>
      </div>
      ${discount > 0 ? `
        <div style="display: flex; justify-content: space-between; color: var(--c-olive);">
          <span>Voucher (${appState.appliedVoucher.code})</span>
          <span>-₱${discount.toLocaleString()}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between;">
        <span>${appState.fulfillmentType === 'pickup' ? 'Tasting Room Pickup' : 'Courier Dispatch'}</span>
        <span>${deliveryFee === 0 ? 'Complimentary' : `₱${deliveryFee.toLocaleString()}`}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: 700; font-family: var(--font-serif); font-size: 1.15rem; border-top: 1px solid var(--c-oat-border); padding-top: 0.6rem; margin-top: 0.2rem;">
        <span>Payable Total</span>
        <span>₱${grandTotal.toLocaleString()}</span>
      </div>
    </div>
  `;

  const btnTotalDisplay = document.getElementById('checkoutSubmitTotalText');
  if (btnTotalDisplay) {
    btnTotalDisplay.innerText = `₱${grandTotal.toLocaleString()}`;
  }
}

function handleOrderSubmission(e) {
  e.preventDefault();

  const name = document.getElementById('checkoutName').value.trim();
  const phone = document.getElementById('checkoutPhone').value.trim();
  const email = document.getElementById('checkoutEmail').value.trim();
  const address = appState.fulfillmentType === 'delivery' ? document.getElementById('checkoutAddress').value.trim() : 'Salcedo Village Tasting Room';

  if (!name || !phone || !email || (appState.fulfillmentType === 'delivery' && !address)) {
    showEditorialToast('Please complete the required guest details.');
    return;
  }

  const submitBtn = document.getElementById('submitOrderBtn');
  if (submitBtn) {
    submitBtn.innerHTML = `<span>Dispatching to Counter...</span>`;
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    const { subtotal, deliveryFee, discount, grandTotal } = computeOrderTotals();
    const orderId = `SA-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    displayConfirmationReceipt({
      orderId,
      guestName: name,
      fulfillment: appState.fulfillmentType === 'pickup' ? 'Tasting Room Pickup (Salcedo Village)' : `Courier Dispatch to ${address}`,
      payment: appState.paymentMethod.toUpperCase(),
      items: [...appState.cart],
      subtotal,
      deliveryFee,
      discount,
      grandTotal,
      timestamp: timeString
    });

    // Reset Cart
    appState.cart = [];
    appState.appliedVoucher = null;
    persistCart();
    renderCartDrawer();

    if (submitBtn) {
      submitBtn.innerHTML = `<span>Place Order (<span id="checkoutSubmitTotalText">₱0</span>)</span>`;
      submitBtn.disabled = false;
    }

    closeCheckoutModal();
  }, 900);
}

function displayConfirmationReceipt(order) {
  const modal = document.getElementById('confirmationModal');
  const backdrop = document.getElementById('confirmationModalBackdrop');
  const body = document.getElementById('confirmationReceiptBody');

  if (!modal || !body) return;

  body.innerHTML = `
    <div class="receipt-top-row">
      <span>ORDER SLIP: #${order.orderId}</span>
      <span>${order.timestamp}</span>
    </div>
    <div style="font-size: 0.8rem; color: var(--c-espresso-muted); margin-bottom: 0.8rem; line-height: 1.5;">
      <div><strong>Guest:</strong> ${order.guestName}</div>
      <div><strong>Fulfillment:</strong> ${order.fulfillment}</div>
      <div><strong>Settlement:</strong> ${order.payment}</div>
      <div><strong>Est. Preparation:</strong> 20 – 30 minutes</div>
    </div>
    <div style="border-top: 1px dashed var(--c-oat-border); padding-top: 0.6rem; margin-bottom: 0.6rem;">
      ${order.items.map(i => `
        <div class="receipt-item-line">
          <span>${i.quantity}x ${i.name} ${i.size ? `(${i.size.split(' ')[0]})` : ''}</span>
          <span>₱${(i.price * i.quantity).toLocaleString()}</span>
        </div>
      `).join('')}
    </div>
    ${order.discount > 0 ? `
      <div class="receipt-item-line" style="color: var(--c-olive);">
        <span>Voucher Discount</span>
        <span>-₱${order.discount.toLocaleString()}</span>
      </div>
    ` : ''}
    <div class="receipt-item-line">
      <span>Delivery</span>
      <span>${order.deliveryFee === 0 ? 'Complimentary' : `₱${order.deliveryFee.toLocaleString()}`}</span>
    </div>
    <div class="receipt-total-line">
      <span>Total Paid</span>
      <span>₱${order.grandTotal.toLocaleString()}</span>
    </div>
  `;

  modal.classList.add('open');
  backdrop.classList.add('active');
  showEditorialToast(`Order #${order.orderId} received. Roasting and pulling shots.`);
}

function closeConfirmationModal() {
  document.getElementById('confirmationModal').classList.remove('open');
  document.getElementById('confirmationModalBackdrop').classList.remove('active');
}

/* ==========================================================================
   CUSTOMER TESTIMONIALS & GUESTBOOK JOURNAL
   ========================================================================== */
function renderTestimonials() {
  const container = document.getElementById('journalGrid');
  if (!container) return;

  container.innerHTML = appState.testimonials.map(item => `
    <div class="journal-card">
      <div>
        <div class="journal-order-tag">${item.favoriteOrder}</div>
        <p class="journal-quote">"${item.comment}"</p>
      </div>
      <div class="journal-author-row">
        <strong>${item.author}</strong>
        <span>${item.location} · ${item.date}</span>
      </div>
    </div>
  `).join('');
}

function openGuestbookModal() {
  const select = document.getElementById('reviewProductSelect');
  if (select) {
    select.innerHTML = appState.products.map(p => `
      <option value="${p.name}">${p.name} (₱${p.price})</option>
    `).join('');
  }
  document.getElementById('reviewModal').classList.add('open');
  document.getElementById('reviewModalBackdrop').classList.add('active');
}

function closeGuestbookModal() {
  document.getElementById('reviewModal').classList.remove('open');
  document.getElementById('reviewModalBackdrop').classList.remove('active');
}

function handleGuestbookSubmit(e) {
  e.preventDefault();

  const author = document.getElementById('reviewAuthorInput').value.trim();
  const location = document.getElementById('reviewLocationInput').value.trim() || 'Manila';
  const favoriteOrder = document.getElementById('reviewProductSelect').value;
  const comment = document.getElementById('reviewCommentInput').value.trim();

  if (!author || !comment) {
    showEditorialToast('Please include your name and message.');
    return;
  }

  const newEntry = {
    id: `rev-${Date.now()}`,
    author,
    location,
    date: 'Today',
    favoriteOrder,
    comment
  };

  appState.testimonials.unshift(newEntry);
  persistTestimonials();
  renderTestimonials();
  closeGuestbookModal();
  showEditorialToast('Thank you. Your note has been published to our journal.');

  document.getElementById('guestbookReviewForm').reset();
}

/* ==========================================================================
   EDITORIAL TOAST NOTIFICATIONS (NO EMOJIS, PURE SVGS)
   ========================================================================== */
function showEditorialToast(message) {
  const tray = document.getElementById('toastTray');
  if (!tray) return;

  const toast = document.createElement('div');
  toast.className = 'editorial-toast';
  toast.innerHTML = `
    ${ICONS.check}
    <span>${message}</span>
  `;

  tray.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

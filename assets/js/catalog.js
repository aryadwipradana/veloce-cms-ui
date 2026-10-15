/**
 * VELOCE PERFORMANCE - CATALOG FILTERING, SEARCH & SORT ENGINE
 * Handles instantaneous client-side filtering for Wheels, Tires, Accessories, and Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogFilters();
  initPortfolioFilters();
});

function initCatalogFilters() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const searchInput = document.getElementById('catalogSearch');
  const brandSelect = document.getElementById('filterBrand');
  const sizeSelect = document.getElementById('filterSize');
  const pcdSelect = document.getElementById('filterPcd');
  const sortSelect = document.getElementById('sortProducts');
  const countEl = document.getElementById('productResultsCount');
  const resetBtn = document.getElementById('resetFilters');

  function applyFilters() {
    const cards = container.querySelectorAll('.catalog-card');
    const searchVal = (searchInput?.value || '').toLowerCase().trim();
    const brandVal = (brandSelect?.value || '').toLowerCase();
    const sizeVal = (sizeSelect?.value || '').toLowerCase();
    const pcdVal = (pcdSelect?.value || '').toLowerCase();

    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const brand = (card.getAttribute('data-brand') || '').toLowerCase();
      const size = (card.getAttribute('data-size') || '').toLowerCase();
      const pcd = (card.getAttribute('data-pcd') || '').toLowerCase();

      const matchSearch = !searchVal || title.includes(searchVal) || brand.includes(searchVal);
      const matchBrand = !brandVal || brand === brandVal;
      const matchSize = !sizeVal || size === sizeVal;
      const matchPcd = !pcdVal || pcd.includes(pcdVal);

      if (matchSearch && matchBrand && matchSize && matchPcd) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) {
      countEl.textContent = `Menampilkan ${visibleCount} produk`;
    }

    const noResultEl = document.getElementById('noResultsMsg');
    if (noResultEl) {
      noResultEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (brandSelect) brandSelect.addEventListener('change', applyFilters);
  if (sizeSelect) sizeSelect.addEventListener('change', applyFilters);
  if (pcdSelect) pcdSelect.addEventListener('change', applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      if (brandSelect) brandSelect.value = '';
      if (sizeSelect) sizeSelect.value = '';
      if (pcdSelect) pcdSelect.value = '';
      applyFilters();
    });
  }

  // Sort handler
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const cards = Array.from(container.querySelectorAll('.catalog-card'));

      cards.sort((a, b) => {
        const titleA = a.getAttribute('data-title') || '';
        const titleB = b.getAttribute('data-title') || '';
        const sizeA = parseFloat(a.getAttribute('data-size') || 0);
        const sizeB = parseFloat(b.getAttribute('data-size') || 0);

        if (val === 'name-asc') return titleA.localeCompare(titleB);
        if (val === 'name-desc') return titleB.localeCompare(titleA);
        if (val === 'size-asc') return sizeA - sizeB;
        if (val === 'size-desc') return sizeB - sizeA;
        return 0;
      });

      cards.forEach(card => container.appendChild(card));
    });
  }

  applyFilters();
}

function initPortfolioFilters() {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  const buttons = document.querySelectorAll('.portfolio-filter-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const items = container.querySelectorAll('.portfolio-item');

      items.forEach(item => {
        const category = item.getAttribute('data-car-brand') || '';
        if (filter === 'all' || category.toLowerCase() === filter.toLowerCase()) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

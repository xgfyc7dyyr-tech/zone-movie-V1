/**
 * ZONEMOVI - HEADER, SEARCH & COMPLETE ADVANCED FILTER SCRIPT
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    function initIcons() {
        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } catch (e) {}
    }
    initIcons();

    // ─────────────────────────────────────────────────────────────
    // SEARCH & FILTER LOGIC
    // ─────────────────────────────────────────────────────────────
    const searchContainer   = document.getElementById('searchContainer');
    const searchTrigger     = document.getElementById('searchTrigger');
    const searchInput       = document.getElementById('searchInput');
    const searchClose       = document.getElementById('searchClose');
    const desktopFilterBtn  = document.getElementById('desktopFilterBtn');
    const dropdownFilterBtn = document.getElementById('dropdownFilterBtn');
    
    const searchResults     = document.getElementById('searchResults');
    const resultsList       = document.getElementById('resultsList');
    const resultsCount      = document.getElementById('resultsCount');

    // المان‌های فیلتر پیشرفته
    const filterModal        = document.getElementById('filterModal');
    const filterModalClose   = document.getElementById('filterModalClose');
    const btnApplyFilter     = document.getElementById('btnApplyFilter');
    const btnResetFilter     = document.getElementById('btnResetFilter');

    const filterYearSelect    = document.getElementById('filterYearSelect');
    const filterQualitySelect = document.getElementById('filterQualitySelect');
    const filterCountrySelect = document.getElementById('filterCountrySelect');
    const filterPlatformSelect= document.getElementById('filterPlatformSelect');
    const filterSortSelect    = document.getElementById('filterSortSelect');
    const filterRatingSelect  = document.getElementById('filterRatingSelect');

    const desktopFilterBadge  = document.getElementById('desktopFilterBadge');
    const dropdownFilterBadge = document.getElementById('dropdownFilterBadge');

    let selectedIndex = -1;
    let debounceTimer = null;

    const moviesData = [
        { id: 1, title: "مرد عنکبوتی: روز جدید", original: "Spider-Man: Brand New Day", year: "2026", type: "movie", genre: "اکشن" },
        { id: 2, title: "عشق بی‌حد و مرز", original: "Hudutsuz Sevda", year: "2024", type: "series", genre: "درام" },
        { id: 3, title: "اشرف رویا", original: "Esref Ruya", year: "2024", type: "series", genre: "درام" },
        { id: 4, title: "شهر دور", original: "Uzak Sehir", year: "2024", type: "series", genre: "درام" },
        { id: 5, title: "تام و جری", original: "Tom & Jerry", year: "2021", type: "movie", genre: "کمدی" }
    ];

    function normalizeText(str) {
        if (!str) return '';
        return str
            .toString()
            .toLowerCase()
            .replace(/\u200c/g, ' ')
            .replace(/ي/g, 'ی')
            .replace(/ك/g, 'ک')
            .trim();
    }

    function openSearch() {
        searchContainer?.classList.add('expanded');
        searchContainer?.setAttribute('aria-expanded', 'true');
        setTimeout(() => searchInput?.focus(), 150);
    }

    function closeSearch() {
        searchContainer?.classList.remove('expanded');
        searchContainer?.setAttribute('aria-expanded', 'false');
        if (searchResults) searchResults.classList.add('hidden');
        if (resultsList) resultsList.innerHTML = '';
        if (resultsCount) resultsCount.textContent = '۰ مورد';
        if (searchInput) searchInput.value = '';
        selectedIndex = -1;
    }

    function openFilterModal() {
        filterModal?.classList.remove('hidden');
        filterModal?.setAttribute('aria-hidden', 'false');
    }

    function closeFilterModal() {
        filterModal?.classList.add('hidden');
        filterModal?.setAttribute('aria-hidden', 'true');
    }

    function countActiveFilters() {
        let count = 0;

        const activeType = document.querySelector('.filter-chip-type.active')?.dataset.type;
        if (activeType && activeType !== 'all') count++;

        const activeGenres = document.querySelectorAll('.filter-chip-genre.active');
        count += activeGenres.length;

        const activeAudio = document.querySelectorAll('.filter-chip-audio.active');
        count += activeAudio.length;

        if (filterYearSelect?.value) count++;
        if (filterQualitySelect?.value) count++;
        if (filterCountrySelect?.value) count++;
        if (filterPlatformSelect?.value) count++;
        if (filterRatingSelect?.value) count++;
        if (filterSortSelect?.value && filterSortSelect.value !== 'newest') count++;

        return count;
    }

    function updateFilterBadges() {
        const count = countActiveFilters();
        const badges = [desktopFilterBadge, dropdownFilterBadge];

        badges.forEach(badge => {
            if (!badge) return;
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });
    }

    function updateKeyboardSelection(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    if (searchTrigger) {
        searchTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (searchContainer?.classList.contains('expanded')) {
                closeSearch();
            } else {
                openSearch();
            }
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSearch();
        });
    }

    desktopFilterBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openFilterModal();
    });

    dropdownFilterBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openFilterModal();
    });

    if (searchInput) {
        searchInput.addEventListener('click', (e) => e.stopPropagation());

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = normalizeText(e.target.value);
            selectedIndex = -1;

            debounceTimer = setTimeout(() => {
                if (query.length > 0) {
                    const filtered = moviesData.filter(m => 
                        normalizeText(m.title).includes(query) ||
                        normalizeText(m.original).includes(query)
                    );
                    
                    if (filtered.length > 0) {
                        resultsList.innerHTML = filtered.map(m => `
                            <div class="search-item" data-url="#movie/${m.id}">
                                <div class="search-item__poster">
                                    <i data-lucide="film" style="width:16px; opacity:0.4;"></i>
                                </div>
                                <div>
                                    <div class="search-item__title">${m.title}</div>
                                    <div class="search-item__meta">${m.original} • ${m.type === 'movie' ? 'فیلم' : 'سریال'}</div>
                                </div>
                            </div>
                        `).join('');
                        
                        if (resultsCount) resultsCount.textContent = `${filtered.length} مورد`;
                        initIcons();
                    } else {
                        resultsList.innerHTML = `<div style="padding:12px; text-align:center; font-size:0.82rem; color:var(--text-muted);">نتیجه‌ای یافت نشد</div>`;
                        if (resultsCount) resultsCount.textContent = `۰ مورد`;
                    }
                    searchResults?.classList.remove('hidden');
                } else {
                    searchResults?.classList.add('hidden');
                }
            }, 250);
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = resultsList?.querySelectorAll('.search-item') || [];
            if (!items.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateKeyboardSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateKeyboardSelection(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    items[selectedIndex].click();
                }
            } else if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }

    // چیپ‌های انتخاب نوع اثر
    document.querySelectorAll('.filter-chip-type').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.filter-chip-type').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // چیپ‌های ژانرها
    document.querySelectorAll('.filter-chip-genre').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // چیپ‌های صوت و زیرنویس
    document.querySelectorAll('.filter-chip-audio').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // جلوگیری از انتشار کلیک داخل کارت مودال
    filterModal?.querySelector('.filter-modal__card')?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    btnApplyFilter?.addEventListener('click', (e) => {
        e.stopPropagation();
        updateFilterBadges();
        closeFilterModal();
    });

    btnResetFilter?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.filter-chip-type').forEach(c => c.classList.remove('active'));
        document.querySelector('.filter-chip-type[data-type="all"]')?.classList.add('active');

        document.querySelectorAll('.filter-chip-genre').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.filter-chip-audio').forEach(c => c.classList.remove('active'));

        if (filterYearSelect) filterYearSelect.value = '';
        if (filterQualitySelect) filterQualitySelect.value = '';
        if (filterCountrySelect) filterCountrySelect.value = '';
        if (filterPlatformSelect) filterPlatformSelect.value = '';
        if (filterRatingSelect) filterRatingSelect.value = '';
        if (filterSortSelect) filterSortSelect.value = 'newest';

        updateFilterBadges();
    });

    filterModalClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFilterModal();
    });

    filterModal?.addEventListener('click', () => {
        closeFilterModal();
    });

    // 🔥 حل باگ: اضافه شدن استثنا برای filterModal در کلیک صفحه
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchWrapper') && !e.target.closest('#filterModal')) {
            closeSearch();
        }
    });

    // ─────────────────────────────────────────────────────────────
    // THEME & DOCK INTERACTIONS
    // ─────────────────────────────────────────────────────────────
    const themeToggleBtn = document.getElementById('themeToggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    function updateThemeIcons() {
        const isLight = document.documentElement.classList.contains('light-mode');
        if (isLight) {
            sunIcon?.classList.add('hidden');
            moonIcon?.classList.remove('hidden');
        } else {
            sunIcon?.classList.remove('hidden');
            moonIcon?.classList.add('hidden');
        }
    }
    updateThemeIcons();

    themeToggleBtn?.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        localStorage.setItem('zone_theme', isLight ? 'light' : 'dark');
        updateThemeIcons();
    });

    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            dockItems.forEach(i => i.classList.remove('dock-item--active'));
            item.classList.add('dock-item--active');
        });
    });

});
/********************************************************************************
 *                                                                              *
 *                                                                              *
 *                             ===================                              *
 *                                  فاز اول                                     *
 *                             ===================                              *
 *                                                                              *
 *                                                                              *
 ********************************************************************************/
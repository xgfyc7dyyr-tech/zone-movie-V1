/**
 * COMPONENT: HEADER & iOS LIQUID GLASS DOCK LOGIC
 */
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
    // SEARCH & HEADER INTERACTION
    // ─────────────────────────────────────────────────────────────
    const searchContainer = document.getElementById('searchContainer');
    const searchTrigger   = document.getElementById('searchTrigger');
    const searchInput     = document.getElementById('searchInput');
    const searchClose     = document.getElementById('searchClose');
    const searchResults   = document.getElementById('searchResults');
    const resultsList     = document.getElementById('resultsList');
    const resultsCount    = document.getElementById('resultsCount');

    let selectedIndex = -1;
    let debounceTimer = null;

    const moviesData = [
        { id: 1, title: "مرد عنکبوتی: روز جدید", original: "Spider-Man: Brand New Day", year: "2026", type: "movie" },
        { id: 2, title: "عشق بی‌حد و مرز", original: "Hudutsuz Sevda", year: "2024", type: "series" },
        { id: 3, title: "اشرف رویا", original: "Esref Ruya", year: "2024", type: "series" },
        { id: 4, title: "شهر دور", original: "Uzak Sehir", year: "2024", type: "series" },
        { id: 5, title: "تام و جری", original: "Tom & Jerry", year: "2021", type: "movie" }
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
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchWrapper') && !e.target.closest('#filterModal')) {
            closeSearch();
        }
    });

    // 🌗 سوییچ تم
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

    // ─────────────────────────────────────────────────────────────
    // 📱 iOS LIQUID GLASS TAB BAR ANIMATION
    // ─────────────────────────────────────────────────────────────
    const dockItems = document.querySelectorAll('.dock-item');
    const dockIndicator = document.getElementById('dockIndicator');

    function moveIndicator(el) {
        if (!el || !dockIndicator) return;
        const itemRect = el.getBoundingClientRect();
        const dockRect = el.parentElement.getBoundingClientRect();
        const offsetLeft = itemRect.left - dockRect.left;
        
        dockIndicator.style.transform = `translateX(${offsetLeft}px)`;
        dockIndicator.style.width = `${itemRect.width}px`;
    }

    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            dockItems.forEach(i => i.classList.remove('dock-item--active'));
            item.classList.add('dock-item--active');
            moveIndicator(item);
        });
    });

    function initIndicator() {
        const activeItem = document.querySelector('.dock-item--active');
        if (activeItem) {
            moveIndicator(activeItem);
        }
    }

    setTimeout(initIndicator, 200);
    window.addEventListener('resize', initIndicator);

});
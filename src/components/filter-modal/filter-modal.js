/**
 * COMPONENT: FILTER MODAL LOGIC
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const filterModal        = document.getElementById('filterModal');
    const filterModalClose   = document.getElementById('filterModalClose');
    const desktopFilterBtn  = document.getElementById('desktopFilterBtn');
    const dropdownFilterBtn = document.getElementById('dropdownFilterBtn');
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

        count += document.querySelectorAll('.filter-chip-genre.active').length;
        count += document.querySelectorAll('.filter-chip-audio.active').length;

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
        [desktopFilterBadge, dropdownFilterBadge].forEach(badge => {
            if (!badge) return;
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
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

    filterModalClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFilterModal();
    });

    filterModal?.addEventListener('click', (e) => {
        if (e.target === filterModal) closeFilterModal();
    });

    filterModal?.querySelector('.filter-modal__card')?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.querySelectorAll('.filter-chip-type').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.filter-chip-type').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.filter-chip-genre, .filter-chip-audio').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
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

        document.querySelectorAll('.filter-chip-genre, .filter-chip-audio').forEach(c => c.classList.remove('active'));

        if (filterYearSelect) filterYearSelect.value = '';
        if (filterQualitySelect) filterQualitySelect.value = '';
        if (filterCountrySelect) filterCountrySelect.value = '';
        if (filterPlatformSelect) filterPlatformSelect.value = '';
        if (filterRatingSelect) filterRatingSelect.value = '';
        if (filterSortSelect) filterSortSelect.value = 'newest';

        updateFilterBadges();
    });

});
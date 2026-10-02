/**
 * COMPONENT: MOVIE GRID & SLIDER LOGIC WITH SKELETON
 */
document.addEventListener('DOMContentLoaded', () => {

    const moviesData = [
        {
            id: 101,
            title: "سوپرگرل (Supergirl)",
            original: "Supergirl",
            year: "2026",
            rating: "8.8",
            quality: "4K",
            lang: "دوبله",
            poster: "https://intocdn.top/wp-content/uploads/2026/06/39R8Un4ozLrlTbuImzWr7tQcApb-180x280.jpg",
            category: "latest"
        },
        {
            id: 102,
            title: "مرد عنکبوتی: روز جدید",
            original: "Spider-Man: Brand New Day",
            year: "2026",
            rating: "8.2",
            quality: "1080p",
            lang: "زیرنویس",
            poster: "https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg",
            category: "latest"
        },
        {
            id: 103,
            title: "ریک و مورتی",
            original: "Rick and Morty",
            year: "2013",
            rating: "9.0",
            quality: "1080p",
            lang: "دوبله",
            poster: "https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg",
            category: "popular"
        },
        {
            id: 104,
            title: "عشق بی‌حد و مرز",
            original: "Hudutsuz Sevda",
            year: "2024",
            rating: "7.8",
            quality: "WEB-DL",
            lang: "زیرنویس",
            poster: "https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg",
            category: "updated"
        },
        {
            id: 105,
            title: "شهر دور",
            original: "Uzak Sehir",
            year: "2024",
            rating: "7.5",
            quality: "WEB-DL",
            lang: "زیرنویس",
            poster: "https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg",
            category: "updated"
        },
        {
            id: 106,
            title: "اشرف رویا",
            original: "Esref Ruya",
            year: "2024",
            rating: "7.9",
            quality: "1080p",
            lang: "زیرنویس",
            poster: "https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg",
            category: "popular"
        }
    ];

    const sectionsConfig = [
        { id: "latestMovies", title: "جدیدترین‌های این هفته", icon: "sparkles", category: "latest" },
        { id: "popularMovies", title: "محبوب‌ترین آثار", icon: "flame", category: "popular" },
        { id: "updatedSeries", title: "سریال‌های بروزشده", icon: "refresh-cw", category: "updated" }
    ];

    // ایجاد ساختار اسکلت کارت‌ها برای حالت لودینگ
    function createSkeletonCard() {
        return `
            <div class="movie-card movie-card--skeleton">
                <div class="movie-card__image">
                    <div class="skeleton-img skeleton-shimmer-effect"></div>
                    <div class="movie-card__badges">
                        <div class="skeleton-badge skeleton-shimmer-effect"></div>
                        <div class="skeleton-badge-sm skeleton-shimmer-effect"></div>
                    </div>
                </div>
                <div class="movie-card__info">
                    <div class="skeleton-title skeleton-shimmer-effect"></div>
                    <div class="movie-card__meta">
                        <div class="skeleton-text-left skeleton-shimmer-effect"></div>
                        <div class="skeleton-text-right skeleton-shimmer-effect"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function createMovieCard(movie) {
        return `
            <div class="movie-card" data-id="${movie.id}">
                <div class="movie-card__image">
                    <img src="${movie.poster}" alt="${movie.title}" loading="lazy">
                    <div class="movie-card__badges">
                        <span class="movie-card__badge movie-card__badge--imdb">${movie.rating} ★</span>
                        <span class="movie-card__badge">${movie.quality}</span>
                        <span class="movie-card__badge">${movie.lang}</span>
                    </div>
                    <div class="movie-card__overlay">
                        <div class="movie-card__play-btn">
                            <i data-lucide="play" style="width: 22px; height: 22px; fill: #fff;"></i>
                        </div>
                    </div>
                </div>
                <div class="movie-card__info">
                    <h3 class="movie-card__title">${movie.title}</h3>
                    <div class="movie-card__meta">
                        <span>${movie.year}</span>
                        <span>${movie.original.substring(0, 16)}...</span>
                    </div>
                </div>
            </div>
        `;
    }

    function renderInitialSkeletons() {
        const targetContainer = document.getElementById('movieGridSections');
        if (!targetContainer) return;

        let htmlContent = '';

        sectionsConfig.forEach(section => {
            // ساخت اسکلت‌ها (مثلا ۵ اسکلت برای هر ردیف)
            let skeletonCards = '';
            for (let i = 0; i < 5; i++) {
                skeletonCards += createSkeletonCard();
            }

            htmlContent += `
                <section class="movie-section" id="${section.id}Section">
                    <div class="section-header">
                        <h2 class="section-title">
                            <i data-lucide="${section.icon}"></i>
                            <span>${section.title}</span>
                        </h2>
                        <div class="section-nav">
                            <button class="section-arrow arrow-prev" aria-label="اسلاید قبلی">
                                <i data-lucide="chevron-right"></i>
                            </button>
                            <button class="section-arrow arrow-next" aria-label="اسلاید بعدی">
                                <i data-lucide="chevron-left"></i>
                            </button>
                        </div>
                    </div>
                    <div class="movie-slider-wrapper" id="${section.id}Wrapper">
                        <div class="movie-slider-track fade-in" id="${section.id}Track">
                            ${skeletonCards}
                        </div>
                    </div>
                </section>
            `;
        });

        targetContainer.innerHTML = htmlContent;

        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } catch (e) {}
    }

    function loadActualData() {
        sectionsConfig.forEach(section => {
            const track = document.getElementById(`${section.id}Track`);
            if (!track) return;

            // انیمیشن ترنزیشن خارج شدن فید اسکلت‌ها
            track.classList.remove('fade-in');
            track.classList.add('fade-out');

            setTimeout(() => {
                const filteredMovies = moviesData.filter(m => m.category === section.category || section.category === 'latest');
                track.innerHTML = filteredMovies.map(movie => createMovieCard(movie)).join('');
                
                track.classList.remove('fade-out');
                track.classList.add('fade-in');

                try {
                    if (window.lucide && typeof window.lucide.createIcons === 'function') {
                        window.lucide.createIcons();
                    }
                } catch (e) {}
            }, 350); // کمی زمان برای اتمام انیمیشن fade-out
        });

        // نصب مجدد هندلر اسکرولرها برای کارت‌های جدید لود شده
        sectionsConfig.forEach(section => {
            const wrapper = document.getElementById(`${section.id}Wrapper`);
            const prevBtn = document.querySelector(`#${section.id}Section .arrow-prev`);
            const nextBtn = document.querySelector(`#${section.id}Section .arrow-next`);

            if (!wrapper || !prevBtn || !nextBtn) return;

            const scrollDistance = 280;

            nextBtn.addEventListener('click', () => {
                wrapper.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                wrapper.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            });
        });
    }

    // ۱. ابتدا ساختارهای لودینگ اسکلتی رو لود کن
    renderInitialSkeletons();

    // ۲. شبیه‌ساز فراخوانی API به مدت ۱.۵ ثانیه و سپس رندر داده‌های واقعی
    setTimeout(() => {
        loadActualData();
    }, 1500);
});
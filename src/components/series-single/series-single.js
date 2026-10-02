/**
 * COMPONENT: COMPLETE SERIES SINGLE CONTROLLER (FULL FIDELITY)
 */

// ۱. استایل‌های دیزاین سیستم و پایه
import '../../styles/variables.css';
import '../../styles/reset.css';

// ۲. کامپوننت‌های مشترک لایه‌بندی
import '../header/header.css';
import '../header/header.js';
import '../footer/footer.css';
import '../footer/footer.js';

// ۳. کامپوننت فیلتر پیشرفته
import '../filter-modal/filter-modal.css';
import '../filter-modal/filter-modal.js';

// ۴. استایل‌های اختصاصی همین صفحه
import './series-single.css';

function initSeriesPage() {

    function initIcons() {
        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } catch (e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // 🎥 ۱. سیستم ویدیوی پس‌زمینه زنده با نوار پیشرفت حلقه‌ای و Replay
    // ─────────────────────────────────────────────────────────────
    function initHeroVideo() {
        const heroVideo         = document.getElementById('heroVideo');
        const muteToggleBtn     = document.getElementById('muteToggleBtn');
        const soundProgressBar  = document.getElementById('soundProgressBar');
        const mainPlayBtn       = document.getElementById('btnPlayMainTrailer');

        const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 20;
        let clickTimer = null;
        let clickCount = 0;

        if (heroVideo) {
            muteToggleBtn?.classList.add('is-loading');

            const onVideoPlayReady = () => {
                muteToggleBtn?.classList.remove('is-loading');
                heroVideo.play().then(() => {
                    heroVideo.classList.add('is-playing');
                }).catch(() => {});
            };

            if (heroVideo.readyState >= 3) {
                onVideoPlayReady();
            } else {
                heroVideo.addEventListener('canplay', onVideoPlayReady, { once: true });
                heroVideo.addEventListener('loadeddata', onVideoPlayReady, { once: true });
            }

            heroVideo.addEventListener('timeupdate', () => {
                if (!soundProgressBar || !heroVideo.duration) return;
                const progress = heroVideo.currentTime / heroVideo.duration;
                const offset = CIRCLE_CIRCUMFERENCE - (progress * CIRCLE_CIRCUMFERENCE);
                soundProgressBar.style.strokeDashoffset = offset;
            });

            function stopHeroTrailerAndShowReplay() {
                heroVideo.pause();
                heroVideo.currentTime = 0;
                heroVideo.classList.remove('is-playing');
                muteToggleBtn?.classList.remove('is-unmuted');
                muteToggleBtn?.classList.add('is-ended');
                muteToggleBtn?.setAttribute('title', 'پخش مجدد پیش‌نمایش');
                if (soundProgressBar) {
                    soundProgressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;
                }
            }

            function playHeroTrailerFromStart(withSound = false) {
                muteToggleBtn?.classList.remove('is-ended');
                heroVideo.currentTime = 0;
                heroVideo.muted = !withSound;
                updateSoundState(heroVideo.muted);
                heroVideo.play().then(() => {
                    heroVideo.classList.add('is-playing');
                }).catch(() => {});
            }

            heroVideo.addEventListener('ended', () => {
                stopHeroTrailerAndShowReplay();
            });

            function updateSoundState(isMuted) {
                if (isMuted) {
                    muteToggleBtn?.classList.remove('is-unmuted');
                    muteToggleBtn?.setAttribute('title', 'وصل کردن صدای پیش‌نمایش');
                } else {
                    muteToggleBtn?.classList.add('is-unmuted');
                    muteToggleBtn?.setAttribute('title', 'قطع کردن صدا');
                }
            }

            muteToggleBtn?.addEventListener('click', function(e) {
                e.stopPropagation();

                if (this.classList.contains('is-ended')) {
                    playHeroTrailerFromStart(true);
                    return;
                }

                clickCount++;

                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        heroVideo.muted = !heroVideo.muted;
                        updateSoundState(heroVideo.muted);
                        clickCount = 0;
                    }, 260);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    stopHeroTrailerAndShowReplay();
                }
            });

            mainPlayBtn?.addEventListener('click', function(e) {
                e.stopPropagation();
                playHeroTrailerFromStart(true);
            });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 🎨 ۲. سیستم هاله رنگ واکنش‌گرا با فید دولایه بدون لگ (Dual Buffer)
    // ─────────────────────────────────────────────────────────────
    function initCardBackdrops() {
        const bgA = document.getElementById('ambientBackdropA');
        const bgB = document.getElementById('ambientBackdropB');
        const defaultBg = "https://image.tmdb.org/t/p/original/9BBTo63ANSm5v7g9rPBb9fZRjzp.jpg";
        const movieCards = document.querySelectorAll('.movie-3d-card[data-bg]');
        const sliderWrapper = document.getElementById('franchiseSliderWrapper');

        if (!bgA || !bgB) return;

        let activeLayer = 'A';

        function switchBackdrop(newUrl) {
            if (activeLayer === 'A') {
                bgB.style.backgroundImage = `url('${newUrl}')`;
                bgB.style.opacity = '1';
                bgA.style.opacity = '0';
                activeLayer = 'B';
            } else {
                bgA.style.backgroundImage = `url('${newUrl}')`;
                bgA.style.opacity = '1';
                bgB.style.opacity = '0';
                activeLayer = 'A';
            }
        }

        movieCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const cardBg = this.dataset.bg;
                if (cardBg) switchBackdrop(cardBg);
            });
        });

        sliderWrapper?.addEventListener('mouseleave', () => {
            switchBackdrop(defaultBg);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 📂 ۳. تب‌بندی عریض کل محتوا
    // ─────────────────────────────────────────────────────────────
    const tabButtons = document.querySelectorAll('.tab-nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const targetId = this.dataset.target;

            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.add('hidden'));

            this.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.remove('hidden');
            initIcons();
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 📖 ۴. سیستم «ادامه مطلب» خلاصه داستان
    // ─────────────────────────────────────────────────────────────
    function initSummaryReadMore() {
        const movieSummary = document.getElementById('movieSummary');
        const btnReadMore  = document.getElementById('btnReadMore');
        if (!movieSummary || !btnReadMore) return;

        const isOverflowing = movieSummary.scrollHeight > (movieSummary.clientHeight + 4);

        if (isOverflowing) {
            btnReadMore.style.display = 'inline-flex';
        } else {
            btnReadMore.style.display = 'none';
        }

        btnReadMore.onclick = function(e) {
            e.stopPropagation();
            const isExpanded = movieSummary.classList.toggle('expanded');

            if (isExpanded) {
                this.innerHTML = '<span>بستن مطلب</span> <i data-lucide="chevron-up"></i>';
            } else {
                this.innerHTML = '<span>ادامه مطلب</span> <i data-lucide="chevron-down"></i>';
            }
            initIcons();
        };
    }

    // ─────────────────────────────────────────────────────────────
    // 🌟 ۵. سیستم ۵ ستاره امتیازدهی کاربران با محدودیت ۳ ویرایش
    // ─────────────────────────────────────────────────────────────
    function initStarRating() {
        const ratingStarsContainer   = document.getElementById('ratingStars');
        const ratingStatusBadge      = document.getElementById('ratingStatusBadge');
        const ratingConfirmModal     = document.getElementById('ratingConfirmModal');
        const btnRatingConfirmYes    = document.getElementById('btnRatingConfirmYes');
        const btnRatingConfirmCancel = document.getElementById('btnRatingConfirmCancel');
        const previewScoreSpan       = document.getElementById('previewScoreSpan');
        const userStarRatingBox      = document.getElementById('userStarRatingBox');
        const userVotedConfirmedCard = document.getElementById('userVotedConfirmedCard');
        const confirmedUserScoreText = document.getElementById('confirmedUserScoreText');
        const btnEditRating          = document.getElementById('btnEditRating');

        const statusTexts = ['افتضاح', 'ضعیف', 'متوسط', 'خوب', 'فوق‌العاده'];
        const SERIES_STORAGE_KEY = 'zonemovi_user_voted_daredevil_2026';
        const MAX_EDITS = 3;

        let pendingSelectedScore = 0;
        let pendingStarValue = 0;

        function getStoredVoteData() {
            try {
                const saved = localStorage.getItem(SERIES_STORAGE_KEY);
                return saved ? JSON.parse(saved) : null;
            } catch (e) {
                return null;
            }
        }

        function checkSavedVoteState() {
            const data = getStoredVoteData();
            if (data && data.score) {
                showConfirmedState(data.score, data.editsCount || 0);
            }
        }

        function showConfirmedState(score, editsCount) {
            if (!userStarRatingBox || !userVotedConfirmedCard) return;
            userStarRatingBox.classList.add('hidden');
            userVotedConfirmedCard.classList.remove('hidden');

            const remaining = MAX_EDITS - editsCount;

            if (confirmedUserScoreText) {
                confirmedUserScoreText.textContent = `امتیاز شما: ${score} / 10 (در صف پردازش و اعمال در سرور)`;
            }

            if (btnEditRating) {
                if (remaining > 0) {
                    btnEditRating.textContent = `ویرایش نمره (${remaining} فرصت باقی‌مانده)`;
                    btnEditRating.disabled = false;
                } else {
                    btnEditRating.textContent = `سقف ویرایش تکمیل شد`;
                    btnEditRating.disabled = true;
                }
            }
            initIcons();
        }

        function resetToVotingBox() {
            if (!userStarRatingBox || !userVotedConfirmedCard) return;
            userVotedConfirmedCard.classList.add('hidden');
            userStarRatingBox.classList.remove('hidden');
            resetStars();
            if (ratingStatusBadge) ratingStatusBadge.classList.add('hidden');
            initIcons();
        }

        btnEditRating?.addEventListener('click', function(e) {
            e.stopPropagation();
            const data = getStoredVoteData();
            const currentEdits = data ? (data.editsCount || 0) : 0;
            if (currentEdits < MAX_EDITS) {
                resetToVotingBox();
            }
        });

        if (ratingStarsContainer) {
            ratingStarsContainer.addEventListener('mouseover', (e) => {
                const star = e.target.closest('.star-btn');
                if (!star) return;

                const value = parseInt(star.getAttribute('data-value') || star.dataset.value, 10);
                highlightStars(value - 1);
                
                if (ratingStatusBadge) {
                    ratingStatusBadge.textContent = statusTexts[value - 1];
                    ratingStatusBadge.classList.remove('hidden');
                    ratingStatusBadge.style.background = 'rgba(245, 158, 11, 0.08)';
                    ratingStatusBadge.style.borderColor = 'rgba(245, 158, 11, 0.35)';
                    ratingStatusBadge.style.color = '#f59e0b';
                }
            });

            ratingStarsContainer.addEventListener('mouseleave', () => {
                resetStars();
                if (ratingStatusBadge) ratingStatusBadge.classList.add('hidden');
            });

            ratingStarsContainer.addEventListener('click', (e) => {
                const star = e.target.closest('.star-btn');
                if (!star) return;

                e.preventDefault();
                e.stopPropagation();

                pendingStarValue = parseInt(star.getAttribute('data-value') || star.dataset.value, 10);
                pendingSelectedScore = pendingStarValue * 2;

                if (previewScoreSpan) {
                    previewScoreSpan.textContent = `${pendingSelectedScore} از 10 (${statusTexts[pendingStarValue - 1]})`;
                }

                if (ratingConfirmModal) {
                    ratingConfirmModal.classList.remove('hidden');
                    initIcons();
                }
            });
        }

        btnRatingConfirmYes?.addEventListener('click', function(e) {
            e.stopPropagation();
            ratingConfirmModal?.classList.add('hidden');

            const prevData = getStoredVoteData();
            const prevEdits = prevData ? (prevData.editsCount || 0) : 0;
            const newEdits = prevData ? prevEdits + 1 : 0;

            try {
                localStorage.setItem(SERIES_STORAGE_KEY, JSON.stringify({
                    score: pendingSelectedScore,
                    editsCount: newEdits,
                    timestamp: Date.now()
                }));
            } catch (e) {}

            showConfirmedState(pendingSelectedScore, newEdits);
            alert(`با تشکر از ثبت نظر شما! امتیاز ${pendingSelectedScore} از 10 شما برای سریال ثبت شد.`);
        });

        btnRatingConfirmCancel?.addEventListener('click', function(e) {
            e.stopPropagation();
            ratingConfirmModal?.classList.add('hidden');
            resetStars();
            if (ratingStatusBadge) ratingStatusBadge.classList.add('hidden');
        });

        function highlightStars(index) {
            if (!ratingStarsContainer) return;
            const stars = ratingStarsContainer.querySelectorAll('.star-btn');
            stars.forEach((s, idx) => {
                if (idx <= index) s.classList.add('hover');
                else s.classList.remove('hover');
            });
        }

        function resetStars() {
            if (!ratingStarsContainer) return;
            const stars = ratingStarsContainer.querySelectorAll('.star-btn');
            stars.forEach(s => s.classList.remove('hover'));
        }

        checkSavedVoteState();
    }

    // ─────────────────────────────────────────────────────────────
    // 📺 ۶. سیستم انتخاب فصل، رندر قسمت‌ها و باکس‌های دانلود ریلی
    // ─────────────────────────────────────────────────────────────
    const seasonsData = {
        1: [
            {
                number: 1,
                title: "آغاز دوباره (Resurrection)",
                airDate: "14 اسفند 1403",
                duration: "54 دقیقه",
                rating: "9.2",
                thumb: "https://image.tmdb.org/t/p/original/9BBTo63ANSm5v7g9rPBb9fZRjzp.jpg",
                overview: "مت مورداک پس از سال‌ها دوری از هویت دردویل، با افزایش جرم و فساد در هلز کیچن مجبور به بازگشت می‌شود."
            },
            {
                number: 2,
                title: "قانون و بی‌قانونی (Law and Order)",
                airDate: "21 اسفند 1403",
                duration: "51 دقیقه",
                rating: "8.7",
                thumb: "https://intocdn.top/wp-content/uploads/2026/06/h37hqVLmCW00ImewLAHT1DadOky.jpg",
                overview: "ویلسون فیسک کارزار انتخاباتی خود را برای شهرداری نیویورک آغاز می‌کند و وکالت مت به چالش کشیده می‌شود."
            },
            {
                number: 3,
                title: "تقاطع مرگ (Crossroads)",
                airDate: "28 اسفند 1403",
                duration: "58 دقیقه",
                rating: "9.6",
                thumb: "https://intocdn.top/wp-content/uploads/2024/11/bJtOEfr3jZMYLDNAoinXzvVAhre.jpg",
                overview: "فرانک کسل (پانیشر) وارد صحنه می‌شود و متوجه توطئه‌ای عمیق درون اداره پلیس نیویورک می‌گردد."
            },
            {
                number: 4,
                title: "سایه شیطان (Shadow of the Devil)",
                airDate: "5 فروردین 1404",
                duration: "49 دقیقه",
                rating: "8.9",
                thumb: "https://image.tmdb.org/t/p/original/vc8bCGjdVBDXg9SpzHvaTevgNmG.jpg",
                overview: "کینگ‌پین نقشه خود را برای ریشه‌کن کردن پارتیزان‌های ماسک‌دار در سطح شهر کلید می‌زند."
            }
        ],
        2: []
    };

    let currentSeason = 1;
    let currentEpisodesOrder = 'asc';

    function renderEpisodes() {
        const container = document.getElementById('episodesListContainer');
        if (!container) return;

        let episodes = seasonsData[currentSeason] ? [...seasonsData[currentSeason]] : [];

        if (episodes.length === 0) {
            container.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-muted); font-size: 0.9rem;" class="glass-refraction">
                    <i data-lucide="clock" style="width:36px; height:36px; margin: 0 auto 10px auto; color: var(--primary); display:block;"></i>
                    قسمت‌های این فصل هنوز منتشر نشده است و به زودی پس از پخش جهانی در دسترس قرار می‌گیرد.
                </div>
            `;
            initIcons();
            return;
        }

        if (currentEpisodesOrder === 'desc') {
            episodes.reverse();
        }

        container.innerHTML = episodes.map(ep => `
            <div class="episode-card-item glass-refraction" data-ep="${ep.number}">
                <div class="episode-card-header">
                    <div class="episode-meta-group">
                        <div class="episode-thumb-wrap">
                            <img src="${ep.thumb}" alt="${ep.title}" loading="lazy">
                            <span class="episode-number-badge">قسمت ${ep.number}</span>
                            <span class="episode-duration-badge">${ep.duration}</span>
                        </div>
                        <div class="episode-info-text">
                            <div class="episode-title-row">
                                <h4 class="episode-title">${ep.title}</h4>
                                <span class="episode-imdb-score">★ ${ep.rating}</span>
                            </div>
                            <span class="episode-air-date">تاریخ پخش: ${ep.airDate}</span>
                            <p class="episode-overview">${ep.overview}</p>
                        </div>
                    </div>
                    <div class="episode-header-actions">
                        <span class="btn-toggle-ep-dl"><i data-lucide="download" style="width:14px; height:14px;"></i> لینک‌های دانلود</span>
                        <i data-lucide="chevron-down" class="episode-chevron"></i>
                    </div>
                </div>

                <div class="episode-dl-drawer">
                    <div class="episode-dl-content">
                        
                        <!-- کیفیت 1080p دوبله -->
                        <div class="dl-quality-card">
                            <div class="dl-quality-top">
                                <div class="dl-quality-badges">
                                    <span class="dl-badge dl-badge--1080">1080p Full HD</span>
                                    <span class="dl-meta-specs">WEB-DL • x264 • دوبله فارسی دوزبانه</span>
                                    <span class="dl-star-badge"><i data-lucide="star"></i> پیشنهادی</span>
                                </div>
                                <div class="dl-filesize"><i data-lucide="hard-drive"></i> 850 MB</div>
                            </div>
                            <div class="dl-actions-rail">
                                <div class="dl-servers-cluster">
                                    <a href="#" class="btn-server-dl btn-server-dl--primary"><i data-lucide="download"></i> دانلود مستقیم</a>
                                    <a href="#" class="btn-server-dl"><i data-lucide="server"></i> سرور کمکی</a>
                                    <a href="#" class="btn-server-dl btn-server-dl--audio"><i data-lucide="volume-2"></i> صوت دوبله</a>
                                </div>
                                <button class="btn-broken-link" title="گزارش خرابی"><i data-lucide="alert-triangle"></i> خرابی لینک</button>
                            </div>
                        </div>

                        <!-- کیفیت 720p زیرنویس -->
                        <div class="dl-quality-card">
                            <div class="dl-quality-top">
                                <div class="dl-quality-badges">
                                    <span class="dl-badge dl-badge--720">720p HD</span>
                                    <span class="dl-meta-specs">SoftSub • زیرنویس فارسی چسبیده</span>
                                </div>
                                <div class="dl-filesize"><i data-lucide="hard-drive"></i> 480 MB</div>
                            </div>
                            <div class="dl-actions-rail">
                                <div class="dl-servers-cluster">
                                    <a href="#" class="btn-server-dl btn-server-dl--primary"><i data-lucide="download"></i> دانلود مستقیم</a>
                                    <a href="#" class="btn-server-dl"><i data-lucide="server"></i> سرور کمکی</a>
                                    <a href="#" class="btn-server-dl btn-server-dl--sub"><i data-lucide="file-text"></i> فایل SRT</a>
                                </div>
                                <button class="btn-broken-link" title="گزارش خرابی"><i data-lucide="alert-triangle"></i> خرابی لینک</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `).join('');

        initIcons();
    }

    // باز و بسته شدن کشوی دانلود هر قسمت
    document.addEventListener('click', (e) => {
        const header = e.target.closest('.episode-card-header');
        if (header) {
            e.stopPropagation();
            const parentCard = header.closest('.episode-card-item');
            parentCard?.classList.toggle('open');
            initIcons();
        }
    });

    // سوییچ فصل از منوی کشویی
    const seasonSelect = document.getElementById('seasonSelect');
    seasonSelect?.addEventListener('change', function(e) {
        currentSeason = parseInt(this.value, 10);
        renderEpisodes();
    });

    // معکوس‌سازی ترتیب قسمت‌ها
    const btnSortEpisodes = document.getElementById('btnSortEpisodes');
    const sortEpisodesText = document.getElementById('sortEpisodesText');

    btnSortEpisodes?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentEpisodesOrder = currentEpisodesOrder === 'asc' ? 'desc' : 'asc';
        if (sortEpisodesText) {
            sortEpisodesText.textContent = currentEpisodesOrder === 'asc' 
                ? 'ترتیب: قسمت اول به آخر' 
                : 'ترتیب: قسمت آخر به اول';
        }
        renderEpisodes();
    });

    // ─────────────────────────────────────────────────────────────
    // 📊 ۷. موتور ساخت جدول حرارتی امتیازات (Ratings Grid Matrix S1 to S75)
    // ─────────────────────────────────────────────────────────────
    function buildRatingsMatrix() {
        const matrixTable = document.getElementById('ratingsMatrixTable');
        if (!matrixTable) return;

        const TOTAL_SEASONS = 75; // از فصل S1 تا S75
        const MAX_EPISODES = 18;  // ۱۸ قسمت در هر فصل

        let tableHTML = '<thead><tr><th class="col-ep-header">قسمت</th>';
        for (let s = 1; s <= TOTAL_SEASONS; s++) {
            tableHTML += `<th>S${s}</th>`;
        }
        tableHTML += '</tr></thead><tbody>';

        for (let ep = 1; ep <= MAX_EPISODES; ep++) {
            tableHTML += `<tr><td class="ep-label">E${ep}</td>`;

            for (let s = 1; s <= TOTAL_SEASONS; s++) {
                let score = '?';
                let heatClass = 'heat-unrated';
                let tooltip = `فصل ${s} • قسمت ${ep}: بدون نمره`;

                // نمرات فصل ۱
                if (s === 1) {
                    if (ep === 1) { score = '9.2'; heatClass = 'heat-great'; }
                    else if (ep === 2) { score = '7.0'; heatClass = 'heat-good'; }
                    else if (ep === 3) { score = '3.5'; heatClass = 'heat-bad'; }
                    else if (ep === 4) { score = '2.5'; heatClass = 'heat-bad'; }
                    else if (ep === 5) { score = '1.0'; heatClass = 'heat-bad'; }
                    else if (ep <= 10) { score = (7.5 + (ep * 0.2)).toFixed(1); heatClass = 'heat-good'; }
                    tooltip = `فصل 1 • قسمت ${ep} (نمره IMDb: ${score})`;
                }

                // شاهکار ۱۰.۰ در فصل ۳۶ قسمت ۱ (S36 E1)
                if (s === 36 && ep === 1) {
                    score = '10.0';
                    heatClass = 'heat-perfect';
                    tooltip = `فصل 36 • قسمت 1: شاهکار نمره کامل (10.0 / 10)`;
                }

                tableHTML += `
                    <td>
                        <div class="matrix-cell-score ${heatClass}" title="${tooltip}">
                            ${score}
                        </div>
                    </td>
                `;
            }

            tableHTML += '</tr>';
        }

        tableHTML += '</tbody>';
        matrixTable.innerHTML = tableHTML;
    }

    const ratingsMatrixModal    = document.getElementById('ratingsMatrixModal');
    const btnOpenRatingsGrid    = document.getElementById('btnOpenRatingsGrid');
    const btnCloseRatingsMatrix = document.getElementById('btnCloseRatingsMatrix');
    const btnMatrixDone         = document.getElementById('btnMatrixDone');

    function openMatrixModal() {
        ratingsMatrixModal?.classList.remove('hidden');
        ratingsMatrixModal?.setAttribute('aria-hidden', 'false');
        initIcons();
    }

    function closeMatrixModal() {
        ratingsMatrixModal?.classList.add('hidden');
        ratingsMatrixModal?.setAttribute('aria-hidden', 'true');
    }

    btnOpenRatingsGrid?.addEventListener('click', (e) => {
        e.stopPropagation();
        openMatrixModal();
    });

    [btnCloseRatingsMatrix, btnMatrixDone].forEach(btn => {
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMatrixModal();
        });
    });

    ratingsMatrixModal?.addEventListener('click', (e) => {
        if (e.target === ratingsMatrixModal) closeMatrixModal();
    });

    // ─────────────────────────────────────────────────────────────
    // 🎥 ۸. تریلر ویدیویی مدال
    // ─────────────────────────────────────────────────────────────
    const trailerModal      = document.getElementById('trailerModal');
    const btnCloseTrailer   = document.getElementById('btnCloseTrailer');
    const trailerVideo      = document.getElementById('trailerVideo');
    const videoSource       = document.getElementById('videoSource');
    const modalTrailerTitle = document.getElementById('modalTrailerTitle');

    function openTrailer(videoUrl, titleText) {
        if (!trailerModal || !trailerVideo || !videoSource) return;

        videoSource.setAttribute('src', videoUrl);
        trailerVideo.load();
        
        if (modalTrailerTitle && titleText) {
            modalTrailerTitle.innerHTML = `<i data-lucide="play-circle"></i> ${titleText}`;
        }

        trailerModal.classList.remove('hidden');
        trailerModal.setAttribute('aria-hidden', 'false');
        trailerVideo.play();
        initIcons();
    }

    function closeTrailer() {
        if (!trailerModal || !trailerVideo) return;
        trailerModal.classList.add('hidden');
        trailerModal.setAttribute('aria-hidden', 'true');
        trailerVideo.pause();
        trailerVideo.currentTime = 0;
    }

    document.addEventListener('click', function(e) {
        const imdbVideoCard = e.target.closest('.imdb-video-card');
        if (imdbVideoCard) {
            e.stopPropagation();
            const videoUrl = imdbVideoCard.dataset.video;
            const titleText = imdbVideoCard.dataset.title;
            if (videoUrl) openTrailer(videoUrl, titleText);
        }
    });

    btnCloseTrailer?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTrailer();
    });

    trailerModal?.addEventListener('click', (e) => {
        if (e.target === trailerModal) closeTrailer();
    });

    // ─────────────────────────────────────────────────────────────
    // 🔗 ۹. اشتراک‌گذاری، لایک و کپی لینک
    // ─────────────────────────────────────────────────────────────
    const btnShare = document.getElementById('btnShare');
    const shareDropdown = document.getElementById('shareDropdown');
    const btnCopyLink = document.getElementById('btnCopyLink');

    btnShare?.addEventListener('click', function(e) {
        e.stopPropagation();
        shareDropdown?.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.share-wrapper-btn')) {
            shareDropdown?.classList.add('hidden');
        }
    });

    btnCopyLink?.addEventListener('click', function(e) {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i data-lucide="check"></i> کپی شد!';
            initIcons();
            setTimeout(() => {
                this.innerHTML = originalText;
                initIcons();
            }, 2000);
        });
    });

    // لایک سریال
    document.getElementById('btnLikeReact')?.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('liked');
        initIcons();
    });

    // گزارش خرابی لینک
    document.addEventListener('click', function(e) {
        const brokenBtn = e.target.closest('.btn-broken-link');
        if (brokenBtn) {
            e.stopPropagation();
            alert('گزارش خرابی لینک ثبت شد. تیم فنی زون‌مووی لینک دانلود را بررسی خواهد کرد.');
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 👥 ۱۰. دنبال کردن و زنگوله بازیگران
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('click', function(e) {
        const followBtn = e.target.closest('.btn-follow-crew');
        if (followBtn) {
            e.stopPropagation();
            const isFollowing = followBtn.classList.toggle('is-following');
            const spanText = followBtn.querySelector('span');
            if (isFollowing) {
                if (spanText) spanText.textContent = 'دنبال شد';
                followBtn.style.background = 'var(--primary)';
                followBtn.style.color = '#fff';
            } else {
                if (spanText) spanText.textContent = 'دنبال کردن';
                followBtn.style.background = '';
                followBtn.style.color = '';
            }
            initIcons();
        }

        const bellBtn = e.target.closest('.btn-bell-crew');
        if (bellBtn) {
            e.stopPropagation();
            const isActive = bellBtn.classList.toggle('is-active');
            bellBtn.setAttribute('title', isActive ? 'اعلان سریال جدید فعال شد' : 'فعال‌سازی اعلان سریال جدید');
            initIcons();
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 💬 ۱۱. کامنت‌ها، پجینیشن، ریپلای و ضداسپویل
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('click', function(e) {
        const spoilerWrapper = e.target.closest('.comment-spoiler-wrapper');
        if (spoilerWrapper) {
            e.stopPropagation();
            spoilerWrapper.classList.toggle('revealed');
        }
    });

    const pagNumBtns = document.querySelectorAll('.pag-btn--num');
    const pagPrevBtn = document.getElementById('pagPrevBtn');
    const pagNextBtn = document.getElementById('pagNextBtn');
    let currentCommentPage = 1;
    const totalCommentPages = 2;

    function goToCommentPage(page) {
        currentCommentPage = page;
        document.querySelectorAll('.comments-page').forEach((p, idx) => {
            p.classList.toggle('hidden', idx + 1 !== page);
            p.classList.toggle('active', idx + 1 === page);
        });
        pagNumBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page, 10) === page);
        });
        initIcons();
    }

    pagNumBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            goToCommentPage(parseInt(this.dataset.page, 10));
        });
    });

    pagPrevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCommentPage > 1) goToCommentPage(currentCommentPage - 1);
    });

    pagNextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentCommentPage < totalCommentPages) goToCommentPage(currentCommentPage + 1);
    });

    // ارسال نظر جدید
    const btnSubmitComment = document.getElementById('btnSubmitComment');
    const commentText      = document.getElementById('commentText');
    const commentAuthor    = document.getElementById('commentAuthor');
    const commentIsSpoiler = document.getElementById('commentIsSpoiler');
    const commentsPage1    = document.getElementById('commentsPage1');
    let commentCounter = 50;

    btnSubmitComment?.addEventListener('click', function(e) {
        e.stopPropagation();
        const text = commentText?.value.trim();
        const author = commentAuthor?.value.trim() || "کاربر مهمان";
        if (!text) return;

        commentCounter++;
        const isSpoiler = commentIsSpoiler?.checked;

        let contentHTML = isSpoiler ? `
            <div class="comment-spoiler-wrapper">
                <div class="comment-spoiler-warning"><i data-lucide="alert-triangle" style="width:14px; margin-left:4px;"></i> حاوی اسپویل داستان (برای مشاهده کلیک کنید)</div>
                <p class="comment-text is-spoiler">${text}</p>
            </div>
        ` : `<p class="comment-text">${text}</p>`;

        const newCommentHTML = `
            <div class="comment-card-wrapper" data-id="comment-${commentCounter}" style="animation: fadeIn 0.4s ease forwards;">
                <div class="comment-item">
                    <div class="comment-side-likes">
                        <button class="btn-comment-like" data-count="0" title="می‌پسندم"><i data-lucide="thumbs-up"></i><span class="like-count">0</span></button>
                        <button class="btn-comment-dislike" data-count="0" title="نمی‌پسندم"><i data-lucide="thumbs-down"></i><span class="dislike-count">0</span></button>
                    </div>
                    <div class="comment-avatar"><img src="https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg" alt="کاربر"></div>
                    <div class="comment-content">
                        <div class="comment-user">${author} <span class="comment-date">همین الان</span></div>
                        ${contentHTML}
                        <div class="comment-actions">
                            <button class="btn-comment-reply" data-id="comment-${commentCounter}" data-author="${author}"><i data-lucide="reply-all"></i> پاسخ به این نظر</button>
                        </div>
                    </div>
                </div>
                <div class="nested-replies-container"></div>
            </div>
        `;

        if (commentsPage1) {
            commentsPage1.insertAdjacentHTML('afterbegin', newCommentHTML);
            goToCommentPage(1);
        }

        if (commentText) commentText.value = '';
        if (commentIsSpoiler) commentIsSpoiler.checked = false;
        initIcons();
    });

    // ریپلای و لایک کامنت‌ها
    document.addEventListener('click', function(e) {
        const btnCommentLike = e.target.closest('.btn-comment-like');
        if (btnCommentLike) {
            e.stopPropagation();
            let count = parseInt(btnCommentLike.dataset.count, 10);
            if (btnCommentLike.classList.contains('active')) {
                btnCommentLike.classList.remove('active');
                count--;
            } else {
                btnCommentLike.classList.add('active');
                count++;
            }
            btnCommentLike.dataset.count = count;
            btnCommentLike.querySelector('.like-count').textContent = count;
        }

        const replyBtn = e.target.closest('.btn-comment-reply');
        if (replyBtn) {
            e.stopPropagation();
            const commentId = replyBtn.dataset.id;
            const targetAuthor = replyBtn.dataset.author || "کاربر";
            const parentWrapper = document.querySelector(`.comment-card-wrapper[data-id="${commentId}"]`);
            if (!parentWrapper || parentWrapper.querySelector('.comment-reply-form')) return;

            const replyFormHTML = `
                <div class="comment-reply-form glass-refraction">
                    <textarea class="reply-textarea" placeholder="پاسخ خود به ${targetAuthor} را بنویسید..."></textarea>
                    <div class="reply-form-actions">
                        <button class="btn-cancel-reply" type="button">انصراف</button>
                        <button class="btn-submit-reply" data-id="${commentId}" data-target-author="${targetAuthor}" type="button">ثبت پاسخ</button>
                    </div>
                </div>
            `;
            const nestedContainer = parentWrapper.querySelector('.nested-replies-container');
            nestedContainer?.insertAdjacentHTML('beforebegin', replyFormHTML);
        }

        const cancelReply = e.target.closest('.btn-cancel-reply');
        if (cancelReply) {
            e.stopPropagation();
            cancelReply.closest('.comment-reply-form')?.remove();
        }

        const submitReply = e.target.closest('.btn-submit-reply');
        if (submitReply) {
            e.stopPropagation();
            const commentId = submitReply.dataset.id;
            const targetAuthor = submitReply.dataset.targetAuthor || "کاربر";
            const form = submitReply.closest('.comment-reply-form');
            const text = form?.querySelector('.reply-textarea')?.value.trim();
            if (!text) return;

            const parentWrapper = document.querySelector(`.comment-card-wrapper[data-id="${commentId}"]`);
            const nestedContainer = parentWrapper?.querySelector('.nested-replies-container');

            const replyHTML = `
                <div class="comment-item comment-item--reply" style="animation: fadeIn 0.3s ease forwards;">
                    <div class="comment-avatar"><img src="https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg" alt="کاربر"></div>
                    <div class="comment-content">
                        <div class="comment-user">
                            <span>پاسخ دهنده</span>
                            <span class="reply-target-tag"><i data-lucide="corner-down-left"></i> در پاسخ به @${targetAuthor}</span>
                            <span class="comment-date">همین الان</span>
                        </div>
                        <p class="comment-text">${text}</p>
                    </div>
                </div>
            `;
            nestedContainer?.insertAdjacentHTML('beforeend', replyHTML);
            form?.remove();
            initIcons();
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 👥 ۱۲. اسلایدرهای افقی بازیگران و آثار ۳ بعدی
    // ─────────────────────────────────────────────────────────────
    const castSliderWrapper = document.getElementById('castSliderWrapper');
    const franchiseSliderWrapper = document.getElementById('franchiseSliderWrapper');
    const franchisePrev = document.getElementById('franchisePrev');
    const franchiseNext = document.getElementById('franchiseNext');

    if (franchiseSliderWrapper && franchisePrev && franchiseNext) {
        const scrollAmount = 310;
        franchiseNext.addEventListener('click', () => {
            franchiseSliderWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        franchisePrev.addEventListener('click', () => {
            franchiseSliderWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // راه‌اندازی توابع
    initHeroVideo();
    initCardBackdrops();
    initSummaryReadMore();
    initStarRating();
    renderEpisodes();
    buildRatingsMatrix();
    window.addEventListener('resize', initSummaryReadMore);
    initIcons();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initSeriesPage();
} else {
    document.addEventListener('DOMContentLoaded', initSeriesPage);
}
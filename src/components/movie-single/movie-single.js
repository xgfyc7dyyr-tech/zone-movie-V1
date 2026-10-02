/**
 * COMPONENT: MOVIE SINGLE PAGE LOGIC (CINEJOY REPLICA)
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

// ۴. استایل همین صفحه
import './movie-single.css';

function initSinglePage() {

    // ─────────────────────────────────────────────────────────────
    // 🎥 ۱. سیستم ویدیوی پس‌زمینه زنده با نوار پیشرفت و Replay
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
    // 🎨 ۲. سیستم هاله رنگ واکنش‌گرا با فید دولایه بدون لگ (Lag-Free Dual Buffer)
    // ─────────────────────────────────────────────────────────────
    function initCardBackdrops() {
        const bgA = document.getElementById('ambientBackdropA');
        const bgB = document.getElementById('ambientBackdropB');
        const defaultBg = "https://image.tmdb.org/t/p/original/kkcwhgSFd81QDlXo8ytrpHPQjhy.jpg";
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
                if (cardBg) {
                    switchBackdrop(cardBg);
                }
            });
        });

        sliderWrapper?.addEventListener('mouseleave', () => {
            switchBackdrop(defaultBg);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 📂 ۳. هاب تب‌بندی عریض سطری کل محتوا
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
            if (targetPane) {
                targetPane.classList.remove('hidden');
            }
            initIcons();
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 📥 ۴. سیستم باز و بسته شدن ریلی باکس‌های دانلود
    // ─────────────────────────────────────────────────────────────
    const railHeaders = document.querySelectorAll('.download-rail-header');

    railHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const parentRail = this.closest('.download-rail-item');
            if (!parentRail) return;

            const isCurrentlyOpen = parentRail.classList.contains('open');

            if (isCurrentlyOpen) {
                parentRail.classList.remove('open');
            } else {
                parentRail.classList.add('open');
            }

            initIcons();
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 📖 ۵. سیستم «ادامه مطلب»
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
    // 🌟 ۶. سیستم امتیازدهی با محدودیت ۳ ویرایش + بج نمره زون‌مووی (ZM)
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
        const MOVIE_STORAGE_KEY = 'zonemovi_user_voted_spiderman_2026';
        const MAX_EDITS = 3;

        let pendingSelectedScore = 0;
        let pendingStarValue = 0;

        function getStoredVoteData() {
            try {
                const saved = localStorage.getItem(MOVIE_STORAGE_KEY);
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
                if (ratingStatusBadge) {
                    ratingStatusBadge.classList.add('hidden');
                }
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
                localStorage.setItem(MOVIE_STORAGE_KEY, JSON.stringify({
                    score: pendingSelectedScore,
                    editsCount: newEdits,
                    timestamp: Date.now()
                }));
            } catch (e) {}

            showConfirmedState(pendingSelectedScore, newEdits);
            alert(`با تشکر از ثبت نظر شما! امتیاز ${pendingSelectedScore} از 10 شما در صف پردازش قرار گرفت و به صورت خودکار در میانگین سراسری اثر اعمال خواهد شد.`);
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
                if (idx <= index) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
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
    // ⚠️ ۷. گزارش خرابی لینک
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('click', function(e) {
        const brokenBtn = e.target.closest('.btn-broken-link');
        if (brokenBtn) {
            e.stopPropagation();
            alert('گزارش خرابی لینک ثبت شد. پشتیبانی زون‌مووی به زودی لینک دانلود را بازسازی خواهد کرد. با تشکر!');
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 🔗 ۸. کپی آدرس صفحه
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

    // ─────────────────────────────────────────────────────────────
    // 🎥 ۹. سیستم پخش ویدیوهای IMDb و تریلرها با آدرس پویا
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

    // متصل کردن کارت‌های ویدیویی جدید IMDb به پلیر شیشه‌ای
    document.addEventListener('click', function(e) {
        const imdbVideoCard = e.target.closest('.imdb-video-card');
        if (imdbVideoCard) {
            e.stopPropagation();
            const videoUrl = imdbVideoCard.dataset.video;
            const titleText = imdbVideoCard.dataset.title;
            if (videoUrl) {
                openTrailer(videoUrl, titleText);
            }
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
    // ⏳ ۱۰. محاسبه زمان پایان فیلم بر اساس ساعت سیستم کاربر
    // ─────────────────────────────────────────────────────────────
    function calculateEndTime() {
        const endTimeElement = document.getElementById('endTimeText');
        if (!endTimeElement) return;

        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        let endMinutes = currentMinutes + 25;
        let endHours = currentHours + 2 + Math.floor(endMinutes / 60);
        
        endMinutes = endMinutes % 60;
        endHours = endHours % 24;

        let ampmText = '';
        if (endHours >= 0 && endHours < 6) {
            ampmText = 'بامداد';
        } else if (endHours >= 6 && endHours < 12) {
            ampmText = 'صبح';
        } else if (endHours >= 12 && endHours < 13) {
            ampmText = 'ظهر';
        } else if (endHours >= 13 && endHours < 17) {
            ampmText = 'بعد از ظهر';
        } else if (endHours >= 17 && endHours < 20) {
            ampmText = 'عصر';
        } else {
            ampmText = 'شب';
        }

        const formattedHours = endHours % 12 || 12;
        const strEndMinutes = endMinutes.toString().padStart(2, '0');

        endTimeElement.textContent = `2 ساعت و 25 دقیقه • پایان در ${formattedHours}:${strEndMinutes} ${ampmText}`;
    }

    // ─────────────────────────────────────────────────────────────
    // 👥 ۱۱. اسلایدرهای افقی بازیگران و کالکشن
    // ─────────────────────────────────────────────────────────────
    const castSliderWrapper = document.getElementById('castSliderWrapper');
    const castPrev          = document.getElementById('castPrev');
    const castNext          = document.getElementById('castNext');

    if (castSliderWrapper && castPrev && castNext) {
        const scrollAmount = 200;
        castNext.addEventListener('click', () => {
            castSliderWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        castPrev.addEventListener('click', () => {
            castSliderWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    const franchiseSliderWrapper = document.getElementById('franchiseSliderWrapper');
    const franchisePrev          = document.getElementById('franchisePrev');
    const franchiseNext          = document.getElementById('franchiseNext');

    if (franchiseSliderWrapper && franchisePrev && franchiseNext) {
        const scrollAmount = 310;
        franchiseNext.addEventListener('click', () => {
            franchiseSliderWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        franchisePrev.addEventListener('click', () => {
            franchiseSliderWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 🌟 ۱۲. منطق دکمه‌های «دنبال کردن» و «زنگوله اعلان» بازیگران و عوامل
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('click', function(e) {
        // دنبال کردن
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

        // فعال‌سازی زنگوله اعلان
        const bellBtn = e.target.closest('.btn-bell-crew');
        if (bellBtn) {
            e.stopPropagation();
            const isActive = bellBtn.classList.toggle('is-active');
            if (isActive) {
                bellBtn.setAttribute('title', 'اعلان فیلم جدید فعال شد');
            } else {
                bellBtn.setAttribute('title', 'فعال‌سازی اعلان فیلم‌های جدید');
            }
            initIcons();
        }
    });

    // ─────────────────────────────────────────────────────────────
    // ❤️ ۱۳. لایک فیلم
    // ─────────────────────────────────────────────────────────────
    const btnLikeReact = document.getElementById('btnLikeReact');

    btnLikeReact?.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('liked');
        initIcons();
    });

    // ─────────────────────────────────────────────────────────────
    // ⚠️ ۱۴. ضداسپویل
    // ─────────────────────────────────────────────────────────────
    document.addEventListener('click', function(e) {
        const spoilerWrapper = e.target.closest('.comment-spoiler-wrapper');
        if (spoilerWrapper) {
            e.stopPropagation();
            spoilerWrapper.classList.toggle('revealed');
        }
    });

    // ─────────────────────────────────────────────────────────────
    // 👥 ۱۵. کامنت‌گذاری، پاسخ‌ها و سیستم شماره صفحه (Pagination)
    // ─────────────────────────────────────────────────────────────
    const btnSubmitComment      = document.getElementById('btnSubmitComment');
    const commentText           = document.getElementById('commentText');
    const commentAuthor         = document.getElementById('commentAuthor');
    const commentIsSpoiler      = document.getElementById('commentIsSpoiler');
    const commentsPage1         = document.getElementById('commentsPage1');

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
            const page = parseInt(this.dataset.page, 10);
            goToCommentPage(page);
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

    let uniqueIdCounter = 20;

    btnSubmitComment?.addEventListener('click', function(e) {
        e.stopPropagation();
        const text = commentText?.value.trim();
        const author = commentAuthor?.value.trim() || "کاربر مهمان";
        if (!text) return;

        uniqueIdCounter++;
        const isSpoilerChecked = commentIsSpoiler?.checked;
        
        let commentTextHTML = '';
        if (isSpoilerChecked) {
            commentTextHTML = `
                <div class="comment-spoiler-wrapper">
                    <div class="comment-spoiler-warning"><i data-lucide="alert-triangle" style="width:14px; margin-left:4px;"></i> حاوی اسپویل داستان (برای مشاهده کلیک کنید)</div>
                    <p class="comment-text is-spoiler">${text}</p>
                </div>
            `;
        } else {
            commentTextHTML = `<p class="comment-text">${text}</p>`;
        }

        const newCommentHTML = `
            <div class="comment-card-wrapper" data-id="comment-${uniqueIdCounter}" style="animation: fadeIn 0.4s ease forwards;">
                <div class="comment-item">
                    <div class="comment-side-likes">
                        <button class="btn-comment-like" data-count="0" title="می‌پسندم">
                            <i data-lucide="thumbs-up"></i>
                            <span class="like-count">0</span>
                        </button>
                        <button class="btn-comment-dislike" data-count="0" title="نمی‌پسندم">
                            <i data-lucide="thumbs-down"></i>
                            <span class="dislike-count">0</span>
                        </button>
                    </div>
                    <div class="comment-avatar">
                        <img src="https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg" alt="آواتار">
                    </div>
                    <div class="comment-content">
                        <div class="comment-user">${author} <span class="comment-date">همین الان</span></div>
                        ${commentTextHTML}
                        <div class="comment-actions">
                            <button class="btn-comment-reply" data-id="comment-${uniqueIdCounter}" data-author="${author}"><i data-lucide="reply-all"></i> پاسخ به این نظر</button>
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
                const dislikeBtn = btnCommentLike.parentElement.querySelector('.btn-comment-dislike');
                if (dislikeBtn && dislikeBtn.classList.contains('active')) {
                    dislikeBtn.click();
                }
            }
            btnCommentLike.dataset.count = count;
            btnCommentLike.querySelector('.like-count').textContent = count;
        }

        const btnCommentDislike = e.target.closest('.btn-comment-dislike');
        if (btnCommentDislike) {
            e.stopPropagation();
            let count = parseInt(btnCommentDislike.dataset.count, 10);
            if (btnCommentDislike.classList.contains('active')) {
                btnCommentDislike.classList.remove('active');
                count--;
            } else {
                btnCommentDislike.classList.add('active');
                count++;
                const likeBtn = btnCommentDislike.parentElement.querySelector('.btn-comment-like');
                if (likeBtn && likeBtn.classList.contains('active')) {
                    likeBtn.click();
                }
            }
            btnCommentDislike.dataset.count = count;
            btnCommentDislike.querySelector('.dislike-count').textContent = count;
        }

        const replyBtn = e.target.closest('.btn-comment-reply');
        if (replyBtn) {
            e.stopPropagation();
            const commentId = replyBtn.dataset.id;
            const targetAuthor = replyBtn.dataset.author || "کاربر";
            const parentWrapper = document.querySelector(`.comment-card-wrapper[data-id="${commentId}"]`);
            if (!parentWrapper) return;

            if (parentWrapper.querySelector('.comment-reply-form')) return;

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
            if (nestedContainer) {
                nestedContainer.insertAdjacentHTML('beforebegin', replyFormHTML);
            }
        }

        const cancelReplyBtn = e.target.closest('.btn-cancel-reply');
        if (cancelReplyBtn) {
            e.stopPropagation();
            const form = cancelReplyBtn.closest('.comment-reply-form');
            form?.remove();
        }

        const submitReplyBtn = e.target.closest('.btn-submit-reply');
        if (submitReplyBtn) {
            e.stopPropagation();
            const commentId = submitReplyBtn.dataset.id;
            const targetAuthor = submitReplyBtn.dataset.targetAuthor || "کاربر";
            const form = submitReplyBtn.closest('.comment-reply-form');
            const replyTextarea = form?.querySelector('.reply-textarea');
            const text = replyTextarea?.value.trim();
            if (!text) return;

            const parentWrapper = document.querySelector(`.comment-card-wrapper[data-id="${commentId}"]`);
            const nestedContainer = parentWrapper?.querySelector('.nested-replies-container');

            const replyHTML = `
                <div class="comment-item comment-item--reply" style="animation: fadeIn 0.3s ease forwards;">
                    <div class="comment-avatar">
                        <img src="https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg" alt="آواتار">
                    </div>
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

            if (nestedContainer) {
                nestedContainer.insertAdjacentHTML('beforeend', replyHTML);
            }
            form?.remove();
            initIcons();
        }
    });

    function initIcons() {
        try {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        } catch (e) {}
    }

    initHeroVideo();
    initCardBackdrops();
    calculateEndTime();
    initSummaryReadMore();
    initStarRating();
    window.addEventListener('resize', initSummaryReadMore);
    initIcons();
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initSinglePage();
} else {
    document.addEventListener('DOMContentLoaded', initSinglePage);
}
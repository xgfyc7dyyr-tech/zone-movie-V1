(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.addEventListener("DOMContentLoaded", () => {
  function initIcons() {
    try {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    } catch (e) {
    }
  }
  initIcons();
  const searchContainer = document.getElementById("searchContainer");
  const searchTrigger = document.getElementById("searchTrigger");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");
  const searchResults = document.getElementById("searchResults");
  const resultsList = document.getElementById("resultsList");
  const resultsCount = document.getElementById("resultsCount");
  let debounceTimer = null;
  const moviesData = [
    { id: 1, title: "مرد عنکبوتی: روز جدید", original: "Spider-Man: Brand New Day", year: "2026", type: "movie" },
    { id: 2, title: "عشق بی‌حد و مرز", original: "Hudutsuz Sevda", year: "2024", type: "series" },
    { id: 3, title: "اشرف رویا", original: "Esref Ruya", year: "2024", type: "series" },
    { id: 4, title: "شهر دور", original: "Uzak Sehir", year: "2024", type: "series" },
    { id: 5, title: "تام و جری", original: "Tom & Jerry", year: "2021", type: "movie" }
  ];
  function normalizeText(str) {
    if (!str) return "";
    return str.toString().toLowerCase().replace(/\u200c/g, " ").replace(/ي/g, "ی").replace(/ك/g, "ک").trim();
  }
  function openSearch() {
    searchContainer == null ? void 0 : searchContainer.classList.add("expanded");
    searchContainer == null ? void 0 : searchContainer.setAttribute("aria-expanded", "true");
    setTimeout(() => searchInput == null ? void 0 : searchInput.focus(), 150);
  }
  function closeSearch() {
    searchContainer == null ? void 0 : searchContainer.classList.remove("expanded");
    searchContainer == null ? void 0 : searchContainer.setAttribute("aria-expanded", "false");
    if (searchResults) searchResults.classList.add("hidden");
    if (resultsList) resultsList.innerHTML = "";
    if (resultsCount) resultsCount.textContent = "۰ مورد";
    if (searchInput) searchInput.value = "";
  }
  if (searchTrigger) {
    searchTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      if (searchContainer == null ? void 0 : searchContainer.classList.contains("expanded")) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  }
  if (searchClose) {
    searchClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("click", (e) => e.stopPropagation());
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      const query = normalizeText(e.target.value);
      debounceTimer = setTimeout(() => {
        if (query.length > 0) {
          const filtered = moviesData.filter(
            (m) => normalizeText(m.title).includes(query) || normalizeText(m.original).includes(query)
          );
          if (filtered.length > 0) {
            resultsList.innerHTML = filtered.map((m) => `
                            <div class="search-item" data-url="#movie/${m.id}">
                                <div class="search-item__poster">
                                    <i data-lucide="film" style="width:16px; opacity:0.4;"></i>
                                </div>
                                <div>
                                    <div class="search-item__title">${m.title}</div>
                                    <div class="search-item__meta">${m.original} • ${m.type === "movie" ? "فیلم" : "سریال"}</div>
                                </div>
                            </div>
                        `).join("");
            if (resultsCount) resultsCount.textContent = `${filtered.length} مورد`;
            initIcons();
          } else {
            resultsList.innerHTML = `<div style="padding:12px; text-align:center; font-size:0.82rem; color:var(--text-muted);">نتیجه‌ای یافت نشد</div>`;
            if (resultsCount) resultsCount.textContent = `۰ مورد`;
          }
          searchResults == null ? void 0 : searchResults.classList.remove("hidden");
        } else {
          searchResults == null ? void 0 : searchResults.classList.add("hidden");
        }
      }, 250);
    });
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchWrapper") && !e.target.closest("#filterModal")) {
      closeSearch();
    }
  });
  const themeToggleBtn = document.getElementById("themeToggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");
  function updateThemeIcons() {
    const isLight = document.documentElement.classList.contains("light-mode");
    if (isLight) {
      sunIcon == null ? void 0 : sunIcon.classList.add("hidden");
      moonIcon == null ? void 0 : moonIcon.classList.remove("hidden");
    } else {
      sunIcon == null ? void 0 : sunIcon.classList.remove("hidden");
      moonIcon == null ? void 0 : moonIcon.classList.add("hidden");
    }
  }
  updateThemeIcons();
  themeToggleBtn == null ? void 0 : themeToggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-mode");
    const isLight = document.documentElement.classList.contains("light-mode");
    localStorage.setItem("zone_theme", isLight ? "light" : "dark");
    updateThemeIcons();
  });
  const dockItems = document.querySelectorAll(".dock-item");
  const dockIndicator = document.getElementById("dockIndicator");
  function moveIndicator(el) {
    if (!el || !dockIndicator) return;
    const itemRect = el.getBoundingClientRect();
    const dockRect = el.parentElement.getBoundingClientRect();
    const offsetLeft = itemRect.left - dockRect.left;
    dockIndicator.style.transform = `translateX(${offsetLeft}px)`;
    dockIndicator.style.width = `${itemRect.width}px`;
  }
  dockItems.forEach((item) => {
    item.addEventListener("click", () => {
      dockItems.forEach((i) => i.classList.remove("dock-item--active"));
      item.classList.add("dock-item--active");
      moveIndicator(item);
    });
  });
  function initIndicator() {
    const activeItem = document.querySelector(".dock-item--active");
    if (activeItem) {
      moveIndicator(activeItem);
    }
  }
  setTimeout(initIndicator, 200);
  window.addEventListener("resize", initIndicator);
});
document.addEventListener("DOMContentLoaded", () => {
  var _a;
  const filterModal = document.getElementById("filterModal");
  const filterModalClose = document.getElementById("filterModalClose");
  const desktopFilterBtn = document.getElementById("desktopFilterBtn");
  const dropdownFilterBtn = document.getElementById("dropdownFilterBtn");
  const btnApplyFilter = document.getElementById("btnApplyFilter");
  const btnResetFilter = document.getElementById("btnResetFilter");
  const filterYearSelect = document.getElementById("filterYearSelect");
  const filterQualitySelect = document.getElementById("filterQualitySelect");
  const filterCountrySelect = document.getElementById("filterCountrySelect");
  const filterPlatformSelect = document.getElementById("filterPlatformSelect");
  const filterSortSelect = document.getElementById("filterSortSelect");
  const filterRatingSelect = document.getElementById("filterRatingSelect");
  const desktopFilterBadge = document.getElementById("desktopFilterBadge");
  const dropdownFilterBadge = document.getElementById("dropdownFilterBadge");
  function openFilterModal() {
    filterModal == null ? void 0 : filterModal.classList.remove("hidden");
    filterModal == null ? void 0 : filterModal.setAttribute("aria-hidden", "false");
  }
  function closeFilterModal() {
    filterModal == null ? void 0 : filterModal.classList.add("hidden");
    filterModal == null ? void 0 : filterModal.setAttribute("aria-hidden", "true");
  }
  function countActiveFilters() {
    var _a2;
    let count = 0;
    const activeType = (_a2 = document.querySelector(".filter-chip-type.active")) == null ? void 0 : _a2.dataset.type;
    if (activeType && activeType !== "all") count++;
    count += document.querySelectorAll(".filter-chip-genre.active").length;
    count += document.querySelectorAll(".filter-chip-audio.active").length;
    if (filterYearSelect == null ? void 0 : filterYearSelect.value) count++;
    if (filterQualitySelect == null ? void 0 : filterQualitySelect.value) count++;
    if (filterCountrySelect == null ? void 0 : filterCountrySelect.value) count++;
    if (filterPlatformSelect == null ? void 0 : filterPlatformSelect.value) count++;
    if (filterRatingSelect == null ? void 0 : filterRatingSelect.value) count++;
    if ((filterSortSelect == null ? void 0 : filterSortSelect.value) && filterSortSelect.value !== "newest") count++;
    return count;
  }
  function updateFilterBadges() {
    const count = countActiveFilters();
    [desktopFilterBadge, dropdownFilterBadge].forEach((badge) => {
      if (!badge) return;
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });
  }
  desktopFilterBtn == null ? void 0 : desktopFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openFilterModal();
  });
  dropdownFilterBtn == null ? void 0 : dropdownFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openFilterModal();
  });
  filterModalClose == null ? void 0 : filterModalClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeFilterModal();
  });
  filterModal == null ? void 0 : filterModal.addEventListener("click", (e) => {
    if (e.target === filterModal) closeFilterModal();
  });
  (_a = filterModal == null ? void 0 : filterModal.querySelector(".filter-modal__card")) == null ? void 0 : _a.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  document.querySelectorAll(".filter-chip-type").forEach((chip) => {
    chip.addEventListener("click", function(e) {
      e.stopPropagation();
      document.querySelectorAll(".filter-chip-type").forEach((c) => c.classList.remove("active"));
      this.classList.add("active");
    });
  });
  document.querySelectorAll(".filter-chip-genre, .filter-chip-audio").forEach((chip) => {
    chip.addEventListener("click", function(e) {
      e.stopPropagation();
      this.classList.toggle("active");
    });
  });
  btnApplyFilter == null ? void 0 : btnApplyFilter.addEventListener("click", (e) => {
    e.stopPropagation();
    updateFilterBadges();
    closeFilterModal();
  });
  btnResetFilter == null ? void 0 : btnResetFilter.addEventListener("click", (e) => {
    var _a2;
    e.stopPropagation();
    document.querySelectorAll(".filter-chip-type").forEach((c) => c.classList.remove("active"));
    (_a2 = document.querySelector('.filter-chip-type[data-type="all"]')) == null ? void 0 : _a2.classList.add("active");
    document.querySelectorAll(".filter-chip-genre, .filter-chip-audio").forEach((c) => c.classList.remove("active"));
    if (filterYearSelect) filterYearSelect.value = "";
    if (filterQualitySelect) filterQualitySelect.value = "";
    if (filterCountrySelect) filterCountrySelect.value = "";
    if (filterPlatformSelect) filterPlatformSelect.value = "";
    if (filterRatingSelect) filterRatingSelect.value = "";
    if (filterSortSelect) filterSortSelect.value = "newest";
    updateFilterBadges();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.getElementById("heroTitle");
  const heroYear = document.getElementById("heroYear");
  const heroRating = document.getElementById("heroRating");
  const heroDesc = document.getElementById("heroDesc");
  const infoContainer = document.getElementById("heroCinematicInfo");
  const trackContainer = document.getElementById("hero3dTrack");
  const dotsContainer = document.getElementById("heroDots");
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");
  const moviesData = [
    {
      id: 1,
      title: "سوپرگرل (Supergirl)",
      year: "2026",
      rating: "8.8/10",
      desc: "کارا زور ال، دخترعموی سوپرمن، پس از سال‌ها پنهان کردن قدرت‌هایش تصمیم می‌گیرد قهرمان شهر خود شود...",
      backdrop: "https://intocdn.top/wp-content/uploads/2026/06/h37hqVLmCW00ImewLAHT1DadOky.jpg",
      poster: "https://intocdn.top/wp-content/uploads/2026/06/39R8Un4ozLrlTbuImzWr7tQcApb-180x280.jpg",
      color1: "#1e1b4b",
      color2: "#4338ca"
    },
    {
      id: 2,
      title: "عنوان فیلم دوم",
      year: "2025",
      rating: "8.5/10",
      desc: "ماجراجویی هیجان‌انگیز و دیدنی در دنیایی پر از رازها و نبردهای تماشایی...",
      backdrop: "https://intocdn.top/wp-content/uploads/2024/11/bJtOEfr3jZMYLDNAoinXzvVAhre.jpg",
      poster: "https://intocdn.top/wp-content/uploads/2025/01/61cSwVmu0urv7H5eqRFwYlnd3oS-180x280.jpg",
      color1: "#311042",
      color2: "#701a75"
    }
  ];
  const width = 100;
  const height = 60;
  let root = null;
  let currentMesh = null;
  let currentIndex = 0;
  let isAnimating = false;
  let autoSlideTimer = null;
  const preloadedImages = [];
  function preloadAllImages(callback) {
    let loaded = 0;
    moviesData.forEach((movie, idx) => {
      const loader = new THREE.ImageLoader();
      loader.setCrossOrigin("Anonymous");
      loader.load(movie.backdrop, (img) => {
        preloadedImages[idx] = img;
        loaded++;
        if (loaded === moviesData.length && callback) callback();
      }, void 0, () => {
        const canvas = createFallbackCanvas(movie.title, movie.color1, movie.color2);
        preloadedImages[idx] = canvas;
        loaded++;
        if (loaded === moviesData.length && callback) callback();
      });
    });
  }
  function createFallbackCanvas(title, color1, color2) {
    const canvas = document.createElement("canvas");
    canvas.width = 1e3;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 1e3, 600);
    grad.addColorStop(0, color1 || "#1e1b4b");
    grad.addColorStop(1, color2 || "#4338ca");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1e3, 600);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, 0, 1e3, 600);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 50px Vazirmatn, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, 500, 310);
    return canvas;
  }
  function initThreeEngine() {
    const container = document.getElementById("three-container");
    if (!container || typeof THREE === "undefined" || typeof THREE.BAS === "undefined") return;
    root = new THREERoot({
      createCameraControls: false,
      antialias: window.devicePixelRatio === 1,
      fov: 60
    });
    root.renderer.setClearColor(0, 0);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    root.camera.position.set(0, 0, 50);
    preloadAllImages(() => {
      loadFirstSlide();
      render3dCards();
      startAutoSlide();
    });
  }
  function loadFirstSlide() {
    currentMesh = new Slide(width, height, "in");
    if (preloadedImages[currentIndex]) {
      currentMesh.setImage(preloadedImages[currentIndex]);
    }
    currentMesh.time = currentMesh.totalDuration;
    root.scene.add(currentMesh);
    root.fitMeshCover(currentMesh);
    updateBannerContentImmediate(moviesData[currentIndex]);
  }
  function goTo(newIndex) {
    const total = moviesData.length;
    newIndex = (newIndex % total + total) % total;
    if (isAnimating || newIndex === currentIndex) return;
    isAnimating = true;
    const outMesh = new Slide(width, height, "out");
    if (preloadedImages[currentIndex]) {
      outMesh.setImage(preloadedImages[currentIndex]);
    }
    const inMesh = new Slide(width, height, "in");
    if (preloadedImages[newIndex]) {
      inMesh.setImage(preloadedImages[newIndex]);
    }
    root.fitMeshCover(outMesh);
    root.fitMeshCover(inMesh);
    root.scene.remove(currentMesh);
    root.scene.add(outMesh);
    root.scene.add(inMesh);
    updateBannerContentImmediate(moviesData[newIndex]);
    update3dTransformsForIndex(newIndex);
    const tl = new TimelineMax({
      onComplete: function() {
        root.scene.remove(outMesh);
        currentMesh = inMesh;
        currentIndex = newIndex;
        isAnimating = false;
      }
    });
    tl.add(outMesh.transition(), 0);
    tl.add(inMesh.transition(), 0);
  }
  function Slide(width2, height2, animationPhase) {
    const plane = new THREE.PlaneGeometry(width2, height2, width2 * 2, height2 * 2);
    THREE.BAS.Utils.separateFaces(plane);
    const geometry = new SlideGeometry(plane);
    geometry.bufferUVs();
    const aAnimation = geometry.createAttribute("aAnimation", 2);
    const aStartPosition = geometry.createAttribute("aStartPosition", 3);
    const aControl0 = geometry.createAttribute("aControl0", 3);
    const aControl1 = geometry.createAttribute("aControl1", 3);
    const aEndPosition = geometry.createAttribute("aEndPosition", 3);
    const minDuration = 0.8;
    const maxDuration = 1.2;
    const maxDelayX = 0.9;
    const maxDelayY = 0.125;
    const stretch = 0.11;
    this.totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;
    const startPosition = new THREE.Vector3();
    const control0 = new THREE.Vector3();
    const control1 = new THREE.Vector3();
    const endPosition = new THREE.Vector3();
    const tempPoint = new THREE.Vector3();
    function getControlPoint0(centroid) {
      const signY = Math.sign(centroid.y);
      tempPoint.x = THREE.Math.randFloat(0.1, 0.3) * 50;
      tempPoint.y = signY * THREE.Math.randFloat(0.1, 0.3) * 70;
      tempPoint.z = THREE.Math.randFloatSpread(20);
      return tempPoint;
    }
    function getControlPoint1(centroid) {
      const signY = Math.sign(centroid.y);
      tempPoint.x = THREE.Math.randFloat(0.3, 0.6) * 50;
      tempPoint.y = -signY * THREE.Math.randFloat(0.3, 0.6) * 70;
      tempPoint.z = THREE.Math.randFloatSpread(20);
      return tempPoint;
    }
    for (let i = 0, i2 = 0, i3 = 0; i < geometry.faceCount; i++, i2 += 6, i3 += 9) {
      const face = plane.faces[i];
      const centroid = THREE.BAS.Utils.computeCentroid(plane, face);
      const duration = THREE.Math.randFloat(minDuration, maxDuration);
      const delayX = THREE.Math.mapLinear(centroid.x, -width2 * 0.5, width2 * 0.5, 0, maxDelayX);
      let delayY = animationPhase === "in" ? THREE.Math.mapLinear(Math.abs(centroid.y), 0, height2 * 0.5, 0, maxDelayY) : THREE.Math.mapLinear(Math.abs(centroid.y), 0, height2 * 0.5, maxDelayY, 0);
      for (let v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v] = delayX + delayY + Math.random() * stretch * duration;
        aAnimation.array[i2 + v + 1] = duration;
      }
      endPosition.copy(centroid);
      startPosition.copy(centroid);
      if (animationPhase === "in") {
        control0.copy(centroid).sub(getControlPoint0(centroid));
        control1.copy(centroid).sub(getControlPoint1(centroid));
      } else {
        control0.copy(centroid).add(getControlPoint0(centroid));
        control1.copy(centroid).add(getControlPoint1(centroid));
      }
      for (let v = 0; v < 9; v += 3) {
        aStartPosition.array[i3 + v] = startPosition.x;
        aStartPosition.array[i3 + v + 1] = startPosition.y;
        aStartPosition.array[i3 + v + 2] = startPosition.z;
        aControl0.array[i3 + v] = control0.x;
        aControl0.array[i3 + v + 1] = control0.y;
        aControl0.array[i3 + v + 2] = control0.z;
        aControl1.array[i3 + v] = control1.x;
        aControl1.array[i3 + v + 1] = control1.y;
        aControl1.array[i3 + v + 2] = control1.z;
        aEndPosition.array[i3 + v] = endPosition.x;
        aEndPosition.array[i3 + v + 1] = endPosition.y;
        aEndPosition.array[i3 + v + 2] = endPosition.z;
      }
    }
    const texture = new THREE.Texture();
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    const material = new THREE.BAS.BasicAnimationMaterial(
      {
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { type: "f", value: 0 }
        },
        shaderFunctions: [
          THREE.BAS.ShaderChunk["cubic_bezier"],
          THREE.BAS.ShaderChunk["ease_in_out_cubic"],
          THREE.BAS.ShaderChunk["quaternion_rotation"]
        ],
        shaderParameters: [
          "uniform float uTime;",
          "attribute vec2 aAnimation;",
          "attribute vec3 aStartPosition;",
          "attribute vec3 aControl0;",
          "attribute vec3 aControl1;",
          "attribute vec3 aEndPosition;"
        ],
        shaderVertexInit: [
          "float tDelay = aAnimation.x;",
          "float tDuration = aAnimation.y;",
          "float tTime = clamp(uTime - tDelay, 0.0, tDuration);",
          "float tProgress = ease(tTime, 0.0, 1.0, tDuration);"
        ],
        shaderTransformPosition: [
          animationPhase === "in" ? "transformed *= tProgress;" : "transformed *= 1.0 - tProgress;",
          "transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);"
        ]
      },
      {
        map: texture
      }
    );
    THREE.Mesh.call(this, geometry, material);
    this.frustumCulled = false;
  }
  Slide.prototype = Object.create(THREE.Mesh.prototype);
  Slide.prototype.constructor = Slide;
  Object.defineProperty(Slide.prototype, "time", {
    get: function() {
      return this.material.uniforms["uTime"].value;
    },
    set: function(v) {
      this.material.uniforms["uTime"].value = v;
    }
  });
  Slide.prototype.setImage = function(image) {
    if (!image) return;
    const tex = this.material.uniforms.map.value;
    tex.image = image;
    tex.needsUpdate = true;
  };
  Slide.prototype.transition = function() {
    return TweenMax.fromTo(this, 1.6, { time: 0 }, { time: this.totalDuration, ease: Power2.easeInOut });
  };
  function SlideGeometry(model) {
    THREE.BAS.ModelBufferGeometry.call(this, model);
  }
  SlideGeometry.prototype = Object.create(THREE.BAS.ModelBufferGeometry.prototype);
  SlideGeometry.prototype.constructor = SlideGeometry;
  SlideGeometry.prototype.bufferPositions = function() {
    var positionBuffer = this.createAttribute("position", 3).array;
    for (var i = 0; i < this.faceCount; i++) {
      var face = this.modelGeometry.faces[i];
      var centroid = THREE.BAS.Utils.computeCentroid(this.modelGeometry, face);
      var a = this.modelGeometry.vertices[face.a];
      var b = this.modelGeometry.vertices[face.b];
      var c = this.modelGeometry.vertices[face.c];
      positionBuffer[face.a * 3] = a.x - centroid.x;
      positionBuffer[face.a * 3 + 1] = a.y - centroid.y;
      positionBuffer[face.a * 3 + 2] = a.z - centroid.z;
      positionBuffer[face.b * 3] = b.x - centroid.x;
      positionBuffer[face.b * 3 + 1] = b.y - centroid.y;
      positionBuffer[face.b * 3 + 2] = b.z - centroid.z;
      positionBuffer[face.c * 3] = c.x - centroid.x;
      positionBuffer[face.c * 3 + 1] = c.y - centroid.y;
      positionBuffer[face.c * 3 + 2] = c.z - centroid.z;
    }
  };
  function THREERoot(params) {
    params = utils.extend({
      fov: 60,
      zNear: 10,
      zFar: 1e5,
      createCameraControls: false
    }, params);
    this.renderer = new THREE.WebGLRenderer({
      antialias: params.antialias,
      alpha: true
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const container = document.getElementById("three-container");
    if (container) container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      params.fov,
      window.innerWidth / window.innerHeight,
      params.zNear,
      params.zFar
    );
    this.scene = new THREE.Scene();
    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.resize();
    this.tick();
    window.addEventListener("resize", this.resize, false);
  }
  THREERoot.prototype = {
    tick: function() {
      this.render();
      requestAnimationFrame(this.tick);
    },
    render: function() {
      this.renderer.render(this.scene, this.camera);
    },
    fitMeshCover: function(mesh) {
      if (!mesh || !this.camera) return;
      const container = document.getElementById("three-container");
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const vFOV = THREE.Math.degToRad(this.camera.fov);
      const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(this.camera.position.z);
      const visibleWidth = visibleHeight * (w / h);
      const scaleX = visibleWidth / 100;
      const scaleY = visibleHeight / 60;
      const maxScale = Math.max(scaleX, scaleY);
      mesh.scale.set(maxScale, maxScale, 1);
    },
    resize: function() {
      const container = document.getElementById("three-container");
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      if (this.scene) {
        this.scene.children.forEach((child) => {
          if (child.isMesh) {
            this.fitMeshCover(child);
          }
        });
      }
    }
  };
  const utils = {
    extend: function(dst, src) {
      for (var key in src) {
        dst[key] = src[key];
      }
      return dst;
    }
  };
  function render3dCards() {
    if (!trackContainer) return;
    trackContainer.innerHTML = moviesData.map((movie, index) => `
            <div class="hero-3d-card" data-index="${index}">
                <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
            </div>
        `).join("");
    if (dotsContainer) {
      dotsContainer.innerHTML = moviesData.map((_, i) => `
                <button class="hero-dot ${i === 0 ? "active" : ""}" data-index="${i}" aria-label="اسلاید ${i + 1}"></button>
            `).join("");
    }
    document.querySelectorAll(".hero-3d-card").forEach((card) => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.dataset.index, 10);
        goTo(idx);
        resetAutoSlide();
      });
    });
    document.querySelectorAll(".hero-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.dataset.index, 10);
        goTo(idx);
        resetAutoSlide();
      });
    });
    update3dTransformsForIndex(0);
  }
  function update3dTransformsForIndex(targetIdx) {
    const cards = document.querySelectorAll(".hero-3d-card");
    cards.forEach((card, i) => {
      const offset = i - targetIdx;
      const absOffset = Math.abs(offset);
      if (offset === 0) {
        card.style.transform = `translateX(0px) rotateY(0deg) scale(1) translateZ(0px)`;
        card.style.opacity = `1`;
        card.style.filter = `blur(0px)`;
        card.style.zIndex = `20`;
        card.classList.add("active");
      } else {
        const translateX = offset * -150;
        const rotateY = offset * 32;
        const scale = Math.max(0.75, 1 - absOffset * 0.15);
        const opacity = absOffset > 2 ? 0 : Math.max(0.2, 1 - absOffset * 0.35);
        card.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.filter = absOffset > 0 ? `blur(1.5px)` : `blur(0px)`;
        card.style.zIndex = `${10 - absOffset}`;
        card.classList.remove("active");
      }
    });
    document.querySelectorAll(".hero-dot").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === targetIdx);
    });
  }
  function updateBannerContentImmediate(movie) {
    if (!infoContainer) return;
    infoContainer.style.opacity = "0";
    infoContainer.style.transform = "translateY(8px)";
    setTimeout(() => {
      if (heroTitle) heroTitle.textContent = movie.title;
      if (heroYear) heroYear.textContent = movie.year;
      if (heroRating) heroRating.textContent = movie.rating;
      if (heroDesc) heroDesc.textContent = movie.desc;
      infoContainer.style.opacity = "1";
      infoContainer.style.transform = "translateY(0)";
    }, 120);
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goTo(currentIndex + 1);
      resetAutoSlide();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goTo(currentIndex - 1);
      resetAutoSlide();
    });
  }
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goTo(currentIndex + 1);
    }, 6500);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }
  initThreeEngine();
});
document.addEventListener("DOMContentLoaded", () => {
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
  function renderSections() {
    const targetContainer = document.getElementById("movieGridSections");
    if (!targetContainer) return;
    let htmlContent = "";
    sectionsConfig.forEach((section) => {
      const filteredMovies = moviesData.filter((m) => m.category === section.category || section.category === "latest");
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
                        <div class="movie-slider-track">
                            ${filteredMovies.map((movie) => createMovieCard(movie)).join("")}
                        </div>
                    </div>
                </section>
            `;
    });
    targetContainer.innerHTML = htmlContent;
    sectionsConfig.forEach((section) => {
      const wrapper = document.getElementById(`${section.id}Wrapper`);
      const prevBtn = document.querySelector(`#${section.id}Section .arrow-prev`);
      const nextBtn = document.querySelector(`#${section.id}Section .arrow-next`);
      if (!wrapper || !prevBtn || !nextBtn) return;
      const scrollDistance = 280;
      nextBtn.addEventListener("click", () => {
        wrapper.scrollBy({ left: -scrollDistance, behavior: "smooth" });
      });
      prevBtn.addEventListener("click", () => {
        wrapper.scrollBy({ left: scrollDistance, behavior: "smooth" });
      });
    });
    try {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    } catch (e) {
    }
  }
  renderSections();
});
document.addEventListener("DOMContentLoaded", () => {
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
    const targetContainer = document.getElementById("movieGridSections");
    if (!targetContainer) return;
    let htmlContent = "";
    sectionsConfig.forEach((section) => {
      let skeletonCards = "";
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
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    } catch (e) {
    }
  }
  function loadActualData() {
    sectionsConfig.forEach((section) => {
      const track = document.getElementById(`${section.id}Track`);
      if (!track) return;
      track.classList.remove("fade-in");
      track.classList.add("fade-out");
      setTimeout(() => {
        const filteredMovies = moviesData.filter((m) => m.category === section.category || section.category === "latest");
        track.innerHTML = filteredMovies.map((movie) => createMovieCard(movie)).join("");
        track.classList.remove("fade-out");
        track.classList.add("fade-in");
        try {
          if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
          }
        } catch (e) {
        }
      }, 350);
    });
    sectionsConfig.forEach((section) => {
      const wrapper = document.getElementById(`${section.id}Wrapper`);
      const prevBtn = document.querySelector(`#${section.id}Section .arrow-prev`);
      const nextBtn = document.querySelector(`#${section.id}Section .arrow-next`);
      if (!wrapper || !prevBtn || !nextBtn) return;
      const scrollDistance = 280;
      nextBtn.addEventListener("click", () => {
        wrapper.scrollBy({ left: -scrollDistance, behavior: "smooth" });
      });
      prevBtn.addEventListener("click", () => {
        wrapper.scrollBy({ left: scrollDistance, behavior: "smooth" });
      });
    });
  }
  renderInitialSkeletons();
  setTimeout(() => {
    loadActualData();
  }, 1500);
});
console.log("🚀 ZONE MOVIE - All Components Including Phase 4 Loaded!");

(function(){
  "use strict";

  /* ---------------- Clients — real logos extracted from the 2026 profile ---------------- */
  var CLIENT_LOGOS = [
    { file: "client-00.png", name: "Al Madinah Region Development Authority" },
    { file: "client-01.png", name: "Fit & Healthy — Lion's Share" },
    { file: "client-02.png", name: "General Entertainment Authority" },
    { file: "client-03.png", name: "Al Adliyah Group" },
    { file: "client-04.png", name: "TACT" },
    { file: "client-05.png", name: "Taiba Investments" },
    { file: "client-06.png", name: "Ministry of Culture" },
    { file: "client-07.png", name: "Client logo" },
    { file: "client-08.png", name: "University of Prince Mugrin" },
    { file: "client-09.png", name: "Saudi Bonyan" },
    { file: "client-10.png", name: "United Nations" },
    { file: "client-11.png", name: "Arab Bank" },
    { file: "client-12.png", name: "Arab Open University" },
    { file: "client-13.png", name: "Binafif Roastery" },
    { file: "client-14.png", name: "Captain Chef" },
    { file: "client-15.png", name: "Cooperative Society" },
    { file: "client-16.png", name: "EDDY Home & Electronics" },
    { file: "client-17.png", name: "Pullman Hotels & Resorts" },
    { file: "client-18.png", name: "InterContinental Madinah" },
    { file: "client-19.png", name: "Taibah University" }
  ];
  var track = document.getElementById("marqueeTrack");
  if (track) {
    var chips = CLIENT_LOGOS.map(function(c){
      return '<span class="logo-chip"><img src="assets/img/clients/' + c.file + '" alt="' + c.name + '" loading="lazy"></span>';
    }).join("");
    // Duplicate the list once so the CSS translateX(-50%) loop is seamless
    track.innerHTML = chips + chips;
  }
  var grid = document.getElementById("clientsGrid");
  if (grid) {
    grid.innerHTML = CLIENT_LOGOS.map(function(c){
      return '<div class="client-tile"><img src="assets/img/clients/' + c.file + '" alt="' + c.name + '" loading="lazy"></div>';
    }).join("");
  }

  /* ---------------- Mobile action popup ---------------- */
  var popupOverlay = document.getElementById("popupOverlay");
  var popupSheet = document.getElementById("popupSheet");
  var popupClose = document.getElementById("popupClose");
  var popupFormLink = document.getElementById("popupFormLink");
  var isMobile = function(){ return window.matchMedia("(max-width: 760px)").matches; };

  function openPopup(){
    popupOverlay.classList.add("open");
    popupSheet.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closePopup(){
    popupOverlay.classList.remove("open");
    popupSheet.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".js-mobile-popup").forEach(function(btn){
    btn.addEventListener("click", function(e){
      if(isMobile()){
        e.preventDefault();
        openPopup();
      }
    });
  });
  popupOverlay.addEventListener("click", closePopup);
  popupClose.addEventListener("click", closePopup);
  popupFormLink.addEventListener("click", function(){ closePopup(); });

  /* ---------------- i18n ---------------- */
  var currentLang = "ar";

  function applyI18n(lang){
    var dict = I18N[lang];
    if(!dict) return;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dict.dir);

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      if(dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var key = el.getAttribute("data-i18n-ph");
      if(dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });

    document.getElementById("langBtn").textContent = dict.lang_toggle;
    var mobileBtn = document.getElementById("langBtnMobile");
    if(mobileBtn) mobileBtn.textContent = dict.lang_toggle;

    currentLang = lang;
  }

  function toggleLang(){
    applyI18n(currentLang === "ar" ? "en" : "ar");
  }
  document.getElementById("langBtn").addEventListener("click", toggleLang);
  var mBtn = document.getElementById("langBtnMobile");
  if(mBtn) mBtn.addEventListener("click", toggleLang);

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function(){
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){ navLinks.classList.remove("open"); });
  });

  /* ---------------- Nav shadow on scroll ---------------- */
  var nav = document.querySelector(".site-nav");
  window.addEventListener("scroll", function(){
    nav.style.boxShadow = window.scrollY > 12 ? "0 6px 20px rgba(0,0,0,.05)" : "none";
  });

  /* ---------------- Reveal on scroll ---------------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  // Safety net: IntersectionObserver can be delayed by heavy paint work
  // (animated gradients, blurred blobs) and occasionally miss elements
  // that are already on-screen. This recurring check guarantees nothing
  // ever gets stuck invisible, regardless of how long the observer takes.
  var revealSafetyChecks = 0;
  var revealSafetyTimer = setInterval(function(){
    var pending = document.querySelectorAll(".reveal:not(.in)");
    pending.forEach(function(el){
      var rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight && rect.bottom > 0){
        el.classList.add("in");
      }
    });
    revealSafetyChecks++;
    if(pending.length === 0 || revealSafetyChecks > 25){ clearInterval(revealSafetyTimer); }
  }, 300);
  window.addEventListener("scroll", function(){
    document.querySelectorAll(".reveal:not(.in)").forEach(function(el){
      var rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight && rect.bottom > 0){ el.classList.add("in"); }
    });
  }, { passive: true });

  /* ---------------- Work filter ---------------- */
  var filterBtns = document.querySelectorAll(".filter-pill");
  var workTiles = document.querySelectorAll(".work-tile");
  filterBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      filterBtns.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      workTiles.forEach(function(tile){
        var cat = tile.getAttribute("data-cat");
        tile.classList.toggle("hidden", f !== "all" && cat !== f);
      });
    });
  });

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".faq-item").forEach(function(item){
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function(){
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove("open");
          openItem.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Contact form (Formspree) ---------------- */
  var form = document.getElementById("contactForm");
  var successBox = document.getElementById("formSuccess");

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var action = form.getAttribute("action");

    // If the Formspree endpoint hasn't been configured yet, don't attempt
    // a network call that will fail — just guide the person clearly.
    if(!action || action.indexOf("REPLACE_WITH_YOUR_FORMSPREE_ID") > -1){
      var msgs = {
        ar: "نموذج التواصل غير مفعّل بعد لاستقبال الرسائل مباشرة. يرجى التواصل عبر WhatsApp أو البريد الإلكتروني مباشرة حاليًا.",
        en: "This form isn't wired to receive submissions yet. Please reach out via WhatsApp or email directly for now."
      };
      alert(msgs[currentLang] || msgs.en);
      return;
    }

    var data = new FormData(form);
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "...";

    fetch(action, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    }).then(function(response){
      if(response.ok){
        form.style.display = "none";
        successBox.classList.add("show");
      } else {
        throw new Error("Form submission failed");
      }
    }).catch(function(){
      var errMsgs = {
        ar: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر WhatsApp.",
        en: "Something went wrong sending this. Please try again or reach out via WhatsApp."
      };
      alert(errMsgs[currentLang] || errMsgs.en);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  });

  /* ---------------- Init ---------------- */
  applyI18n("ar");
})();

(function(){
  "use strict";

  /* ---------------- CRM (Supabase) config ----------------
     Fill these in once your Supabase project exists (see
     crm/supabase-schema.sql). Get both values from:
     Supabase dashboard → Project Settings → API.
     Leaving them as placeholders just means leads won't be
     saved to the CRM yet — the on-site Formspree flow (if
     configured) keeps working independently either way. */
  var SUPABASE_URL = "REPLACE_WITH_YOUR_SUPABASE_URL";
  var SUPABASE_ANON_KEY = "REPLACE_WITH_YOUR_SUPABASE_ANON_KEY";
  var supabaseConfigured = SUPABASE_URL.indexOf("REPLACE_WITH") === -1 && SUPABASE_ANON_KEY.indexOf("REPLACE_WITH") === -1;

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
    // Fisher-Yates shuffle — a fresh random order every page load, so this
    // never reads as a fixed, predictable grid.
    var shuffled = CLIENT_LOGOS.slice();
    for (var si = shuffled.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var stmp = shuffled[si]; shuffled[si] = shuffled[sj]; shuffled[sj] = stmp;
    }
    grid.innerHTML = shuffled.map(function(c, idx){
      var rot = (Math.random() * 8 - 4).toFixed(2); // -4deg .. 4deg
      var delay = (Math.random() * 0.5 + idx * 0.03).toFixed(2); // staggered + randomized
      return '<div class="client-tile" style="--rot:' + rot + 'deg; --delay:' + delay + 's;">'
        + '<img src="assets/img/clients/' + c.file + '" alt="' + c.name + '" loading="lazy"></div>';
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

  /* ---------------- Contact form as a popup (sticky button) ---------------- */
  var formFloatBtn = document.getElementById("formFloatBtn");
  var formPopupOverlay = document.getElementById("formPopupOverlay");
  var formPopupClose = document.getElementById("formPopupClose");
  var contactFormPanel = document.getElementById("contactFormPanel");

  function openFormPopup(){
    closePopup(); // close the small WhatsApp/Form action sheet if it was open
    contactFormPanel.classList.add("as-modal");
    formPopupOverlay.classList.add("open");
    document.body.classList.add("form-popup-open");
  }
  function closeFormPopup(){
    contactFormPanel.classList.remove("as-modal");
    formPopupOverlay.classList.remove("open");
    document.body.classList.remove("form-popup-open");
  }
  formFloatBtn.addEventListener("click", openFormPopup);
  formPopupOverlay.addEventListener("click", closeFormPopup);
  formPopupClose.addEventListener("click", closeFormPopup);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeFormPopup();
  });
  // In the existing mobile "how would you like to contact us" sheet, the
  // "fill the form" choice now opens the form as a popup directly instead
  // of just scrolling down to the contact section.
  popupFormLink.addEventListener("click", function(e){
    e.preventDefault();
    closePopup();
    openFormPopup();
  });

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

  /* ---------------- Contact form (CRM + Formspree) ---------------- */
  var form = document.getElementById("contactForm");
  var successBox = document.getElementById("formSuccess");

  form.addEventListener("submit", function(e){
    e.preventDefault();
    var action = form.getAttribute("action");
    var formspreeConfigured = action && action.indexOf("REPLACE_WITH_YOUR_FORMSPREE_ID") === -1;

    if(!supabaseConfigured && !formspreeConfigured){
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

    var tasks = [];

    // Primary: save the lead into the CRM (Supabase).
    if(supabaseConfigured){
      tasks.push(
        fetch(SUPABASE_URL + "/rest/v1/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": "Bearer " + SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            name: data.get("name"),
            company: data.get("company"),
            email: data.get("email") || null,
            phone: data.get("phone"),
            service: data.get("service"),
            city: data.get("city"),
            brief: data.get("brief")
          })
        }).then(function(r){ if(!r.ok) throw new Error("Supabase insert failed"); })
      );
    }

    // Optional: also email a copy via Formspree, if it's been configured.
    // Best-effort — a Formspree failure alone shouldn't block success,
    // since the CRM save (above) is the source of truth once configured.
    if(formspreeConfigured){
      var formspreeCall = fetch(action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      }).then(function(r){ if(!r.ok) throw new Error("Formspree failed"); });
      tasks.push(supabaseConfigured ? formspreeCall.catch(function(){}) : formspreeCall);
    }

    Promise.all(tasks).then(function(){
      form.style.display = "none";
      successBox.classList.add("show");
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

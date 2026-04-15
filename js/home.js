
//  LANGUAGE SECTION start

document.addEventListener("DOMContentLoaded", () => {

  const switcher = document.getElementById("language-switcher");
  const options = document.getElementById("language-options");
  const currentLang = document.getElementById("current-language");

  const langCodeMap = {
    English: "en", Hindi: "hi", Gujarati: "gu", Marathi: "mr",
    Punjabi: "pa", Kannada: "kn", Bengali: "bn", Telugu: "te",
    French: "fr", German: "de", Spanish: "es", Portuguese: "pt",
    Russian: "ru", Japanese: "ja", Arabic: "ar", Nepali: "ne"
  };

  const autoLangs = Object.keys(langCodeMap);
  let index = 0;
  let autoChange = null;

  if (currentLang && autoLangs.length) {
    autoChange = setInterval(() => {
      index = (index + 1) % autoLangs.length;
      currentLang.textContent = autoLangs[index];
    }, 2000);
  }

  if (switcher && options) {
    switcher.addEventListener("click", (e) => {
      options.classList.toggle("hidden");
      e.stopPropagation();
    });
  }

  if (options && currentLang) {
    options.querySelectorAll(".lang").forEach(item => {
      item.addEventListener("click", (e) => {
        const langName = e.currentTarget.getAttribute("data-en");
        const langCode = langCodeMap[langName];

        currentLang.textContent = langName;
        options.classList.add("hidden");
        if (autoChange) clearInterval(autoChange);

        const gtCombo = document.querySelector(".goog-te-combo");
        if (gtCombo && langCode) {
          gtCombo.value = langCode;
          gtCombo.dispatchEvent(new Event("change"));
        }

        e.stopPropagation();
      });
    });
  }

  document.addEventListener("click", () => {
    if (options) options.classList.add("hidden");
  });

  window.addEventListener("load", () => {
    if (switcher) switcher.classList.add("show");
  });

});



// SCROLL ANIMATION (INTERSECTION)

function initScrollAnimations(selector) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
    initScrollAnimations('.content-center h2'); 
  initScrollAnimations('.fixed-bg-section');   
  initScrollAnimations('.three-boxes .box');     
  initScrollAnimations('.intro-section');   
  initScrollAnimations('.card-section .card');
  initScrollAnimations('.image-section .image-box');
  initScrollAnimations('.reveal');
  initScrollAnimations('.popup-section-wrap');
});







// CATALOG SLIDER (FINAL + LIGHTBOX)

window.addEventListener("load", () => {

  const wrapper = document.getElementById("catalogSlider");
  const hoverBox = document.getElementById("catalogHoverBox");

  let slides = document.querySelectorAll(".catalog-slide");
  const thumbs = document.querySelectorAll(".thumb");

  //  LIGHTBOX ELEMENTS
  const lightbox = document.getElementById("catalogLightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const closeBtn = document.querySelector(".close-btn");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (!wrapper || slides.length === 0) return;

  // clone
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  wrapper.appendChild(firstClone);
  wrapper.insertBefore(lastClone, slides[0]);

  slides = document.querySelectorAll(".catalog-slide");

  let index = 1;
  let interval = null;

  wrapper.style.transform = `translateX(-${index * 100}%)`;

  function getGroup() {
    if (!slides[index]) return null;
    return slides[index].dataset.group;
  }

  function showThumbs(group) {
    if (!group) return;
    thumbs.forEach(t => {
      t.style.display = (t.dataset.group === group) ? "block" : "none";
    });
  }

  function moveSlide() {
    if (!slides[index]) return;

    wrapper.style.transition = "transform 0.8s ease-in-out";
    wrapper.style.transform = `translateX(-${index * 100}%)`;

    showThumbs(getGroup());
  }

  function nextSlide() {
    index++;
    moveSlide();
  }

  function start() {
    if (interval) return;
    interval = setInterval(nextSlide, 3000);
  }

  function stop() {
    clearInterval(interval);
    interval = null;
  }

  wrapper.addEventListener("transitionend", () => {

    if (index === slides.length - 1) {
      wrapper.style.transition = "none";
      index = 1;
      wrapper.style.transform = `translateX(-${index * 100}%)`;
    }

    if (index === 0) {
      wrapper.style.transition = "none";
      index = slides.length - 2;
      wrapper.style.transform = `translateX(-${index * 100}%)`;
    }
  });


  // LIGHTBOX LOGIC

  let currentGroupImages = [];
  let currentIndex = 0;

  function getImageUrl(el) {
    return el.style.backgroundImage
      .replace('url("', '')
      .replace('")', '');
  }

  function openLightbox(group, clickedThumb) {

    currentGroupImages = Array.from(thumbs)
      .filter(t => t.dataset.group === group);

    currentIndex = currentGroupImages.indexOf(clickedThumb);

    updateLightbox();

    if (lightbox) lightbox.style.display = "flex";
  }

  function updateLightbox() {
    if (lightboxImg && currentGroupImages[currentIndex]) {
      lightboxImg.src = getImageUrl(currentGroupImages[currentIndex]);
    }
  }

  //  THUMB CLICK
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {

      const group = thumb.dataset.group;

      slides.forEach((slide, i) => {
        if (slide.dataset.group === group) {
          index = i;
        }
      });

      moveSlide();
      openLightbox(group, thumb);
    });
  });

  //  LIGHTBOX CONTROLS
  if (closeBtn) closeBtn.onclick = () => lightbox.style.display = "none";

  if (nextBtn) {
    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % currentGroupImages.length;
      updateLightbox();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + currentGroupImages.length) % currentGroupImages.length;
      updateLightbox();
    };
  }

  if (lightbox) {
    lightbox.onclick = (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
      }
    };
  }
  
  // INIT

  showThumbs(getGroup());
  start();

  if (hoverBox) {
    hoverBox.addEventListener("mouseenter", stop);
    hoverBox.addEventListener("mouseleave", start);
  }

});






// GSAP ANIMATION (SAFE)

if (typeof gsap !== "undefined") {

  let tl = gsap.timeline();

  if (document.querySelector(".hero-title")) {
    tl.from(".hero-title", { y: 100, opacity: 0, duration: 1 });
  }

  if (document.querySelector(".hero-text")) {
    tl.from(".hero-text", { y: 60, opacity: 0, duration: 1 }, "-=0.6");
  }

  if (document.querySelector(".btn-main")) {
    tl.from(".btn-main", { y: 40, opacity: 0, duration: 1 }, "-=0.7");
  }

  if (document.querySelector(".product-card")) {
    tl.from(".product-card", {
      y: 120,
      opacity: 0,
      stagger: 0.3,
      duration: 1.4
    }, "-=0.7");
  }

  gsap.to(".card1", { y: 20, repeat: -1, yoyo: true, duration: 4 });
  gsap.to(".card2", { y: -20, repeat: -1, yoyo: true, duration: 5 });
  gsap.to(".card3", { y: 15, repeat: -1, yoyo: true, duration: 4 });
}







//  SERVICE IMAGE HOVER

const services = document.querySelectorAll(".service");

let current = document.getElementById("img1");
let next = document.getElementById("img2");

if (services.length && current && next) {

  services.forEach(service => {
    service.addEventListener("mouseenter", () => {

      const newSrc = service.getAttribute("data-img");

      if (current.src === newSrc) return;

      next.src = newSrc;

      next.classList.add("active");
      current.classList.remove("active");

      let temp = current;
      current = next;
      next = temp;
    });
  });

}
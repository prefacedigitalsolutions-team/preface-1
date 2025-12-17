// Language changes section Start

const switcher = document.getElementById("language-switcher");
const options = document.getElementById("language-options");
const currentLang = document.getElementById("current-language");

// English name → Google language code map
const langCodeMap = {
  English: "en",
  Hindi: "hi",
  Gujarati: "gu",
  Marathi: "mr",
  Punjabi: "pa",
  Kannada: "kn",
  Bengali: "bn",
  Telugu: "te",
  French: "fr",
  German: "de",
  Spanish: "es",
  Portuguese: "pt",
  Russian: "ru",
  Japanese: "ja",
  Arabic: "ar",
  Nepali: "ne"
};

// Auto rotate language text on button (sirf text)
const autoLangs = Object.keys(langCodeMap);
let index = 0;

let autoChange = setInterval(() => {
  index = (index + 1) % autoLangs.length;
  currentLang.textContent = autoLangs[index];
}, 2000);

// Open / close dropdown
switcher.addEventListener("click", (e) => {
  options.classList.toggle("hidden");
  e.stopPropagation();
});

// Click on language → translate whole website
document.querySelectorAll("#language-options .lang").forEach(item => {
  item.addEventListener("click", (e) => {
    const langName = e.target.getAttribute("data-en"); // English name
    const langCode = langCodeMap[langName];

    currentLang.textContent = langName;
    options.classList.add("hidden");
    clearInterval(autoChange);

    // Trigger Google Translate
    const gtCombo = document.querySelector(".goog-te-combo");
    if (gtCombo && langCode) {
      gtCombo.value = langCode;
      gtCombo.dispatchEvent(new Event("change"));
    }

    e.stopPropagation();
  });
});

// Click outside → close dropdown
document.addEventListener("click", () => {
  options.classList.add("hidden");
});


// animation website load time

window.addEventListener("load", () => {
  document.getElementById("language-switcher").classList.add("show");
});


// Language changes section End
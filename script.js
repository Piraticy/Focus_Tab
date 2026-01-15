const timeEl = document.querySelector(".time");
const greetingEl = document.querySelector(".greeting");
const focusInput = document.querySelector(".focus-input");

/* ---------------- TIME ---------------- */

function updateTime() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timeEl.textContent = `${hours}:${minutes}:${seconds}`;
  
  updateGreeting(hours);
}

function updateGreeting(hour) {
  let greeting = "Good evening";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const name = localStorage.getItem("userName");
  greetingEl.textContent = name ? `${greeting}, ${name}` : greeting;
}


/* ---------------- FOCUS ---------------- */

// Load saved focus
const savedFocus = localStorage.getItem("focus");

if (savedFocus) {
  focusInput.value = savedFocus;
}

// Save focus on Enter
focusInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    localStorage.setItem("focus", focusInput.value);
    focusInput.blur(); // nice UX
  }
});

/* ---------------- NAME ---------------- */

/* ---------------- NAME ---------------- */

const nameEl = document.querySelector(".name");

function capitalizeName(name) {
  return name
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Load saved name
const savedName = localStorage.getItem("userName");
if (savedName) {
  nameEl.textContent = savedName;
  nameEl.classList.add("visible");
} else {
  setTimeout(() => nameEl.classList.add("visible"), 800);
}

// Save name
nameEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    nameEl.blur();
  }
});

nameEl.addEventListener("blur", () => {
  const formatted = capitalizeName(nameEl.textContent.trim());
  nameEl.textContent = formatted;
  localStorage.setItem("userName", formatted);
});


/* ---------------- BACKGROUND SYSTEM ---------------- */

const body = document.body;

const localImages = [
  "images/bg.jpg",
  "images/bg1.jpg",
  "images/bg2.jpg",
  "images/bg3.jpg"
];

function setDailyLocalBackground() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("bgDate");
  let image = localStorage.getItem("bgImage");

  if (!image || savedDate !== today) {
    image = localImages[Math.floor(Math.random() * localImages.length)];
    localStorage.setItem("bgImage", image);
    localStorage.setItem("bgDate", today);
  }

  applyBackground(image);
}

function applyBackground(image) {
  body.style.backgroundImage = `url("${image}")`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
}
setDailyLocalBackground();

/* ---------------- FADE LAYER ---------------- */

const fadeLayer = document.querySelector(".fade-layer");

window.addEventListener("load", () => {
  fadeLayer.classList.add("fade-out");
  setTimeout(() => {
    fadeLayer.style.display = "none";
  }, 1000); // Match the duration in CSS
});

/*-----------------FADE IN OUT-----------------*/
function applyBackground(image) {
  body.style.backgroundImage = `url("${image}")`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
}
setDailyLocalBackground();

const UNSPLASH_KEY = "QNHFJ_2wcxzmPPtAe78WYdqznFI6oJ9kjtUbVXHJ5p8";

async function fetchUnsplashImage() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("bgDate");
  const savedImage = localStorage.getItem("bgImage");

  if (savedImage && savedDate === today) {
    applyBackground(savedImage);
    return;
  }

  try {
    const res = await fetch(
      "https://api.unsplash.com/photos/random?query=nature,landscape&orientation=landscape",
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
      }
    );

    const data = await res.json();
    const imageUrl = data.urls.full;

    applyBackground(imageUrl);
    localStorage.setItem("bgImage", imageUrl);
    localStorage.setItem("bgDate", today);

  } catch (err) {
    console.error("Unsplash failed, using local image");
    setDailyLocalBackground(); // fallback
  }
}

// Use Unsplash (with fallback)
fetchUnsplashImage();

// OR local only
// setDailyLocalBackground();
/* ---------------- DAILY QUOTE ---------------- */

const quoteEl = document.querySelector(".quote");

async function loadQuote() {
  const today = new Date().toDateString();
  const savedQuote = localStorage.getItem("quote");
  const savedDate = localStorage.getItem("quoteDate");

  if (savedQuote && savedDate === today) {
    quoteEl.textContent = savedQuote;
    return;
  }

  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    const text = `"${data.content}" — ${data.author}`;

    quoteEl.textContent = text;
    localStorage.setItem("quote", text);
    localStorage.setItem("quoteDate", today);
  } catch {
    quoteEl.textContent = "Stay focused. Keep moving.";
  }
}

loadQuote();

v/* ---------------- WEATHER ---------------- */

const weatherEl = document.querySelector(".weather");
const WEATHER_KEY = "V4cASKh8plvkz4Uq3Dn0dscVZOF4aD7soQv7xMxd";

navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_KEY}`
  );
  const data = await res.json();

  weatherEl.textContent = `${Math.round(data.main.temp)}°C · ${data.weather[0].main}`;
});



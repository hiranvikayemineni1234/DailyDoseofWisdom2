const quotes = [
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" }
];

let currentQuote = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const quoteEl = document.getElementById("quote");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const saveQuoteBtn = document.getElementById("save-quote");
const favoritesToggle = document.getElementById("favorites-toggle");
const favoritesPanel = document.getElementById("favorites");
const favoritesList = document.getElementById("favorites-list");

function getRandomQuote() {
  let newQuote;
  do {
    newQuote = quotes[Math.floor(Math.random() * quotes.length)];
  } while (newQuote.text === currentQuote.text);
  currentQuote = newQuote;
  showQuote();
}

function showQuote() {
  quoteEl.style.opacity = 0;
  authorEl.style.opacity = 0;
  setTimeout(() => {
    quoteEl.textContent = `"${currentQuote.text}"`;
    authorEl.textContent = `– ${currentQuote.author}`;
    quoteEl.style.opacity = 1;
    authorEl.style.opacity = 1;
    updateSaveButton();
  }, 300);
}

function updateSaveButton() {
  const isFavorited = favorites.some(
    (q) => q.text === currentQuote.text && q.author === currentQuote.author
  );
  saveQuoteBtn.textContent = isFavorited ? "💖 Saved" : "💖 Save Quote";
}

function toggleFavorite() {
  const index = favorites.findIndex(
    (q) => q.text === currentQuote.text && q.author === currentQuote.author
  );

  if (index === -1) {
    favorites.push(currentQuote);
    triggerConfetti();
  } else {
    favorites.splice(index, 1);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateSaveButton();
  renderFavorites();
}

function renderFavorites() {
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach((quote, index) => {
    const item = document.createElement("div");
    item.classList.add("favorite-item");
    item.innerHTML = `
      <p>"${quote.text}"</p>
      <small>– ${quote.author}</small>
      <button onclick="removeFavorite(${index})">🗑️</button>
    `;
    favoritesList.appendChild(item);
  });
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
  updateSaveButton();
}

function toggleFavoritesPanel() {
  favoritesPanel.classList.toggle("visible");
}

// 🎉 Confetti Trigger
function triggerConfetti() {
  const duration = 1 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 5,
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 100),
      origin: { y: 0.6 }
    });
  }, 250);
}

// Load Confetti Library
(function () {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
  script.async = true;
  document.head.appendChild(script);
})();

// Event Listeners
newQuoteBtn.addEventListener("click", getRandomQuote);
saveQuoteBtn.addEventListener("click", toggleFavorite);
favoritesToggle.addEventListener("click", toggleFavoritesPanel);

// Init
getRandomQuote();
renderFavorites();

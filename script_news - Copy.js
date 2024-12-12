const API_KEY = "4843591cbd1b4f23b82df24a507fb84c";
const BASE_URL = "https://newsapi.org/v2/everything";

const searchInput = document.getElementById("search-text");
const searchButton = document.getElementById("search-button");
const cardsContainer = document.getElementById("cards-container");
const templateCard = document.getElementById("template-news-card");


async function fetchNews(query) {
  try {
    const response = await fetch(`${BASE_URL}?q=${query}&apiKey=${API_KEY}`);
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    console.error(error);
    alert("Error fetching news articles.");
  }
}


function displayNews(articles) {
  cardsContainer.innerHTML = ""; 
  articles.forEach((article) => {
    const cardClone = templateCard.content.cloneNode(true);
    cardClone.querySelector("#news-img").src = article.urlToImage || "https://via.placeholder.com/400x200";
    cardClone.querySelector("#news-title").textContent = article.title || "No title available";
    cardClone.querySelector("#news-desc").textContent = article.description || "No description available";
    cardsContainer.appendChild(cardClone);
  });
}


searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchNews(query);
  } else {
    alert("Please enter a search term.");
  }
});


window.onload = () => fetchNews("latest");

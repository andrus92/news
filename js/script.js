const API_KEY = 'fbaed260130146c786b25f3b2ed50404';
const choiceElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');

const choices = new Choices(choiceElem, {
    searchEnabled: false,
    itemSelectText: '',
});

const getData = async (url) => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key' : API_KEY,
        }
        
    });

    const data = await response.json();
    return data;
};

const renderCard = (data) => {
    newsList.textContent = '';

    data.forEach(news => {
        const card = document.createElement('li');
        card.classList.add('news-item');

        card.innerHTML = `
            <img class="news-image" src="${news.urlToImage}" alt="${news.title}" width="270" height="200">
            <h3 class="news-title">
                <a href="${news.url}" class="news-link" target="_blank">${news.title}</a>
            </h3>
            <p class="news-description">${news.description}</p>

            <div class="news-footer">
                <time class="news-datetime" datetime="${news.publishedAt}">
                    <span class="news-date">${news.publishedAt}</span> 11:06
                </time>
                <div class="news-author">${news.author}</div>
            </div>
        `;

        newsList.append(card);

    });
};

const loadNews = async () => {
    const data = await getData('https://newsapi.org/v2/top-headlines?country=it');
    renderCard(data.articles);
};

loadNews();
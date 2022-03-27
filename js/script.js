const API_KEY = 'fbaed260130146c786b25f3b2ed50404';
const choiceElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');

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

const getDateCorrectFormat = (isoDate) => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });

    return `<span class="news-date">${fullDate}</span> ${fullTime}`;
}

const getImage = urlToImage => new Promise((resolve) => {
    const image = new Image(270, 200);
    image.addEventListener('load', () => {
        resolve(image);
    });

    image.addEventListener('error', () => {
        image.src = urlToImage || 'image/no-photo.jpg';
        image.className = 'news-image';
        resolve(image);
    });

    image.src = urlToImage || 'image/no-photo.jpg';
    image.className = 'news-image';
    return image;
});

const renderCard = (data) => {
    newsList.textContent = '';

    data.forEach(async news => {
        const {urlToImage, title, url, description, publishedAt, author} = news;
        const card = document.createElement('li');
        card.classList.add('news-item');

        const image = await getImage(urlToImage);
        image.alt = title;
        card.append(image);

        card.innerHTML += `
            <h3 class="news-title">
                <a href="${url}" class="news-link" target="_blank">${title || ''}</a>
            </h3>
            <p class="news-description">${description || ''}</p>
            <div class="news-footer">
                <time class="news-datetime" datetime="${publishedAt}">
                    ${getDateCorrectFormat(publishedAt)}
                </time>
                <div class="news-author">${author || ''}</div>
            </div>
        `;

        newsList.append(card);

    });
};

const loadNews = async () => {
    newsList.innerHTML = `<li class="preload"></li>`;
    const country = localStorage.getItem('country') || 'ua';
    choices.setChoiceByValue(country);
    title.classList.add('hide');
    const data = await getData(`https://newsapi.org/v2/top-headlines?country=${country}`);
    renderCard(data.articles);
};

const loadSearch = async (value) => {
    const data = await getData(`https://newsapi.org/v2/everything?q=${value}`);
    title.classList.remove('hide');
    title.textContent = `According to your request “${value}” ${data.articles.length} news have been found`;
    choices.setChoiceByValue('');
    renderCard(data.articles);
};

choiceElem.addEventListener('change' , (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value);
    loadNews(value);

});

formSearch.addEventListener('submit' , (event) => {
    event.preventDefault();
    
    const value = formSearch.search_input.value;
    console.log(value)
    formSearch.reset();
    loadSearch(value);
    

});


loadNews();
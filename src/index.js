import { fetchImages } from './js/api.js';
import Notiflix from 'notiflix';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const imagePerPage = 40;

let currentPage = 1;
let value = '';
let totalImages = 0;
let isFirstLoad = true;
let photoCaunter = 0;

formEl.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', onLoad);

function onLoad() {
    if (currentPage >= Math.ceil(totalImages / imagePerPage)) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        loadMore.hidden = true;
    } else {
        currentPage += 1;
        getImages(value, currentPage);
    }
}

function onFormSubmit(event) {
    event.preventDefault();
    value = event.target.elements.searchQuery.value.trim();
    if (value === '') {
        return; 
    }
    galleryEl.innerHTML = '';
    photoCaunter = 0;
    currentPage = 1;
    isFirstLoad = true;
    getImages(value, currentPage);
}

async function getImages(value, page = 1) { 
    try {

        const response = await fetchImages(value, page);
        totalImages = response.data.totalHits;
        photoCaunter += response.data.hits.length;
       
  
        if (response.data.total === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            loadMore.hidden = true;
        } else if (response.data.hits && response.data.hits.length > 0) {
            galleryEl.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
  
            if (isFirstLoad) {
                Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
                isFirstLoad = false;
            }
            
            if (photoCaunter < totalImages) {
                loadMore.hidden = false;
            } else {
                loadMore.hidden = true;
            }
  
            //  if (currentPage >= response.data.totalPages && response.data.totalHits < imagePerPage) {
            //       loadMore.hidden = true;
            //   } else {
            //       loadMore.hidden = false;
            //   }
             
        } else {
            Notiflix.Notify.failure("No images found.");
            loadMore.hidden = true;
        }
    } catch (err) {
        console.log(err.message);
    }
}

function createMarkup(arr) {
    return arr
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
            <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" width="400" loading="lazy"/></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </div>
            </div>`;
        })
        .join('');
}

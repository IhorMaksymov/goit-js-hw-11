import { ImageApiService } from "./fetchimg";
import LoadMoreBtm from './btmload'; 
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const imageApiService = new ImageApiService();
const loadMoreBtm = new LoadMoreBtm({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const refs = {
    form: document.querySelector('#search-form'),
    subBtn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
}

refs.form.addEventListener('submit', get)
loadMoreBtm.refs.button.addEventListener('click', onLoadMore);



async function get(e) {
    try {
        e.preventDefault();
        clearContainer();
        imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
        if (imageApiService.query) {
            loadMoreBtm.show();
            loadMoreBtm.disable();
            imageApiService.resetPage();
            imageApiService.fetchImages().then(data => {
                const arrayImage = data.hits;
                renderCard(arrayImage);
                loadMoreBtm.enable();
                if (arrayImage.length === 0) {
                    Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                    loadMoreBtm.refs.button.classList.add('is-hidden')
                }
            });
        }
        if (imageApiService.query === '') {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            loadMoreBtm.refs.button.classList.add('is-hidden')
        }
    } catch (error) {
        console.log(error)
    }    
};


function renderCard(arrayImages) {
    const imageCard = arrayImages.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a class="photo-card" href='${largeImageURL}'>
            <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
            <p class="info-item"><b>Likes: </b>${likes}</p>
            <p class="info-item"><b>Views: </b>${views}</p>
            <p class="info-item"><b>Comments: </b>${comments}</p>
            <p class="info-item"><b>Downloads: </b>${downloads}</p>
            </div>
        </a>`   
    }).join('')
    refs.gallery.insertAdjacentHTML('beforeend', imageCard);
    const lightBox = new SimpleLightbox(".gallery a")
}

function onLoadMore() {
    loadMoreBtm.disable();
    imageApiService.fetchImages().then(data => {
        const arrayImage = data.hits;
        renderCard(arrayImage);
        loadMoreBtm.enable();
        const totalPages = Math.ceil(data.totalHits / imageApiService.per_page);
        if (imageApiService.page === totalPages) {
            Notify.info("We're sorry, but you've reached the end of search results.")
            loadMoreBtm.refs.button.classList.add('is-hidden');
        }
    });
}

function clearContainer() {
    refs.gallery.innerHTML = '';
}
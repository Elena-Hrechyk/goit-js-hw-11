import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchImages from './js/class';
import { createMarkup } from './js/markup';

const searchForm = document.querySelector('#search-form');
const photoCards = document.querySelector('.photo-cards');
const loadMoreBtn = document.querySelector('.load-more');
let totalHits = 0;

const searchImages = new SearchImages();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMoreImages);

function onSearch(evt) {
  evt.preventDefault();
  clearMarkup();
  searchImages.resetPage();
  totalHits = 24;

  searchImages.value = evt.target.searchQuery.value.trim();

  searchImages
    .getImages()
    .then(async resp => {
      if (resp.hits.length === 0) {
        Notiflix.Notify.info(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        clearMarkup();
      } else {
        photoCards.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
        let lightbox = new SimpleLightbox('.link');
        loadMoreBtn.style.display = 'block';
        searchImages.incrementPage();
      }
    })
    .catch(() => {
      Notiflix.Notify.failure(`Sorry, search failed. Please try again.`);
      clearMarkup();
    });
  // evt.currentTarget.reset();
}

function onLoadMoreImages() {
  searchImages.getImages().then(async resp => {
    photoCards.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
    let lightbox = new SimpleLightbox('.link');
    const pagesQuantity = Math.ceil(resp.totalHits / resp.hits.length);
    if (searchImages.page === pagesQuantity) {
      loadMoreBtn.style.display = 'none';
      return;
    }
    totalHits += resp.hits.length;
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    searchImages.incrementPage();
  });
}

function clearMarkup() {
  photoCards.innerHTML = '';
  loadMoreBtn.style.display = 'none';
}

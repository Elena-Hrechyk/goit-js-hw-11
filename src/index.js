import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchImages from './js/class';
import { createMarkup } from './js/markup';
import { clearMarkup } from './js/markup';
import { getPagesQuantity } from './js/pagesQuantity';

const searchForm = document.querySelector('#search-form');
export const gallery = document.querySelector('.gallery');
export const loadMoreBtn = document.querySelector('.load-more');

let lightbox = {};
let totalHits = 0;

const searchImages = new SearchImages();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMoreImages);

function onSearch(evt) {
  evt.preventDefault();
  clearMarkup();
  searchImages.resetPage();
  totalHits = searchImages.perPage;

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
        gallery.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
        lightbox = new SimpleLightbox('.gallery a');

        loadMoreBtn.style.display = 'block';

        getPagesQuantity(
          resp.totalHits,
          searchImages.perPage,
          searchImages.page
        );

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
    gallery.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
    lightbox.refresh();

    totalHits += resp.hits.length;
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

    getPagesQuantity(resp.totalHits, searchImages.perPage, searchImages.page);

    searchImages.incrementPage();
  });
}

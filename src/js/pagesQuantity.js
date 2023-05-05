import { loadMoreBtn } from '..';

//розрахунок кількості сторінок

export function getPagesQuantity(sumHits, perPage, page) {
  const pagesQuantity = Math.ceil(sumHits / perPage);

  if (page === pagesQuantity) {
    loadMoreBtn.style.display = 'none';
    return;
  }
}

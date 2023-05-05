import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '35811349-b68fa3ce0fc70a92b2c072ca8';

export default class SearchImages {
  constructor() {
    this.value = '';
    this.page = 1;
    this.perPage = 24;
  }

  async getImages() {
    const resps = await axios.get(
      `${BASE_URL}/?key=${API_KEY}&q=${this.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
    );
    if (resps.status === 404) {
      throw new Error(resps.statusText);
    }
    return resps.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get searchValue() {
    return this.value;
  }

  set searchValue(newValue) {
    this.value = newValue;
  }
}

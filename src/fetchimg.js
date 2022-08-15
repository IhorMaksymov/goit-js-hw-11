export { ImageApiService };

import axios from 'axios';
const API_URL = 'https://pixabay.com/api/';
const API_KEY = '29118139-f0fadce498ed45b93da5b0f44';

class ImageApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchImages() {
        const options = new URLSearchParams({
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: this.per_page,
        });

        const response = await axios.get(`${API_URL}?${options}`);
        this.additionPage();
        return response.data;   
    }

    additionPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
import axios from 'axios';

class CategoryService {
  constructor() {
    this.baseURL = process.env.VUE_APP_BACKEND_URL;
    this.instance = axios.create({
      baseURL: this.baseURL,
    });
  }

  async getCategories() {
    return this.instance.get('api/category');
  }

  async getTopCategories() {
    return this.instance.get('api/category/top')
  }
}

export default CategoryService;

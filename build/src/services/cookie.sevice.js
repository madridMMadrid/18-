import axios from 'axios';

class CookieService {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.VUE_APP_COOKIE_URL,
      withCredentials: true,
    });
  }

  async get() {
    return this.instance.get('/');
  }
}

export default CookieService;

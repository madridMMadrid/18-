import axios from 'axios';

class InquirerService {
  constructor() {
    this.baseURL = process.env.VUE_APP_BACKEND_URL;
    this.instance = axios.create({
      baseURL: this.baseURL,
    });
  }

  async getSources() {
    return this.instance.get('api/source');
  }
}

export default InquirerService;

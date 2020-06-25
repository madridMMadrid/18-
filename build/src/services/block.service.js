import axios from 'axios';

class BlockService {
  constructor() {
    this.baseURL = process.env.VUE_APP_BACKEND_URL;
    this.instance = axios.create({
      baseURL: this.baseURL,
    });
  }

  async get(params) {
    return this.instance.get(`api/content?${this.queryEncode(params)}`);
  }

  makeLink(params) {
    return `${this.baseURL}tracker/click?${this.queryEncode(params)}`;
  }

  queryEncode(params) {
    const keys = Object.keys(params);

    return keys.map(key => `${key}=${params[key]}`).reduce((sum, n) => `${sum}&${n}`);
  }
}

export default BlockService;

export class APIRequest {
  constructor({
    params = {},
    payload = {},
    config = {},
    queryParams = {},
  } = {}) {
    this.params = params || {};
    this.payload = payload || {};
    this.config = config || {};
    this.queryParams = queryParams || {};
  }
}

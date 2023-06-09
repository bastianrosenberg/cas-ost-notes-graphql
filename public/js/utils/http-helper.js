import CONSTANTS from "./constants.js";

class HttpHelper {
  static async ajax(data, headers) {
    const fetchHeaders = new Headers({
      "content-type": "application/json",
      ...(headers || {}),
    });

    return fetch(CONSTANTS.API_BASE_URL, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify(data),
    }).then((res) => res.json());
  }
}

export default HttpHelper;

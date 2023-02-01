export default class FetchWrapper {
    constructor(baseURL){
        this.baseURL = baseURL;
    }

    // Performs HTTP:GET request to a endpoint of the Base URL
    get(endpoint='') {
        return fetch(this.baseURL + endpoint)
        .then(response => response.json())
    }
    // Interal Helper method. Prevents code duplication
    _send(method, endpoint, body){
        return fetch(this.baseURL + endpoint, {
            method,
            headers: {'Content-Type' : "application/json"},
            body
        })
        .then(response => response.json())
    }

    post(endpoint, body) {
        return this._send('POST', endpoint, body)
    }
    put(endpoint, body) {
        return this._send("PUT", endpoint, body);
    }
    delete(endpoint, body) {
        return this._send("DELETE", endpoint, body);
    }
}
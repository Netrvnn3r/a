const axios = require('axios').default;

class ApiHelper {
    constructor() {
        this.lastResponse = null;
        this.lastRequest = null;
        this.error = null;
    }

    async getRequest(url) {
        this.lastRequest = { method: 'GET', url, headers: {}, data: null };
        try {
            this.lastResponse = await axios.get(url);
            return this.lastResponse;
        } catch (error) {
            this.lastResponse = error.response;
            this.error = error;
            return this.lastResponse;
        }
    }

    async postRequest(url, body) {
        this.lastRequest = { method: 'POST', url, headers: { 'Content-Type': 'application/json' }, data: body };
        try {
            this.lastResponse = await axios.post(url, body);
            return this.lastResponse;
        } catch (error) {
            this.lastResponse = error.response;
            this.error = error;
            return this.lastResponse;
        }
    }

    getLastResponse() {
        return this.lastResponse;
    }

    getFullLog() {
        return JSON.stringify({
            request: this.lastRequest,
            response: {
                status: this.lastResponse?.status,
                statusText: this.lastResponse?.statusText,
                headers: this.lastResponse?.headers,
                data: this.lastResponse?.data
            }
        }, null, 2);
    }
}

module.exports = new ApiHelper();

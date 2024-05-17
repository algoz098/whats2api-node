const fetch = require('node-fetch');

module.exports = function createFetch(creationOptions) {
    async function whats2apiFetch(url, options = {}) {
        let tried = 0;
        let retries = options.retries ?? creationOptions.retries ?? 1;

        for (let index = 0; index < retries; index++) {
            try {
                const timeout = options.timeout ?? creationOptions.timeout ?? 10000;
                const urlTarget = `${creationOptions.baseUrl}${url}`;
            
                const fetchOptions = {
                    ...options,
                    signal: AbortSignal.timeout(timeout)
                }

                const response = await fetch(urlTarget, fetchOptions)
                
                if (response.status > 399) throw {
                    abort: true,
                    response
                }

                return response;
            } catch (error) {
                console.log(999, error)
                if (error.abort) {
                    // console.log('Whats2API Fetch Error', error.abort, error)
                    throw error.response
                }
                
                if (tried >= retries) {
                    throw error;
                }
            }
            tried++;
        }

    }
    
    return whats2apiFetch;
}
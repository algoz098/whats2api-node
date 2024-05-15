module.exports = function createAuth({
    fetch,
    userCredentials,
}) {
    const auth = {
        token: null,
        expiresAt: null,
        userId: null
    }

    function checkToken() {
        const now = Date.now();
    
        if (!auth.token) return false;
    
        if (auth.expiresAt < now) return false;
    
        return true;
    }

    async function authenticate(force = false) {
        if (!force && checkToken()) return auth;
    
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCredentials),
        }
    
        try {
            const response = await fetch(`/authentication`, options)
            const data = await response.json();
            auth.token = data?.accessToken || '';
            auth.expiresAt = Date.now() + 82800000; // 1 day
            auth.userId = data?.user?._id || '';
            return auth;
        } catch (error) {
            // error is a node-fetch error
            const status = error.status;
            const message = error.statusText;
            console.error('Error authenticating Whats2Api, check user credentials:', status, message)
            throw error
        }
    }
    

    return {
        auth,
        checkToken,
        authenticate,
    };
}
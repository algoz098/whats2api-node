
module.exports =  async function request({
        fetch,
        auth,
        connectionId,
        method,
        params,
        media = false
    }) {
        const {token} = await auth.authenticate();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const body = JSON.stringify({
            connectionId,
            method,
            params
        })

        const response = await fetch(`/connections/request`, {
            method: 'POST',
            headers,
            body
        })

        if (!media) {
            const res = await response.json();
    
            return res.result;
        }

        return response.arrayBuffer()
    }

async function signUp(data) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response;
}

async function signIn(data) {
    const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return response;
}

async function check(token) {
    const response = await fetch("/api/auth/check", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response;
}

const authAPI = {
    signUp,
    signIn,
    check
};

export default authAPI;

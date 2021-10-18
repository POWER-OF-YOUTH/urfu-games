async function signUp(data) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {
        return { 
            success: true,
            data: responseData
        };
    }
    return {
        success: false,
        errors: responseData.errors.map(err => new Error(err.detail))
    };
}

async function signIn(data) {
    const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (response.ok) {
        return { 
            success: true,
            data: responseData
        };
    }
    return {
        success: false,
        errors: responseData.errors.map(err => new Error(err.detail))
    };
}

async function signOut() {
    const response = await fetch("/api/auth/signout", {
        method: "POST"
    });

    const responseData = await response.json();

    if (response.ok) {
        return { 
            success: true,
            data: responseData
        };
    }
    return {
        success: false,
        errors: responseData.errors.map(err => new Error(err.detail))
    };
}

async function check(token) {
    const response = await fetch("/api/auth/check", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const responseData = await response.json();

    if (response.ok) {
        return { 
            success: true,
            data: responseData
        };
    }
    return {
        success: false,
        errors: responseData.errors.map(err => new Error(err.detail))
    };
}

const authAPI = {
    signUp,
    signIn,
    signOut,
    check
};

export default authAPI;
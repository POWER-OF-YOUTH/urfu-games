import authAPI from "./api/authAPI";

async function checkAuthentication() {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && token) {
        const response = await authAPI.check(token);

        if (response.success) {
            const data = {...currentUser, ...response.data};
            localStorage.setItem("user", JSON.stringify(data.user));
            return {
                success: true,
                user: data
            };
        }
    }
    return {
        success: false,
        user: null
    };
}

export default checkAuthentication;

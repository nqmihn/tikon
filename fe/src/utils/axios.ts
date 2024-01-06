import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_BACKEND_URL,
    withCredentials: true
});
const handleRefresh = async () => {
    const res = await instance.post("/api/v1/auth/refresh")
    if (res.data) return res.data.accessToken
    return null
}
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry'
// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    if (error.config && error.response && +error.response.status === 401 && !error.config.headers[NO_RETRY_HEADER]) {
        const accessToken = await handleRefresh()
        error.config.headers[NO_RETRY_HEADER] = "true"
        if (accessToken) {
            error.config.headers['Authorization'] = `Bearer ${accessToken}`
            localStorage.setItem("access_token", accessToken)
            return instance.request(error.config)
        }
    }

    if (error.config && error.response && +error.response.status === 400 && error.config.url === "/api/v1/auth/refresh") {
        window.location.href = '/login'
    }

    return error && error.response && error.response.data
        ? error.response.data
        : Promise.reject(error);
});

export default instance
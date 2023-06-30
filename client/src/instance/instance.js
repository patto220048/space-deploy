import axios from "axios"

const axiosInstance = axios.create({
    baseURL : process.env.REACT_APP_API_URL_SSL ? process.env.REACT_APP_API_URL_SSL : process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",
    },
})

export default axiosInstance;
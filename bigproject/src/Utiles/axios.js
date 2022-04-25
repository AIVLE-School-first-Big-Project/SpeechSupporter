import axios from 'axios';

// 요청 인터셉터

export const doRequest = (url) => {
    axios.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

let isTokenRefreshing = false;
let refreshSubscribers = [];

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// 응답 인터셉터

export const publishRefreshToken = () => {
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const {
                config,
                response: { status },
            } = error;

            if (status === 401) {
                // error.response.data.detail === 'TokenExpiredError!'
                if (!isTokenRefreshing) {
                    isTokenRefreshing = true;

                    const originalRequest = config;
                    const refreshToken = localStorage.getItem('refresh');
                    const { data } = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    const { accessToken = data.access, refresh = data.refresh } = data;

                    localStorage.setItem('access', accessToken);
                    localStorage.setItem('refresh', refresh);

                    //onTokenRefreshed(data.access);
                    originalRequest.headers.Authorization = accessToken;
                    addRefreshSubscriber(originalRequest);

                    const retryOriginalRequest = new Promise((resolve) => {
                        resolve(axios(refreshSubscribers[0]));
                    });
                    refreshSubscribers = [];

                    return retryOriginalRequest;
                }
            }
            isTokenRefreshing = false;
            return Promise.reject(error);
        }
    );
};

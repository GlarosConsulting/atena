import axios from 'axios';

import Cookies from '@/lib/cookies';
import getTimeZone from '@/utils/getTimeZone';

interface ISession {
  access_token: string;
  refresh_token: string;
}

interface IUpdateSessionResponse {
  access_token: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.defaults.headers['User-TimeZone'] = getTimeZone();

api.interceptors.request.use(
  config => {
    const session = Cookies.get<ISession>('session');

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  error => {
    const request = error.config;

    const isFrom = (from: string): boolean => request.url.includes(from);

    const isMethod = (
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    ): boolean => request.method.toUpperCase() === method;

    const isStatusCode = (statusCode: number) =>
      error.response && error.response.status === statusCode;

    if (isFrom('sessions') && !isMethod('PUT')) {
      return Promise.reject(error);
    }

    const session = Cookies.get<ISession>('session');

    if (
      !session ||
      (!isStatusCode(200) && isFrom('sessions') && isMethod('PUT'))
    ) {
      Cookies.remove('session');
      window.location.href = '/';

      return Promise.reject(error);
    }

    if (isStatusCode(401) && !request._retry) {
      request._retry = true;

      return api
        .put<IUpdateSessionResponse>('sessions', {
          token: session.refresh_token,
        })
        .then(response => {
          const { access_token } = response.data;

          Cookies.set('session', { ...session, access_token });

          api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

          return api(request);
        });
    }

    return Promise.reject(error);
  },
);

export default api;

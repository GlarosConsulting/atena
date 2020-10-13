import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const fetchLibApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default function fetch<T = any>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  return fetchLibApi.get<T>(url, config);
}

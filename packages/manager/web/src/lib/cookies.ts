import Cookies from 'js-cookie';

const key = process.env.NEXT_PUBLIC_COOKIES_KEY;

function get<T = string>(name: string): T | null {
  const value = Cookies.get(`${key}/${name}`);

  if (value) {
    return JSON.parse(value) as T;
  }

  return null;
}

function remove(name: string): void {
  Cookies.remove(`${key}/${name}`);
}

function set(name: string, value: any): string {
  return Cookies.set(`${key}/${name}`, value);
}

export default {
  get,
  remove,
  set,
};

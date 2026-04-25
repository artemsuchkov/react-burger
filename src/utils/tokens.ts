import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken' as const;

// Функция проверки наличия токена
export function isTokenExists(): boolean {
  return !!Cookies.get(ACCESS_TOKEN_KEY);
}

import Cookies from 'js-cookie';

// Функция проверки наличия токена
export function isTokenExists() {
  return !!Cookies.get('accessToken');
}

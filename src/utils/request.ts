import { defaultOptions, host } from '@utils/constants.ts';

// Кастомный класс для обработки ошибок ответа сервера
export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}

// Функция проверки ответа от сервера
export async function checkResponse<T = unknown>(response: Response): Promise<T> {
  const res = await response.json();

  if (response.ok) {
    return res as T;
  }
  throw new ServerError(res.message, response.status);
}

// Функция отправки запроса
export async function request<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${host}/api/${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  return await checkResponse<T>(response);
}

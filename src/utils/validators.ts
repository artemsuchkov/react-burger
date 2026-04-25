import type { Validators } from '../types/validators';

const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9\s-]{2,}$/;

export const validators: Validators = {
  name: {
    validator: (value: string): boolean => !!value && NAME_REGEX.test(value.trim()),
    message: 'Укажите корретное имя.',
  },
  email: {
    validator: (value: string): boolean => EMAIL_REGEX.test(value.trim()),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value: string): boolean => PWD_REGEX.test(value.trim()),
    message: 'Укажите пароль посложнее.',
  },
};

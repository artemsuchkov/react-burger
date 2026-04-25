//export const host = 'https://norma.education-services.ru';
export const host = 'https://new-stellarburgers.education-services.ru';

export type DefaultOptions = {
  method: string;
  headers: Record<string, string>;
};

export const defaultOptions: DefaultOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

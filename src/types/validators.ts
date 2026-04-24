export type ValidatorField = 'name' | 'email' | 'password';

export type ValidatorConfig = {
  validator: (value: string) => boolean;
  message: string;
};

export type Validators = Record<ValidatorField, ValidatorConfig>;

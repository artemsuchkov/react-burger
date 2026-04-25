import { useState } from 'react';

import { validators } from '../utils/validators';

import type { ChangeEvent } from 'react';

type FormValues = Record<string, string>;
type FormErrors = Record<string, boolean>;

type UseFormWithValidationReturn = {
  values: FormValues;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  isValid: boolean;
};

export function useFormWithValidation(
  initialValues: FormValues = {}
): UseFormWithValidationReturn {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>(initErrors(initialValues));
  const [isValid, setIsValid] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.target;
    const value = input.value;
    const name = input.name;

    const newValues = {
      ...values,
      [name]: value,
    };

    setValues(newValues);

    const newErrors = {
      ...errors,
      [name]: validators[name as keyof typeof validators]?.validator(value) ?? true,
    };

    setErrors(newErrors);

    const formIsNotValid = Object.values(newErrors).some((x) => !x);

    setIsValid(!formIsNotValid);
  }

  return { values, handleChange, errors, isValid };
}

function initErrors(formValues: FormValues): FormErrors {
  return Object.keys(formValues).reduce((errors, fieldName) => {
    errors[fieldName] = false;
    return errors;
  }, {} as FormErrors);
}

import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ICurrency } from './currency-converter.model';

export function validCurrency(list: ICurrency[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue =
      typeof control.value === 'string' ? control.value : control.value.id;
    if (!list.some((currency) => currency.id === inputValue.toUpperCase())) {
      return { invalidCurrency: true };
    }

    return null;
  };
}

export function validNumberLength(numRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const exceedsMaxLength = !numRe.test(control.value);
    return exceedsMaxLength ? { exceededMaximumNumberLength: true } : null;
  };
}

export function isNumber(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value !== 'number') return { notNumber: true };
  return null;
}

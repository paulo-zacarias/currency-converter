import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ICurrency } from './currency-converter.model';

export function validCurrency(list: ICurrency[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue = control.value.toUpperCase();
    if (!list.some((currency) => currency.id === inputValue)) {
      return { invalidCurrency: true };
    }

    return null;
  };
}

export function validNumberLength(numRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const exceedsMaxLength = !numRe.test(control.value);
    return exceedsMaxLength
      ? { 'Maximum allowed number of digits is 9': true }
      : null;
  };
}

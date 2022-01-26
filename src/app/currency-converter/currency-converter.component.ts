import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ICurrency } from './currency-converter.model';

export function validCurrency(list: ICurrency[]): ValidatorFn {
  console.log(list);
  return (control: AbstractControl): ValidationErrors | null => {
    const inputValue = control.value.toUpperCase();
    if (!list.some((currency) => currency.id === inputValue)) {
      return { invalidCurrency: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent implements OnInit, AfterViewInit {
  @Input() listOfCurrencies: ICurrency[] = [];
  convertFromControl: FormControl = new FormControl();
  convertToControl: FormControl = new FormControl();
  fromOptions!: Observable<ICurrency[]>;
  toOptions!: Observable<ICurrency[]>;

  @ViewChildren(MatAutocompleteTrigger)
  triggers!: QueryList<MatAutocompleteTrigger>;

  constructor() {}

  ngOnInit(): void {
    this.convertFromControl = new FormControl('', [
      Validators.required,
      validCurrency(this.listOfCurrencies),
    ]);
    this.convertToControl = new FormControl('', [
      Validators.required,
      validCurrency(this.listOfCurrencies),
    ]);

    this.fromOptions = this.convertFromControl.valueChanges.pipe(
      startWith(''),
      map((val) => this.filter(val))
    );

    this.toOptions = this.convertToControl.valueChanges.pipe(
      startWith(''),
      map((val) => this.filter(val))
    );
  }

  ngAfterViewInit() {
    this.triggers.get(0)?.panelClosingActions.subscribe((e: any) => {
      console.log(e);
      if (!(e && e.source)) {
        this.convertFromControl.setValue('');
        this.triggers.get(0)?.closePanel();
      }
    });
    this.triggers.get(1)?.panelClosingActions.subscribe((e: any) => {
      console.log(e);
      if (!(e && e.source)) {
        this.convertToControl.setValue('');
        this.triggers.get(1)?.closePanel();
      }
    });
  }

  private filter(val: string): ICurrency[] {
    const input = val.toUpperCase();
    return this.listOfCurrencies.filter((option) => {
      return (
        option.id.toUpperCase().includes(input) ||
        option.currencyName.toUpperCase().includes(input)
      );
    });
  }

  swapSelection() {
    const temp = this.convertFromControl.value;
    this.convertFromControl.setValue(this.convertToControl.value);
    this.convertToControl.setValue(temp);
  }
}

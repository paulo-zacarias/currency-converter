import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { startWith, map, debounceTime, takeUntil } from 'rxjs/operators';
import { IConvertRate, ICurrency } from './shared/currency-converter.model';
import {
  validNumberLength,
  validCurrency,
} from './shared/custom-form-validation';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() listOfCurrencies: ICurrency[] = [];
  @Output() newSelection = new EventEmitter<string>();
  convertFromControl: FormControl = new FormControl();
  convertToControl: FormControl = new FormControl();
  amountControl: FormControl = new FormControl('', [
    Validators.required,
    validNumberLength(new RegExp('^[0-9]{0,9}$')),
  ]);
  fromOptions!: Observable<ICurrency[]>;
  toOptions!: Observable<ICurrency[]>;
  private unsubscribe$ = new Subject();
  @Input() convertionRate!: IConvertRate;
  convertedAmout: number = 0;
  amountToConvert: number = 0;

  @ViewChildren(MatAutocompleteTrigger)
  triggers!: QueryList<MatAutocompleteTrigger>;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.convertionRate) {
      const rate = changes['convertionRate'].currentValue.rate;
      this.amountToConvert = this.amountControl.value;
      this.convertedAmout = this.amountToConvert * rate;
    }
  }

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

    this.amountControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.unsubscribe$))
      .subscribe(() => this.selectionChanged());
  }

  ngAfterViewInit() {
    //https://github.com/angular/components/issues/3334

    this.triggers.get(0)?.panelClosingActions.subscribe((e: any) => {
      if (!(e && e.source)) {
        if (!this.convertFromControl.valid) {
          this.convertFromControl.setValue('');
          this.triggers.get(0)?.closePanel();
        }
      }
    });
    this.triggers.get(1)?.panelClosingActions.subscribe((e: any) => {
      if (!(e && e.source)) {
        if (!this.convertToControl.valid) {
          this.convertToControl.setValue('');
          this.triggers.get(1)?.closePanel();
        }
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

  selectionChanged() {
    if (
      this.convertFromControl.valid &&
      this.convertToControl.valid &&
      this.amountControl.valid
    ) {
      const newSelectionValue =
        this.convertFromControl.value + '_' + this.convertToControl.value;
      this.newSelection.emit(newSelectionValue);
    }
  }

  swapSelection() {
    const temp = this.convertFromControl.value;
    this.convertFromControl.setValue(this.convertToControl.value);
    this.convertToControl.setValue(temp);
    this.selectionChanged();
  }
}

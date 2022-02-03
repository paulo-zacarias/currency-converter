import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
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
  isNumber,
} from './shared/custom-form-validation';

enum Triggers {
  FromControl,
  ToControl,
}

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() listOfCurrencies: ICurrency[] = [];
  @Input() loading = false;
  @Input() convertionRate!: IConvertRate;
  @Output() newSelection = new EventEmitter<string>();
  convertFromControl: FormControl = new FormControl();
  convertToControl: FormControl = new FormControl();
  amountControl: FormControl = new FormControl('', [
    Validators.required,
    validNumberLength(new RegExp('^[0-9]{0,9}$')),
    isNumber,
  ]);
  fromOptions!: Observable<ICurrency[]>;
  toOptions!: Observable<ICurrency[]>;
  convertedAmout: number = 0;
  amountToConvert: number = 0;
  private unsubscribe$ = new Subject<void>();

  @ViewChildren(MatAutocompleteTrigger)
  triggers!: QueryList<MatAutocompleteTrigger>;
  @ViewChild('inputFrom') inputFrom!: ElementRef;
  @ViewChild('inputTo') inputTo!: ElementRef;

  public TriggersEnum = Triggers;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.convertionRate && changes['convertionRate']) {
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
      map((value) => (typeof value === 'string' ? value : value.id)),
      map((id) => (id ? this.filter(id) : this.listOfCurrencies.slice())),
      takeUntil(this.unsubscribe$)
    );

    this.toOptions = this.convertToControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.id)),
      map((id) => (id ? this.filter(id) : this.listOfCurrencies.slice())),
      takeUntil(this.unsubscribe$)
    );

    this.amountControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.unsubscribe$))
      .subscribe(() => this.selectionChanged());
  }

  ngAfterViewInit(): void {
    //https://github.com/angular/components/issues/3334

    this.triggers
      .get(this.TriggersEnum.FromControl)
      ?.panelClosingActions.pipe(takeUntil(this.unsubscribe$))
      .subscribe((e: any) => {
        if (!(e && e.source)) {
          if (!this.convertFromControl.valid) {
            this.convertFromControl.setValue('');
            this.triggers.get(this.TriggersEnum.FromControl)?.closePanel();
          }
        }
      });
    this.triggers
      .get(this.TriggersEnum.ToControl)
      ?.panelClosingActions.pipe(takeUntil(this.unsubscribe$))
      .subscribe((e: any) => {
        if (!(e && e.source)) {
          if (!this.convertToControl.valid) {
            this.convertToControl.setValue('');
            this.triggers.get(this.TriggersEnum.ToControl)?.closePanel();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  getAmountErrorMsg(): string {
    if (this.amountControl.hasError('required')) return 'Required field';
    if (this.amountControl.hasError('notNumber'))
      return 'Value inserted is not a number';
    if (this.amountControl.hasError('exceededMaximumNumberLength'))
      return 'Maximum number lenght is 9';
    if (this.amountControl.hasError('required')) return 'Required field';
    return 'Error';
  }

  getCurrencyErrorMsg(control: any): string {
    if (control.hasError('invalidCurrency')) return 'Invalid currency';
    if (control.hasError('required')) return 'Required field';
    return 'Error';
  }

  selectionChanged(): void {
    if (
      this.convertFromControl.valid &&
      this.convertToControl.valid &&
      this.amountControl.valid
    ) {
      const newSelectionValue =
        this.convertFromControl.value.id + '_' + this.convertToControl.value.id;
      this.newSelection.emit(newSelectionValue);
    }
  }

  swapSelection(): void {
    const temp = this.convertFromControl.value;
    this.convertFromControl.setValue(this.convertToControl.value);
    this.convertToControl.setValue(temp);
    this.selectionChanged();
  }

  displayFn(option: ICurrency): string {
    return option && option.id ? `${option.id} - ${option.currencyName}` : '';
  }

  clearInput(evt: any, trigger: number): void {
    evt.stopPropagation();
    if (trigger === this.TriggersEnum.FromControl) {
      this.convertFromControl.setValue('');
      this.inputFrom?.nativeElement.focus();
      this.triggers.get(this.TriggersEnum.FromControl)?.openPanel();
    } else {
      this.convertToControl.setValue('');
      this.inputTo?.nativeElement.focus();
      this.triggers.get(this.TriggersEnum.ToControl)?.openPanel();
    }
  }
}

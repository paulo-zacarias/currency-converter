import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { CurrencyConverterComponent } from './currency-converter.component';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyConverterComponent],
      imports: [MatAutocompleteModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 autocomplete elements', () => {
    expect(component.triggers.length).toEqual(2);
  });

  it('should have validation errors', () => {
    // autocomplete errors
    component.convertFromControl.setValue('XPTO');
    expect(component.convertFromControl.hasError('invalidCurrency')).toBeTrue();
    component.convertFromControl.setValue('');
    expect(component.convertFromControl.hasError('required')).toBeTrue();

    // numerical input errors
    component.amountControl.setValue(null);
    expect(component.amountControl.hasError('required')).toBeTrue();
    component.amountControl.setValue('a');
    expect(component.amountControl.hasError('notNumber')).toBeTrue();
    component.amountControl.setValue(12345678910);
    expect(
      component.amountControl.hasError('exceededMaximumNumberLength')
    ).toBeTrue();
  });

  it('should call selectionChange', async () => {
    const spySelectionChanged = spyOn(component, 'selectionChanged');
    const el = fixture.nativeElement.querySelector('.cy-amount-input');
    el.value = 1;
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spySelectionChanged).toHaveBeenCalled();
    expect(component.amountControl.value).toEqual(1);
  });

  it('should swap selection', () => {
    const spySelectionChanged = spyOn(component, 'selectionChanged');
    component.convertFromControl.setValue('EUR');
    component.convertToControl.setValue('USD');
    expect(component.convertFromControl.value).toEqual('EUR');
    expect(component.convertToControl.value).toEqual('USD');
    component.swapSelection();
    expect(component.convertFromControl.value).toEqual('USD');
    expect(component.convertToControl.value).toEqual('EUR');
    expect(spySelectionChanged).toHaveBeenCalled();
  });

  it('should filter currency list', async () => {
    component.listOfCurrencies = [
      { currencyName: 'Euro', currencySymbol: '€', id: 'EUR' },
      { currencyName: 'British Pound', currencySymbol: '£', id: 'GBP' },
      { currencyName: 'United States Dollar', currencySymbol: '$', id: 'USD' },
    ];
    //@ts-ignore
    const spyFilter = spyOn(component, 'filter');
    const el = fixture.nativeElement.querySelector('.cy-convert-from-dropdown');
    el.value = 'USD';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyFilter).toHaveBeenCalled();
  });
});

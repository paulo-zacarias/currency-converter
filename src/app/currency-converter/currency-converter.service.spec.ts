import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AppSettingsService } from '../shared/app-settings.service';

import { CurrencyConverterService } from './currency-converter.service';
import { IConvertRate, ICurrency } from './shared/currency-converter.model';

const CURRENCIES = JSON.parse(`{
  "results": {
    "USD": {
      "currencyName": "United States Dollar",
      "currencySymbol": "$",
      "id": "USD"
    },
    "EUR": {
      "currencyName": "Euro",
      "currencySymbol": "€",
      "id": "EUR"
    }
  }
}
`);

const RATE = JSON.parse(`{
  "USD_EUR": 0.89737
}`);

describe('CurrencyConverterService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let appSettings: jasmine.SpyObj<AppSettingsService>;
  let service: CurrencyConverterService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    appSettings = jasmine.createSpyObj(
      'AppSettingsService',
      [],
      ['apiUrl', 'apiKey']
    );
    service = new CurrencyConverterService(httpClientSpy, appSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should split currencies', () => {
    //@ts-ignore
    const result = service.splitCurrencies('USD_EUR');
    expect(result[0]).toEqual('USD');
    expect(result[1]).toEqual('EUR');
  });

  it('should return expected currencies list (HttpClient called once)', (done: DoneFn) => {
    const expectedCurrencies: ICurrency[] = [
      { currencyName: 'Euro', currencySymbol: '€', id: 'EUR' },
      { currencyName: 'United States Dollar', currencySymbol: '$', id: 'USD' },
    ];

    httpClientSpy.get.and.returnValue(of(CURRENCIES));

    service.getListOfCurrencies().subscribe({
      next: (currencies) => {
        expect(currencies)
          .withContext('expected currencies')
          .toEqual(expectedCurrencies);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('should return expected currency convertion rate (HttpClient called once)', (done: DoneFn) => {
    const currancyPair = 'USD_EUR';
    const expectedRate: IConvertRate = {
      currency: 'USD',
      rate: 0.89737,
      to: 'EUR',
    };

    httpClientSpy.get.and.returnValue(of(RATE));

    service.getCovertionRate(currancyPair).subscribe({
      next: (rate) => {
        expect(rate).withContext('expected rate').toEqual(expectedRate);
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });
});

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IConvertRate, ICurrency } from './shared/currency-converter.model';
import { map } from 'rxjs/operators';
import { AppSettingsService } from '../shared/app-settings.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(
    private http: HttpClient,
    private appSettings: AppSettingsService
  ) {}

  getListOfCurrencies() {
    return this.http
      .get<ICurrency[]>(
        this.appSettings.apiUrl + 'currencies?apiKey=' + this.appSettings.apiKey
      )
      .pipe(
        map((response: any) => {
          let tranformedData: ICurrency[] = [];
          for (let el in response.results) {
            const cur: ICurrency = {
              currencyName: response.results[el].currencyName,
              currencySymbol: response.results[el].currencySymbol
                ? response.results[el].currencySymbol
                : '',
              id: response.results[el].id,
            };
            tranformedData.push(cur);
          }
          const orderedList: ICurrency[] = tranformedData.sort((a, b) =>
            a.id.localeCompare(b.id)
          );
          return orderedList;
        })
      );
  }

  getCovertionRate(currencyPair: string) {
    return this.http
      .get<IConvertRate[]>(
        `${this.appSettings.apiUrl}convert?q=${currencyPair}&compact=ultra&apiKey=${this.appSettings.apiKey}`
      )
      .pipe(
        map((response: any) => {
          let rate = {} as IConvertRate;
          for (let el in response) {
            const currencies = this.splitCurrencies(el);
            rate = {
              currency: currencies[0],
              rate: response[el],
              to: currencies[1],
            };
          }
          return rate;
        })
      );
  }

  private splitCurrencies(text: string) {
    return text.split('_');
  }
}

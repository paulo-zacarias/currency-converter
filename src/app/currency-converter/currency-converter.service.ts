import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IConvertRate, ICurrency } from './shared/currency-converter.model';
import { map } from 'rxjs/operators';
import { DATA, RESULT } from '../fake.api';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  private apiKey = '9f813ff62c9c2ccff2b1';

  constructor(private http: HttpClient) {}

  getListOfCurrencies() {
    // return this.http
    //   .get<ICurrency[]>(
    //     'https://free.currconv.com/api/v7/currencies?apiKey=' + this.apiKey
    //   )
    //   .pipe(
    //     map((response: any) => {
    //       let tranformedData: ICurrency[] = [];
    //       for (let el in response.results) {
    //         const cur: ICurrency = {
    //           currencyName: response.results[el].currencyName,
    //           currencySymbol: response.results[el].currencySymbol
    //             ? response.results[el].currencySymbol
    //             : '',
    //           id: response.results[el].id,
    //         };
    //         tranformedData.push(cur);
    //       }
    //       const orderedList: ICurrency[] = tranformedData.sort((a, b) =>
    //         a.id.localeCompare(b.id)
    //       );
    //       return orderedList;
    //     })
    //   );
    // }
    return of(JSON.parse(DATA)).pipe(
      map((response: any) => {
        let tranformedData: ICurrency[] = [];
        for (let el in response.results) {
          const cur: ICurrency = {
            currencyName: response.results[el].currencyName,
            currencySymbol: response.results[el].currencySymbol
              ? response.results[el].currencySymbol
              : '',
            id: response.results[el].id.toUpperCase(),
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
    return of(JSON.parse(RESULT)).pipe(
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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IConvertRate, ICurrency } from './shared/currency-converter.model';
import { catchError, map } from 'rxjs/operators';
import { AppSettingsService } from '../shared/app-settings.service';
import { of, throwError } from 'rxjs';

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
        }),
        catchError(this.handleError)
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
        }),
        catchError(this.handleError)
      );
  }

  private splitCurrencies(text: string) {
    return text.split('_');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}

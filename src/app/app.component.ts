import { Component, OnInit } from '@angular/core';
import {
  IConvertRate,
  ICurrency,
} from './currency-converter/shared/currency-converter.model';
import { CurrencyConverterService } from './currency-converter/currency-converter.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  listOfCurrencies: ICurrency[] = [];
  convertionRate!: IConvertRate;
  loading = false;

  // title = 'currency-converter';

  constructor(private cc: CurrencyConverterService) {}
  ngOnInit(): void {
    this.cc.getListOfCurrencies().subscribe((currencies) => {
      this.listOfCurrencies = [...this.listOfCurrencies, ...currencies];
    });
  }

  newSelectionHandler(event: string) {
    this.loading = true;
    this.cc
      .getCovertionRate(event)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((rate) => (this.convertionRate = rate));
  }
}

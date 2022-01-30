import { Component, OnInit } from '@angular/core';
import {
  IConvertRate,
  ICurrency,
} from './currency-converter/shared/currency-converter.model';
import { CurrencyConverterService } from './currency-converter/currency-converter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  listOfCurrencies: ICurrency[] = [];
  convertionRate!: IConvertRate;

  constructor(private cc: CurrencyConverterService) {}
  ngOnInit(): void {
    this.cc.getListOfCurrencies().subscribe((currencies) => {
      this.listOfCurrencies = [...this.listOfCurrencies, ...currencies];
    });
  }

  newSelectionHandler(event: string) {
    this.cc
      .getCovertionRate(event)
      .subscribe((rate) => (this.convertionRate = rate));
  }
}

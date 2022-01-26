import { Component, OnInit } from '@angular/core';
import { ICurrency } from './currency-converter/currency-converter.model';
import { CurrencyConverterService } from './currency-converter/currency-converter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  listOfCurrencies: ICurrency[] = [];

  constructor(private cc: CurrencyConverterService) {}
  ngOnInit(): void {
    this.cc.getListOfCurrencies().subscribe((currencies) => {
      this.listOfCurrencies = [...this.listOfCurrencies, ...currencies];
    });
  }
}

export interface ICurrency {
  currencyName: string;
  currencySymbol: string;
  id: string;
}

export interface IConvertRate {
  currency: string;
  rate: number;
  to: string;
}

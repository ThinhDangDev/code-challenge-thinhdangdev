export interface Token {
  currency: string;
  date: string;
  price: number;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  price?: number;
  icon?: string;
  balance?: string;
}
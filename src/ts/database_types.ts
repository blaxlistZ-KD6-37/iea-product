import "../css/style.css";
export interface Database_Objects {
  account_id: number;
  name: string;
  category: string;
  chart_account: number;
  transaction_tab_id: number;
  date: Date | string;
  description: string;
  transaction_detail_id: number;
  amount: number;
  is_debit: boolean;
}

export interface Exchange_Rate_I {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: {
    [code: string]: number;
  };
}

export type financial_accounting_t = Pick<
  Database_Objects,
  | "name"
  | "amount"
  | "chart_account"
  | "is_debit"
  | "date"
  | "description"
  | "category"
>;

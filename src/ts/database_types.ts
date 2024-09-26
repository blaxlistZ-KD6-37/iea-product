import "../css/style.css";
export interface Database_Objects {
  account_id: number;
  name: string;
  category: string;
  chart_account: number;
  transaction_tab_id: number;
  date: Date;
  description: string;
  transaction_detail_id: number;
  amount: number;
  is_debit: boolean;
}

export interface Database_Types {
  account_id: number[];
  account_name: string[];
  account_category: string[];
  transaction_id: number[];
  transaction_date: Date[];
  transaction_description: string[];
  transaction_detail_id: number[];
  account_id_fk: number[];
  transaction_id_fk: number[];
  transaction_amount: number[];
  transaction_is_debit: boolean[];
}

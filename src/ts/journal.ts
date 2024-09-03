import api from "./api";
import { Database_Types } from "./database_types";

type Account = Pick<
  Database_Types,
  "account_id" | "account_name" | "account_category"
>;

type Transaction_Tab = Pick<
  Database_Types,
  "transaction_id" | "transaction_date" | "transaction_description"
>;

type Transaction_Detail = Pick<
  Database_Types,
  | "transaction_detail_id"
  | "account_id_fk"
  | "transaction_id_fk"
  | "transaction_amount"
  | "transaction_is_debit"
>;

const account_ob = await api.GetDB<Account>("account");
const transaction_ob = await api.GetDB<Transaction_Tab>("transaction");
const transaction_detail_ob = await api.GetDB<Transaction_Detail>(
  "transaction_detail"
);

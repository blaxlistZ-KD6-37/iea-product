import api from "./api";
import { Database_Types } from "./database_types";

type Account = Pick<Database_Types, "account_id" | "name" | "category">;

type Transaction_Tab = Pick<
  Database_Types,
  "transaction_tab_id" | "date" | "description"
>;

type Transaction_Detail = Pick<
  Database_Types,
  | "transaction_detail_id"
  | "transaction_tab_id"
  | "account_id"
  | "amount"
  | "is_debit"
>;

const account_ob = await api.GetDB<Account[]>("account");
const transaction_ob = await api.GetDB<Transaction_Tab[]>("transaction");
const transaction_detail_ob = await api.GetDB<Transaction_Detail[]>(
  "transaction_detail"
);

const entry = <HTMLElement>document.querySelector(".journal-entry");

/* Entry Wrapper */
const entry_wrapper: HTMLDivElement = document.createElement("div");
entry_wrapper.classList.add(
  "entry-wrapper",
  "bg-yellow-100",
  "grid",
  "gap-4",
  "items-center",
  "outline",
  "outline-2",
  "outline-orange-300"
);
const k: number = 2;

/* Entry Date Creation */
const entry_date: HTMLTimeElement = document.createElement("time");
const date = new Date(transaction_ob.transaction_date[0]);
entry_date.classList.add("day-month");
entry_date.textContent = `${date.toString().slice(4, 10)}`;

/* Entry Debit Creation */
const entry_debit: HTMLDivElement = document.createElement("div");
entry_debit.classList.add("account-debit");
const account_debit: string = account_ob.account_name[id_acc];
entry_debit.textContent = `${account_debit}`;

const entry_debit_value: HTMLDivElement = document.createElement("div");
entry_debit_value.classList.add("debit");
const debit_value: number = parseFloat(
  transaction_detail_ob.transaction_amount[0]
);
entry_debit_value.textContent = `₱${debit_value.toFixed(2)}`;

/* Entry Credit Creation */
const entry_credit: HTMLDivElement = document.createElement("div");
entry_credit.classList.add("account-credit");
const account_credit: string = account_ob.account_name[0];
entry_credit.textContent = `${account_credit}`;

const entry_credit_value: HTMLDivElement = document.createElement("div");
entry_credit_value.classList.add("credit");
const credit_value: number = parseFloat(
  transaction_detail_ob.transaction_amount[k]
);
entry_credit_value.textContent = `₱${credit_value.toFixed(2)}`;

/* Block Div Elements */
const block_element: HTMLDivElement[] = [
  document.createElement("div"),
  document.createElement("div"),
  document.createElement("div"),
];

/* Append Child Elements to Wrapper */
entry_wrapper.appendChild(entry_date);
entry_wrapper.appendChild(entry_debit);
entry_wrapper.appendChild(entry_debit_value);
entry_wrapper.appendChild(block_element[0]);
entry_wrapper.appendChild(block_element[1]);
entry_wrapper.appendChild(entry_credit);
entry_wrapper.appendChild(block_element[2]);
entry_wrapper.appendChild(entry_credit_value);

/* Append Wrapper to Entry */
entry.appendChild(entry_wrapper);

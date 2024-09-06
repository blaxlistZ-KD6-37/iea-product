import api from "./api";
import { Database_Objects } from "./database_types";

type Account = Pick<Database_Objects, "account_id" | "name" | "category">;

type Transaction_Tab = Pick<
  Database_Objects,
  "transaction_tab_id" | "date" | "description"
>;

type Transaction_Detail = Pick<
  Database_Objects,
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

console.log(transaction_detail_ob);

type account_sig =
  | "debit_entry"
  | "debit_value_entry"
  | "credit_entry"
  | "credit_value_entry";

type account_entries = Record<account_sig, HTMLDivElement>;

const createAccountElement = (ndx: number): account_entries => {
  /* Entry Debit Creation */
  const account_ndx: number = account_ob.findIndex((val) => {
    return val.account_id === transaction_detail_ob[ndx].account_id;
  });

  const entry_debit: HTMLDivElement = document.createElement("div");
  entry_debit.classList.add("account-debit");
  const account_debit: string = account_ob[account_ndx].name;
  entry_debit.textContent = `${account_debit}`;

  const entry_debit_value: HTMLDivElement = document.createElement("div");
  entry_debit_value.classList.add("debit");
  const debit_value: number = transaction_detail_ob[ndx].amount;
  entry_debit_value.textContent = `₱${debit_value.toFixed(2)}`;

  /* Entry Credit Creation */
  const account_ndx_cred: number = account_ob.findIndex((val) => {
    return val.account_id === transaction_detail_ob[ndx + 1].account_id;
  });

  const entry_credit: HTMLDivElement = document.createElement("div");
  entry_credit.classList.add("account-credit");
  const account_credit: string = account_ob[account_ndx_cred].name;
  entry_credit.textContent = `${account_credit}`;

  const entry_credit_value: HTMLDivElement = document.createElement("div");
  entry_credit_value.classList.add("credit");
  const credit_value: number = transaction_detail_ob[ndx].amount;
  entry_credit_value.textContent = `₱${credit_value.toFixed(2)}`;

  return {
    debit_entry: entry_debit,
    debit_value_entry: entry_debit_value,
    credit_entry: entry_credit,
    credit_value_entry: entry_credit_value,
  };
};

const createDateElement = (ndx: number): HTMLTimeElement => {
  /* Entry Date Creation */
  const transaction_ndx: number = transaction_ob.findIndex((val) => {
    return (
      val.transaction_tab_id === transaction_detail_ob[ndx].transaction_tab_id
    );
  });
  const entry_date: HTMLTimeElement = document.createElement("time");
  const date: Date = new Date(transaction_ob[transaction_ndx].date);
  entry_date.classList.add("day-month");
  entry_date.textContent = `${date.toString().slice(4, 10)}`;

  return entry_date;
};

const createEntryWrapper = (): HTMLElement => {
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

  return entry_wrapper;
};

const createBlockElement = (): HTMLDivElement[] => {
  const block_element: HTMLDivElement[] = [
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div"),
    document.createElement("div"),
  ];

  return block_element;
};

const verifyDate = (x: number, y: number): boolean => {
  const date_x: number = new Date(transaction_ob[x].date).getDate();
  const date_y: number = new Date(transaction_ob[y].date).getDate();
  return date_x === date_y ? true : false;
};

const appendAccountElement = (): void => {
  const entry = <HTMLElement>document.querySelector(".journal-entry");
  const entry_wrapper: HTMLElement = createEntryWrapper();
  for (let ndx = 0; Math.ceil(transaction_detail_ob.length / 2); ndx++) {
    ndx *= 2;
    const entry_date: HTMLTimeElement = createDateElement(ndx);
    const account_elements: account_entries = createAccountElement(ndx);
    const block_element: HTMLDivElement[] = createBlockElement();

    /* Append Child Elements to Wrapper */
    const date_wrapper: HTMLElement = ndx > 0 ? block_element[0] : entry_date;

    entry_wrapper.appendChild(date_wrapper);
    entry_wrapper.appendChild(account_elements.debit_entry);
    entry_wrapper.appendChild(account_elements.debit_value_entry);
    entry_wrapper.appendChild(block_element[1]);
    entry_wrapper.appendChild(block_element[2]);
    entry_wrapper.appendChild(account_elements.credit_entry);
    entry_wrapper.appendChild(block_element[3]);
    entry_wrapper.appendChild(account_elements.credit_value_entry);

    /* Append Wrapper to Entry */
    entry.appendChild(entry_wrapper);
  }
};

appendAccountElement();

// for (let i = 0; i < Math.ceil(transaction_detail_ob.length / 2); i++) {
//   appendAccountElement(i);
// }

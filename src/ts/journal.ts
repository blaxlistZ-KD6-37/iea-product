import "../css/style.css";
import { financial_accounting_t } from "./database_types";
import util from "./utils";

const timeline_month = <HTMLElement>document.querySelector(".timeline-wrapper");
const entry = <HTMLElement>document.querySelector(".journal-entry");

let curr_month = 9;
let financial_accounting_ob = util.FilterDate(curr_month);

type account_sig =
  | "debit_entry"
  | "debit_value_entry"
  | "credit_entry"
  | "credit_value_entry";

type account_entries = Record<account_sig, HTMLDivElement>;

const createDateElement = (curr_date: Date): HTMLTimeElement => {
  const entry_date: HTMLTimeElement = document.createElement("time");
  const date: string = new Date(curr_date).toString();
  entry_date.classList.add("day-month");
  entry_date.textContent = `${date.slice(8, 10)}-${date.slice(4, 7)}.`;

  return entry_date;
};

const createAccountElement = (
  debit_name: string,
  credit_name: string,
  debit_value: string,
  credit_value: string
): account_entries => {
  const entry_debit: HTMLDivElement = document.createElement("div");
  entry_debit.classList.add("account-debit");
  entry_debit.textContent = `${debit_name}`;

  const entry_debit_value: HTMLDivElement = document.createElement("div");
  entry_debit_value.classList.add("debit");
  entry_debit_value.textContent = `₱${debit_value}`;

  const entry_credit: HTMLDivElement = document.createElement("div");
  entry_credit.classList.add("account-credit");
  entry_credit.textContent = `${credit_name}`;

  const entry_credit_value: HTMLDivElement = document.createElement("div");
  entry_credit_value.classList.add("credit");
  entry_credit_value.textContent = `₱${credit_value}`;

  return {
    debit_entry: entry_debit,
    debit_value_entry: entry_debit_value,
    credit_entry: entry_credit,
    credit_value_entry: entry_credit_value,
  };
};

const createEntryWrapper = (): HTMLElement => {
  const entry_wrapper: HTMLDivElement = document.createElement("div");
  entry_wrapper.classList.add(
    "entry-wrapper",
    "bg-yellow-100",
    "grid",
    "gap-4",
    "items-center"
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

const sortByDebit = (accounts: financial_accounting_t[]): void => {
  let tmp_ndx: number = 0;
  for (let ndx = 0; ndx < Math.ceil(accounts.length / 2); ndx++) {
    tmp_ndx = ndx * 2;
    if (
      (accounts[tmp_ndx].is_debit ? 0 : 1) -
        (accounts[tmp_ndx + 1].is_debit ? 0 : 1) >
      0
    ) {
      let temp: financial_accounting_t = accounts[tmp_ndx];
      accounts[tmp_ndx] = accounts[tmp_ndx + 1];
      accounts[tmp_ndx + 1] = temp;
    }
  }
};

const createEntry = (curr_date: string): void => {
  const entry_wrapper: HTMLElement = createEntryWrapper();
  const finance: financial_accounting_t[] = financial_accounting_ob.filter(
    (account) => {
      return (
        new Date(account.date).toString() === new Date(curr_date).toString()
      );
    }
  );
  finance.reverse();
  sortByDebit(finance);

  for (let ndx = 0; ndx < Math.ceil(finance.length) / 2; ndx++) {
    const temp_ndx = 2 * ndx;
    const entry_date: HTMLTimeElement = createDateElement(
      new Date(finance[temp_ndx].date)
    );
    const account_elements: account_entries = createAccountElement(
      finance[temp_ndx].name,
      finance[temp_ndx + 1].name,
      finance[temp_ndx].amount.toFixed(2),
      finance[temp_ndx + 1].amount.toFixed(2)
    );
    const block_element: HTMLDivElement[] = createBlockElement();

    let date_wrapper: HTMLElement = entry_date;
    if (temp_ndx > 0 && finance[temp_ndx].date === finance[temp_ndx + 1].date) {
      date_wrapper = block_element[0];
    }
    entry_wrapper.appendChild(date_wrapper);
    entry_wrapper.appendChild(account_elements.debit_entry);
    entry_wrapper.appendChild(account_elements.debit_value_entry);
    entry_wrapper.appendChild(block_element[1]);
    entry_wrapper.appendChild(block_element[2]);
    entry_wrapper.appendChild(account_elements.credit_entry);
    entry_wrapper.appendChild(block_element[3]);
    entry_wrapper.appendChild(account_elements.credit_value_entry);

    entry.appendChild(entry_wrapper);
  }
};

const appendEntries = (): void => {
  entry.innerHTML = "";

  let dates: string[] = [];

  financial_accounting_ob.forEach((value) => {
    dates.push(new Date(value.date).toISOString().split("T")[0]);
  });

  const date_set = new Set(dates);
  dates = Array.from(date_set).sort();

  for (let i = 0; i < dates.length; i++) {
    createEntry(dates[i].toString());
  }
};

timeline_month.addEventListener("click", (e) => {
  e.preventDefault();
  const timeline_child = <HTMLDivElement>e.target;
  const target_month =
    parseInt((<string>timeline_child.textContent).trim().slice(6, 7)) + 8;

  curr_month = target_month;

  financial_accounting_ob = util.FilterDate(curr_month);

  appendEntries();
});

// Initial load
appendEntries();

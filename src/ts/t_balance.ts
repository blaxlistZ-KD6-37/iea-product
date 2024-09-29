import "../css/style.css";
import { financial_accounting_t } from "./database_types";
import util from "./utils";

const financial_accounting_ob = util.FilterDate(9);

// Getting the Trial Balance Body
const trial_body = <HTMLTableElement>(
  document.getElementById("trial-balance-body")
);

function getLastDayOfMonth(yr: number, mo: number): number {
  const today = new Date(`${yr}-${mo}`);
  return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

const acception_accounts: string[] = [
  "Supplies",
  "Supplies Expense",
  "Accumulated Depreciation - Equipments",
  "Depreciation Expense - Equipments",
  "Accounts Receivable",
  "Coldbrew Sales",
  "Accounts Payable",
  "Salaries and Wages",
  "Unearned Revenue",
  "Inventory",
  "Cost of Goods Sold",
];

let asset_accounts: string[] = [
  ...new Set(
    financial_accounting_ob
      .filter((acc) => acc.category === "Asset")
      .map((acc) => acc.name)
  ),
];

function createAccountRow(
  account: string,
  data: number[]
): HTMLTableRowElement {
  const row = document.createElement("tr");
  row.classList.add("account-items");

  const cells = [
    account,
    ...data.map((val) => `&#x20B1; ${Math.abs(val).toFixed(2)}`),
  ];
  cells.forEach((cellData) => {
    const cell = document.createElement("td");
    cell.innerHTML = cellData;
    row.appendChild(cell);
  });

  return row;
}

function calculateBalance(
  transactions: financial_accounting_t[],
  is_asset: boolean
): number {
  return transactions.reduce((balance, item) => {
    if (is_asset) {
      return item.is_debit ? balance + item.amount : balance - item.amount;
    } else {
      return item.is_debit ? balance - item.amount : balance + item.amount;
    }
  }, 0);
}

// Get unique accounts
const accounts: string[] = [
  ...new Set(
    financial_accounting_ob
      .sort((a, b) => a.chart_account - b.chart_account)
      .map((acc) => acc.name)
  ),
];

let debit_total: number = 0;
let credit_total: number = 0;
let adjustment_debit_total: number = 0;
let adjustment_credit_total: number = 0;
let adjusted_debit_total: number = 0;
let adjusted_credit_total: number = 0;

// Process each account
accounts.forEach((account) => {
  const account_transaction = financial_accounting_ob.filter(
    (acc) => acc.name === account
  );
  const is_asset = asset_accounts.includes(account);

  // Unadjusted balance
  const unadjusted_balance = calculateBalance(account_transaction, is_asset);

  // Adjustments
  let counter: number = 0;
  const adjustment_transaction = account_transaction.filter((acc) => {
    const curr_date = new Date(acc.date);
    return (
      acc.name.includes(acception_accounts[counter++]) &&
      curr_date.getDate() ===
        getLastDayOfMonth(curr_date.getFullYear(), curr_date.getMonth() + 1)
    );
  });

  const adjustment_balance = calculateBalance(adjustment_transaction, is_asset);

  // Adjusted balance
  const adjusted_balance = unadjusted_balance + adjustment_balance;

  // Determine which column to put the balances in
  let unadjusted_debit = 0,
    unadjusted_credit = 0;
  let adjustment_debit = 0,
    adjustment_credit = 0;
  let adjusted_debit = 0,
    adjusted_credit = 0;

  if (
    (is_asset && unadjusted_balance > 0) ||
    (!is_asset && unadjusted_balance < 0)
  ) {
    unadjusted_debit = Math.abs(unadjusted_balance);
    debit_total += unadjusted_debit;
  } else {
    unadjusted_credit = Math.abs(unadjusted_balance);
    credit_total += unadjusted_credit;
  }

  if (
    (is_asset && adjustment_balance > 0) ||
    (!is_asset && adjustment_balance < 0)
  ) {
    adjustment_debit = Math.abs(adjustment_balance);
    adjustment_debit_total += adjustment_debit;
  } else {
    adjustment_credit = Math.abs(adjustment_balance);
    adjustment_credit_total += adjustment_credit;
  }

  if (
    (is_asset && adjusted_balance > 0) ||
    (!is_asset && adjusted_balance < 0)
  ) {
    adjusted_debit = Math.abs(adjusted_balance);
    adjusted_debit_total += adjusted_debit;
  } else {
    adjusted_credit = Math.abs(adjusted_balance);
    adjusted_credit_total += adjusted_credit;
  }

  // Create and append the row
  const row = createAccountRow(account, [
    unadjusted_debit,
    unadjusted_credit,
    adjustment_debit,
    adjustment_credit,
    adjusted_debit,
    adjusted_credit,
  ]);
  trial_body.appendChild(row);
});

// Add total row
const total_row = createAccountRow("Total", [
  debit_total,
  credit_total,
  adjustment_debit_total,
  adjustment_credit_total,
  adjusted_debit_total,
  adjusted_credit_total,
]);
total_row.id = "account-total";
const total_wrapper = <HTMLTableElement>(
  document.getElementById("account-total-wrapper")
);
total_wrapper.appendChild(total_row);

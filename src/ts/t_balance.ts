import "../css/style.css";
import api from "./api";
import { Database_Objects } from "./database_types";

type financial_accounting_t = Pick<
  Database_Objects,
  | "name"
  | "amount"
  | "chart_account"
  | "is_debit"
  | "date"
  | "description"
  | "category"
>;

const financial_accounting_ob = await api.GetDB<financial_accounting_t[]>(
  "financial_account"
);

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

let asset_accounts: string[] = financial_accounting_ob
  .filter((acc) => {
    return acc.category === "Asset";
  })
  .map((acc) => {
    return acc.name;
  });

asset_accounts = [...new Set(asset_accounts)];

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

// Process each account
accounts.forEach((account) => {
  const account_transaction = financial_accounting_ob.filter(
    (acc) => acc.name === account
  );
  const is_asset = asset_accounts.includes(account);

  // Unadjusted balance
  const unadjusted_balance = calculateBalance(account_transaction, is_asset);

  // Adjustments (only for acception_accounts)
  let adjustment_balance = 0;

  if (acception_accounts.includes(account)) {
    const adjustmentTransactions = account_transaction.filter((acc) => {
      const curr_date = new Date(acc.date);
      return (
        curr_date.getDate() ===
        getLastDayOfMonth(curr_date.getFullYear(), curr_date.getMonth() + 1)
      );
    });
    adjustment_balance = calculateBalance(adjustmentTransactions, is_asset);
  }

  // Adjusted balance
  const adjustedBalance = unadjusted_balance + adjustment_balance;

  // Determine which column to put the balance in
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
    debit_total += adjustment_debit;
  } else {
    adjustment_credit = Math.abs(adjustment_balance);
    credit_total += adjustment_credit;
  }

  if ((is_asset && adjustedBalance > 0) || (!is_asset && adjustedBalance < 0)) {
    adjusted_debit = Math.abs(adjustedBalance);
  } else {
    adjusted_credit = Math.abs(adjustedBalance);
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
  0,
  0, // Assuming adjustments net to zero
  debit_total,
  credit_total,
]);
total_row.id = "account-total";
document.getElementById("account-total-wrapper")?.appendChild(total_row);

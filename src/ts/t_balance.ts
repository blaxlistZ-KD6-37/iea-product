import "../css/style.css";
import { financial_accounting_t } from "./database_types";
import util from "./utils";

const timeline_month = <HTMLElement>document.querySelector(".timeline-wrapper");
const trial_body = <HTMLTableElement>(
  document.getElementById("trial-balance-body")
);
const total_wrapper = <HTMLTableElement>(
  document.getElementById("account-total-wrapper")
);

const comma_expression = /,/g;
let curr_month = 9;
let financial_accounting_ob = util.FilterDate(util.month);

timeline_month.addEventListener("click", (e) => {
  e.preventDefault();
  const timeline_child = <HTMLDivElement>e.target;
  const target_month =
    parseInt((<string>timeline_child.textContent).trim().slice(6, 7)) + 8;

  // Update current month
  curr_month = target_month;

  // Refilter the financial accounting data for the new month
  financial_accounting_ob = util.FilterDate(curr_month);

  // Clear existing rows
  trial_body.innerHTML = "";
  total_wrapper.innerHTML = "";

  // Recalculate and repopulate the trial balance
  processTrialBalance();
});

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
  "Income Summary",
];

const createAccountRow = (
  account: string,
  data: number[]
): HTMLTableRowElement => {
  const row = document.createElement("tr");
  row.classList.add("account-items");

  const cells = [
    account,
    ...data.map(
      (val) =>
        `&#x20B1; ${Math.abs(val).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
    ),
  ];
  cells.forEach((cellData) => {
    const cell = document.createElement("td");
    cell.innerHTML = cellData;
    row.appendChild(cell);
  });

  return row;
};

const calculateBalance = (
  transactions: financial_accounting_t[],
  is_asset: boolean
): number => {
  return Number(
    transactions
      .reduce((balance, item) => {
        const amount = Number(item.amount.toFixed(2));
        if (is_asset) {
          return item.is_debit ? balance + amount : balance - amount;
        } else {
          return item.is_debit ? balance - amount : balance + amount;
        }
      }, 0)
      .toFixed(2)
  );
};

const processTrialBalance = () => {
  // Get asset accounts
  const asset_accounts: string[] = [
    ...new Set(
      financial_accounting_ob
        .filter((acc) => acc.category === "Asset")
        .map((acc) => acc.name)
    ),
  ];

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
    const account_transaction = financial_accounting_ob.filter((acc) => {
      return acc.name === account;
    });

    const is_asset = asset_accounts.includes(account);

    const unadjusted_transaction = account_transaction.filter((acc) => {
      return (
        new Date(acc.date).getDate() <
        getLastDayOfMonth(
          new Date(acc.date).getFullYear(),
          new Date(acc.date).getMonth() + 1
        )
      );
    });

    // Unadjusted balance
    const unadjusted_balance = calculateBalance(
      unadjusted_transaction,
      is_asset
    );

    // Adjustments
    const adjustment_transaction = account_transaction.filter((acc) => {
      const curr_date = new Date(acc.date);
      const lastDayOfMonth = getLastDayOfMonth(
        curr_date.getFullYear(),
        curr_date.getMonth() + 1
      );

      return (
        acception_accounts.includes(acc.name) &&
        curr_date.getDate() === lastDayOfMonth
      );
    });

    const adjustment_balance = Number(
      calculateBalance(adjustment_transaction, is_asset)
    );

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

    if (Math.abs(adjustment_balance) < 0.01) {
      // Ignore balances smaller than 1 cent
      adjustment_debit = 0;
      adjustment_credit = 0;
    } else if (
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
  total_wrapper.appendChild(total_row);
};

// Initial load
processTrialBalance();

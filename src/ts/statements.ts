import "../css/style.css";
import { FilterDate, CalculateItem, month } from "./utils";

const financial_accounting_ob = FilterDate(month);

const categories: string[] = [
  "Asset",
  "Liability",
  "Capital",
  "Revenue",
  "Expense",
];

// Getting Dates
const statement_date = <NodeListOf<HTMLSpanElement>>(
  document.querySelectorAll(".current-date")
);

const capital_date = <NodeListOf<HTMLSpanElement>>(
  document.querySelectorAll(".month-capital")
);

capital_date.forEach((capital) => {
  capital.textContent = `${new Date(financial_accounting_ob[0].date)
    .toDateString()
    .slice(4, 7)}.`;
});

statement_date.forEach((statement) => {
  const curr_date: string = `${new Date(financial_accounting_ob[0].date)
    .toDateString()
    .slice(4, 7)}. ${new Date(financial_accounting_ob[0].date)
    .toDateString()
    .slice(11, 15)}`;
  statement.textContent = curr_date;
});

const separateAccounts = (cat: string): string[] => {
  const accounts: string[] = [
    ...new Set(
      financial_accounting_ob
        .sort((a, b) => a.chart_account - b.chart_account)
        .filter((acc) => {
          return acc.category === cat;
        })
        .map((acc) => acc.name)
    ),
  ];
  return accounts;
};

// Income Statement
const createAccountRow = (
  account_value: number,
  account_name: string,
  class_name: string
): HTMLTableRowElement => {
  const row_data = <HTMLTableRowElement>document.createElement("tr");
  row_data.classList.add(class_name);

  const data_name = <HTMLTableCellElement>document.createElement("td");
  data_name.textContent = account_name;

  const data_value = <HTMLTableCellElement>document.createElement("td");
  data_value.classList.add("amount");
  data_value.textContent = `₱ ${account_value.toFixed(2)}`;

  row_data.appendChild(data_name);
  row_data.appendChild(data_value);

  return row_data;
};

const createStatement = (
  parent: string,
  category: string,
  cell: string,
  class_name: string,
  statement_classes: string[]
) => {
  const element_parent = <HTMLTableElement>document.querySelector(parent);
  const items: string[] = separateAccounts(category);
  items.forEach((item) => {
    const data = financial_accounting_ob.filter((sale) => {
      return sale.name == item;
    });
    const total_data = CalculateItem(data);
    const data_element = createAccountRow(total_data, item, class_name);
    element_parent.appendChild(data_element);
  });
  const items_balance: HTMLTableRowElement = document.createElement("tr");
  items_balance.classList.add(...statement_classes);
  const balance_data = financial_accounting_ob.filter((balance) => {
    return balance.category == category;
  });
  const total_balance_data = CalculateItem(balance_data);
  const item_cell_name: HTMLTableCellElement = document.createElement("td");
  item_cell_name.textContent = cell;
  const total_balance_amount: HTMLTableCellElement =
    document.createElement("td");
  total_balance_amount.classList.add("amount");
  total_balance_amount.innerHTML = `₱ ${total_balance_data.toFixed(2)}`;
  items_balance.appendChild(item_cell_name);
  items_balance.appendChild(total_balance_amount);

  element_parent.appendChild(items_balance);
};

const appendIncomeStatement = (): void => {
  createStatement(".revenue", categories[3], "Total Revenue", "revenue", [
    "total",
    "income-statement",
  ]);

  createStatement(
    ".operating-expense_row",
    categories[4],
    "Total Operating Expense",
    "expense",
    ["total", "income-statement"]
  );
  const income_statement = <NodeListOf<HTMLTableRowElement>>(
    document.querySelectorAll(".income-statement")
  );

  const rev: number = parseFloat(
    (<string>(
      (<HTMLTableRowElement>income_statement[0].lastElementChild).textContent
    )).slice(2)
  );

  const oe: number = parseFloat(
    (<string>(
      (<HTMLTableRowElement>income_statement[1].lastElementChild).textContent
    )).slice(2)
  );

  const net: string =
    rev - oe < 0
      ? `(₱ ${(rev - oe).toFixed(2)})`
      : `₱ ${(rev - oe).toFixed(2)}`;

  const net_income = (
    (document.querySelector(".net-income") as HTMLElement)
      .firstElementChild as HTMLElement
  ).lastElementChild as HTMLTableElement;

  net_income.textContent = net;
};

appendIncomeStatement();

// Statement of Change in Equity

const appendEquityChange = (): void => {
  const equity = <HTMLTableElement>document.querySelector(".equity");

  const day_one = financial_accounting_ob.filter((acc) => {
    return (
      new Date(acc.date).getDate() === 1 &&
      acc.name === separateAccounts(categories[2])[0]
    );
  });

  const day_n = financial_accounting_ob.filter((acc) => {
    return (
      new Date(acc.date).getDate() > 1 &&
      acc.name === separateAccounts(categories[2])[0]
    );
  });

  const net_income = (
    (document.querySelector(".net-income") as HTMLElement)
      .firstElementChild as HTMLElement
  ).lastElementChild as HTMLTableElement;

  const net_income_amt: number = parseFloat(
    (net_income.textContent as string).slice(2)
  );

  const withdrawals = financial_accounting_ob.filter((acc) => {
    return (
      new Date(acc.date).getDate() > 1 && acc.name === "Owner's Withdrawal"
    );
  });

  const equity_totals = [
    CalculateItem(day_one),
    CalculateItem(day_n),
    net_income_amt,
    CalculateItem(withdrawals),
  ];

  const equity_child = <HTMLTableElement>equity.firstElementChild;
  let ctr: number, sum: number;
  ctr = sum = 0;

  for (
    let trav = equity_child;
    <HTMLTableElement>trav.nextElementSibling !== null;
    trav = <HTMLTableElement>trav.nextElementSibling
  ) {
    const amount_equity = <HTMLTableRowElement>trav.lastElementChild;
    amount_equity.textContent = `₱ ${equity_totals[ctr].toFixed(2)}`;
    sum += equity_totals[ctr];
    ctr++;
  }

  const end_capital = <HTMLTableRowElement>(
    (<HTMLTableElement>equity.lastElementChild).lastElementChild
  );

  end_capital.textContent = `₱ ${sum.toFixed(2)}`;
};

appendEquityChange();

// Balance Sheet
const createBalanceSheet = (): void => {
  // Assets
  createStatement(".asset-account", categories[0], "TOTAL ASSETS", "assets", [
    "total",
    "final",
  ]);

  // Liability
  const liability_element = <HTMLTableRowElement>(
    document.querySelector(".liability")
  );

  const liabilities = separateAccounts(categories[1]);
  let liab_total = 0;
  if (liabilities.length < 1) {
    liability_element.textContent = ``;
  }

  if (liabilities.length > 0) {
    liabilities.forEach((liability) => {
      const liab_acc = financial_accounting_ob.filter((acc) => {
        return acc.name == liability;
      });
      liab_total = CalculateItem(liab_acc);
      liability_element.appendChild(
        createAccountRow(liab_total, liability, "liab")
      );
    });
  }

  // Capital
  const capital_statement = <HTMLTableRowElement>(
    (<HTMLTableElement>document.querySelector(".equity")).lastElementChild
  );

  const capital_amount_element = <HTMLTableCellElement>(
    capital_statement.lastElementChild
  );
  const capital_amount: number = parseFloat(
    <string>(<string>capital_amount_element.textContent).slice(2)
  );

  const capital = <HTMLTableCellElement>(
    (<HTMLTableRowElement>document.querySelector(".capital")).lastElementChild
  );
  capital.textContent = `₱ ${capital_amount.toFixed(2)}`;

  const liab_eq_elem = <HTMLTableCellElement>(
    (<HTMLTableRowElement>(
      (<HTMLTableElement>(
        (<HTMLTableElement>(
          (<HTMLDivElement>document.querySelector(".liabilities-equity"))
            .lastElementChild
        )).firstElementChild
      )).firstElementChild
    )).lastElementChild
  );

  const liab_eq = liab_total + capital_amount;
  liab_eq_elem.textContent = `₱ ${liab_eq.toFixed(2)}`;
};

createBalanceSheet();

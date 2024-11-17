import {
  Chart,
  ChartData,
  ChartDataset,
  ChartTypeRegistry,
  LogarithmicScale,
  registerables,
} from "chart.js";
import api from "./api";
import utils, { acc_ob, CalculateItem, month } from "./utils";
import { Exchange_Rate_I, financial_accounting_t } from "./database_types";
import analysis, { Account_Position_T, ProfitMargin } from "./analysis";

Chart.register(...registerables);

const month_range = [
  ...new Set(
    acc_ob.map((account) => {
      return new Date(account.date).getMonth() + 1;
    })
  ),
];

const label_accounts: string[] = [];

month_range.forEach((month) => {
  label_accounts.push(`${new Date(0, month - 1).toDateString().slice(4, 7)}.`);
});

const specifyAccountToMonth = (month: number): financial_accounting_t[] => {
  const account = acc_ob.filter((account) => {
    const account_date: Date = new Date(account.date);
    return account_date.getMonth() + 1 === month;
  });

  return account;
};

const createAccountChart = (
  html_document: HTMLCanvasElement,
  labels_account: string[],
  datasets_account: ChartDataset[],
  chart_type: keyof ChartTypeRegistry,
  dependent_axis: string = `%`
): void => {
  new Chart(html_document, {
    type: chart_type,
    data: {
      labels: labels_account,
      datasets: datasets_account,
    },
    options: {
      aspectRatio: 1,
      scales: {
        y: {
          ticks: {
            callback: (value) => `${value}${dependent_axis}`,
          },
        },
      },
    },
  });
};

// Profitability Ratios

// Profit Margin
const profitability_ratios_chart_DOCUMENT = <HTMLElement>(
  document.querySelector(".profitability-ratios")
);

const profit_margin_chart_DOCUMENT = <HTMLCanvasElement>(
  profitability_ratios_chart_DOCUMENT.firstElementChild
);

const netIncomeByMonth = (month: number): number => {
  const new_account: financial_accounting_t[] = specifyAccountToMonth(month);

  const total_revenue: number = CalculateItem(
    new_account.filter((account) => {
      return account.category === "Revenue";
    })
  );

  const operating_expenses: number = CalculateItem(
    new_account.filter((account) => {
      return account.category === "Expense";
    })
  );

  const net_income: number = total_revenue - operating_expenses;

  return net_income;
};

const profitMarginByMonth = (month: number): number => {
  const new_account: financial_accounting_t[] = specifyAccountToMonth(month);

  const total_revenue: number = CalculateItem(
    new_account.filter((account) => {
      return account.category === "Revenue";
    })
  );

  const net_income: number = netIncomeByMonth(month);

  const profit_margin: number = ProfitMargin(total_revenue, net_income);

  if (isNaN(profit_margin)) {
    return 0;
  }

  return profit_margin;
};

const profit_margin: number[] = [];

month_range.forEach((month) => {
  profit_margin.push(profitMarginByMonth(month));
});

createAccountChart(
  profit_margin_chart_DOCUMENT,
  label_accounts,
  [
    {
      label: "Monthly Profit Margin",
      data: profit_margin,
    },
  ],
  "bar"
);

// Return on Total Assets
const return_on_total_assets_chart_DOCUMENT = <HTMLCanvasElement>(
  profit_margin_chart_DOCUMENT.nextElementSibling
);

const assets_total: Account_Position_T[] = [];

month_range.forEach((month, ndx) => {
  const initial =
    ndx === 0
      ? 0
      : CalculateItem(
          specifyAccountToMonth(month - 1).filter((account) => {
            return account.category === "Asset";
          })
        );
  const final = CalculateItem(
    specifyAccountToMonth(month).filter((account) => {
      return account.category === "Asset";
    })
  );

  assets_total.push({ beginning_position: initial, ending_position: final });
});

const total_income: number[] = [];

month_range.forEach((month) => {
  total_income.push(netIncomeByMonth(month));
});

const total_assets_return: number[] = [];

month_range.forEach((_, ndx) => {
  total_assets_return.push(
    analysis.ReturnOnTotalAssets(total_income[ndx], assets_total[ndx])
  );
});

createAccountChart(
  return_on_total_assets_chart_DOCUMENT,
  label_accounts,
  [{ label: "Return on Total Assets", data: total_assets_return }],
  "bar"
);

// Horizontal Analysis
type Income_Statement_T = {
  readonly [index: string]: number;
};

const prior_account = specifyAccountToMonth(9).filter((account) => {
  return account.category === "Expense" || account.category === "Revenue";
});

console.log(prior_account);

const prior_statements: Income_Statement_T = {};

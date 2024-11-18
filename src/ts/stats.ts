import {
  Chart,
  ChartData,
  ChartDataset,
  ChartTypeRegistry,
  LogarithmicScale,
  registerables,
} from "chart.js";
import { acc_ob, CalculateItem } from "./utils";
import { financial_accounting_t } from "./database_types";
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
const horizontal_analysis_chart_DOCUMENT = <HTMLElement>(
  document.querySelector(".horizontal-analysis")
);

const dollar_change_chart_DOCUMENT = <HTMLCanvasElement>(
  horizontal_analysis_chart_DOCUMENT.firstElementChild
);
const percent_change_chart_DOCUMENT = <HTMLCanvasElement>(
  dollar_change_chart_DOCUMENT.nextElementSibling
);

type Income_Statement_T = {
  readonly [index: string]: number;
  coldbrew_sales: number;
  cost_of_goods_sold: number;
  supplies_expense: number;
  water_expense: number;
  delivery_expense: number;
  depreciation_expense_equipments: number;
  miscallaneous_expense: number;
};

const CalculateSpecificAccount = (name: string, month: number): number => {
  const specified_account = specifyAccountToMonth(month).filter((account) => {
    return account.name === name;
  });

  if (specified_account.length === 0) {
    return 0;
  }

  return CalculateItem(specified_account);
};

const IncomeStatementDollarChange = (
  month_prior: number,
  month_current: number
): Income_Statement_T => {
  const prior_statements: Income_Statement_T = {
    coldbrew_sales: CalculateSpecificAccount("Coldbrew Sales", month_prior),
    cost_of_goods_sold: CalculateSpecificAccount(
      "Cost of Goods Sold",
      month_prior
    ),
    supplies_expense: CalculateSpecificAccount("Supplies Expense", month_prior),
    water_expense: CalculateSpecificAccount("Water Expense", month_prior),
    delivery_expense: CalculateSpecificAccount("Delivery Expense", month_prior),
    depreciation_expense_equipments: CalculateSpecificAccount(
      "Depreciation Expense - Equipments",
      month_prior
    ),
    salaries_and_wages: CalculateSpecificAccount(
      "Salaries and Wages",
      month_prior
    ),
    miscallaneous_expense: CalculateSpecificAccount(
      "Miscallaneous Expense",
      month_prior
    ),
  };

  const current_statements: Income_Statement_T = {
    coldbrew_sales: CalculateSpecificAccount("Coldbrew Sales", month_current),
    cost_of_goods_sold: CalculateSpecificAccount(
      "Cost of Goods Sold",
      month_current
    ),
    supplies_expense: CalculateSpecificAccount(
      "Supplies Expense",
      month_current
    ),
    water_expense: CalculateSpecificAccount("Water Expense", month_current),
    delivery_expense: CalculateSpecificAccount(
      "Delivery Expense",
      month_current
    ),
    depreciation_expense_equipments: CalculateSpecificAccount(
      "Depreciation Expense - Equipments",
      month_current
    ),
    salaries_and_wages: CalculateSpecificAccount(
      "Salaries and Wages",
      month_current
    ),
    miscallaneous_expense: CalculateSpecificAccount(
      "Miscallaneous Expense",
      month_current
    ),
  };

  const dollar_change: Income_Statement_T = {
    coldbrew_sales: analysis.DollarChange(
      current_statements.coldbrew_sales,
      prior_statements.coldbrew_sales
    ),
    cost_of_goods_sold: analysis.DollarChange(
      current_statements.cost_of_goods_sold,
      prior_statements.cost_of_goods_sold
    ),
    supplies_expense: analysis.DollarChange(
      current_statements.supplies_expense,
      prior_statements.supplies_expense
    ),
    water_expense: analysis.DollarChange(
      current_statements.water_expense,
      prior_statements.water_expense
    ),
    delivery_expense: analysis.DollarChange(
      current_statements.delivery_expense,
      prior_statements.delivery_expense
    ),
    depreciation_expense_equipments: analysis.DollarChange(
      current_statements.depreciation_expense_equipments,
      prior_statements.depreciation_expense_equipments
    ),
    salaries_and_wages: analysis.DollarChange(
      current_statements.salaries_and_wages,
      prior_statements.salaries_and_wages
    ),
    miscallaneous_expense: analysis.DollarChange(
      current_statements.miscallaneous_expense,
      prior_statements.miscallaneous_expense
    ),
  };

  return dollar_change;
};

const IncomeStatementPercentChange = (
  month_prior: number,
  month_current: number
): Income_Statement_T => {
  const prior_statements: Income_Statement_T = {
    coldbrew_sales: CalculateSpecificAccount("Coldbrew Sales", month_prior),
    cost_of_goods_sold: CalculateSpecificAccount(
      "Cost of Goods Sold",
      month_prior
    ),
    supplies_expense: CalculateSpecificAccount("Supplies Expense", month_prior),
    water_expense: CalculateSpecificAccount("Water Expense", month_prior),
    delivery_expense: CalculateSpecificAccount("Delivery Expense", month_prior),
    depreciation_expense_equipments: CalculateSpecificAccount(
      "Depreciation Expense - Equipments",
      month_prior
    ),
    salaries_and_wages: CalculateSpecificAccount(
      "Salaries and Wages",
      month_prior
    ),
    miscallaneous_expense: CalculateSpecificAccount(
      "Miscallaneous Expense",
      month_prior
    ),
  };

  const dollar_change: Income_Statement_T = IncomeStatementDollarChange(
    month_prior,
    month_current
  );

  const percent_change = {
    coldbrew_sales: analysis.PercentChange(
      prior_statements.coldbrew_sales,
      dollar_change.coldbrew_sales
    ),
    cost_of_goods_sold: analysis.PercentChange(
      prior_statements.cost_of_goods_sold,
      dollar_change.cost_of_goods_sold
    ),
    supplies_expense: analysis.PercentChange(
      prior_statements.supplies_expense,
      dollar_change.supplies_expense
    ),
    water_expense: analysis.PercentChange(
      prior_statements.water_expense,
      dollar_change.water_expense
    ),
    delivery_expense: analysis.PercentChange(
      prior_statements.delivery_expense,
      dollar_change.delivery_expense
    ),
    depreciation_expense_equipments: analysis.PercentChange(
      prior_statements.depreciation_expense_equipments,
      dollar_change.depreciation_expense_equipments
    ),
    salaries_and_wages: analysis.PercentChange(
      prior_statements.salaries_and_wages,
      dollar_change.salaries_and_wages
    ),
    miscallaneous_expense: analysis.PercentChange(
      prior_statements.miscallaneous_expense,
      dollar_change.miscallaneous_expense
    ),
  };

  return percent_change;
};

const dollar_changes: Income_Statement_T[] = [];
const percent_changes: Income_Statement_T[] = [];

type Income_Changes_T = {
  coldbrew_sales: number[];
  cost_of_goods_sold: number[];
  supplies_expense: number[];
  water_expense: number[];
  delivery_expense: number[];
  depreciation_expense_equipments: number[];
  miscallaneous_expense: number[];
};

const horizontal_dollar: Income_Changes_T = {
  coldbrew_sales: [],
  cost_of_goods_sold: [],
  supplies_expense: [],
  water_expense: [],
  delivery_expense: [],
  depreciation_expense_equipments: [],
  miscallaneous_expense: [],
};

const horizontal_percent: Income_Changes_T = {
  coldbrew_sales: [],
  cost_of_goods_sold: [],
  supplies_expense: [],
  water_expense: [],
  delivery_expense: [],
  depreciation_expense_equipments: [],
  miscallaneous_expense: [],
};

month_range.forEach((month, ndx) => {
  dollar_changes.push(IncomeStatementDollarChange(month - 1, month));
  horizontal_dollar.coldbrew_sales[ndx] = dollar_changes[ndx].coldbrew_sales;
  horizontal_dollar.cost_of_goods_sold[ndx] =
    dollar_changes[ndx].cost_of_goods_sold;
  horizontal_dollar.delivery_expense[ndx] =
    dollar_changes[ndx].delivery_expense;
  horizontal_dollar.depreciation_expense_equipments[ndx] =
    dollar_changes[ndx].depreciation_expense_equipments;
  horizontal_dollar.miscallaneous_expense[ndx] =
    dollar_changes[ndx].miscallaneous_expense;
  horizontal_dollar.supplies_expense[ndx] =
    dollar_changes[ndx].supplies_expense;
  horizontal_dollar.water_expense[ndx] = dollar_changes[ndx].water_expense;

  percent_changes.push(IncomeStatementPercentChange(month - 1, month));
  horizontal_percent.coldbrew_sales[ndx] = percent_changes[ndx].coldbrew_sales;
  horizontal_percent.cost_of_goods_sold[ndx] =
    percent_changes[ndx].cost_of_goods_sold;
  horizontal_percent.delivery_expense[ndx] =
    percent_changes[ndx].delivery_expense;
  horizontal_percent.depreciation_expense_equipments[ndx] =
    percent_changes[ndx].depreciation_expense_equipments;
  horizontal_percent.miscallaneous_expense[ndx] =
    percent_changes[ndx].miscallaneous_expense;
  horizontal_percent.supplies_expense[ndx] =
    percent_changes[ndx].supplies_expense;
  horizontal_percent.water_expense[ndx] = percent_changes[ndx].water_expense;
});

createAccountChart(
  dollar_change_chart_DOCUMENT,
  label_accounts,
  [
    {
      label: "Coldbrew Sales",
      data: horizontal_dollar.coldbrew_sales,
    },
    {
      label: "Delivery Expense",
      data: horizontal_dollar.delivery_expense,
    },
    {
      label: "Depreciation Expense - Equipments",
      data: horizontal_dollar.depreciation_expense_equipments,
    },
    {
      label: "Miscallaneous Expense",
      data: horizontal_dollar.miscallaneous_expense,
    },
    {
      label: "Supplies Expense",
      data: horizontal_dollar.supplies_expense,
    },
  ],
  "bar",
  ".00"
);

createAccountChart(
  percent_change_chart_DOCUMENT,
  label_accounts,
  [
    {
      label: "Coldbrew Sales",
      data: horizontal_percent.coldbrew_sales,
    },
    {
      label: "Delivery Expense",
      data: horizontal_percent.delivery_expense,
    },
    {
      label: "Depreciation Expense - Equipments",
      data: horizontal_percent.depreciation_expense_equipments,
    },
    {
      label: "Miscallaneous Expense",
      data: horizontal_percent.miscallaneous_expense,
    },
    {
      label: "Supplies Expense",
      data: horizontal_percent.supplies_expense,
    },
  ],
  "bar"
);

// Vertical Analysis
const vertical_analysis_chart_DOCUMENT = <HTMLElement>(
  document.querySelector(".vertical-analysis")
);
const common_size_percentage_chart_DOCUMENT = <HTMLCanvasElement>(
  vertical_analysis_chart_DOCUMENT.firstElementChild
);

const IncomeStatementCommonSize = (
  month_current: number
): Income_Statement_T => {
  const current_statements: Income_Statement_T = {
    coldbrew_sales: CalculateSpecificAccount("Coldbrew Sales", month_current),
    cost_of_goods_sold: CalculateSpecificAccount(
      "Cost of Goods Sold",
      month_current
    ),
    supplies_expense: CalculateSpecificAccount(
      "Supplies Expense",
      month_current
    ),
    water_expense: CalculateSpecificAccount("Water Expense", month_current),
    delivery_expense: CalculateSpecificAccount(
      "Delivery Expense",
      month_current
    ),
    depreciation_expense_equipments: CalculateSpecificAccount(
      "Depreciation Expense - Equipments",
      month_current
    ),
    salaries_and_wages: CalculateSpecificAccount(
      "Salaries and Wages",
      month_current
    ),
    miscallaneous_expense: CalculateSpecificAccount(
      "Miscallaneous Expense",
      month_current
    ),
  };

  const common_change = {
    coldbrew_sales: analysis.CommonSizePercentage(
      current_statements.coldbrew_sales,
      current_statements.coldbrew_sales
    ),
    cost_of_goods_sold: analysis.CommonSizePercentage(
      current_statements.cost_of_goods_sold,
      current_statements.coldbrew_sales
    ),
    supplies_expense: analysis.CommonSizePercentage(
      current_statements.supplies_expense,
      current_statements.coldbrew_sales
    ),
    water_expense: analysis.CommonSizePercentage(
      current_statements.water_expense,
      current_statements.coldbrew_sales
    ),
    delivery_expense: analysis.CommonSizePercentage(
      current_statements.delivery_expense,
      current_statements.coldbrew_sales
    ),
    depreciation_expense_equipments: analysis.CommonSizePercentage(
      current_statements.depreciation_expense_equipments,
      current_statements.coldbrew_sales
    ),
    salaries_and_wages: analysis.CommonSizePercentage(
      current_statements.salaries_and_wages,
      current_statements.coldbrew_sales
    ),
    miscallaneous_expense: analysis.CommonSizePercentage(
      current_statements.miscallaneous_expense,
      current_statements.coldbrew_sales
    ),
  };

  return common_change;
};

const common_size_changes: Income_Statement_T[] = [];

const vertical_common_percent: Income_Changes_T = {
  coldbrew_sales: [],
  cost_of_goods_sold: [],
  supplies_expense: [],
  water_expense: [],
  delivery_expense: [],
  depreciation_expense_equipments: [],
  miscallaneous_expense: [],
};

month_range.forEach((month, ndx) => {
  common_size_changes.push(IncomeStatementCommonSize(month));
  vertical_common_percent.coldbrew_sales[ndx] =
    common_size_changes[ndx].coldbrew_sales;
  vertical_common_percent.cost_of_goods_sold[ndx] =
    common_size_changes[ndx].cost_of_goods_sold;
  vertical_common_percent.delivery_expense[ndx] =
    common_size_changes[ndx].delivery_expense;
  vertical_common_percent.depreciation_expense_equipments[ndx] =
    common_size_changes[ndx].depreciation_expense_equipments;
  vertical_common_percent.miscallaneous_expense[ndx] =
    common_size_changes[ndx].miscallaneous_expense;
  vertical_common_percent.supplies_expense[ndx] =
    common_size_changes[ndx].supplies_expense;
  vertical_common_percent.water_expense[ndx] =
    common_size_changes[ndx].water_expense;
});

createAccountChart(
  common_size_percentage_chart_DOCUMENT,
  label_accounts,
  [
    {
      label: "Coldbrew Sales",
      data: vertical_common_percent.coldbrew_sales,
    },
    {
      label: "Delivery Expense",
      data: vertical_common_percent.delivery_expense,
    },
    {
      label: "Depreciation Expense - Equipments",
      data: vertical_common_percent.depreciation_expense_equipments,
    },
    {
      label: "Miscallaneous Expense",
      data: vertical_common_percent.miscallaneous_expense,
    },
    {
      label: "Supplies Expense",
      data: vertical_common_percent.supplies_expense,
    },
  ],
  "bar"
);

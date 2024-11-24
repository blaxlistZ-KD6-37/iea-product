import {
  Chart,
  ChartDataset,
  ChartTypeRegistry,
  registerables,
} from "chart.js";
import { acc_ob, CalculateItem } from "./utils";
import { financial_accounting_t } from "./database_types";
import analysis, {
  Account_Position_T,
  ProfitMargin,
  TotalAssetTurnover,
} from "./analysis";

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

let active_charts: Record<string, Chart> = {};

const createAccountChart = (
  html_document: HTMLCanvasElement,
  labels_account: string[],
  datasets_account: ChartDataset[],
  chart_type: keyof ChartTypeRegistry,
  dependent_axis: string = `%`
): void => {
  const chart_id = html_document.id;
  if (active_charts[chart_id]) {
    active_charts[chart_id].destroy();
  }

  active_charts[chart_id] = new Chart(html_document, {
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

const horizontal_analysis_DOCUMENT = <NodeListOf<HTMLDivElement>>(
  document.querySelectorAll(".horizontal")
);

const CalculateSpecificAccount = (
  account_name: string[],
  month: number
): number => {
  const specified_account = specifyAccountToMonth(month).filter((account) => {
    return account_name.includes(account.name);
  });

  if (specified_account.length === 0) {
    return 0;
  }

  return CalculateItem(specified_account);
};

type Account_And_Number_T = {
  name: string;
  value: number;
};

const DollarChangeRange = (
  trends: string[],
  curr_month: number
): Account_And_Number_T[] => {
  const trends_dollar_change: Account_And_Number_T[] = [];

  trends.forEach((trend) => {
    const prior_month_value: number = CalculateSpecificAccount(
      [trend],
      curr_month - 1
    );

    const curr_month_value: number = CalculateSpecificAccount(
      [trend],
      curr_month
    );

    trends_dollar_change.push({
      name: trend,
      value: analysis.DollarChange(curr_month_value, prior_month_value),
    });
  });

  return trends_dollar_change;
};

const PercentChangeRange = (
  trends: string[],
  curr_month: number
): Account_And_Number_T[] => {
  const trends_dollar_change = DollarChangeRange(trends, curr_month);
  const trends_percent_change: Account_And_Number_T[] = [];

  trends.forEach((trend, ndx) => {
    const prior_month_value: number = CalculateSpecificAccount(
      [trend],
      curr_month - 1
    );

    trends_percent_change.push({
      name: trend,
      value: analysis.PercentChange(
        prior_month_value,
        trends_dollar_change[ndx].value
      ),
    });
  });

  return trends_percent_change;
};

const income_statement_string = [
  ...new Set(
    acc_ob
      .filter((account) => {
        return account.category === "Revenue" || account.category === "Expense";
      })
      .map((account) => {
        return account.name;
      })
  ),
];

const balance_sheet_string = [
  ...new Set(
    acc_ob
      .filter((account) => {
        return (
          account.category === "Asset" ||
          account.category === "Liability" ||
          account.category === "Capital"
        );
      })
      .map((account) => {
        return account.name;
      })
  ),
];

const createDollarChangeDataset = (
  statement_type: string[]
): ChartDataset[] => {
  const dollar_change_statements: ChartDataset[] = [];
  statement_type.forEach((statement) => {
    const dollar_values: number[] = [];
    month_range.forEach((month) => {
      const dollar_change = DollarChangeRange([statement], month);
      dollar_change.forEach((change) => {
        dollar_values.push(change.value);
      });
    });
    dollar_change_statements.push({ label: statement, data: dollar_values });
  });

  return dollar_change_statements;
};

const createPercentChangeDataset = (
  statement_type: string[]
): ChartDataset[] => {
  const percent_change_statements: ChartDataset[] = [];
  statement_type.forEach((statement) => {
    const percent_values: number[] = [];
    month_range.forEach((month) => {
      const percent_change = PercentChangeRange([statement], month);
      percent_change.forEach((change) => {
        percent_values.push(change.value);
      });
    });
    percent_change_statements.push({ label: statement, data: percent_values });
  });

  return percent_change_statements;
};

createAccountChart(
  dollar_change_chart_DOCUMENT,
  label_accounts,
  createDollarChangeDataset(income_statement_string),
  "bar",
  ".00"
);

createAccountChart(
  percent_change_chart_DOCUMENT,
  label_accounts,
  createPercentChangeDataset(income_statement_string),
  "bar"
);

horizontal_analysis_DOCUMENT.forEach((anal) => {
  anal.addEventListener("click", (e) => {
    const current_sibling = <HTMLDivElement>e.currentTarget;
    const current_sibling_string = (<string>current_sibling.textContent).trim();

    if (current_sibling_string === "Income Statements") {
      createAccountChart(
        dollar_change_chart_DOCUMENT,
        label_accounts,
        createDollarChangeDataset(income_statement_string),
        "bar",
        ".00"
      );

      createAccountChart(
        percent_change_chart_DOCUMENT,
        label_accounts,
        createPercentChangeDataset(income_statement_string),
        "bar"
      );
    }

    if (current_sibling_string === "Balance Sheets") {
      createAccountChart(
        dollar_change_chart_DOCUMENT,
        label_accounts,
        createDollarChangeDataset(balance_sheet_string),
        "bar",
        ".00"
      );

      createAccountChart(
        percent_change_chart_DOCUMENT,
        label_accounts,
        createPercentChangeDataset(balance_sheet_string),
        "bar"
      );
    }
  });
});

// Vertical Analysis
const vertical_analysis_chart_DOCUMENT = <HTMLElement>(
  document.querySelector(".vertical-analysis")
);
const common_size_percentage_chart_DOCUMENT = <HTMLCanvasElement>(
  vertical_analysis_chart_DOCUMENT.firstElementChild
);

const vertical_analysis_DOCUMENT = <NodeListOf<HTMLDivElement>>(
  document.querySelectorAll(".vertical")
);

const CommonSizePercentageRange = (
  common_size: string[],
  base: string[],
  curr_month: number
): Account_And_Number_T[] => {
  const common_size_change: Account_And_Number_T[] = [];
  const base_value = CalculateSpecificAccount(base, curr_month);

  common_size.forEach((common) => {
    const common_size_month: number = CalculateSpecificAccount(
      [common],
      curr_month
    );

    common_size_change.push({
      name: common,
      value: analysis.CommonSizePercentage(common_size_month, base_value),
    });
  });

  return common_size_change;
};

const createCommonSizeDataset = (
  statement_type: string[],
  base: string[]
): ChartDataset[] => {
  const common_size_change_statements: ChartDataset[] = [];

  statement_type.forEach((statement) => {
    const common_size_values: number[] = [];
    month_range.forEach((month) => {
      const common_size_change = CommonSizePercentageRange(
        [statement],
        base,
        month
      );
      common_size_change.forEach((change) => {
        common_size_values.push(change.value);
      });
    });
    common_size_change_statements.push({
      label: statement,
      data: common_size_values,
    });
  });

  return common_size_change_statements;
};

const asset_string = [
  ...new Set(
    acc_ob
      .filter((account) => {
        return account.category === "Asset";
      })
      .map((account) => {
        return account.name;
      })
  ),
];

const liability_and_capital_string = [
  ...new Set(
    acc_ob
      .filter((account) => {
        return (
          account.category === "Liability" || account.category === "Capital"
        );
      })
      .map((account) => {
        return account.name;
      })
  ),
];

const common_size_asset: ChartDataset[] = createCommonSizeDataset(
  asset_string,
  asset_string
);

const common_size_liability_and_capital: ChartDataset[] =
  createCommonSizeDataset(
    liability_and_capital_string,
    liability_and_capital_string
  );

const common_size_overall: ChartDataset[] = [];

common_size_asset.forEach((common) => {
  common_size_overall.push(common);
});

common_size_liability_and_capital.forEach((common) => {
  common_size_overall.push(common);
});

createAccountChart(
  common_size_percentage_chart_DOCUMENT,
  label_accounts,
  common_size_overall,
  "bar"
);

vertical_analysis_DOCUMENT.forEach((anal) => {
  anal.addEventListener("click", (e) => {
    const current_sibling = <HTMLDivElement>e.currentTarget;
    const current_sibling_string = (<string>current_sibling.textContent).trim();

    if (current_sibling_string === "Income Statements") {
      createAccountChart(
        common_size_percentage_chart_DOCUMENT,
        label_accounts,
        createCommonSizeDataset(income_statement_string, ["Coldbrew Sales"]),
        "bar"
      );
    }

    if (current_sibling_string === "Balance Sheets") {
      createAccountChart(
        common_size_percentage_chart_DOCUMENT,
        label_accounts,
        common_size_overall,
        "bar"
      );
    }
  });
});

// Efficiency Ratios
const efficiency_ratios_chart_DOCUMENT = <HTMLElement>(
  document.querySelector(".efficiency-ratios")
);

const total_assets_turnover_chart_DOCUMENT = <HTMLCanvasElement>(
  efficiency_ratios_chart_DOCUMENT.firstElementChild
);

const inventory_turnover_chart_DOCUMENT = <HTMLCanvasElement>(
  total_assets_turnover_chart_DOCUMENT.nextElementSibling
);

const days_sales_inventory_chart_DOCUMENT = <HTMLCanvasElement>(
  inventory_turnover_chart_DOCUMENT.nextElementSibling
);

const total_assets_turnover: number[] = [];

month_range.forEach((month) => {
  const net_sales = CalculateItem(
    specifyAccountToMonth(month).filter((account) => {
      return account.chart_account === 600;
    })
  );

  const assets: Account_Position_T = {
    beginning_position: CalculateItem(
      specifyAccountToMonth(month - 1).filter((account) => {
        return account.category === "Asset";
      })
    ),
    ending_position: CalculateItem(
      specifyAccountToMonth(month).filter((account) => {
        return account.category === "Asset";
      })
    ),
  };

  total_assets_turnover.push(TotalAssetTurnover(net_sales, assets));
});

createAccountChart(
  total_assets_turnover_chart_DOCUMENT,
  label_accounts,
  [
    {
      label: "Total Assets Turnover",
      data: total_assets_turnover,
    },
  ],
  "bar",
  ".00"
);

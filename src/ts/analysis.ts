// Horizontal Analysis

export const DollarChange = (sales_b: number, sales_a: number): number => {
  const sales_change: number = sales_b - sales_a;

  return sales_change;
};

export const PercentChange = (
  base_amount: number,
  currency_change: number
): number => {
  if (base_amount === 0) {
    return 0;
  }

  const percent_ratio: number = currency_change / base_amount;

  return percent_ratio * 100;
};

// Vertical Analysis
export const CommonSizePercentage = (
  comparison_amount: number,
  base_amount: number
): number => {
  if (base_amount === 0) {
    return 0;
  }

  const comparison_ratio: number = comparison_amount / base_amount;

  return comparison_ratio * 100;
};

// Efficiency Ratio
export type Account_Position_T = {
  beginning_position: number;
  ending_position: number;
};

export const TotalAssetTurnover = (
  net_sales: number,
  assets: Account_Position_T
): number => {
  const average_total_assets =
    (assets.beginning_position + assets.ending_position) / 2;

  const total_assets_turnover = net_sales / average_total_assets;

  return total_assets_turnover;
};

// Profitability Ratios
export const ProfitMargin = (net_sales: number, net_income: number): number => {
  if (net_sales === 0) {
    return 0;
  }
  const profit_margin = net_income / net_sales;

  return profit_margin * 100;
};

export const ReturnOnTotalAssets = (
  net_income: number,
  total_assets: Account_Position_T
): number => {
  if (total_assets.beginning_position + total_assets.ending_position === 0) {
    return 0;
  }

  const return_on_total_assets =
    (2 * net_income) /
    (total_assets.beginning_position + total_assets.ending_position);

  return return_on_total_assets * 100;
};

export default {
  DollarChange,
  PercentChange,
  CommonSizePercentage,
  TotalAssetTurnover,
  ProfitMargin,
  ReturnOnTotalAssets,
};

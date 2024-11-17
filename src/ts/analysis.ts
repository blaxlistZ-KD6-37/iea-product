// Horizontal Analysis

export const DollarChange = (sales_b: number, sales_a: number): number => {
  const sales_change: number = sales_b - sales_a;

  return sales_change;
};

export const PercentChange = (
  total_sales: number,
  currency_change: number
): number => {
  const percent_ratio: number = currency_change / total_sales;

  return percent_ratio * 100;
};

// Vertical Analysis
export const CommonSizePercentage = (
  comparison_amount: number,
  base_amount: number
): number => {
  const comparison_ratio: number = comparison_amount / base_amount;

  return comparison_ratio * 100;
};

// Efficiency Ratio
export type Account_Position_T = {
  beginning_position: number;
  ending_position: number;
};

export const InventoryTurnOver = (
  cost_of_goods_sold: number,
  inventory: Account_Position_T
): number => {
  const inventory_turnover =
    (2 * cost_of_goods_sold) /
    (inventory.beginning_position + inventory.ending_position);

  return inventory_turnover;
};

export const DaySalesInventory = (
  cost_of_goods_sold: number,
  ending_inventory: number
): number => {
  const days_sales_inventory = ending_inventory / cost_of_goods_sold;

  return days_sales_inventory * 365;
};

// Profitability Ratios
export const ProfitMargin = (net_sales: number, net_income: number): number => {
  const profit_margin = net_income / net_sales;

  return profit_margin * 100;
};

export const ReturnOnTotalAssets = (
  net_income: number,
  total_assets: Account_Position_T
): number => {
  const return_on_total_assets =
    (2 * net_income) /
    (total_assets.beginning_position + total_assets.ending_position);

  return return_on_total_assets * 100;
};

export default {
  DollarChange,
  PercentChange,
  CommonSizePercentage,
  InventoryTurnOver,
  DaySalesInventory,
  ProfitMargin,
  ReturnOnTotalAssets,
};

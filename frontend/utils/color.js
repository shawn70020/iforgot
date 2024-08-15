// utils/colors.js
export const colors = new Map([
  ["red", "#ff3d56"],
  ["orange", "#fd7a4c"],
  ["deep-yellow", "#ffb900"],
  ["yellow", "#f9d21f"],
  ["green", "#2fc14a"],
  ["blue", "#0080ff"],
  ["dark-blue", "#1e36d3"],
  ["light-green", "#5ddb6a"],
  ["pink", "#ff90ad"],
  ["purple", "#9940de"],
  ["light-purple", "#e140e1"],
  ["gray", "#9197a3"],
]);

// 定義一個函數來獲取顏色值
export const getColor = (colorName) => {
  return colors.get(colorName);
};

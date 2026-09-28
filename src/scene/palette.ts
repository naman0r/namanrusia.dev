export const ACCENT = "#4f8bff";

/** Contribution heat, shared by the 2D calendar and the 3D city so both read the same. */
export const HEAT = ["#16140f", "#1c3a82", ACCENT, "#6fd6b0", "#c8f03c", "#ffd23f"];

export const heatLevel = (n: number) => (n === 0 ? 0 : n < 3 ? 1 : n < 7 ? 2 : n < 14 ? 3 : n < 24 ? 4 : 5);

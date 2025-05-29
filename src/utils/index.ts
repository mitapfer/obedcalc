export const truncateNumber = (num: number, decimals?: number) => {
  if (!num) return 0;

  const factor = 10 ** (decimals || 2);
  return Math.trunc(num * factor) / factor;
}
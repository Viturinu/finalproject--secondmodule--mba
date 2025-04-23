 export function formatToBRL(value: number | string): string {
    const number = typeof value === "string" ? parseFloat(value) : value;
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
const number = new Intl.NumberFormat('en-KE');

export function formatKES(amount) {
  return `KES ${number.format(amount)}`;
}

// The browser only shows an estimate. The backend works out the real total.
export function rentalTotal(dailyRate, days) {
  return dailyRate * days;
}

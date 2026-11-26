const number = new Intl.NumberFormat('en-KE');

export function formatKES(amount) {
  return `KES ${number.format(amount)}`;
}


export function rentalTotal(dailyRate, days) {
  return dailyRate * days;
}

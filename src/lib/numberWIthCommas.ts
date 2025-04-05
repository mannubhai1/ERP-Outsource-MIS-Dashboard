export function numberWithCommas(x: number | string): string {
  x = x.toString();
  const [intPart, decimalPart] = x.split(".");

  let lastThree: string = intPart.slice(-3);
  const otherNumbers: string = intPart.slice(0, -3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return decimalPart ? formatted + "." + decimalPart : formatted;
}

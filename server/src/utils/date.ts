import moment from "moment";

export function validDateChecker(date: number | Date): boolean {
  try {
    return moment(date).isValid();
  } catch {
    return false;
  }
}

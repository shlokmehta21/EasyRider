import moment from "moment";

export function validDateChecker(date: number | Date): boolean {
  try {
    if (!date) return false;
    return moment(date).isValid();
  } catch {
    return false;
  }
}

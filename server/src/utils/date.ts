import moment from "moment";

export function validDateChecker(date: number): boolean {
  try {
    return moment(date).isValid();
  } catch {
    return false;
  }
}

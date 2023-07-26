export const regex = {
  ALPHANUMERIC_WITH_STARTING_WITH_LETTER: /^[a-zA-Z][a-zA-Z0-9 ]*$/,
  ALPHANUMERIC:
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-=_+[\]{}`~|;:'",.<>/?\\]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  CONTAINS_ALPHANUMERIC: /^[a-zA-Z0-9][a-zA-Z0-9 ]+$/,
};

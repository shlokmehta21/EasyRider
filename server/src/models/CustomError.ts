interface CustomError {
  code: number;
  customMessage?: {
    [key: string]: string;
  };
  message?: string;
}

export default CustomError;

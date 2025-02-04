
/** Logger class for logging data */ // to do
class Logger {
  log(message: any): void {
      console.log(message);
  }

  error(message: any): void {
      console.error(message);
  }

  warn(message: any): void {
      console.warn(message);
  }
}

export const logger = new Logger();
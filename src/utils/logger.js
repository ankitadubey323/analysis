
 

const colors = {
  info: '\x1b[36m',    
  success: '\x1b[32m', 
  warn: '\x1b[33m',   
  error: '\x1b[31m',  
  reset: '\x1b[0m',
};

class Logger {
  info(message, ...args) {
    console.log(
      `${colors.info}[INFO]${colors.reset}`,
      new Date().toISOString(),
      message,
      ...args
    );
  }

  success(message, ...args) {
    console.log(
      `${colors.success}[SUCCESS]${colors.reset}`,
      new Date().toISOString(),
      message,
      ...args
    );
  }

  warn(message, ...args) {
    console.warn(
      `${colors.warn}[WARN]${colors.reset}`,
      new Date().toISOString(),
      message,
      ...args
    );
  }

  error(message, ...args) {
    console.error(
      `${colors.error}[ERROR]${colors.reset}`,
      new Date().toISOString(),
      message,
      ...args
    );
  }

  debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEBUG]`,
        new Date().toISOString(),
        message,
        ...args
      );
    }
  }
}

const logger = new Logger();

export default logger;
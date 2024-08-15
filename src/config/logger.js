// config/logger.js

const winston = import('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

// Definir niveles de logging personalizados
const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

// Formato de log personalizado
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Logger para entorno de desarrollo
const developmentLogger = () => {
    return createLogger({
        levels,
        level: 'debug',
        format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
        transports: [
            new transports.Console()
        ]
    });
};

// Logger para entorno de producción
const productionLogger = () => {
    return createLogger({
        levels,
        level: 'info',
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'errors.log', level: 'error' })
        ]
    });
};

// Seleccionar el logger basado en el entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger() : developmentLogger();

export default logger;

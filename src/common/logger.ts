import { createLogger, format, transports } from 'winston';

const isDev = process.env.NODE_ENV !== 'production';
const colorizer = format.colorize();

export const logger = createLogger({
  level: 'info',
  format: isDev
    ? format.combine(
        format.timestamp({ format: 'HH:mm:ss.sss' }),
        format.printf(
          ({ timestamp, level, message, correlationId, ...meta }) => {
            const metaStr = Object.keys(meta).length
              ? JSON.stringify(meta)
              : '';
            const coloredLevel = colorizer.colorize(level, level.toUpperCase());
            return `[${timestamp}] ${coloredLevel}: ${message} ${
              typeof correlationId === 'string' ? `(id: ${correlationId})` : ''
            } ${metaStr}`;
          },
        ),
      )
    : format.combine(
        format.timestamp(),
        format.json(), // raw JSON in production — log aggregators want this
      ),
  transports: [new transports.Console()],
});

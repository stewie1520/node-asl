import pino from "pino";
import path from "path";

const level = process.env.PINO_LOG_LEVEL || "info";

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      level,
      options: { destination: path.join(process.cwd(), "./tmp/app.log") },
    },

    ...(process.env.ENV === "development"
      ? [
          {
            target: "pino-pretty",
            options: {},
            level,
          },
        ]
      : []),
  ],
});

export default pino(
  {
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    bindings: (bindings: any) => {
      return {
        pid: bindings.pid,
        host: bindings.hostname,
        node_version: process.version,
      };
    },
  },
  transport,
);

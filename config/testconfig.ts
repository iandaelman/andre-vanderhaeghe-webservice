export const confTest = {
  loglevel: "error",
  disabled: true,
  port: 9000,
  cors: {
    origin: "http://localhost:9000",
    maxAge: 3 * 60 * 60, // 3 hours
  },
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "vdh_webservice_test",
  },
};

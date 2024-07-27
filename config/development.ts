export const confDev = {
  loglevel: "debug",
  disabled: false,
  port: 9000,
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "vdh_webservice",
  },
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
  },
};

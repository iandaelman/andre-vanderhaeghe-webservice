export const confProd = {
  loglevel: "prod",
  disabled: false,
  database: {
    client: "mysql2",
    host: "localhost",
    port: 3306,
    name: "vdh_webservice",
  },
  port: 9000,
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
  },
};

# Examenopdracht Web Services

- Student: Ian Daelman
- Studentennummer: 202078391
- E-mailadres: ian.daelman@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Npm](https://www.npmjs.com/package/npm)
- [Mysql](https://dev.mysql.com/downloads/installer/)

## Opstarten

### Development omgeving opstarten

- installeer de dependencies met **npm install**

- Maak een .env bestand aan in de root van de applicatie met volgende inhoud:

```
NODE_ENV="development"

DATABASE_USERNAME=[DB_USERNAME]
DATABASE_PASSWORD=[DB_PW]
DATABASE_PORT=[DB_PORT]
DATABASE_HOST=[DB_HOST]
DATABASE_NAME=[DB_NAME]
CORS_ORIGIN=[URL]

#AUTH0 config
AUTH_JWKSURI=[AUTH_JWKSURI]
AUTH_AUDIENCE=[AUTH_AUDIENCE]
AUTH_ISSUER=[AUTH_ISSUER]
AUTH_USER_INFO=[AUTH_USER_INFO]

```

Zorg ervoor dat je een mysql database hebt aangemaakt met de naam die je in het .env bestand hebt opgegeven.
Voer hierna de database migraties uit met **npm run migration**.

Indien je de mock data niet wilt toevoegen, ga dan naar het src/migration-data-source.ts bestand en verwijder de migration bestanden die je niet wilt uitvoeren.

Om zelf seed data toe te voegen kan je de volgende commando's uitvoeren:

- npx typeorm migration:create ./src/migrations/bestandnaam
- Vervolledig de up en down functies in het bestand dat je hebt aangemaakt.
- Voeg de bestandsnaam toe aan de array **migrations** in het src/migration-data-source.ts bestand.

### Commando's

Overzicht van de commando's die je kan uitvoeren:

- Installeer de dependencies: **npm install**
- Start de applicatie: **npm start**
- Test de applicatie: **npm test**
- Voer de database migraties: **npm run migration**

## Testen

- Maak voor de testen een .env.test bestand aan in de root van de applicatie met volgende inhoud:

```

NODE_ENV="test"

DATABASE_USERNAME=[DB_USERNAME]
DATABASE_PASSWORD=[DB_PW]
DATABASE_PORT=[DB_PORT]
DATABASE_HOST=[DB_HOST]
DATABASE_NAME=[DB_NAME]
CORS_ORIGIN=[URL]

#AUTH0 config
AUTH_JWKSURI=[AUTH_JWKSURI]
AUTH_AUDIENCE=[AUTH_AUDIENCE]
AUTH_ISSUER=[AUTH_ISSUER]
AUTH_USER_INFO=[AUTH_USER_INFO]

```

Indien er geen babel.config.js bestand in de root van de applicatie te vinden is. Maak deze dan aan met volgende inhoud:

```
/* eslint-disable no-undef */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};

```

- Run daarna **jest --init** in de terminal en kies voor de opties die bij jouw project passen.
- Pas in het jest.config bestand het volgende aan: **testPathIgnorePatterns: ["src", "node_modules", "config"]**

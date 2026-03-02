const Sequelize = require("sequelize");

require("dotenv").config();

const parseBoolean = value => {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const buildDialectOptions = useSsl => {
  if (!useSsl) {
    return {};
  }

  return {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
};

const useSsl = parseBoolean(process.env.DB_SSL);
const databaseUrl = process.env.DATABASE_URL || process.env.JAWSDB_URL;
const sharedConfig = {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 1000
  }
};

const sslConfig = buildDialectOptions(useSsl);
const configWithSsl = Object.keys(sslConfig).length
  ? { ...sharedConfig, dialectOptions: sslConfig }
  : sharedConfig;

// create connection to our db
const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, configWithSsl)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        ...configWithSsl
      }
    );

module.exports = sequelize;

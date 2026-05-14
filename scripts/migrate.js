const fs = require('fs/promises');
const path = require('path');
const sequelize = require('../config/connection');

const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');

const ensureMigrationTable = async () => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS migration (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      run_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const getAppliedMigrations = async () => {
  const [rows] = await sequelize.query('SELECT name FROM migration ORDER BY name ASC;');
  return new Set(rows.map(row => row.name));
};

const recordMigration = async (name, transaction) => {
  await sequelize.query('INSERT INTO migration (name) VALUES (?);', {
    replacements: [name],
    transaction
  });
};

const run = async () => {
  await ensureMigrationTable();
  const appliedMigrations = await getAppliedMigrations();
  const files = (await fs.readdir(migrationsDir)).filter(file => file.endsWith('.js')).sort();

  for (const file of files) {
    if (appliedMigrations.has(file)) {
      continue;
    }

    const migration = require(path.join(migrationsDir, file));

    await sequelize.transaction(async transaction => {
      await migration.up(sequelize, transaction);
      await recordMigration(file, transaction);
    });

    console.log(`Applied migration ${file}`);
  }

  if (files.every(file => appliedMigrations.has(file))) {
    console.log('No pending migrations.');
  }

  await sequelize.close();
};

run().catch(async error => {
  console.error('Migration failed.', error);
  await sequelize.close();
  process.exit(1);
});

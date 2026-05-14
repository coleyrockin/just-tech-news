const up = async (sequelize, transaction) => {
  await sequelize.query(
    `
    CREATE TABLE IF NOT EXISTS tag (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(50) NOT NULL,
      slug VARCHAR(60) NOT NULL,
      description VARCHAR(255) NULL,
      color_token VARCHAR(32) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_tag_name (name),
      UNIQUE KEY unique_tag_slug (slug),
      KEY idx_tag_slug (slug)
    );
  `,
    { transaction }
  );

  await sequelize.query(
    `
    CREATE TABLE IF NOT EXISTS post_tag (
      post_id INT NOT NULL,
      tag_id INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (post_id, tag_id),
      KEY idx_post_tag_tag_id (tag_id),
      CONSTRAINT fk_post_tag_post
        FOREIGN KEY (post_id) REFERENCES post (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_post_tag_tag
        FOREIGN KEY (tag_id) REFERENCES tag (id)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
  `,
    { transaction }
  );
};

const down = async (sequelize, transaction) => {
  await sequelize.query('DROP TABLE IF EXISTS post_tag;', { transaction });
  await sequelize.query('DROP TABLE IF EXISTS tag;', { transaction });
};

module.exports = { up, down };

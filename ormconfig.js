module.exports = {
  type: "postgres",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  synchronize: true,
  port: 5432,
  entities: ["dist/models/*.js"],
  logging: true,
  ssl:
    process.env.NODE_ENV === "development"
      ? undefined
      : { rejectUnauthorized: false },
};

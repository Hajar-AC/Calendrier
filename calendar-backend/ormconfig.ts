import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    entities: [__dirname + "/entities/*.ts"],
    synchronize: true,  // Cree automatiquement tables ds SQLiteand synchronise automatiquement changements bd
});

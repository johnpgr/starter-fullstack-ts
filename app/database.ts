import { DataSource } from "typeorm"
import * as entities from "~/models/*.js"

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./database/db.sqlite",
    entities,
    synchronize: true,
})

export const QueryBuilder = AppDataSource.createQueryBuilder()

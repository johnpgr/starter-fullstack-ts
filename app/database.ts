import { join } from "path"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: "./database/db.sqlite",
    entities: [join(import.meta.dirname, "models", "*.js")],
    synchronize: true,
})

export const QueryBuilder = AppDataSource.createQueryBuilder()

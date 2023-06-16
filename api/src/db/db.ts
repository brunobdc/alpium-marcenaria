import migrate from "node-pg-migrate"
import path from "path";
import { Pool } from "pg"

let pool: Pool | undefined = undefined;

export namespace Database {
    export async function setup() {
        pool = new Pool({ host: "db", user: "postgres", password: "SN7mes5uvKbv66wY2p9upToiVMga9MrDoUy4MhtyFK95W7PhVQ" })
        const client = await pool.connect()
        await migrate({
            dbClient: client,
            dir: path.join(__dirname, "migrations"),
            direction: "up",
            migrationsTable: "migrations",
        })
    }

    export function getPool(): Pool {
        if (!pool) {
            throw new Error("Execute setup function first")
        }
        return pool
    }
}
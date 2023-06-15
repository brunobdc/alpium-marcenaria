/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        "resources",
        {
            id: "SERIAL",
            name: "VARCHAR(80)",
            uom: "VARCHAR(10)",
            price: "MONEY"
        },
        {
            constraints: {
                primaryKey: "id"
            }
        }
    )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("resources")
}

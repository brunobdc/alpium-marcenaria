/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(
        "projects",
        {
            id: "SERIAL",
            name: "VARCHAR(100)"
        },
        {
            constraints: {
                primaryKey: "id"
            }
        }
    )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("projects")
}

/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("project_resources", {
        projectId: "BIGINT",
        resourceId: "BIGINT",
        resourceQty: "INT"
    }, {
        constraints: {
            foreignKeys: [
                { columns: "projectId", references: "projects" },
                { columns: "resourceId", references: "resources" }
            ]
        }
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("project_resources")
}

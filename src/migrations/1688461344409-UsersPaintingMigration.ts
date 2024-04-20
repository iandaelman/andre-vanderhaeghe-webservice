import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class UsersPaintingMigration1688461344409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "painting",
        columns: [
          {
            name: "id",
            type: "BIGINT",
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
          },
          {
            name: "category",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "imageFilepath",
            type: "varchar",
          },
          {
            name: "length",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "height",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "BIGINT",
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
          },
          {
            name: "auth0Id",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "users_paintings",
        columns: [
          {
            name: "userId",
            type: "bigint",
            isPrimary: true,
          },
          {
            name: "paintingId",
            type: "bigint",
            isPrimary: true,
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "exhibition",
        columns: [
          {
            name: "id",
            type: "BIGINT",
            isNullable: false,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
          },
          {
            name: "description",
            type: "text",
          },
          {
            name: "startDate",
            type: "date",
          },
          {
            name: "endDate",
            type: "date",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "users_paintings",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "users_paintings",
      new TableForeignKey({
        columnNames: ["paintingId"],
        referencedColumnNames: ["id"],
        referencedTableName: "painting",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_paintings");
    await queryRunner.dropTable("user");
    await queryRunner.dropTable("painting");
    await queryRunner.dropTable("exhibition");
  }
}

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
            type: "SERIAL",
            isPrimary: true,
          },
          {
            name: "title",
            type: "varchar",
            length: "255"
          },
          {
            name: "category",
            type: "varchar",
            length: "255"
          },
          {
            name: "description",
            type: "varchar",
            length: "255"
          },
          {
            name: "imagefilepath",
            type: "varchar",
            length: "255"
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
        name: "useraccount",
        columns: [
          {
            name: "id",
            type: "SERIAL",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password_hash",
            type: "varchar",
            isNullable: false,
            length: "255",
          },
          {
            name: "roles",
            type: "json",
            isNullable: false,
          }
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "useraccounts_paintings",
        columns: [
          {
            name: "userid",
            type: "bigint",
            isPrimary: true,
          },
          {
            name: "paintingid",
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
            type: "SERIAL",
            isPrimary: true,
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
            name: "startdate",
            type: "date",
          },
          {
            name: "enddate",
            type: "date",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "useraccounts_paintings",
      new TableForeignKey({
        columnNames: ["userid"],
        referencedColumnNames: ["id"],
        referencedTableName: "useraccount",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "useraccounts_paintings",
      new TableForeignKey({
        columnNames: ["paintingid"],
        referencedColumnNames: ["id"],
        referencedTableName: "painting",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("useraccounts_paintings");
    await queryRunner.dropTable("useraccount");
    await queryRunner.dropTable("painting");
    await queryRunner.dropTable("exhibition");
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingUsers1688562737955 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO useraccount (name, email, password_hash, roles) VALUES
 ('John Doe', 'johndoe@hotmail.be', 'test', '["ROLE.USER"]'),
      ('Jane Smith', 'janesmith@hotmail.be', 'test', '["ROLE.USER"]'),
      ('Ian Daelman', 'iandaelman@hotmail.be', 'test', '["ROLE.USER","ROLE.ADMIN"]')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM useraccount;`);
  }
}

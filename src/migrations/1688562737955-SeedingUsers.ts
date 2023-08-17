import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingUsers1688562737955 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO user (name, auth0Id)
VALUES
    ('John Doe', 'unknown'),
    ('Jane Smith', 'unknown'),
    ('Ian Daelman', 'unknown'),
    ('Tom Test', 'unknown')
   
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM users;`);
  }
}

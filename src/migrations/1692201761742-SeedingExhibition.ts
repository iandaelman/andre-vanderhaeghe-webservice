import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingExhibition1692201761742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO exhibition (title, description, startdate, enddate) VALUES
    ('first Exhibition', 'Dit is de eerste tentoonstelling', '2025-01-01', '2025-01-02'),
    ('second Exhibition', 'Dit is de tweede tentoonstelling', '2026-01-01', '2026-01-02'),
    ('third Exhibition', 'Dit is de derde tentoonstelling', '2027-01-01', '2027-01-02')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM exhibition;`);
  }
}

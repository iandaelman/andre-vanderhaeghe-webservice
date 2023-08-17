import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingCategories1688494833326 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO category (name)
        VALUES
            ('Rood-Blauw'),
            ('Het Sensualisme'),
            ('Het Fantastische Droomlandschap'),
            ('Design');
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM category;`);
  }
}

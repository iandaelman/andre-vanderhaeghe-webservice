import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingPaintings1688561879775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO painting (title,  categoryId, description,imageFilepath,length, height, price)
        VALUES
            ('De bloei van moeder aarde', '4', 'Description 1', 'deBloeiVanMoederAarde.jpg',10,10, 100),
            ('De esotherische bloem',  '2', 'Description 2','deEsotherischeBloem.jpg',10,10, 200),
            ('De groei',  '4', 'Description 3','deGroei.jpg',10,10, 150),
            ('De keuze van de levenspartner',  '1', 'Description 4','DeKeuzeVandeLevenspartnerBig.jpg',10,10, 300),
            ('De klim in de ruimte',  '3','Description 5', 'DeKlimInDeRuimteBig.jpg',10,10, 250),
            ('De liefde van het leven',  '3', 'Description 6','DeLiefdeVanHetLevenBig.jpg',10,10, 120),
            ('De offerande',  '3', 'Description 7','DeOfferandeBig.jpg',10,10, 280),
            ('De toekomst',  '2', 'Description 8','DeToekomstBig.jpg',10,10, 220),
            ('De tweelingen',  '2', 'Description 9','DeTweelingenBig.jpg',10,10, 130),
            ('De wandel droom',  '3', 'Description 10','DeWandelDroomBig.jpg',10,10, 320);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM paintings;`);
  }
}

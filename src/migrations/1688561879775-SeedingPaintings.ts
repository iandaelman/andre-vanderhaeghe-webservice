import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingPaintings1688561879775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO painting (title,  category, description,imagefilepath,length, height, price)
        VALUES
            ('De bloei van moeder aarde', 'Design', 'Description 1', 'deBloeiVanMoederAarde.jpg',10,10, 100),
            ('De esotherische bloem',  'Het Sensualisme', 'Description 2','deEsotherischeBloem.jpg',10,10, 200),
            ('De groei',  'Design', 'Description 3','deGroei.jpg',10,10, 150),
            ('De keuze van de levenspartner',  'Rood-Blauw', 'Description 4','DeKeuzeVandeLevenspartnerBig.jpg',10,10, 300),
            ('De klim in de ruimte',  'Het Fantastische Droomlandschap','Description 5', 'DeKlimInDeRuimteBig.jpg',10,10, 250),
            ('De liefde van het leven',  'Het Fantastische Droomlandschap', 'Description 6','DeLiefdeVanHetLevenBig.jpg',10,10, 120),
            ('De offerande',  'Het Fantastische Droomlandschap', 'Description 7','DeOfferandeBig.jpg',10,10, 280),
            ('De toekomst',  'Het Sensualisme', 'Description 8','DeToekomstBig.jpg',10,10, 220),
            ('De tweelingen',  'Het Sensualisme', 'Description 9','DeTweelingenBig.jpg',10,10, 130),
            ('De wandel droom',  'Het Fantastische Droomlandschap', 'Description 10','DeWandelDroomBig.jpg',10,10, 320);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM paintings;`);
  }
}

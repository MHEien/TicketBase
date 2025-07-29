import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFederationMetadata1737574800000 implements MigrationInterface {
  name = 'AddFederationMetadata1737574800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists before adding it
    const columnExists = await queryRunner.hasColumn('plugins', 'federation_metadata');
    
    if (!columnExists) {
      await queryRunner.query(`
        ALTER TABLE "plugins" 
        ADD COLUMN "federation_metadata" jsonb
      `);

      await queryRunner.query(`
        COMMENT ON COLUMN "plugins"."federation_metadata" IS 'Module Federation metadata including federation name, exposes, and shared dependencies'
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists before dropping it
    const columnExists = await queryRunner.hasColumn('plugins', 'federation_metadata');
    
    if (columnExists) {
      await queryRunner.query(`
        ALTER TABLE "plugins" 
        DROP COLUMN "federation_metadata"
      `);
    }
  }
}
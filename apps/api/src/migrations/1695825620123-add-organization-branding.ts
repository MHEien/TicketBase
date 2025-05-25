import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationBranding1695825620123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns to organizations table
    await queryRunner.query(`
      ALTER TABLE organizations 
      ADD COLUMN IF NOT EXISTS favicon VARCHAR,
      ADD COLUMN IF NOT EXISTS domain_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS domain_verification_token VARCHAR,
      ADD COLUMN IF NOT EXISTS checkout_message TEXT,
      ADD COLUMN IF NOT EXISTS email_template TEXT;
    `);

    // Update the settings JSONB column schema (this doesn't require a migration in PostgreSQL)
    // But we'll set default values for existing organizations
    await queryRunner.query(`
      UPDATE organizations 
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{buttonStyle}',
        '"rounded"'
      ) 
      WHERE settings->>'buttonStyle' IS NULL;
      
      UPDATE organizations 
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{headerStyle}',
        '"centered"'
      ) 
      WHERE settings->>'headerStyle' IS NULL;
      
      UPDATE organizations 
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{footerLinks}',
        '[]'
      ) 
      WHERE settings->>'footerLinks' IS NULL;
      
      UPDATE organizations 
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{socialLinks}',
        '[]'
      ) 
      WHERE settings->>'socialLinks' IS NULL;
      
      UPDATE organizations 
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{customScripts}',
        '[]'
      ) 
      WHERE settings->>'customScripts' IS NULL;
      
      UPDATE organizations 
      SET settings = jsonb_set(
        COALESCE(settings, '{}'::jsonb),
        '{themeName}',
        '"default"'
      ) 
      WHERE settings->>'themeName' IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the new columns
    await queryRunner.query(`
      ALTER TABLE organizations 
      DROP COLUMN IF EXISTS favicon,
      DROP COLUMN IF EXISTS domain_verified,
      DROP COLUMN IF EXISTS domain_verification_token,
      DROP COLUMN IF EXISTS checkout_message,
      DROP COLUMN IF EXISTS email_template;
    `);

    // We can't easily remove JSON fields, so we'll leave them in place
  }
} 
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDepartmentsTable1701234567890 implements MigrationInterface {
  name = 'CreateDepartmentsTable1701234567890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create departments table
    await queryRunner.query(`
      CREATE TABLE "departments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "slug" character varying NOT NULL,
        "organizationId" uuid NOT NULL,
        "headId" uuid,
        "parentDepartmentId" uuid,
        "code" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "settings" jsonb NOT NULL DEFAULT '{}',
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_departments_id" PRIMARY KEY ("id")
      )
    `);

    // Add departmentId column to users table
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "departmentId" uuid
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "departments" 
      ADD CONSTRAINT "FK_departments_organizations" 
      FOREIGN KEY ("organizationId") 
      REFERENCES "organizations"("id") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "departments" 
      ADD CONSTRAINT "FK_departments_parent" 
      FOREIGN KEY ("parentDepartmentId") 
      REFERENCES "departments"("id") 
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "departments" 
      ADD CONSTRAINT "FK_departments_head" 
      FOREIGN KEY ("headId") 
      REFERENCES "users"("id") 
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_departments" 
      FOREIGN KEY ("departmentId") 
      REFERENCES "departments"("id") 
      ON DELETE SET NULL
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_departments_organization" ON "departments" ("organizationId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_departments_parent" ON "departments" ("parentDepartmentId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_departments_head" ON "departments" ("headId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_department" ON "users" ("departmentId")
    `);

    // Create unique constraint for department slug within an organization
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_departments_slug_organization" 
      ON "departments" ("slug", "organizationId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_departments_slug_organization"`);
    await queryRunner.query(`DROP INDEX "IDX_users_department"`);
    await queryRunner.query(`DROP INDEX "IDX_departments_head"`);
    await queryRunner.query(`DROP INDEX "IDX_departments_parent"`);
    await queryRunner.query(`DROP INDEX "IDX_departments_organization"`);

    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_departments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_departments_head"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_departments_parent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_departments_organizations"`,
    );

    // Drop departmentId column from users table
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "departmentId"`);

    // Drop departments table
    await queryRunner.query(`DROP TABLE "departments"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1684252800000 implements MigrationInterface {
  name = 'InitialSchema1684252800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create organizations table
    await queryRunner.query(`
            CREATE TYPE "public"."organizations_plan_enum" AS ENUM('free', 'basic', 'pro', 'enterprise')
        `);

    await queryRunner.query(`
            CREATE TABLE "organizations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying,
                "website" character varying,
                "address" jsonb,
                "logo" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "plan" "public"."organizations_plan_enum" NOT NULL DEFAULT 'free',
                "settings" jsonb NOT NULL DEFAULT '{}',
                "subscription_id" character varying,
                "custom_domain" character varying,
                CONSTRAINT "UQ_organizations_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
            )
        `);

    // Create users table
    await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('owner', 'admin', 'manager', 'support', 'analyst')
        `);

    await queryRunner.query(`
            CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'pending')
        `);

    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "avatar" character varying,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'manager',
                "permissions" text array NOT NULL,
                "organization_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "last_active" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending',
                "two_factor_enabled" boolean NOT NULL DEFAULT false,
                "two_factor_secret" character varying,
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // Create user_sessions table
    await queryRunner.query(`
            CREATE TABLE "user_sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "token" character varying NOT NULL,
                "refresh_token" character varying NOT NULL,
                "device" character varying,
                "ip" character varying,
                "location" character varying,
                "last_active" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "expires_at" TIMESTAMP NOT NULL,
                "is_revoked" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_user_sessions" PRIMARY KEY ("id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "FK_users_organization"
            FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_user_sessions_user"
            FOREIGN KEY ("user_id") REFERENCES "users"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_user_sessions_user"
        `);

    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_users_organization"
        `);

    // Drop tables
    await queryRunner.query(`DROP TABLE "user_sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "organizations"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."organizations_plan_enum"`);
  }
}

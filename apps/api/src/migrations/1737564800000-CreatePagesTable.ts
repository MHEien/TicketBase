import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePagesTable1737564800000 implements MigrationInterface {
  name = 'CreatePagesTable1737564800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create pages table
    await queryRunner.createTable(
      new Table({
        name: 'pages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published', 'archived'],
            default: "'draft'",
            isNullable: false,
          },
          {
            name: 'is_homepage',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'seo_title',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'seo_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'seo_keywords',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'featured_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'sort_order',
            type: 'integer',
            default: 0,
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['created_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['updated_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
      true,
    );

    // Create unique index for organization_id + slug
    await queryRunner.createIndex(
      'pages',
      new TableIndex({
        name: 'IDX_pages_organization_slug',
        columnNames: ['organization_id', 'slug'],
        isUnique: true,
      }),
    );

    // Create index for organization_id + status for faster queries
    await queryRunner.createIndex(
      'pages',
      new TableIndex({
        name: 'IDX_pages_organization_status',
        columnNames: ['organization_id', 'status'],
      }),
    );

    // Create index for homepage queries
    await queryRunner.createIndex(
      'pages',
      new TableIndex({
        name: 'IDX_pages_homepage',
        columnNames: ['organization_id', 'is_homepage', 'status'],
      }),
    );

    // Create index for sorting
    await queryRunner.createIndex(
      'pages',
      new TableIndex({
        name: 'IDX_pages_sort_order',
        columnNames: ['organization_id', 'sort_order'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('pages', 'IDX_pages_sort_order');
    await queryRunner.dropIndex('pages', 'IDX_pages_homepage');
    await queryRunner.dropIndex('pages', 'IDX_pages_organization_status');
    await queryRunner.dropIndex('pages', 'IDX_pages_organization_slug');

    // Drop table
    await queryRunner.dropTable('pages');
  }
}

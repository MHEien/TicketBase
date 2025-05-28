import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateActivitiesTable1734567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'activities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'FINANCIAL',
              'EVENT_MANAGEMENT',
              'USER_MANAGEMENT',
              'ADMINISTRATIVE',
              'SECURITY',
              'MARKETING',
            ],
          },
          {
            name: 'severity',
            type: 'enum',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: "'LOW'",
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'organizationId',
            type: 'uuid',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'relatedEntityId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'relatedEntityType',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'relatedEntityName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_activities_organization_created',
        columnNames: ['organizationId', 'createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_activities_organization_type',
        columnNames: ['organizationId', 'type'],
      }),
    );

    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_activities_organization_severity',
        columnNames: ['organizationId', 'severity'],
      }),
    );

    await queryRunner.createIndex(
      'activities',
      new TableIndex({
        name: 'IDX_activities_user',
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('activities');
  }
}

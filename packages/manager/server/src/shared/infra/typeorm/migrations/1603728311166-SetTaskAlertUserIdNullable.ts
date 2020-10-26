import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class SetTaskAlertUserIdNullable1603728311166
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'task_alerts',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'task_alerts',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
      }),
    );
  }
}

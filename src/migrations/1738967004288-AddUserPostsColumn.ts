import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPostsColumn1738967004288 implements MigrationInterface {
    name = 'AddUserPostsColumn1738967004288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userPosts" text array NOT NULL DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userPosts"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTagsColumn1738989369227 implements MigrationInterface {
    name = 'AddUserTagsColumn1738989369227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userTags" text array NOT NULL DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userPosts" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userPosts" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userTags"`);
    }

}

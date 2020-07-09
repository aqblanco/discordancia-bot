import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { getDB } from "@helpers/bootstrapper";

@Entity('user_server')
export class UserServerEntity {
	@PrimaryColumn() user_id: string;

	@PrimaryColumn() server_id: string;

	@Column({ nullable: true}) last_connection: Date;

	@CreateDateColumn() createdAt: Date;

	@UpdateDateColumn() updatedAt: Date;
}

//getDB().then(async (DB) => {await DB.addEntity(UserServerEntity);});
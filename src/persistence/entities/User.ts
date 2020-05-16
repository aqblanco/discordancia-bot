import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { getDB } from "@helpers/initialize";

@Entity('user')
export class UserEntity {
	@PrimaryColumn() user_id: string;

	@Column({ nullable: true}) btag: string;

	@CreateDateColumn() createdAt: Date;

	@UpdateDateColumn() updatedAt: Date;
	
}

//getDB().then(async (DB) => {await DB.addEntity(UserEntity);});
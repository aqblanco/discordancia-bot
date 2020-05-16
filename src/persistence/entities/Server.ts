import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { getDB } from "@helpers/initialize";

@Entity('server')
export class ServerEntity {
	@PrimaryColumn() server_id: string;

	@Column({ nullable: true}) motd: string;

	@CreateDateColumn() createdAt: Date;

	@UpdateDateColumn() updatedAt: Date;
}

//getDB().then(async (DB) => {await DB.addEntity(ServerEntity);});
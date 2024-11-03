import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Event } from "./Event";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    password!: string;


    // Relation avec evenements
    @OneToMany(() => Event, (event) => event.user)
    events!: Event[];
}

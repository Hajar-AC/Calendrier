import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: "date" })
    startDate!: string;

    @Column({ type: "date" })
    endDate!: string;

    @Column({ type: "time" })
    startTime!: string;

    @Column({ type: "time" })
    endTime!: string;

    @ManyToOne(() => User, (user) => user.events, { onDelete: "CASCADE" })
    user!: User;
}

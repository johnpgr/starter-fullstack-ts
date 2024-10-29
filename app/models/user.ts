import { Session } from "./session.js"
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm"
import type { Relation } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    hashedPassword: string

    @OneToMany(() => Session, (session) => session.user)
    sessions: Relation<Session[]>
}
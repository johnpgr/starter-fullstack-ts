import { hash } from "@node-rs/argon2"
import { Session } from "./session.js"
import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
} from "typeorm"
import type { Relation } from "typeorm"
import { ulid } from "ulid"

@Entity()
export class User extends BaseEntity {
    @BeforeInsert()
    generateId() {
        this.id = ulid()
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password)
    }

    @PrimaryColumn()
    id: string

    @Column({ unique: true })
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @OneToMany(() => Session, (session) => session.user)
    sessions: Relation<Session[]>
}

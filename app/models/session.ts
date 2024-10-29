import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"

import { User } from "./user.js"

@Entity()
export class Session extends BaseEntity {
    @PrimaryColumn()
    id: string

    @ManyToOne(() => User, (user) => user.sessions, { eager: true })
    user: Relation<User>

    @Column()
    userAgent: string

    @Column()
    ip: string

    @Column()
    expiresAt: Date
}

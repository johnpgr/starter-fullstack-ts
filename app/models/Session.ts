import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    type Relation,
} from "typeorm"
import { User } from "./User.js"

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

import { Column, Entity } from "typeorm";
import { BasedEntity } from "./based.entity";


@Entity()
export class Logs extends BasedEntity{

    @Column({
        default: null,
        nullable: true
    })
    status: number

    @Column({
        default: null,
        nullable: true
    })
    route: string

    @Column({
        default: null,
        nullable: true,
        type: 'boolean'
    })
    error: Boolean;

    @Column({
        default: null,
        nullable: true
    })
    message: string

    @Column({
        default: null,
        nullable: true,
        type: 'longtext'
    })
    data: string

}
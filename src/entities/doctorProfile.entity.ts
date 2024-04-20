import { Column, Entity } from "typeorm";
import { BasedEntity } from "./based.entity";

@Entity()
export class DoctorProfile extends BasedEntity{

    @Column({
        default: null,
        nullable: true
    })
    profile_picture: String;

    @Column({
        default: null,
        nullable: true,
        type: 'longtext'
    })
    about_me: string;

    @Column({
        default: null,
        nullable: true,
        type: 'time'
    })
    available_start: Date;

    @Column({
        default: null,
        nullable: true,
        type: 'time'
    })
    available_end: Date;

}
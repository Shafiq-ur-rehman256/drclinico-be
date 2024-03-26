import { Column, Entity, OneToMany } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Donations } from "./Donations.entity";

@Entity()
export class Patients extends BasedEntity {

    @Column({
        default: null,
        nullable: true
    })
    full_name: string;

    @Column({
        default: null,
        nullable: true
    })
    email: string;

    @Column({
        default: null,
        nullable: true
    })
    cnic: string;

    @Column({
        default: null,
        nullable: true
    })
    phone_number: string;

    @Column({
        default: null,
        nullable: true
    })
    password: string;

    @Column({
        default: null,
        nullable: true
    })
    otp_code: string;

    @Column({
        default: null,
        nullable: true
    })
    otp_expiry: string;

    @Column({
        default: false,
        nullable: false,
        type: 'boolean'
    })
    email_verified: Boolean;

    @Column({
        default: null,
        nullable: true,
        type: 'longtext'
    })
    auth_token: string;

    @OneToMany(() => Donations, (photo) => photo.patient)
    donations: Donations[]

}
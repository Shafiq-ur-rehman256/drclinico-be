import { Column, Entity } from "typeorm";
import { BasedEntity } from "./based.entity";

@Entity()
export class Doctors extends BasedEntity {

    @Column({
        default: null,
        nullable: true
    })
    email: string;

    @Column({
        default: null,
        nullable: true
    })
    full_name: string;


    @Column({
        default: null,
        nullable: true
    })
    phone_number: string;


    @Column({
        default: null,
        nullable: true
    })
    cnic: string;

    @Column({
        default: null,
        nullable: true
    })
    license_number: string;

    @Column({
        default: null,
        nullable: true
    })
    password: string;


    @Column({
        default: null,
        nullable: true
    })
    specialization: string;

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
        default: null,
        nullable: true
    })
    availibilty_status: string;

}
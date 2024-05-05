import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { DoctorProfile } from "./doctorProfile.entity";
import { DoctorAvailableSlots } from "./doctorAvailableSlots.entity";

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
        default: 'OFFLINE',
        nullable: true
    })
    status: string;

    @Column({
        default: false,
        nullable: false,
        type: 'boolean'
    })
    account_verified: Boolean;

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

    @OneToOne(() => DoctorProfile)
    @JoinColumn({name: 'profile_id'})
    profile: DoctorProfile;


    @OneToMany(() => DoctorAvailableSlots, (photo) => photo.doctor)
    available_slots: DoctorAvailableSlots[]

}
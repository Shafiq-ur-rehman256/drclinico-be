import { Column, Entity, OneToMany } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Donations } from "./Donations.entity";
import { Appointments } from "./appointment.entity";
import { Chats } from "./chats.entity";
import { Conversations } from "./conversation.entity";

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

    @Column({
        default: null,
        nullable: true
    })
    socket_id: string;

    @Column({
        default: 'offline',
        nullable: true
    })
    status: string;

    @OneToMany(() => Donations, (photo) => photo.patient)
    donations: Donations[]

    @OneToMany(() => Appointments, (photo) => photo.patient)
    appointments: Appointments[]

    @OneToMany(() => Chats, (photo) => photo.patient)
    chats: Chats[]

    @OneToMany(() => Conversations, (convo) => convo.patient)
    conversations: Conversations[]

}
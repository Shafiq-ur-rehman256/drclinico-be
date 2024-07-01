import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";
import { Appointments } from "./appointment.entity";
import { Conversations } from "./conversation.entity";


@Entity()
export class Chats extends BasedEntity{

    @Column({
        default: null,
        nullable: true
    })
    message: string;

    @Column({
        default: null,
        nullable: true
    })
    attachment: string;

    @Column({
        default: null,
        nullable: true
    })
    message_type: string;

    @Column({
        default: null,
        nullable: false
    })
    message_from_doctor: Boolean;

    @Column({
        default: null,
        nullable: false
    })
    seen: Boolean;

    @ManyToOne(() => Appointments, (appointment) => appointment.chats)
    @JoinColumn({name: 'appointment_id'})
    appointments: Appointments

    @ManyToOne(() => Doctors,  (doctors) => doctors.chats)
    @JoinColumn({name: "doc_id"})
    docter: Doctors

    @ManyToOne(() => Patients,  (patients) => patients.chats)
    @JoinColumn({name: "pat_id"})
    patient: Patients;

    @ManyToOne(() => Conversations, (chats) => chats)
    @JoinColumn({name: "conversation_id"})
    conversation: Conversations;

}
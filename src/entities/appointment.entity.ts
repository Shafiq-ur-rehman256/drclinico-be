import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";
import { Chats } from "./chats.entity";
import { Conversations } from "./conversation.entity";


@Entity()
export class Appointments extends BasedEntity{

    @Column({
        default:null,
        nullable:true
    })
    status: string

    @Column({
        default:null,
        nullable:true,
        type:"datetime"
    })
    waiting_time: Date

    @Column({
        default:null,
        nullable:true,
        type:"datetime"
    })
    duration_from: Date

    @Column({
        default:null,
        nullable:true,
        type:"datetime"
    })
    duration_to: Date

    @Column({
        default:null,
        nullable:true,
        type:"datetime"
    })
    scheduled_date: Date

    @ManyToOne(() => Doctors, (doctor) => doctor)
    @JoinColumn({name: "doctor_id"})
    docter: Doctors

    @ManyToOne(() => Patients, (patient) => patient)
    @JoinColumn({name: "patient_id"})
    patient: Patients

    @Column({
        default: null,
        nullable: true
    })
    selected_slot_time: string;

    @OneToMany(() => Chats, (appointment) => appointment.appointments)
    chats: Chats[];

    @ManyToOne(() => Conversations, (patient) => patient)
    @JoinColumn({name: "convo_id"})
    conversation: Conversations;

}
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";
import { Chats } from "./chats.entity";
import { Appointments } from "./appointment.entity";


@Entity()
export class Conversations extends BasedEntity{
    
    @Column({
        default: null,
        nullable: false
    })
    room_name: string;

    @Column({
        default: null,
        nullable: false
    })
    chat_ended: Boolean;

    @ManyToOne(() => Doctors, (doctor) => doctor)
    @JoinColumn({name: "doctor_id"})
    docter: Doctors


    @ManyToOne(() => Patients, (patient) => patient)
    @JoinColumn({name: "patient_id"})
    patient: Patients;

    @OneToMany(() => Chats, (chats) => chats.conversation)
    chats: Chats[]

    @OneToMany(() => Appointments, (appointment) => appointment.conversation)
    appointments: Appointments[]

} 
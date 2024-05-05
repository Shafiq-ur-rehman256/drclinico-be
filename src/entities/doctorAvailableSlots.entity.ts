import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";

@Entity()
export class DoctorAvailableSlots extends BasedEntity {

    @Column({
        default: null,
        nullable: false
    })
    day_name: string;

    @Column({
        default: null,
        nullable: true
    })
    start: string;

    @Column({
        default: null,
        nullable: true
    })
    end: string;

    @ManyToOne(() => Doctors, (doctor) => doctor.available_slots)
    @JoinColumn({name: "doctor_id"})
    doctor: Doctors


}
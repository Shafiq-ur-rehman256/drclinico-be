import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";


@Entity()
export class Notifications extends BasedEntity{

    @OneToOne(() => Doctors)
    @JoinColumn({name: "doc_id"})
    docter: Doctors

    @OneToOne(() => Patients)
    @JoinColumn({name: "pat_id"})
    patient: Patients;

    @Column({
        default: null,
        nullable: true
    })
    heading: string;

    @Column({
        default: null,
        nullable: true
    })
    description: string;

    @Column({
        default: null,
        nullable: true
    })
    action: string;

}
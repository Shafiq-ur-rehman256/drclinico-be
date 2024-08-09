import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Prescription } from "./prescription.entity";


@Entity()
export class PrescriptionDetail extends BasedEntity{

    @Column({
        nullable: false,
        default: null
    })
    medicine_name: string;

    @Column({
        nullable: false,
        default: null
    })
    number_of_doze: number;

    @Column({
        nullable: false,
        default: null
    })
    time: string;

    @ManyToOne(() => Prescription, (patient) => patient)
    @JoinColumn({name: "prescription_id"})
    prescription: Prescription;
    
}
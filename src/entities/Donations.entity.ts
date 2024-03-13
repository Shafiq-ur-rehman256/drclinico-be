import { Column, Entity, ManyToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Patients } from "./patients.entity";


@Entity()
export class Donations extends BasedEntity{

    @ManyToOne(() => Patients, (user) => user)
    patient: Patients

    @Column({
        default: null,
        nullable: true
    })
    transaction_amount: string;

    @Column({
        default: null,
        nullable: true
    })
    transaction_token: string;


    @Column({
        default: null,
        nullable: true
    })
    transaction_status: string;
    
}
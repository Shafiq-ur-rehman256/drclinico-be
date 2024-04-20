import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";


@Entity()
export class Notifications extends BasedEntity{

    @Column({
        default:null,
        nullable:true
     })
     subject: string

    @Column({
        default:null,
        nullable:true,
        type:"longtext"
     })
     text: string
     

}
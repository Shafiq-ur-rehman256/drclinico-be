import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";


@Entity()
export class Chats extends BasedEntity{

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
    text_message: string;

    @Column({
        default: null,
        nullable: true
    })
    media_link: string;

    @Column({
        default: null,
        nullable: true
    })
    message_type: string;

    @Column({
        default: null,
        nullable: true
    })
    media_type: string;

}
import { Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BasedEntity } from "./based.entity";
import { Doctors } from "./doctors.entity";
import { Patients } from "./patients.entity";
import { PrescriptionDetail } from "./prescriptionDetail.eneitiy";


@Entity()
export class Prescription extends BasedEntity{
 
    @ManyToOne(() => Doctors, (doctor) => doctor)
    @JoinColumn({name: "doctor_id"})
    doctor: Doctors;

    @ManyToOne(() => Patients, (patient) => patient)
    @JoinColumn({name: "patient_id"})
    patient: Patients;

    @OneToMany(() => PrescriptionDetail, (detail) => detail.prescription)
    detail: PrescriptionDetail[];
    
}
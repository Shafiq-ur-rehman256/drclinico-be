import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AssignPrescriptionDto } from './prescription.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctors } from 'src/entities/doctors.entity';
import { ResponseService } from 'src/shared/services/response/response.service';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Patients } from 'src/entities/patients.entity';
import { Prescription } from 'src/entities/prescription.entity';
import { PrescriptionDetail } from 'src/entities/prescriptionDetail.eneitiy';

@Injectable()
export class PrescriptionService {

    constructor(
        @InjectRepository(Doctors) private _doctorRepo: Repository<Doctors>,
        @InjectRepository(Patients) private _patientRepo: Repository<Patients>,
        @InjectRepository(Prescription) private _prescriptionRepo: Repository<Prescription>,
        @InjectRepository(PrescriptionDetail) private _prescriptionDetailRepo: Repository<PrescriptionDetail>,
        @Inject('RES-SERVICE') private _res: ResponseService,
        @Inject('JWT-SERVICE') private _jwt: JwtService,
    ){}

    async assignPrescription(body: AssignPrescriptionDto, req: Request){
        try {
            
            const { doctor_id, patient_id, prescription_detail } = body;

            const doctor = await this._doctorRepo.findOne({
                where: {
                    id: doctor_id, 
                    account_verified: true
                }
            })

            if(!doctor){
                throw new HttpException("Invalid Doctor Id", HttpStatus.BAD_REQUEST)
            }

            const patient = await this._patientRepo.findOne({
                where: {
                    id: patient_id
                }
            })

            if (!patient) {
                throw new HttpException("Invalid patient Id", HttpStatus.BAD_REQUEST);
            }

            const newPrescription = this._prescriptionRepo.create({
                doctor: doctor,
                patient: patient
            });
            await this._prescriptionRepo.save(newPrescription);


            for (const detail of prescription_detail){

                const newDetail = this._prescriptionDetailRepo.create({
                    medicine_name: detail.medicine_name,
                    number_of_doze: detail.number_of_doze,
                    time: detail.time,
                    prescription: newPrescription
                });
                await this._prescriptionDetailRepo.save(newDetail);

            }

            return this._res.generateRes(HttpStatus.OK, null, "Prescription Assign", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }


    async getAllprescriptionForDoctor(req: Request){
        try {

            const {id} = this._jwt.decodeToken(req.headers.authorization) as any
            
            const doctor = await this._doctorRepo.findOne({
                where: {
                    id: id
                }
            })

            if (!doctor) {
                throw new HttpException("Session Expire", HttpStatus.BAD_REQUEST);
            }

            const prescriptionList = await this._prescriptionRepo.find({
                where: {
                    doctor: {
                        id: doctor.id
                    }
                },
                relations: {
                    detail: true,
                    doctor: true,
                    patient: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, prescriptionList, "List", req);

        } catch (error) {
            
            return this._res.generateErr(error, req);

        }
    }


}

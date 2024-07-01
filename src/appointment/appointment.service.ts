import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Doctors } from 'src/entities/doctors.entity';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { ResponseService } from 'src/shared/services/response/response.service';
import { IsNull, Not, Repository } from 'typeorm';
import * as moment from 'moment';
import { BookAppointmentDto, StartAppointmentDto } from './appointment.dto';
import { Patients } from 'src/entities/patients.entity';
import { Appointments } from 'src/entities/appointment.entity';
import { Conversations } from 'src/entities/conversation.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppointmentService {

    constructor(
        @InjectRepository(Doctors) private _doctorRepo: Repository<Doctors>,
        @InjectRepository(Patients) private _patientRepo: Repository<Patients>,
        @InjectRepository(Appointments) private _appointmentRepo: Repository<Appointments>,
        @InjectRepository(Conversations) private _convoRepo: Repository<Conversations>,
        @Inject('RES-SERVICE') private _res: ResponseService,
        @Inject('JWT-SERVICE') private _jwt: JwtService,
    ) { }

    async getAllDoctorListForPatient(req: Request) {
        try {

            const doctors = await this._doctorRepo.find({
                where: {
                    deleted_at: IsNull(),
                    account_verified: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, doctors, "Doctor list", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async getDoctorAvailableSlots(doctor_id: string, req: Request) {
        try {

            const slots = await this._doctorRepo.findOne({
                where: {
                    id: parseInt(doctor_id),
                    deleted_at: IsNull(),
                    account_verified: true,
                    available_slots: [
                        {
                            start: Not(IsNull())
                        },
                        {
                            end: Not(IsNull())
                        }
                    ]
                },
                relations: {
                    available_slots: {
                        doctor: true
                    }
                }
            })

            const weekDays: any[] = this.getNextSevenDays()

            const data: any[] = [];

            slots.available_slots.forEach((ele) => {

                let temp = {};
                const date = weekDays.find(date => date.day == ele.day_name);
                delete date.day
                temp = {
                    ...date,
                    ...ele
                }

                data.push(temp);

            })

            return this._res.generateRes(HttpStatus.OK, data, "Slot List", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async bookAppointmentForPatient(body: BookAppointmentDto, req: Request) {
        try {


            const { patient_id, doctor_id, selected_slot_time, scheduled_date } = body;

            const doctor = await this._doctorRepo.findOne({
                where: {
                    id: doctor_id,
                    account_verified: true,
                    deleted_at: IsNull()
                }
            })

            if (!doctor) throw new HttpException("Invalid Doctor", HttpStatus.BAD_REQUEST);

            const patient = await this._patientRepo.findOne({
                where: {
                    id: patient_id,
                    deleted_at: IsNull()
                }
            })

            if (!patient) throw new HttpException("Invalid Patient", HttpStatus.BAD_REQUEST);

            console.log(new Date(scheduled_date));
            const alreadyBooked = await this._appointmentRepo.findOne({
                where: {
                    deleted_at: IsNull(),
                    scheduled_date: new Date(scheduled_date),
                    selected_slot_time: selected_slot_time,
                    patient: {
                        id: patient_id,
                    },
                    docter: {
                        id: doctor_id
                    }

                }
            })

            if (alreadyBooked) {
                throw new HttpException("You have already book appointment on this date", HttpStatus.BAD_REQUEST)
            }
            const appointment = this._appointmentRepo.create({
                selected_slot_time: selected_slot_time,
                status: 'PENDING',
                scheduled_date: new Date(scheduled_date),
                docter: doctor,
                patient: patient
            })

            await this._appointmentRepo.save(appointment);

            return this._res.generateRes(HttpStatus.OK, {}, "Your appointment booked", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async patientAppointmentsForDoctor(req: Request) {
        try {

            const { id: doctor_id } = await this._jwt.decodeToken(req.headers.authorization)

            const list = await this._appointmentRepo.find({
                where: {
                    status: 'PENDING',
                    docter: {
                        id: doctor_id
                    }
                },
                relations: {
                    patient: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, list, "Appointment List", req)

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async startAppointment(body: StartAppointmentDto, req: Request) {
        try {

            const { appointment_id } = body;
            const { id: doctor_id } = await this._jwt.decodeToken(req.headers.authorization)

            const doctor = await this._doctorRepo.findOne({
                where: {
                    id: doctor_id,
                    account_verified: true,
                    deleted_at: IsNull()
                }
            })

            if (!doctor) throw new HttpException("This appointment not belong to you", HttpStatus.BAD_REQUEST);

            const appointment = await this._appointmentRepo.findOne({
                where: {
                    id: appointment_id,
                    docter: {
                        id: doctor.id
                    },
                    status: 'PENDING'
                },
                relations: {
                    patient: true
                }
            })

            if (!appointment) throw new HttpException("This appointment not belong to you", HttpStatus.BAD_REQUEST);

            // // update appointment record
            // await this._appointmentRepo.createQueryBuilder()
            //     .update()
            //     .set({
            //         status: 'STARTED',
            //         duration_from: new Date(),
            //         conversation: 
            //     })
            //     .where("id = :id", { id: appointment.id })
            //     .execute();

            // create room if not exsist

            const conversation = await this._convoRepo.findOne({
                where: {
                    deleted_at: IsNull(),
                    docter: {
                        id: doctor.id
                    },
                    patient: {
                        id: appointment.patient.id
                    }
                },
                relations: {
                    docter: true,
                    patient: true
                }
            })

            if (conversation) {
                await this._convoRepo.createQueryBuilder()
                    .update()
                    .set({
                        chat_ended: false
                    })
                    .where("id=:id", { id: conversation.id })
                    .execute();

                // update appointment record
                await this._appointmentRepo.createQueryBuilder()
                    .update()
                    .set({
                        status: 'STARTED',
                        duration_from: new Date(),
                        conversation: conversation
                    })
                    .where("id = :id", { id: appointment.id })
                    .execute();
                return this._res.generateRes(HttpStatus.OK, {...conversation, appointments:[appointment]}, "Appointment Started", req)

            } else {

                const convo = this._convoRepo.create({
                    room_name: uuidv4(),
                    chat_ended: false,
                    docter: doctor,
                    patient: appointment.patient
                })
                await this._convoRepo.save(convo);

                // update appointment record
                await this._appointmentRepo.createQueryBuilder()
                    .update()
                    .set({
                        status: 'STARTED',
                        duration_from: new Date(),
                        conversation: convo
            })
                    .where("id = :id", { id: appointment.id })
                    .execute();

                return this._res.generateRes(HttpStatus.OK, {...convo, appointments:[appointment]}, "Appointment Started", req)
            }



        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }


    private getNextSevenDays() {
        // Start from today
        let startDate = moment();
        // Initialize an array to store the days and dates
        let nextSevenDays = [];

        // Loop through the next 7 days
        for (let i = 0; i < 7; i++) {
            // Get the current day's moment object

            let currentDay = startDate.clone().add(i, 'day');
            // Add an object containing the day name and date to the array
            nextSevenDays.push({
                day: currentDay.format('dddd'),
                date: currentDay.format('YYYY-MM-DD')
            });
        }

        return nextSevenDays;
    }


}

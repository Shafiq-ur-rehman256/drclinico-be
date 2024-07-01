import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Appointments } from 'src/entities/appointment.entity';
import { Conversations } from 'src/entities/conversation.entity';
import { Doctors } from 'src/entities/doctors.entity';
import { Patients } from 'src/entities/patients.entity';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { ResponseService } from 'src/shared/services/response/response.service';
import { IsNull, Repository } from 'typeorm';
import { DoctorSendMsgDto, PatientSendMsgDto } from './chats.dto';
import { Chats } from 'src/entities/chats.entity';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketService } from 'src/socket/socket.service';
import { GeneralService } from 'src/shared/services/general/general.service';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Doctors) private _doctorRepo: Repository<Doctors>,
        @InjectRepository(Patients) private _patientRepo: Repository<Patients>,
        @InjectRepository(Appointments) private _appointmentRepo: Repository<Appointments>,
        @InjectRepository(Conversations) private _convoRepo: Repository<Conversations>,
        @InjectRepository(Chats) private _chatsRepo: Repository<Chats>,
        @Inject('RES-SERVICE') private _res: ResponseService,
        @Inject('JWT-SERVICE') private _jwt: JwtService,
        @Inject('GEN-SERVICE') private _general: GeneralService,
    ){}

    // DOCTOR

    async getAllConversationForDoctor(req: Request){
        try {
            
            const {id: doctor_id} = await this._jwt.decodeToken(req.headers.authorization);

            const allConversations = await this._convoRepo.find({
                where: {
                    deleted_at: IsNull(),
                    docter: {
                        id: doctor_id
                    },
                    appointments: {
                        status: 'STARTED'
                    }
                },
                relations: {
                    patient: true,
                    docter: true,
                    chats: true,
                    appointments: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, allConversations, "Conversation List", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async doctorSendMessage(body: DoctorSendMsgDto, req:Request){
        try {
            

            const  {message, attachment, message_type, message_from_doctor, appointment_id, doc_id, pat_id,conversation_id} = body;
            const appointment = await this._appointmentRepo.findOne({
                where: {
                    id: appointment_id,
                    status: 'STARTED'
                }
            })

            if(!appointment) throw new HttpException('Invalid appointment id', HttpStatus.BAD_REQUEST);

            const docter = await this._doctorRepo.findOne({
                where: {
                    id: doc_id
                }
            })

            if(!docter) throw new HttpException('Invalid docter id', HttpStatus.BAD_REQUEST);

            const patient = await this._patientRepo.findOne({
                where: {
                    id: pat_id
                }
            })

            if(!patient) throw new HttpException('Invalid patient id', HttpStatus.BAD_REQUEST);

            const conversation = await this._convoRepo.findOne({
                where: {
                    id: conversation_id
                }
            })

            if(!conversation) throw new HttpException('Invalid conversation id', HttpStatus.BAD_REQUEST);

            const createMessage = this._chatsRepo.create({
                message: message,
                attachment: attachment,
                message_type: message_type,
                appointments: appointment,
                docter: docter,
                patient: patient,
                conversation: conversation,
                message_from_doctor: message_from_doctor,
                seen: false
            })

            await this._chatsRepo.save(createMessage);

            const newMessage = await this._chatsRepo.findOne({
                where: {
                    id: createMessage.id
                },
                relations: {
                    conversation: true
                }
            });

            this._general.changObj({topic:'send-message-patient', data: newMessage})

            return this._res.generateRes(HttpStatus.OK, newMessage, "Message Emit", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async getAllChatsOfPatient(patient_id:string, req:Request){
        try {
            
            const chats = await this._chatsRepo.find({
                where: {
                    patient: {
                        id: parseInt(patient_id)
                    }
                },
                relations: {
                    conversation: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, chats, "Message List", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }


    // PATIENT

    async getAllConversationForPatient(req: Request){
        try {
            
            const {id: patient_id} = await this._jwt.decodeToken(req.headers.authorization);

            const allConversations = await this._convoRepo.find({
                where: {
                    deleted_at: IsNull(),
                    patient: {
                        id: patient_id
                    }
                },
                relations: {
                    patient: true,
                    docter: true,
                    chats: true,
                    appointments: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, allConversations, "Conversation List", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async patientSendMessage(body: PatientSendMsgDto, req:Request){
        try {
            

            const  {message, attachment, message_type, message_from_doctor, appointment_id, doc_id, pat_id,conversation_id} = body;
            const appointment = await this._appointmentRepo.findOne({
                where: {
                    id: appointment_id,
                    status: 'STARTED'
                }
            })

            if(!appointment) throw new HttpException('Invalid appointment id', HttpStatus.BAD_REQUEST);

            const docter = await this._doctorRepo.findOne({
                where: {
                    id: doc_id
                }
            })

            if(!docter) throw new HttpException('Invalid docter id', HttpStatus.BAD_REQUEST);

            const patient = await this._patientRepo.findOne({
                where: {
                    id: pat_id
                }
            })

            if(!patient) throw new HttpException('Invalid patient id', HttpStatus.BAD_REQUEST);

            const conversation = await this._convoRepo.findOne({
                where: {
                    id: conversation_id
                }
            })

            if(!conversation) throw new HttpException('Invalid conversation id', HttpStatus.BAD_REQUEST);

            const createMessage = this._chatsRepo.create({
                message: message,
                attachment: attachment,
                message_type: message_type,
                appointments: appointment,
                docter: docter,
                patient: patient,
                conversation: conversation,
                message_from_doctor: message_from_doctor,
                seen: false
            })

            await this._chatsRepo.save(createMessage);

            const newMessage = await this._chatsRepo.findOne({
                where: {
                    id: createMessage.id
                },
                relations: {
                    conversation: true
                }
            });

            this._general.changObj({topic:'send-message-patient', data: newMessage})

            return this._res.generateRes(HttpStatus.OK, newMessage, "Message Emit", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async getAllChatsOfDoctor(doctor_id: string, req){
        try {
            
            const chats = await this._chatsRepo.find({
                where: {
                    docter: {
                        id: parseInt(doctor_id)
                    }
                },
                relations: {
                    conversation: true
                }
            })

            return this._res.generateRes(HttpStatus.OK, chats, "Message List", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

}

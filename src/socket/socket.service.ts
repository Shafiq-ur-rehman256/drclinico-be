import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctors } from 'src/entities/doctors.entity';
import { Patients } from 'src/entities/patients.entity';
import { Repository } from 'typeorm';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
    constructor(
        @InjectRepository(Doctors) private _doctorRepo: Repository<Doctors>,
        @InjectRepository(Patients) private _patientRepo: Repository<Patients>,
    ) { }


    async setSocketId(socket_id: string, data: any) {

        const { user_type, user_id } = data;

        if (user_type == 'doctor') {
           await this._doctorRepo.createQueryBuilder()
                .update()
                .set({
                    socket_id: socket_id,
                    status: 'Active'
                })
                .where("id = :id", { id: user_id })
                .execute();
        } else {
           await this._patientRepo.createQueryBuilder()
                .update()
                .set({
                    socket_id: socket_id,
                    status: 'Active'
                })
                .where("id = :id", { id: user_id })
                .execute();
        }

    }

    async RemovesetSocketId(socket_id: string) {
        console.log(socket_id);

        const doctor = await this._doctorRepo.findOne({
            where: {
                socket_id: socket_id
            }
        })

        if(doctor){
            await this._doctorRepo.createQueryBuilder()
                 .update()
                 .set({
                     socket_id: null,
                     status: 'offline'
                 })
                 .where("id = :id", { id: doctor.id })
                 .execute();
            console.log("DOCTOR DISCONNECTED");
         }


        const patient = await this._patientRepo.findOne({
            where: {
                socket_id: socket_id
            }
        })

        if(patient){
           await this._patientRepo.createQueryBuilder()
                .update()
                .set({
                    socket_id: null,
                    status: 'offline'
                })
                .where("id = :id", { id: patient.id })
                .execute();
                console.log("PATIENT DISCONNECTED");
        }

    }


}

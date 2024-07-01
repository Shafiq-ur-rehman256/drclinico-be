import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from 'src/entities/patients.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { ResponseService } from 'src/shared/services/response/response.service';
import { IsNull, Repository } from 'typeorm';
import { AuthenticatePatientDto, PatientSignUpDto, PatientVerificationDto, SerializePatient } from './patient.dto';
import { Request } from 'express';
import * as rsg from 'randomstring';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(Patients) private _patientRepo: Repository<Patients>,
        @Inject('RES-SERVICE') private _res: ResponseService,
        @Inject('JWT-SERVICE') private _jwt: JwtService,
        @Inject('MAILER-SERVICE') private _mailer: MailService,
    ){}

    async patientSignUp(body: PatientSignUpDto, req: Request){
        try {
            
            const { full_name, email, cnic, password, phone_number } = body;

            const findOne = await this._patientRepo.findOne({
                where: {
                    email: email
                }
            })

            if (findOne) {
                throw new HttpException("Patient already created with this email", HttpStatus.BAD_REQUEST)
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            // generate OTP
            const otpCode = rsg.generate({
                length: 5
            })

            // set otp expiry
            const otpExpiry: any = new Date();
            otpExpiry.setSeconds(otpExpiry.getSeconds() + 300); // Set expiration time 5 minutes from now

            // send otp to doctor
            await this._mailer.sendOtpToPatient({ to: email , otp_code: otpCode});

            const patient = this._patientRepo.create({
                full_name,
                email,
                cnic,
                password: hashPassword,
                phone_number,
                otp_code: otpCode,
                otp_expiry: otpExpiry

            })

            await this._patientRepo.save(patient);

            return this._res.generateRes(HttpStatus.OK, [], "Sign up sucessfull", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async patientOtpVerification(body: PatientVerificationDto, req: Request){
        try {
            
            const { email } = body;

            const findOne = await this._patientRepo.findOne({
                where: {
                    email: email
                }
            })

            console.log(findOne);
            if(!findOne){
                throw new HttpException("Invalid email provided!", HttpStatus.BAD_REQUEST);
            }

            const { otp_code, otp_expiry } = findOne;

            if( otp_code != body.otp_code || new Date(otp_expiry) < new Date()){
                throw new HttpException("OTP expired or invalid otp provided!", HttpStatus.BAD_REQUEST)
            }

            await this._patientRepo.createQueryBuilder()
            .update()
            .set({
                email_verified: true
            })
            .where("id =:id", {id: findOne.id})
            .execute()
            
            return this._res.generateRes(HttpStatus.OK, [], "OTP VERIFIED", req);

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

    async authenticatePatient(body: AuthenticatePatientDto, req: Request){
        try {
            console.log("body.email");
            const { email, password } = body;

            // console.log("===============",email);

            const findOne = await this._patientRepo.findOne({
                where: {
                    email: email,
                    email_verified: true,
                    deleted_at: IsNull()
                }
            })
            // console.log(findOne);
            if (!findOne) {
                throw new HttpException("Invalid email provided!", HttpStatus.BAD_REQUEST)
            }

            const { password:EncryptedPass } = findOne;

            // match password
            const isMatch = await bcrypt.compare(password, EncryptedPass);
            if(!isMatch){
                throw new HttpException("Invalid email or password!", HttpStatus.BAD_REQUEST)
            }

            // create auth token
            const payload = {
                id: findOne.id,
                email: findOne.email
            }
            const token = await this._jwt.generateToken(payload);

            await this._patientRepo.createQueryBuilder()
            .update()
            .set({
                auth_token: token
            })
            .where("id = :id", {id: findOne.id})
            .execute()
            
            const serializeDoctor = new SerializePatient(findOne)

            const data = {
                ...serializeDoctor,
                auth_token: token
            }

            console.log(data);

            return this._res.generateRes(HttpStatus.OK, data, "Patient authenticate sucessfully!", req)

        } catch (error) {
            return this._res.generateErr(error, req);
        }
    }

}

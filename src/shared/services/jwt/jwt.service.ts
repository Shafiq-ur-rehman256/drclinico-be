import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {

    async generateToken(payload: any){

        const decodedToken = jwt.sign(payload, process.env.APP_JWT_SECRET, {expiresIn: '1d'})
        return  decodedToken;

    }

}

import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {

    async generateToken(payload: any){
        const encodedToken = jwt.sign(payload, process.env.APP_JWT_SECRET, {expiresIn: '1d'})
        return  encodedToken;
    }

    async decodeToken(token: string):Promise<any>{

        const decodedToken = jwt.verify(token, process.env.APP_JWT_SECRET);
        return decodedToken;

    }

}

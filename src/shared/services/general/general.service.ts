import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GeneralService {

    constructor(){}

    messageSource = new BehaviorSubject('');
    objectSource = new BehaviorSubject('{}');
  
    currentMsg = this.messageSource.asObservable();
    currentObj = this.objectSource.asObservable();
  
    changMsg(msg: string) {
      this.messageSource.next(msg);
    }
  
    changObj(obj: any) {
      let OBJ = JSON.stringify(obj)
      this.objectSource.next(OBJ);
    }


}

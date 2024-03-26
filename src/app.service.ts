import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth(): any {

    const data = {
      code: 1,
      msg: "Api working fine!",
      data: null
    }

    return data
  }
}

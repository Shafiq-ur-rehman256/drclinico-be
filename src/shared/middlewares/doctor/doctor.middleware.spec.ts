import { DoctorMiddleware } from './doctor.middleware';

describe('DoctorMiddleware', () => {
  it('should be defined', () => {
    expect(new DoctorMiddleware()).toBeDefined();
  });
});

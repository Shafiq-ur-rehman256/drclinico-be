import { PatientMiddleware } from './patient.middleware';

describe('PatientMiddleware', () => {
  it('should be defined', () => {
    expect(new PatientMiddleware()).toBeDefined();
  });
});

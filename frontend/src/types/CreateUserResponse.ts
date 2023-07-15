import { Car } from "./Car";

export type CreateUserResponse = {
  firstName: string;
  lastName: string;
  email: string;
  license?: {
    number: string;
    images: Buffer[] | {}[];
  };
  dob: number;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  locale?: string;
  profilePicture?: Buffer;
  domain: [
    {
      name: string;
      domainID: string;
      startDate: number;
      endDate?: number;
      images?: Buffer;
    }
  ];
  car?: Car[];
};

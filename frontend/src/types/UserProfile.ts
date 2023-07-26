export type UserProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  license?: {
    number?: string;
    images?: Buffer[] | {}[];
  };
  dob?: number;
  phoneNumber?: string;
  locale?: string;
  profilePicture?: Buffer;
  domain?: [
    {
      name?: string;
      domainID?: string;
      startDate?: number;
      endDate?: number;
      images?: Buffer;
    }
  ];
};

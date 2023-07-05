export interface CurrentUserContextType {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  license?: {
    images?: [];
    number?: string;
  };
  phoneNumber?: string;
  sessionId?: string;
}

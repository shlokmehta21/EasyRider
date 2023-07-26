export interface userStorage {
  user: {
    firstName: string;
    lastName: string;
    sessionId: string | null;
    id: string | null;
  };
}

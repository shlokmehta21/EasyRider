import { createContext, useState } from "react";
import { CurrentUserContextType } from "../types/CurrentUserContextType";

interface UserProviderProps {
  children?: React.ReactNode;
  isLogged?: boolean;
  user?: CurrentUserContextType | null;
  setUser?: React.Dispatch<React.SetStateAction<CurrentUserContextType>>;
  setIsLogged?: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValues: CurrentUserContextType = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  license: {
    images: [],
    number: "",
  },
  phoneNumber: "",
  sessionId: "",
};

export const UserContext = createContext<UserProviderProps>({
  user: initialValues,
  isLogged: false,
  setUser: () => {},
  setIsLogged: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUserContextType>(initialValues);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLogged, setIsLogged }}>
      {children}
    </UserContext.Provider>
  );
};

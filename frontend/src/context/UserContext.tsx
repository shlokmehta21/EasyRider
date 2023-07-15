import { createContext, useEffect, useState } from "react";
import { CurrentUserContextType } from "../types/CurrentUserContextType";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProviderProps {
  children?: React.ReactNode;
  isLogged?: boolean;
  user?: CurrentUserContextType | null;
  setUser?: React.Dispatch<React.SetStateAction<CurrentUserContextType>>;
  setIsLogged?: React.Dispatch<React.SetStateAction<boolean>>;
  userSessionID?: string | null;
  setUserSessionID?: React.Dispatch<React.SetStateAction<string | null>>;
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
  userSessionID: "",
  isLogged: false,
  setUser: () => {},
  setIsLogged: () => {},
  setUserSessionID: () => {},
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUserContextType>(initialValues);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [userSessionID, setUserSessionID] = useState<string | null>(null);

  const getSessionID = async (): Promise<string | null> => {
    try {
      const result = await AsyncStorage.getItem("userSession");
      if (result) {
        return result;
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  useEffect(() => {
    getSessionID().then((res) => {
      if (res) {
        setUserSessionID(res);
      }
    });
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLogged,
        setIsLogged,
        setUserSessionID,
        userSessionID,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

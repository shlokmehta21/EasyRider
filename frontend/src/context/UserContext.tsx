import { createContext, useEffect, useState } from "react";
import { CurrentUserContextType } from "../types/CurrentUserContextType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userStorage } from "../types/UserStorage";

interface UserProviderProps {
  children?: React.ReactNode;
  isLogged?: boolean;
  user?: CurrentUserContextType | null;
  setUser?: React.Dispatch<React.SetStateAction<CurrentUserContextType>>;
  setIsLogged?: React.Dispatch<React.SetStateAction<boolean>>;
  userStorage?: userStorage | null;
  setUserStorage?: React.Dispatch<React.SetStateAction<userStorage | null>>;
  getUserStorageData?: () => Promise<userStorage | null>;
}

const initialValues: CurrentUserContextType = {
  firstName: "",
  lastName: "",
  sessionId: "",
};

export const UserContext = createContext<UserProviderProps>({
  user: initialValues,
  userStorage: null,
  isLogged: false,
  setUser: () => {},
  setIsLogged: () => {},
  setUserStorage: () => {},
  getUserStorageData: () => Promise.resolve(null),
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<CurrentUserContextType>(initialValues);
  const [userStorage, setUserStorage] = useState<userStorage | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const getUserStorageData = async (): Promise<userStorage | null> => {
    try {
      const result = await AsyncStorage.getItem("user-storage");
      if (result) {
        return JSON.parse(result);
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  useEffect(() => {
    getUserStorageData().then((res) => {
      if (res) {
        setUserStorage(res);
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
        userStorage,
        setUserStorage,
        getUserStorageData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const StoreSettingsContext =
  createContext(null);

export const StoreSettingsProvider = ({
  children,
}) => {

  const [settings, setSettings] =
    useState(null);

  const fetchSettings = async () => {
    try {

      const res = await api.get(
        "/settings/configs"
      );

      setSettings(res.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        fetchSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  return useContext(
    StoreSettingsContext
  );
};
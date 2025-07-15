import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type AlertType = "success" | "error" | "info";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (
    type: AlertType,
    title: string,
    message: string,
    duration?: number
  ) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const addAlert = (
    type: AlertType,
    title: string,
    message: string,
    duration = 5000
  ) => {
    const id = uuidv4();
    setAlerts((prevAlerts) => [...prevAlerts, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState } from "react";
import { 
  initialClients, 
  initialApplications, 
  initialBookings, 
  initialEmails, 
  Client, 
  Application, 
  Booking, 
  Email 
} from "./MockData";

interface BrokerContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  emails: Email[];
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
  autoCompose: boolean;
  setAutoCompose: (val: boolean) => void;
  notifications: Array<{ type: string; message: string; time: string }>;
  setNotifications: React.Dispatch<React.SetStateAction<Array<{ type: string; message: string; time: string }>>>;
}

const BrokerContext = createContext<BrokerContextType | undefined>(undefined);

export function BrokerProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [autoCompose, setAutoCompose] = useState(false);
  const [notifications, setNotifications] = useState([
    { type: "Dossier Update", message: "Alice Smith uploaded corporate bank logs and income statement.", time: "10 mins ago" },
    { type: "Outstanding File", message: "Emma Wilson's construction file is missing certified builder insurance.", time: "1 hour ago" },
    { type: "Valuation Scheduled", message: "John Doe's property appraisal booking is locked for tomorrow.", time: "3 hours ago" }
  ]);

  return (
    <BrokerContext.Provider value={{
      clients,
      setClients,
      applications,
      setApplications,
      bookings,
      setBookings,
      emails,
      setEmails,
      autoCompose,
      setAutoCompose,
      notifications,
      setNotifications
    }}>
      {children}
    </BrokerContext.Provider>
  );
}

export function useBroker() {
  const context = useContext(BrokerContext);
  if (!context) {
    throw new Error("useBroker must be used within a BrokerProvider");
  }
  return context;
}

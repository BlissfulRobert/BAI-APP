"use client";

import React, { createContext, useContext, useState } from "react";
import { 
  initialClients, 
  initialBookings, 
  Client, 
  Booking 
} from "../broker/MockData";

import { 
  initialTransactions, 
  initialMessages, 
  Transaction, 
  ClientMessage 
} from "./MockClientData";

interface ClientContextType {
  client: Client;
  setClient: React.Dispatch<React.SetStateAction<Client>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  messages: ClientMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ClientMessage[]>>;
  notifications: Array<{ type: string; message: string; time: string }>;
  setNotifications: React.Dispatch<React.SetStateAction<Array<{ type: string; message: string; time: string }>>>;
  booking: Booking | null;
  setBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
  handleNewBooking: (dateStr: string, timeStr: string, typeStr: string, platformStr: string) => void;
  handleLogAction: (actionText: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client>(
    initialClients.find((c) => c.id === "c4") || initialClients[0]
  );
  
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);
  
  const [notifications, setNotifications] = useState([
    { type: "upload", message: "Emma Wilson uploaded certified UMID ID document.", time: "2 hours ago" },
    { type: "alert", message: "System alert: Bank Statement document uploaded is missing page 3.", time: "1 day ago" },
    { type: "system", message: "Welcome to BAI Finance Secure Client Hub! Your broker is Sarah Jenkins.", time: "3 days ago" }
  ]);

  const [booking, setBooking] = useState<Booking | null>(
    initialBookings.find((b) => b.clientId === "c4") || null
  );

  const handleNewBooking = (dateStr: string, timeStr: string, typeStr: string, platformStr: string) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      clientId: "c4",
      clientName: "Emma Wilson",
      date: dateStr,
      time: timeStr,
      type: typeStr,
      platform: platformStr
    };
    setBooking(newBooking);
  };

  const handleLogAction = (actionText: string) => {
    const newNotif = {
      type: "user",
      message: actionText,
      time: "Just Now"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <ClientContext.Provider value={{
      client,
      setClient,
      transactions,
      setTransactions,
      messages,
      setMessages,
      notifications,
      setNotifications,
      booking,
      setBooking,
      handleNewBooking,
      handleLogAction
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}

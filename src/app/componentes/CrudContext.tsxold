import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Item {
  id: number;
  title: string;
  description: string;
  // agrega más campos según tu modelo
}

interface CrudContextType {
  items: Item[];
  fetchItems: () => Promise<void>;
  createItem: (item: Omit<Item, "id">) => Promise<void>;
  updateItem: (id: number, item: Partial<Item>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

const CrudContext = createContext<CrudContextType | undefined>(undefined);

export const useCrud = () => {
  const context = useContext(CrudContext);
  if (!context) throw new Error("useCrud must be used within CrudProvider");
  return context;
};

export const CrudProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);

  // Cambia la URL al puerto correcto de tu backend Express
  const API_URL = "http://localhost:3000/productos";

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
  };

  const createItem = async (item: Omit<Item, "id">) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await fetchItems();
  };

  const updateItem = async (id: number, item: Partial<Item>) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    await fetchItems();
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <CrudContext.Provider value={{ items, fetchItems, createItem, updateItem, deleteItem }}>
      {children}
    </CrudContext.Provider>
  );
};

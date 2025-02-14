'use client';

import { createContext, useEffect, useMemo, useState } from 'react';

const LOCAL_STORAGE_KEY = 'history';

export interface SearchHistoryItem {
  id: string;
  query: string;
  scripts: AssetScript[];
  createdAt: Date;
}

interface HistoryContextValue {
  currentId?: string;
  histories: SearchHistoryItem[];
  onAdd: (item: SearchHistoryItem) => void;
  onRemove: (id: string) => void;
  onChangeCurrentId: (id: string) => void;
}

export const HistoryContext = createContext<HistoryContextValue>({
  histories: [],
  onAdd: () => {},
  onRemove: () => {},
  onChangeCurrentId: () => {},
});

export default function HistoryContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const [currentId, setCurrentId] = useState<string>();
  const [histories, setHistories] = useState<SearchHistoryItem[]>([]);

  // useEffect
  useEffect(() => {
    const prevHistory = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!prevHistory) {
      return;
    }

    setHistories(JSON.parse(prevHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(histories));
  }, [histories]);

  // handle
  const handleAdd = (item: SearchHistoryItem) => {
    setHistories((prev) => {
      const newHistories = prev.slice();

      newHistories.unshift(item);

      return newHistories;
    });
  };

  const handleRemove = (id: string) => {
    setHistories((prev) => {
      const newHistories = prev.slice();

      const index = newHistories.findIndex((history) => history.id === id);

      if (index >= 0) {
        newHistories.splice(index, 1);
      }

      return newHistories;
    });
  };

  const handleChangeCurrentId = (id: string) => {
    setCurrentId(id);
  };

  // memo
  const contextValue = useMemo(
    () => ({
      currentId,
      histories,
      onAdd: handleAdd,
      onRemove: handleRemove,
      onChangeCurrentId: handleChangeCurrentId,
    }),
    [currentId, histories],
  );

  return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
}

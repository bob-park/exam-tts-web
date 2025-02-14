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
  histories: SearchHistoryItem[];
  onAdd: (item: SearchHistoryItem) => void;
  onRemove: (id: string) => void;
}

export const HistoryContext = createContext<HistoryContextValue>({
  histories: [],
  onAdd: () => {},
  onRemove: () => {},
});

export default function HistoryContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
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

  // memo
  const contextValue = useMemo(
    () => ({
      histories,
      onAdd: handleAdd,
      onRemove: handleRemove,
    }),
    [histories],
  );

  return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>;
}

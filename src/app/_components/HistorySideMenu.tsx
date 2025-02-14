'use client';

import { useContext } from 'react';

import { HistoryContext } from '@/app/_components/HistoryContextProvider';

export default function HistorySideMenu() {
  // context
  const { histories } = useContext(HistoryContext);

  return (
    <div className="flex size-full select-none flex-col gap-2 overflow-auto rounded-2xl border bg-white p-6 shadow-xl">
      {/* title */}
      <h2 className="text-xl font-bold">기록</h2>

      {/* history */}
      <div className="mt-5"></div>
    </div>
  );
}

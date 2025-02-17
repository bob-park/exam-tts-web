'use client';

import { useContext, useEffect, useState } from 'react';

import { BsThreeDots } from 'react-icons/bs';

import cx from 'classnames';
import dayjs from 'dayjs';

import { HistoryContext, SearchHistoryItem } from './HistoryContextProvider';

interface DisplayHistory {
  today: SearchHistoryItem[];
  yesterday: SearchHistoryItem[];
  last7Day: SearchHistoryItem[];
  last30Day: SearchHistoryItem[];
}

const HistoryItem = ({
  history,
  active = false,
  onClick,
}: {
  history: SearchHistoryItem;
  active?: boolean;
  onClick?: (id: string) => void;
}) => {
  // handle
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(history.id);
  };

  return (
    <div
      className={cx(
        'flex w-full flex-row items-center justify-between gap-2 rounded-xl px-4 py-2 transition-all duration-150 hover:cursor-pointer hover:bg-base-200',
        {
          'bg-base-200': active,
        },
      )}
      onClick={handleClick}
    >
      <div className="w-48 flex-none font-medium">
        <p className="truncate text-left">{history.query}</p>
      </div>
      <div className="">
        <button className="btn btn-circle btn-ghost" type="button" onClick={(e) => e.stopPropagation()}>
          <BsThreeDots className="size-3" />
        </button>
      </div>
    </div>
  );
};

export default function HistorySideMenu() {
  // context
  const { histories, currentId, onChangeCurrentId } = useContext(HistoryContext);

  // state
  const [displayHistory, setDisplayHistory] = useState<DisplayHistory>({
    today: [],
    yesterday: [],
    last7Day: [],
    last30Day: [],
  });

  // useEffect
  useEffect(() => {
    const today = histories.filter((history) =>
      dayjs(history.createdAt).startOf('date').isSame(dayjs().startOf('date')),
    );

    const yesterday = histories.filter((history) =>
      dayjs(history.createdAt).startOf('date').isSame(dayjs().add(-1, 'day').startOf('date')),
    );

    const last7Day = histories.filter(
      (history) =>
        dayjs(history.createdAt).startOf('date').isBefore(dayjs().add(-1, 'day').startOf('date')) &&
        dayjs(history.createdAt).startOf('date').isAfter(dayjs().add(-1, 'month').startOf('date')),
    );

    const last30Day = histories.filter((history) =>
      dayjs(history.createdAt).startOf('date').isBefore(dayjs().add(-1, 'month').startOf('date')),
    );

    setDisplayHistory({ today, yesterday, last7Day, last30Day });
  }, [histories]);

  // handle
  const handleClick = (id: string) => {
    onChangeCurrentId(id);
  };

  return (
    <div className="flex size-full select-none flex-col gap-2 overflow-auto rounded-2xl border bg-white p-6 shadow-xl">
      {/* title */}
      <h2 className="text-xl font-bold">기록</h2>

      {/* history */}
      <div className="mt-5 size-full overflow-auto">
        <div className="flex w-full flex-col items-start gap-10">
          {/* today */}
          <div className="flex w-full flex-col items-start gap-2">
            <h4 className="text-sm font-semibold text-gray-400">오늘</h4>
            <div className="flex w-full flex-col gap-2">
              {displayHistory.today.map((item) => (
                <HistoryItem
                  key={`today-history-item-${item.id}`}
                  history={item}
                  active={item.id === currentId}
                  onClick={handleClick}
                />
              ))}
            </div>
          </div>

          {/* yesterday */}
          <div
            className={cx(
              'flex w-full flex-col items-start gap-2',
              displayHistory.yesterday.length > 0 ? 'visible' : 'hidden',
            )}
          >
            <h4 className="w-full text-sm font-semibold text-gray-400">어제</h4>
            <div className="flex w-full flex-col gap-2">
              {displayHistory.yesterday.map((item) => (
                <HistoryItem
                  key={`yesterday-history-item-${item.id}`}
                  history={item}
                  active={item.id === currentId}
                  onClick={handleClick}
                />
              ))}
            </div>
          </div>

          {/* prev 7 days */}
          <div
            className={cx(
              'flex w-full flex-col items-start gap-2',
              displayHistory.last7Day.length > 0 ? 'visible' : 'hidden',
            )}
          >
            <h4 className="w-full text-sm font-semibold text-gray-400">지난 7일</h4>
            <div className="flex w-full flex-col gap-2">
              {displayHistory.last7Day.map((item) => (
                <HistoryItem
                  key={`last7day-history-item-${item.id}`}
                  history={item}
                  active={item.id === currentId}
                  onClick={handleClick}
                />
              ))}
            </div>
          </div>

          {/* prev 30 days */}
          <div
            className={cx(
              'flex w-full flex-col items-start gap-2',
              displayHistory.last30Day.length > 0 ? 'visible' : 'hidden',
            )}
          >
            <h4 className="w-full text-sm font-semibold text-gray-400">지난 30일</h4>
            <div className="flex w-full flex-col gap-2">
              {displayHistory.last30Day.map((item) => (
                <HistoryItem
                  key={`last30day-history-item-${item.id}`}
                  history={item}
                  active={item.id === currentId}
                  onClick={handleClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

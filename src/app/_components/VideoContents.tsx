'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { HistoryContext } from '@/app/_components/HistoryContextProvider';

import { frameToSec, toTimeCode } from '@/utils/timecode';

import cx from 'classnames';

const DEFAULT_FPS = 29.97;

const AssetScriptItem = ({
  item,
  active = false,
  onClick,
}: {
  item: AssetScript;
  active?: boolean;
  onClick?: (id: number) => void;
}) => {
  // handle
  const handleClick = () => {
    onClick && onClick(item.id);
  };

  return (
    <div
      className={cx(
        'flex w-full flex-row items-center justify-center gap-2 rounded-xl px-4 py-4 transition-all duration-150 hover:cursor-pointer hover:bg-base-200',
        {
          'bg-base-200': active,
        },
      )}
      onClick={handleClick}
    >
      <div className="w-full">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="w-full">
            <p className="">{item.contents}</p>
          </div>
          <div className="w-full">
            <span className="">{toTimeCode(frameToSec(DEFAULT_FPS, item.inPoint))}</span>
            <span className=""> - </span>
            <span className="">{toTimeCode(frameToSec(DEFAULT_FPS, item.outPoint))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VideoContents() {
  // ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // context
  const { currentId, histories } = useContext(HistoryContext);

  // state
  const [currentScriptId, setCurrentScriptId] = useState<number>();

  const current = histories.find((item) => item.id === currentId);

  // useEffect
  useEffect(() => {
    if (!current || !currentScriptId || !videoRef.current) {
      return;
    }

    const { scripts } = current;

    const selectedScript = scripts.find((script) => script.id === currentScriptId);

    if (!selectedScript) {
      return;
    }

    videoRef.current.currentTime = frameToSec(DEFAULT_FPS, selectedScript.inPoint);

    videoRef.current.play();
  }, [current, currentScriptId]);

  // handle
  const handleScriptClick = (id: number) => {
    setCurrentScriptId(id);
  };

  if (!current) {
    return;
  }

  return (
    <div className="flex size-full flex-row items-center justify-center gap-6">
      {/* video */}
      <div className="card p-2 shadow-xl">
        <div className="card-body">
          <video
            className="max-h-[600px] min-h-[300px] min-w-[400px] max-w-[800px]"
            ref={videoRef}
            src={`/api/assets/${1}/resource`}
            controls
          />
        </div>
      </div>

      <div className="size-full h-[540px] w-96 rounded-2xl p-4 shadow-xl">
        <div className="flex size-full flex-none flex-col items-center gap-3 overflow-auto">
          {current &&
            current.scripts.map((script) => (
              <AssetScriptItem
                key={`asset-script-item-${script.id}`}
                item={script}
                active={script.id === currentScriptId}
                onClick={handleScriptClick}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

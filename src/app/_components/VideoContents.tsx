'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { HistoryContext } from '@/app/_components/HistoryContextProvider';

import { useAsset } from '@/domain/asset/query/asset';

import { frameToSec, toTimeCode } from '@/utils/timecode';

import cx from 'classnames';

const DEFAULT_FPS = 29.97;
const VIDEO_ID = 'tts_video_id';

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
  // context
  const { currentId, histories } = useContext(HistoryContext);

  // state
  const [currentScriptId, setCurrentScriptId] = useState<number>();
  const [totalVideoSeconds, setTotalVideoSeconds] = useState<number>(0);
  const [currentVideoSeconds, setCurrentVideoSeconds] = useState<number>(0);

  const current = histories.find((item) => item.id === currentId);
  const currentScript = current?.scripts.find((script) => script.id === currentScriptId);

  // query
  const { asset } = useAsset(currentScript?.assetId);

  // useEffect
  useEffect(() => {
    const video = document.getElementById(VIDEO_ID) as HTMLVideoElement;

    if (!currentScript || !video) {
      return;
    }

    video.currentTime = frameToSec(DEFAULT_FPS, currentScript.inPoint);

    video.play();

    const interval = setInterval(() => {
      if (video.currentTime > frameToSec(DEFAULT_FPS, currentScript.outPoint)) {
        video.pause();
      }
    }, 10);

    return () => {
      interval && clearInterval(interval);
    };
  }, [currentScript, asset]);

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
      {asset && (
        <div className="card p-2 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{asset.title}</h2>
            <video
              id={VIDEO_ID}
              className="max-h-[600px] min-h-[300px] min-w-[400px] max-w-[800px]"
              src={`/api/assets/${asset.id}/resource`}
              onTimeUpdate={(e) => setCurrentVideoSeconds(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setTotalVideoSeconds(e.currentTarget.duration)}
            />
            <div className="text-center">
              <span className="font-semibold">{toTimeCode(currentVideoSeconds)}</span>
              <span className=""> / </span>
              <span className="">{currentScript && toTimeCode(frameToSec(DEFAULT_FPS, currentScript.outPoint))}</span>
            </div>
          </div>
        </div>
      )}

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

'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import { MdReplay } from 'react-icons/md';

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

interface VideoClipProps {
  assetId: number;
  startTime: number;
  endTime: number;
}

const VideoClip = ({ assetId, startTime, endTime }: VideoClipProps) => {
  // useRef
  const videoRef = useRef<HTMLVideoElement>(null);

  // state
  const [currentVideoSeconds, setCurrentVideoSeconds] = useState<number>(0);

  // query
  const { asset } = useAsset(assetId);

  // useEffect
  useEffect(() => {
    videoRef.current = document.getElementById(VIDEO_ID) as HTMLVideoElement;

    videoRef.current.currentTime = startTime;

    videoRef.current.play();

    const interval = setInterval(() => {
      if (!videoRef.current) {
        return;
      }

      if (videoRef.current.currentTime > endTime) {
        videoRef.current.pause();
      }
    }, 10);

    return () => {
      interval && clearInterval(interval);
    };
  }, [asset, startTime, endTime]);

  // handle
  const handleReplayClick = () => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime = startTime;

    videoRef.current.play();
  };

  return (
    <div className="card p-2 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{asset?.title}</h2>
        <div className="relative size-full">
          <video
            id={VIDEO_ID}
            className="size-full"
            src={`/api/assets/${assetId}/resource`}
            onTimeUpdate={(e) => setCurrentVideoSeconds(e.currentTarget.currentTime)}
          />
          <div
            className={cx(
              'absolute left-0 top-0 z-50 flex size-full items-center justify-center gap-2 bg-gray-600 bg-opacity-80 p-2 transition-all duration-300',
              currentVideoSeconds > endTime ? 'opacity-100' : 'invisible opacity-0',
            )}
          >
            <div
              className="flex size-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-full p-8 text-white transition-all duration-150 hover:bg-black"
              onClick={handleReplayClick}
            >
              <MdReplay className="size-24" />
              <span className="font-bold">REPLAY</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="font-semibold">{toTimeCode(currentVideoSeconds)}</span>
          <span className=""> / </span>
          <span className="">{toTimeCode(endTime)}</span>
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

  const current = histories.find((item) => item.id === currentId);
  const currentScript = current?.scripts.find((script) => script.id === currentScriptId);

  // handle
  const handleScriptClick = (id: number) => {
    setCurrentScriptId(id);
  };

  if (!current) {
    return null;
  }

  return (
    <div className="flex size-full flex-row items-center justify-center gap-6">
      {/* video */}
      {currentScript && (
        <div className="h-[524px] w-[750px]">
          <VideoClip
            assetId={currentScript.assetId}
            startTime={frameToSec(DEFAULT_FPS, currentScript?.inPoint || 0)}
            endTime={frameToSec(DEFAULT_FPS, currentScript?.outPoint || 0)}
          />
        </div>
      )}

      <div className="size-full h-[524px] w-96 rounded-2xl p-4 shadow-xl">
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

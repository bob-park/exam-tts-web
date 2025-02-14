'use client';

import { useContext, useEffect, useState } from 'react';

import { BsLightbulb, BsSoundwave } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { TbWorldWww } from 'react-icons/tb';

import { HistoryContext } from '@/app/_components/HistoryContextProvider';

import { useAssetScriptTTS } from '@/domain/asset/query/assetScript';

import { v4 as uuid } from 'uuid';

export default function SearchQueryInput() {
  // state
  const [value, setValue] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  // context
  const { onAdd, onChangeCurrentId } = useContext(HistoryContext);

  // query
  const { textToSql, isLoading } = useAssetScriptTTS((result) => {
    const currentId = uuid().toString();

    onAdd({
      id: currentId,
      query: query,
      scripts: result,
      createdAt: new Date(),
    });

    onChangeCurrentId(currentId);
  });

  // useEffect
  useEffect(() => {
    query && textToSql(query);
  }, [query]);

  // handle
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setQuery(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="card size-full bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="relative flex flex-row items-center justify-center gap-4">
            <input
              className="input w-full"
              type="text"
              placeholder="찾고 싶으면 쓰세요"
              onChange={handleChange}
              value={value}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-0 mt-1 pr-4">
                <span className="loading loading-bars loading-sm"></span>
              </div>
            )}
          </div>
        </form>

        <div className="card-actions">
          <div className="flex w-full flex-row items-center justify-between gap-4">
            <div className="flex flex-row gap-2">
              <button className="btn btn-circle btn-outline">
                <FaPlus className="size-5" />
              </button>

              <button className="btn btn-outline rounded-full">
                <TbWorldWww className="inline-block size-5" />
                검색
              </button>

              <button className="btn btn-outline rounded-full">
                <BsLightbulb className="inline-block size-5" />
                이성
              </button>
            </div>
            <div className="">
              <button className="btn btn-circle btn-neutral">
                <BsSoundwave className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

import { BsLightbulb, BsSoundwave } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { TbWorldWww } from 'react-icons/tb';

export default function SearchQueryInput() {
  // state
  const [query, setQuery] = useState<string>('');

  // handle
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="card size-full bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-center justify-center gap-4">
            <input
              className="input w-full"
              type="text"
              placeholder="찾고 싶으면 쓰세요"
              onChange={handleChangeQuery}
              value={query}
            />
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

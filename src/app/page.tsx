import HistoryContextProvider from './_components/HistoryContextProvider';
import HistorySideMenu from './_components/HistorySideMenu';
import SearchQueryInput from './_components/SearchQueryInput';
import VideoContents from './_components/VideoContents';

export default function Home() {
  return (
    <div className="flex w-full flex-row items-start gap-5">
      <HistoryContextProvider>
        {/* side menu */}
        <div className="sticky top-[130px] h-[calc(100vh-180px)] w-80 flex-none">
          <HistorySideMenu />
        </div>

        {/* contents */}
        <div className="w-full">
          <div className="flex size-full flex-col items-center justify-center gap-5">
            {/* search input */}
            <div className="sticky top-[130px] z-10 w-full max-w-[650px]">
              <SearchQueryInput />
            </div>

            {/* video contents */}
            <div className="w-full">
              <VideoContents />
            </div>
          </div>
        </div>
      </HistoryContextProvider>
    </div>
  );
}

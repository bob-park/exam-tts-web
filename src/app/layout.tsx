import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Headers from '@/app/_components/Headers';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

import RQProvider from './_components/RQProvider';
import './globals.css';

const { WEB_SERVICE_HOST } = process.env;

export const metadata: Metadata = {
  title: 'Text To SQL EXAMPLE',
  description: '헤헤 다 뒈졋다',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const queryClient = new QueryClient();

  const result = await fetch(`${WEB_SERVICE_HOST}/users/me`, {
    method: 'get',
    headers: {
      Cookie: `JSESSIONID=${cookieStore.get('JSESSIONID')?.value || ''}`,
    },
    credentials: 'include',
  });

  if (!result.ok) {
    redirect('/api/oauth2/authorization/keyflow-auth');
  }

  const user = (await result.json()) as User;
  queryClient.setQueryData(['user', 'me'], user);

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      {process.env.NODE_ENV !== 'production' && (
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      )}
      <body className="relative h-full min-w-max">
        <RQProvider>
          <HydrationBoundary state={dehydratedState}>
            {/* headers */}
            <div className="sticky left-0 top-1 z-50 flex w-full flex-row items-start justify-center px-5">
              <Headers />
            </div>

            {/* content */}
            <div className="mx-3 my-4 p-3">{children}</div>
          </HydrationBoundary>
        </RQProvider>
      </body>
    </html>
  );
}

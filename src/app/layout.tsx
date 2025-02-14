import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

  try {
    const res = await fetch(`${WEB_SERVICE_HOST}/users/me`, {
      method: 'get',
      headers: {
        Cookie: `JSESSIONID=${cookieStore.get('JSESSIONID')?.value || ''}`,
      },
      credentials: 'include',
    });

    const user = (await res.json()) as User;

    queryClient.setQueryData<User>(['user', 'me'], user);
  } catch (err) {
    console.error(err);
    redirect('/api/oauth2/authorization/keyflow-auth');
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      {process.env.NODE_ENV !== 'production' && (
        <head>
          <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      )}
      <body className="relative min-w-max">
        <RQProvider>
          <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
        </RQProvider>
      </body>
    </html>
  );
}

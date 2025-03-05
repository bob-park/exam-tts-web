import NextAuth, { AuthOptions } from 'next-auth';
import { OAuthConfig } from 'next-auth/providers/oauth';

interface UserInfo {
  sub: string;
  profile: {
    role: string;
    userId: string;
    uniqueId: string;
    username: string;
  };
}

const keyflowAuth: OAuthConfig<UserInfo> = {
  id: 'keyflow-auth',
  name: 'KeyFlow Auth',
  type: 'oauth',
  wellKnown: 'http://192.168.20.10:10000/.well-known/openid-configuration',
  authorization: { params: { scope: 'openid profile' } },
  userinfo: 'http://192.168.20.10:10000/userinfo',
  clientId: '2025-dfde543d-6649-47cb-aa86-75bb56bccbfb',
  clientSecret: 'VD5du6zZ5457N340tjY0',
  idToken: true,
  profile(profile: UserInfo) {
    return {
      id: profile.sub,
      name: profile.profile?.username,
    };
  },
};

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [keyflowAuth],
  callbacks: {
    async session({ session, user, token }) {
      console.log(token);

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (profile) {
        token.user = profile;
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

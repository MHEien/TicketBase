import NextAuth from "next-auth"
import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Configure API URL based on environment
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith("/(admin)")
      
      if (isAdminRoute) {
        if (isLoggedIn) return true
        return false
      }
      
      return true
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.role = user.role
        token.permissions = user.permissions
        token.expiresAt = user.expiresAt
      }
      
      // Return previous token if the access token has not expired yet
      const now = Math.floor(Date.now() / 1000)
      if (token.expiresAt && typeof token.expiresAt === 'number' && now < token.expiresAt) {
        return token
      }
      
      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          const response = await fetch(`${apiBaseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })
          
          if (!response.ok) {
            console.error("Authentication failed:", await response.text())
            return null
          }
          
          const data = await response.json()
          
          const user = {
            id: data.id || data.sub,
            name: data.name,
            email: data.email,
            role: data.role,
            permissions: data.permissions || [],
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + (data.expiresIn || 900),
          }
          
          return user
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
}

/**
 * Refreshes the access token using the refresh token
 */
async function refreshAccessToken(token: any) {
  try {
    console.log('Refreshing token, API URL:', apiBaseUrl);
    
    // Make sure we have a refresh token
    if (!token.refreshToken) {
      console.error('No refresh token available');
      return {
        ...token,
        error: 'NoRefreshToken',
      };
    }
    
    const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // The backend might be expecting Authorization header with the refresh token
        'Authorization': `Bearer ${token.refreshToken}`, 
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
      // Add credentials to ensure cookies are sent if they're being used
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to refresh token: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
    }

    const refreshedTokens = await response.json();
    console.log('Token refreshed successfully');

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + (refreshedTokens.expiresIn || 900),
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    
    // The error property will be used client-side to handle the refresh token error
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig) 
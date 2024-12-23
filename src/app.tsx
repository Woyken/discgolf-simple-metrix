import {
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from '@kobalte/core';
import { Router } from '@solidjs/router';
import { clientOnly } from '@solidjs/start';
import { FileRoutes } from '@solidjs/start/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { Suspense } from 'solid-js';
import { isServer } from 'solid-js/web';
import { getCookie } from 'vinxi/http';
import { NavHandleLogin } from './components/nav_renameme.tsx';
import { Toaster } from './components/ui/toast_renameme.tsx';

import './app.css';

const ReloadPrompt = clientOnly(() =>
  import('./components/reloadPrompt_renameme.tsx').then((x) => ({
    default: x.ReloadPrompt,
  })),
);

// type UserAuth =
//   | { state: "logged-in"; token: string; expiresAt: number }
//   | { state: "logged-out" };

// const userTokenCtx = createContext<Signal<UserAuth>>();

// export function useLoggedInUser() {
//   const token = useCurrentUser();
//   const t = createMemo(() => {
//     const tok = token.auth;
//     if (tok.state !== "logged-in")
//       throw new Error("User not logged in while rendering component");
//     return tok;
//   });

//   return {
//     get auth() {
//       return t();
//     },
//     logout: () => token.logout(),
//   };
// }

// export function useCurrentUser() {
//   const tokenSignal = useContext(userTokenCtx);
//   if (!tokenSignal) throw new Error("forgot to add userTokenCtx.Provider");
//   const [auth, setAuth] = tokenSignal;
//   return {
//     get auth() {
//       return auth();
//     },
//     setToken: (token: { token: string; expiresAt: number }) =>
//       setAuth(() => ({
//         state: "logged-in",
//         token: token.token,
//         expiresAt: token.expiresAt,
//       })),
//     logout: () => setAuth(() => ({ state: "logged-out" })),
//   };
// }

// function getStoredUserToken() {
//   const userTokenStr =
//     typeof window !== "undefined"
//       ? window.localStorage.getItem("userToken")
//       : null;
//   if (!userTokenStr) return undefined;
//   const userToken = JSON.parse(userTokenStr) as {
//     token: string;
//     expiresAt: number;
//   };

//   return userToken;
// }

// function getInitUserToken(): UserAuth {
//   const stored = getStoredUserToken();
//   if (stored)
//     return {
//       ...stored,
//       state: "logged-in",
//     };
//   return {
//     state: "logged-out",
//   };
// }

// const initialState = { state: "logged-out" } as const;
// function UserTokenProvider(props: ParentProps) {
//   const tokenSignal = createSignal<UserAuth>(initialState);
//   createEffect(() => {
//     const currentToken = tokenSignal[0]();
//     if (currentToken === initialState)
//       return tokenSignal[1](getInitUserToken());
//     if (currentToken.state !== "logged-in")
//       return localStorage.removeItem("userToken");

//     return localStorage.setItem(
//       "userToken",
//       JSON.stringify({
//         token: currentToken.token,
//         expiresAt: currentToken.expiresAt,
//       })
//     );
//   });
//   return (
//     <userTokenCtx.Provider value={tokenSignal}>
//       {props.children}
//     </userTokenCtx.Provider>
//   );
// }

function getServerCookies() {
  'use server';
  const colorMode = getCookie('kb-color-mode');
  return colorMode ? `kb-color-mode=${colorMode}` : '';
}

// biome-ignore lint/style/noDefaultExport: Required by framework
export default function App() {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );
  return (
    <Router
      root={(props) => (
        <>
          <QueryClientProvider
            client={
              new QueryClient({
                defaultOptions: {
                  queries: {
                    // biome-ignore lint/style/useNamingConvention: that's the API
                    experimental_prefetchInRender: true,
                    staleTime: 5 * 60 * 1000,
                    gcTime: 2 * 24 * 60 * 60 * 1000,
                  },
                },
              })
            }
          >
            <ColorModeScript storageType={storageManager.type} />
            <ColorModeProvider storageManager={storageManager}>
              <ReloadPrompt />
              <Toaster />
              <NavHandleLogin />
              {/* <UserTokenProvider> */}
              <Suspense fallback={<div>ROUTER FALLBACK</div>}>
                {props.children}
              </Suspense>
              {/* </UserTokenProvider> */}
            </ColorModeProvider>
          </QueryClientProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

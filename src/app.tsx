import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  ParentProps,
  Signal,
  Suspense,
  useContext,
} from "solid-js";
import Nav from "~/components/nav";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import "./app.css";

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

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Nav />
          <QueryClientProvider client={new QueryClient()}>
            {/* <UserTokenProvider> */}
            <Suspense fallback={<div>ROUTER FALLBACK</div>}>
              {props.children}
            </Suspense>
            {/* </UserTokenProvider> */}
          </QueryClientProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

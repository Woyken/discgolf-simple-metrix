/// <reference types="@solidjs/start/env" />

declare module 'virtual:pwa-register/solid' {
  import type { Accessor, Setter } from 'solid-js';
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export type { RegisterSWOptions };

  export function useRegisterSw(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>];
    offlineReady: [Accessor<boolean>, Setter<boolean>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

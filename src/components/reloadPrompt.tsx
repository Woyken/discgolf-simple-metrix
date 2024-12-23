import { useRegisterSW } from 'virtual:pwa-register/solid';
import { toaster } from '@kobalte/core/toast';
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { getLogger } from '~/lib/logger';
import { Button } from './ui/button.tsx';
import { Toast } from './ui/toast';

export const ReloadPrompt: Component = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      getLogger().log('SW Registered: ', r);
    },
    onRegisterError(error) {
      getLogger().log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <Show when={offlineReady() || needRefresh()}>
      {(_) => {
        toaster.show((data) => (
          <Toast toastId={data.toastId} variant="success" duration={5000}>
            <div class="mb-0">
              <Show
                fallback={
                  <span>
                    New content available, click on reload button to update.
                  </span>
                }
                when={offlineReady()}
              >
                <span>App ready to work offline2</span>
              </Show>
            </div>
            <Show when={needRefresh()}>
              <Button onClick={() => updateServiceWorker(true)}>Reload</Button>
            </Show>
            <Button onClick={() => close()}>Close</Button>
          </Toast>
        ));

        return <></>;
      }}
    </Show>
  );
};

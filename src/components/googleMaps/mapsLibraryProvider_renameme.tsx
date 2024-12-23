import {
  type ParentProps,
  Show,
  createContext,
  createResource,
  useContext,
} from 'solid-js';
import { useGoogleMapsLoader } from './loaderProvider_renameme.tsx';

const ctx = createContext<{
  mapsLibrary: NonNullable<
    ReturnType<ReturnType<typeof createResourceToGetMapsLibrary>>
  >;
}>();

export function useGoogleMapsMapsLibrary() {
  const value = useContext(ctx);
  if (!value) throw new Error('Missing GoogleMapsMapsLibraryProvider');
  return value;
}

function createResourceToGetMapsLibrary() {
  const x = useGoogleMapsLoader();
  const [mapsLibrary] = createResource(() => x.loader.importLibrary('maps'));
  return mapsLibrary;
}

export function GoogleMapsMapsLibraryProvider(props: ParentProps) {
  const mapsLibrary = createResourceToGetMapsLibrary();

  return (
    <Show when={mapsLibrary()}>
      {(mapsLibrary) => (
        <ctx.Provider
          value={{
            get mapsLibrary() {
              return mapsLibrary();
            },
          }}
        >
          {props.children}
        </ctx.Provider>
      )}
    </Show>
  );
}

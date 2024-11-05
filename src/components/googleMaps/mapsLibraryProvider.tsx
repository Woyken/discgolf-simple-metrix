import {
  createContext,
  createResource,
  ParentProps,
  Show,
  useContext,
} from "solid-js";
import { useGoogleMapsLoader } from "./loaderProvider";

const ctx = createContext<{ mapsLibrary: google.maps.MapsLibrary }>();

export function useGoogleMapsMapsLibrary() {
  const value = useContext(ctx);
  if (!value) throw new Error("Missing GoogleMapsMapsLibraryProvider");
  return value;
}

export function GoogleMapsMapsLibraryProvider(props: ParentProps) {
  const x = useGoogleMapsLoader();
  const [mapsLibrary] = createResource(() => x.loader.importLibrary("maps"));

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

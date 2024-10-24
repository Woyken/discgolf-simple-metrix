import {
  createContext,
  createMemo,
  onCleanup,
  ParentProps,
  useContext,
} from "solid-js";
import { Loader } from "@googlemaps/js-api-loader";

const ctx = createContext<{ loader: Loader }>();

export function useGoogleMapsLoader() {
  const value = useContext(ctx);
  if (!value) throw new Error("Missing GoogleMapsLoaderProvider");
  return value;
}

export function GoogleMapsLoaderProvider(
  props: ParentProps<{ apiKey: string }>
) {
  const loader = createMemo(
    () =>
      new Loader({
        apiKey: props.apiKey,
        version: "weekly",
      })
  );
  onCleanup(() => loader().deleteScript());

  return (
    <ctx.Provider
      value={{
        get loader() {
          return loader();
        },
      }}
    >
      {props.children}
    </ctx.Provider>
  );
}

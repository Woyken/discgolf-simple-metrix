import type { Accessor } from "solid-js";
import { createMemo, createSignal, onCleanup } from "solid-js";

const geolocationDefaults: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: Number.POSITIVE_INFINITY,
};

export const createGeolocation = (options: Accessor<PositionOptions>) => {
  const [location, setLocation] = createSignal<GeolocationPosition>();
  const [error, setError] = createSignal<GeolocationPositionError>();

  const getCurrentLocation = () => {
    const opt = Object.assign(geolocationDefaults, options());
    navigator.geolocation.getCurrentPosition(
      (e) => {
        setLocation(e);
        setError();
      },
      (e) => {
        setLocation();
        setError(e);
      },
      opt
    );
  };

  getCurrentLocation();

  createMemo(() => {
    if (!location()) return;
    const opt = Object.assign(geolocationDefaults, options());
    const watch = navigator.geolocation.watchPosition(
      setLocation,
      setError,
      opt
    );
    onCleanup(() => navigator.geolocation.clearWatch(watch));
  });

  return [location, error, () => getCurrentLocation()] as const;
};

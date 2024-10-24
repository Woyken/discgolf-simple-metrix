import { GoogleMapsLoaderProvider } from "./googleMaps/loaderProvider";
import { GoogleMapsMapsLibraryProvider } from "./googleMaps/mapsLibraryProvider";
import { GoogleMapsRender } from "./googleMaps/render";

export default function RenderCourseMap(props: { apiKey: string }) {
  return (
    <GoogleMapsLoaderProvider apiKey={props.apiKey}>
      <GoogleMapsMapsLibraryProvider>
        <GoogleMapsRender />
      </GoogleMapsMapsLibraryProvider>
    </GoogleMapsLoaderProvider>
  );
}

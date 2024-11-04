import { GoogleMapsLoaderProvider } from "./googleMaps/loaderProvider";
import { GoogleMapsMapsLibraryProvider } from "./googleMaps/mapsLibraryProvider";
import { GoogleMapsRender } from "./googleMaps/render";

export default function RenderCourseMap(props: {
  apiKey: string;
  courseId: string;
}) {
  return (
    <GoogleMapsLoaderProvider apiKey={props.apiKey}>
      <GoogleMapsMapsLibraryProvider>
        <GoogleMapsRender courseId={props.courseId} />
      </GoogleMapsMapsLibraryProvider>
    </GoogleMapsLoaderProvider>
  );
}

import { GoogleMapsLoaderProvider } from './googleMaps/loaderProvider.ts';
import { GoogleMapsMapsLibraryProvider } from './googleMaps/mapsLibraryProvider.ts';
import { GoogleMapsRender } from './googleMaps/render.ts';

export function RenderCourseMap(props: {
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

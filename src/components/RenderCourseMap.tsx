import { GoogleMapsLoaderProvider } from './googleMaps/LoaderProvider.tsx';
import { GoogleMapsMapsLibraryProvider } from './googleMaps/MapsLibraryProvider.tsx';
import { GoogleMapsRender } from './googleMaps/Render.tsx';

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

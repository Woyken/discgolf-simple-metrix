import { GoogleMapsLoaderProvider } from './googleMaps/loaderProvider_renameme.tsx';
import { GoogleMapsMapsLibraryProvider } from './googleMaps/mapsLibraryProvider_renameme.tsx';
import { GoogleMapsRender } from './googleMaps/render_renameme.tsx';

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

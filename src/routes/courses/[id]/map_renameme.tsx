import { useParams } from '@solidjs/router';
import { clientOnly } from '@solidjs/start';
import { useQueryClient } from '@tanstack/solid-query';
import { Show } from 'solid-js';
import {
  getCourseMapDataQueryOptions,
  useCourseMapGoogleMapsKeyQuery,
} from '~/components/googleMaps/query/query';

const RenderCourseMap = clientOnly(() =>
  import('~/components/renderCourseMap_renameme').then((x) => ({
    default: x.RenderCourseMap,
  })),
);

// biome-ignore lint/style/noDefaultExport: Required for route
export default function CourseMapPage() {
  const params = useParams<{ id: string }>();

  return <RenderMap courseId={params.id} />;
}

function RenderMap(props: { courseId: string }) {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery(getCourseMapDataQueryOptions(props.courseId));
  const googleMapsKeyQuery = useCourseMapGoogleMapsKeyQuery(
    () => props.courseId,
  );

  return (
    <Show when={googleMapsKeyQuery.data?.googleMapsApiKey}>
      {(key) => <RenderCourseMap apiKey={key()} courseId={props.courseId} />}
    </Show>
  );
}

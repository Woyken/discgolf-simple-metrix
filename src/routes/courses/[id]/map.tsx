import { useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createQuery } from "@tanstack/solid-query";
import { Accessor, Show } from "solid-js";
import { discGolfMetrixGetCourseMapData } from "~/apiWrapper/getCourseMapData";
import { discGolfMetrixGetGoogleMapsKey } from "~/apiWrapper/getGoogleMapsKey";

const RenderCourseMap = clientOnly(
  () => import("~/components/renderCourseMap")
);

export default function CourseMapPage() {
  const params = useParams<{ id: string }>();

  return <RenderMap courseId={params.id} />;
}

function useCourseMapDataQuery(courseId: Accessor<string>) {
  return createQuery(() => ({
    queryKey: ["courseMapData", courseId()],
    queryFn: async () => {
      const result = await discGolfMetrixGetCourseMapData(courseId());
      return result;
    },
    throwOnError: true,
  }));
}

function useCourseMapGoogleMapsKeyQuery(courseId: Accessor<string>) {
  return createQuery(() => ({
    queryKey: ["courseMapGoogleMapsKey", courseId()],
    queryFn: async () => {
      const result = await discGolfMetrixGetGoogleMapsKey(courseId());
      return result;
    },
    throwOnError: true,
  }));
}

function RenderMap(props: { courseId: string }) {
  const courseMapDataQuery = useCourseMapDataQuery(() => props.courseId);
  const googleMapsKeyQuery = useCourseMapGoogleMapsKeyQuery(
    () => props.courseId
  );

  return (
    <Show when={googleMapsKeyQuery.data?.googleMapsApiKey}>
      {(key) => <RenderCourseMap apiKey={key()} />}
    </Show>
  );
}

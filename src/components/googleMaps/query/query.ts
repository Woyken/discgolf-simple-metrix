import { queryOptions, createQuery } from "@tanstack/solid-query";
import { Accessor } from "solid-js";
import { discGolfMetrixGetCourseMapData } from "~/apiWrapper/getCourseMapData";
import { discGolfMetrixGetGoogleMapsKey } from "~/apiWrapper/getGoogleMapsKey";

export function getCourseMapDataQueryOptions(courseId: string) {
  return queryOptions({
    queryKey: ["courseMapData", courseId],
    queryFn: async () => {
      const result = await discGolfMetrixGetCourseMapData(courseId);
      return result;
    },
    throwOnError: true,
  });
}

export function useCourseMapGoogleMapsKeyQuery(courseId: Accessor<string>) {
  return createQuery(() => ({
    queryKey: ["courseMapGoogleMapsKey", courseId()],
    queryFn: async () => {
      const result = await discGolfMetrixGetGoogleMapsKey(courseId());
      return result;
    },
    throwOnError: true,
  }));
}

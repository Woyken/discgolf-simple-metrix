import { A, useParams } from '@solidjs/router';

// biome-ignore lint/style/noDefaultExport: Required for route
export default function CoursePage() {
  const params = useParams<{ id: string }>();
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <p>TODO</p>
      <A class="link" href={`/courses/${params.id}/map`}>
        Map
      </A>
    </main>
  );
}

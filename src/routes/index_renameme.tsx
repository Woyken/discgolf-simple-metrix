import { MyHistory } from '~/components/myHistory_renameme';

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
}

// biome-ignore lint/style/noDefaultExport: Required for route
export default function Home() {
  return (
    <main class="text-center mx-auto p-4">
      {/* <Suspense fallback={<div>L</div>}> */}
      <MyHistory />
      {/* </Suspense> */}
    </main>
  );
}

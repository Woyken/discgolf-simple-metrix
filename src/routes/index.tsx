import { MyHistory } from "~/components/myHistory";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
}

export default function Home() {
  return (
    <main class="text-center mx-auto p-4">
      <MyHistory />
    </main>
  );
}

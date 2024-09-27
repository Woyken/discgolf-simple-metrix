import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createMemo, Show, Suspense } from "solid-js";
import { discGolfMetrixViewResults } from "~/apiWrapper/viewResults";
import { PlayerAvatar, PlayerAvatarFromName } from "~/components/playerAvatar";

function useResultsQuery(id: string) {
  return createQuery(() => ({
    queryKey: ["resultsq", id],
    queryFn: async () => {
      const result = await discGolfMetrixViewResults(id);
      return result;
    },
  }));
}

type TableColumns = {
  position: number;
  player: { name: string; id?: number };
  scores: (number | undefined)[];
  diff: string;
  total: number;
};

export default function TodoLoaderPage() {
  return (
    <Suspense fallback={<div>LOADING...</div>}>
      <ResultsPage />
    </Suspense>
  );
}

function ResultsPage() {
  const params = useParams<{ id: string }>();
  const resultsQuery = useResultsQuery(params.id);

  const columnHelper = createColumnHelper<TableColumns>();

  const columns = createMemo(() => [
    columnHelper.accessor("player", {
      header: "Name",
      cell: (ctx) => {
        return (
          <div class="flex items-center space-x-3">
            <Show
              when={ctx.getValue().id}
              fallback={
                <PlayerAvatarFromName playerName={ctx.getValue().name} />
              }
            >
              {(id) => (
                <PlayerAvatar
                  playerId={id()}
                  playerName={ctx.getValue().name}
                />
              )}
            </Show>
            <div>
              <div class="font-bold">{ctx.getValue().name}</div>
              <div class="text-sm opacity-50">{ctx.getValue().id}</div>
            </div>
          </div>
        );
      },
    }),
    columnHelper.group({
      header: "Holes",
      columns: [
        ...(resultsQuery.data?.holesParList ?? []).map((_, index) =>
          columnHelper.accessor("scores", {
            header: `${index + 1}`,
            cell: (ctx) => {
              console.log("cell", ctx.getValue());
              return <>{ctx.getValue()[index]}</>;
            },
          })
        ),
        columnHelper.accessor("total", {
          header: "total",
          cell: (ctx) => {
            return <>{ctx.getValue()}</>;
          },
        }),
        columnHelper.accessor("diff", {
          header: "+-",
          cell: (ctx) => {
            return <>{ctx.getValue()}</>;
          },
        }),
      ],
    }),
  ]);

  const tableData = createMemo(
    () =>
      resultsQuery.data?.players.map(
        (player) =>
          ({
            get diff() {
              const diff = player.scores.reduce(
                (prev: number, curr, currentIndex) => {
                  if (curr === undefined) return prev;
                  const holeDiff =
                    curr -
                    (resultsQuery.data.holesParList?.[currentIndex] ?? 0);
                  return prev + holeDiff;
                },
                0
              );
              return `${diff >= 0 ? "+" : "-"}${Math.abs(diff)}`;
            },
            player: {
              id: player.playerId,
              name: player.name,
            },
            scores: player.scores,
            position: player.position,
            total: player.scores.reduce(
              (prev: number, curr: number | undefined) => prev + (curr ?? 0),
              0
            ),
          } satisfies TableColumns)
      ) ?? []
  );

  const table = createSolidTable({
    get columns() {
      return columns();
    },
    get data() {
      return tableData();
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main class="text-center mx-auto p-4">
      <div class="h-full w-full pb-6 bg-base-100">
        <div class="overflow-x-auto w-full">
          <table class="table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr>
                  {headerGroup.headers.map((header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr>
                  {row.getVisibleCells().map((cell) => (
                    <td>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

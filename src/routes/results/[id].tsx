import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createMemo, For, Show } from "solid-js";
import { discGolfMetrixViewResults } from "~/apiWrapper/viewResults";
import { PlayerAvatar, PlayerAvatarFromName } from "~/components/playerAvatar";
import { QueryBoundary } from "~/components/queryBoundary";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

function useResultsQuery(id: string) {
  return createQuery(() => ({
    queryKey: ["resultsq", id],
    queryFn: async () => {
      const result = await discGolfMetrixViewResults(id);
      return result;
    },
    throwOnError: true,
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
  const params = useParams<{ id: string }>();
  const resultsQuery = useResultsQuery(params.id);
  return (
    // <Show when={resultsQuery.data}>
    //   {(results) => <ResultsPage results={results()} />}
    // </Show>
    <QueryBoundary
      query={resultsQuery}
      loadingFallback={<div>Loading in suspense boundary</div>}
    >
      {(results) => <ResultsPage results={results} />}
    </QueryBoundary>
    // <Suspense fallback={<div>LOADING...</div>}>
    // <Show when={a()}>{(results) => <ResultsPage results={results()} />}</Show>

    // </Suspense>
  );
}

function ResultsPage(props: {
  results: Awaited<ReturnType<typeof discGolfMetrixViewResults>>;
}) {
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
        ...(props.results.holesParList ?? []).map((_, index) =>
          columnHelper.accessor("scores", {
            header: `${index + 1}`,
            cell: (ctx) => {
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
      props.results.players.map(
        (player) =>
          ({
            get diff() {
              const diff = player.scores.reduce(
                (prev: number, curr, currentIndex) => {
                  if (curr === undefined) return prev;
                  const holeDiff =
                    curr - (props.results.holesParList?.[currentIndex] ?? 0);
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/courses/${props.results.courseId}`}>
                {props.results.courseName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <TableRow>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <TableHead colSpan={header.colSpan}>
                          <Show when={!header.isPlaceholder}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Show>
                        </TableHead>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </TableHeader>
            <TableBody>
              <Show
                when={table.getRowModel().rows?.length}
                fallback={
                  <TableRow>
                    <TableCell
                      colSpan={props.results.holesParList.length + 3}
                      class="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                }
              >
                <For each={table.getRowModel().rows}>
                  {(row) => (
                    <TableRow>
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <TableCell>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )}
                      </For>
                    </TableRow>
                  )}
                </For>
              </Show>
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

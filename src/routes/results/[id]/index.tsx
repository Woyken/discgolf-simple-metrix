import { A, useParams, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { Accessor, createMemo, For, Show } from "solid-js";
import { type discGolfMetrixGetCompetitionThrows } from "~/apiWrapper/getCompetitionThrows";
import { getCompetitionThrowsQueryOptions } from "~/components/mapbox/query/query";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

function useCompetitionScoresQuery(competitionId: Accessor<string>) {
  return createQuery(() => getCompetitionThrowsQueryOptions(competitionId()));
}

type TableColumns = {
  player: { name: string; id?: number };
  scores: (number | undefined)[];
  diff: string;
  total: number;
};

export default function TodoLoaderPage() {
  const params = useParams<{ id: string }>();
  const resultsQuery = useCompetitionScoresQuery(() => params.id);
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
  results: Awaited<ReturnType<typeof discGolfMetrixGetCompetitionThrows>>;
}) {
  const [searchParams, setSearchParams] = useSearchParams<{
    groupId: string;
  }>();
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
        ...(
          props.results.course.Tracks.map((x) => ({
            id: x.Name,
            par: x.Par,
          })) ?? []
        ).map(({ id, par }, index) =>
          columnHelper.accessor("scores", {
            header: `${id}`,
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

  const groupIds = createMemo(
    () => new Set(props.results.scorecards.map((s) => s.GroupName))
  );

  const tableData = createMemo(
    () =>
      props.results.scorecards
        .filter((x) => {
          if (searchParams.groupId === undefined) return true;
          return x.GroupName === searchParams.groupId;
        })
        .map(
          (player) =>
            ({
              get diff() {
                console.log(props.results);
                const diff = Object.values(player.Results).reduce(
                  (prev: number, curr) => {
                    if (curr === undefined) return prev;
                    if ("Diff" in curr) {
                      const holeDiff = parseInt(curr.Diff);
                      return prev + holeDiff;
                    }
                    return prev;
                  },
                  0
                );
                return `${diff >= 0 ? "+" : "-"}${Math.abs(diff)}`;
              },
              player: {
                id: parseInt(player.UserID),
                name: player.Name,
              },
              scores: Object.values(player.Results).map((x) =>
                "Result" in x ? parseInt(x.Result) : undefined
              ),
              total: Object.values(player.Results)
                .map((x) => ("Result" in x ? parseInt(x.Result) : undefined))
                .reduce(
                  (prev: number, curr: number | undefined) =>
                    prev + (curr ?? 0),
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
        <div class="flex justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/courses/${props.results.competition.CourceID}`}
                >
                  {props.results.competition.CourseName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink current>Breadcrumb</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <A href="./enter">Edit scores</A>
        </div>
        <Select
          value={searchParams.groupId}
          onChange={(value) => {
            if (value === "All") return setSearchParams({ groupId: undefined });
            setSearchParams({ groupId: value });
          }}
          options={["All", ...groupIds()]}
          placeholder="Select a group…"
          itemComponent={(props) => (
            <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
          )}
        >
          <SelectTrigger aria-label="Group" class="w-[180px]">
            <SelectValue<string>>
              {(state) => state.selectedOption()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent />
        </Select>
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
                      colSpan={props.results.course.Tracks.length + 3}
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

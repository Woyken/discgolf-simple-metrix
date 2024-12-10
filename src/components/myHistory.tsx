import { A, cache } from "@solidjs/router";
import { createInfiniteQuery } from "@tanstack/solid-query";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { createMemo, For } from "solid-js";
import { discGolfMetrixGetCompetitionsList } from "~/apiWrapper/listCompetitions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";

type MyHistory = {
  id: number;
  location: {
    locationName: string;
    courseName: string;
    id: number;
  };
  date: string;
  type: "training" | undefined;
  players: number;
};

function useMyHistoryQuery() {
  return createInfiniteQuery(() => ({
    queryKey: ["myCompetitionsList"],
    queryFn: async (context) => {
      const result = await cache(
        () => discGolfMetrixGetCompetitionsList(context.pageParam),
        "cac"
      )();
      return result;
    },
    initialPageParam: undefined as
      | {
          from: number;
          to: number;
        }
      | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageParams,
  }));
}

export function MyHistory() {
  const myHistoryQuery = useMyHistoryQuery();
  const columnsData = createMemo(() =>
    myHistoryQuery.data?.pages
      .flatMap((x) => x.items)
      .map<MyHistory>((x) => ({
        id: x.id,
        date: x.date,
        location: {
          courseName: x.courseName,
          locationName: x.locationName,
          id: x.id,
        },
        players: x.playerCount,
        type: x.isTraining ? "training" : undefined,
      }))
  );
  const columnHelper = createColumnHelper<MyHistory>();

  const columns = createMemo(() => [
    columnHelper.accessor("location", {
      header: "Location",
      cell: (ctx) => (
        // <div class="flex items-center space-x-3">
        //   <div class="avatar">
        //     <div class="mask mask-squircle w-12 h-12">
        //       <img src="https://reqres.in/img/faces/7-image.jpg" alt="Avatar" />
        //     </div>
        //   </div>
        //   <div>
        <>
          <A href={`/results/${ctx.getValue().id}`} class="font-bold">
            {ctx.getValue().courseName}
          </A>
          <div class="text-sm opacity-50">{ctx.getValue().locationName}</div>
        </>
        //   </div>
        // </div>
      ),
    }),
    columnHelper.accessor("date", {
      id: "lastName",
      cell: (ctx) => ctx.getValue(),
      header: () => <span>Date</span>,
    }),
    columnHelper.accessor("players", {
      cell: (ctx) => <span>{ctx.getValue()}</span>,
      header: () => <span>Players</span>,
    }),
    columnHelper.accessor("type", {
      cell: (ctx) => (
        <Button variant="ghost" title={ctx.getValue()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            aria-hidden="true"
            class="w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            ></path>
          </svg>
        </Button>
      ),
      header: "Type",
    }),
  ]);

  const table = createSolidTable({
    get columns() {
      return columns();
    },
    get data() {
      return columnsData() ?? [];
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div class="h-full w-full pb-6 bg-base-100">
      <div class="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <TableHead colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

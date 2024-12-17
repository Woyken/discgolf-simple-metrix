import { createStore as createIdbStore, get, set as setIdb } from "idb-keyval";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
} from "../ui/pagination";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { getCompetitionThrowsQueryOptions } from "../mapbox/query/query";
import { QueryBoundary } from "../queryBoundary";
import { CompetitionThrowsResponse } from "~/apiWrapper/getCompetitionThrows";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { discGolfMetrixUpdateCompetitionScores2 } from "~/apiWrapper/updateCompetitionScores";
import { showToast } from "../ui/toast";

const idbStore = createIdbStore("w-db", "competition-throws");

type ParticipantThrows = {
  participants: {
    participantId: string;
    holes: {
      holeId: number;
      throws: {
        throwId: number;
        landed:
          | "Basket"
          | "Circle0 0-3m"
          | "Circle1 0-10m"
          | "Circle2 10-20m"
          | "Fairway"
          | "Off fairway"
          | "Penalty";
      }[];
    }[];
  }[];
};

type SingleThrow =
  ParticipantThrows["participants"][0]["holes"][0]["throws"][0];

function setStoreThrows(competitionId: string, throwsData: ParticipantThrows) {
  return setIdb(competitionId, throwsData, idbStore);
}

function getStoreThrows(competitionId: string) {
  return get<ParticipantThrows>(competitionId, idbStore);
}

function useParticipantThrows(competitionId: Accessor<string>) {
  const [isInitialized, setIsInitialized] = createSignal(false);
  const [getThrows, setThrows] = createStore<ParticipantThrows>({
    participants: [],
  });

  createEffect(() => {
    // Initialize throws data from idb
    getStoreThrows(competitionId()).then((throws) => {
      if (throws) setThrows(throws);
      setIsInitialized(true);
    });
  });

  createEffect(() => {
    if (!isInitialized()) return;
    // When throws data changes, store to idb for next time

    JSON.stringify(getThrows);
    setStoreThrows(competitionId(), unwrap(getThrows));
  });

  return {
    setThrow: (
      participantId: string,
      holeId: number,
      singleThrow: SingleThrow
    ) => {
      setThrows(
        produce((throws) => {
          const scores = throws.participants.find(
            (scores) => scores.participantId === participantId
          )?.holes;
          if (!scores) {
            throws.participants.push({
              participantId,
              holes: [
                {
                  holeId,
                  throws: [singleThrow],
                },
              ],
            });
            return;
          }

          const holeThrows = scores.find((x) => x.holeId === holeId)?.throws;
          if (!holeThrows) {
            scores.push({
              holeId,
              throws: [singleThrow],
            });
            return;
          }

          const foundThrow = holeThrows.find(
            (x) => x.throwId === singleThrow.throwId
          );
          if (!foundThrow) {
            holeThrows.push(singleThrow);
            return;
          }

          foundThrow.landed = singleThrow.landed;
        })
      );
    },
    removeThrow: (participantId: string, holeId: number, throwId: number) => {
      setThrows(
        produce((throws) => {
          const t = throws.participants
            .find((x) => x.participantId === participantId)
            ?.holes.find((x) => x.holeId === holeId)?.throws;
          if (t) {
            const i = t.findIndex((x) => x.throwId === throwId);
            t.splice(i, 1);
          }
        })
      );
    },
    get throws() {
      return getThrows.participants;
    },
    getThrowsForHole: (participantId: string, holeId: number) =>
      getThrows.participants
        .find((x) => x.participantId === participantId)
        ?.holes.find((x) => x.holeId === holeId)?.throws,
    get isInitialized() {
      return isInitialized();
    },
  };
}
type ThrowsStore = ReturnType<typeof useParticipantThrows>;

export default function EnterCompetitionResultsWithQuery(props: {
  competitionId: string;
}) {
  const competitionScoresQuery = createQuery(() =>
    getCompetitionThrowsQueryOptions(props.competitionId.toString())
  );

  return (
    <QueryBoundary query={competitionScoresQuery}>
      {(data) => <EnterCompetitionResults competitionData={data} />}
    </QueryBoundary>
  );
}

function EnterCompetitionResults(props: {
  competitionData: CompetitionThrowsResponse;
}) {
  // Do the custom keyboard with simple input?
  // use native keyboard? (slower :( )
  // Enter single hole stats?

  // Enter throw by throw, then auto fill hole stats? store temporary throws (maybe in localstorage? so it won't die on refresh), until hole submit
  // Don't need custom keyboard, just select is throw was OB or not (Udisc has more options, like fairway, and such)
  // If using GPS, then single click. (Unless OB, can't say for certain)
  // No api to store GPS throw location. Just store it in IDB locally?

  const throwsStore = useParticipantThrows(
    () => props.competitionData.competition.ID
  );
  const [activeHole, setActiveHole] = createSignal(1);

  return (
    <>
      <EnterHoleResults
        competitionData={props.competitionData}
        store={throwsStore}
        competitionId={props.competitionData.competition.ID}
        holeId={activeHole()}
      />
      <Pagination
        count={props.competitionData.course.Tracks.length}
        fixedItems
        page={activeHole()}
        itemComponent={(props) => (
          <PaginationItem
            onClick={() => setActiveHole(props.page)}
            page={props.page}
          >
            {props.page}
          </PaginationItem>
        )}
        ellipsisComponent={() => <PaginationEllipsis />}
      >
        <PaginationItems />
      </Pagination>
    </>
  );
}

function EnterHoleResults(props: {
  competitionData: CompetitionThrowsResponse;
  store: ThrowsStore;
  competitionId: string;
  holeId: number;
}) {
  const queryClient = useQueryClient();
  const updateScoresMutation = createMutation(() => ({
    mutationFn: async (
      params: Parameters<typeof discGolfMetrixUpdateCompetitionScores2>[0]
    ) => {
      const result = await discGolfMetrixUpdateCompetitionScores2(params);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        getCompetitionThrowsQueryOptions(props.competitionId)
      );
    },
    onError: () => {
      queryClient.invalidateQueries(
        getCompetitionThrowsQueryOptions(props.competitionId)
      );
    },
  }));

  createEffect(() => {
    if (!updateScoresMutation.isError) return;
    showToast({
      variant: "error",
      title: "Failed to save scores",
      description: `Failed saved scores: ${JSON.stringify(
        updateScoresMutation.error
      )}`,
    });
  });

  createEffect(() => {
    if (!updateScoresMutation.isSuccess) return;
    showToast({
      variant: "success",
      title: "Saved scores",
      description: "Successfully saved scores",
    });
  });

  createEffect(() => {
    if (!updateScoresMutation.isPending) return;
    showToast({
      variant: "default",
      title: "Saving scores...",
    });
  });

  return (
    <>
      <div class="space-y-4">
        <h4 class="text-sm font-medium">Hole {props.holeId}</h4>
        <div class="grid gap-6">
          <For each={props.competitionData.scorecards}>
            {(scorecard) => {
              const [dropdownOpen, setDropdownOpen] = createSignal(false);

              const throwsForHole = createMemo(() =>
                props.store.getThrowsForHole(scorecard.ID, props.holeId)
              );

              const handleDropdownClick =
                (landed: SingleThrow["landed"]) => () => {
                  const throwIds = throwsForHole()?.map((x) => x.throwId);
                  let lastThrowId = 0;
                  if (!throwIds || throwIds.length < 1) lastThrowId = 0;
                  else lastThrowId = Math.max(...throwIds);

                  props.store.setThrow(scorecard.ID, props.holeId, {
                    throwId: lastThrowId + 1,
                    landed,
                  });
                };

              const currentScore = createMemo(() => {
                const throws = throwsForHole();
                const scoreFromThrows =
                  throws
                    ?.map((x) => (x.landed === "Penalty" ? 2 : 1))
                    .reduce((acc, curr) => curr + acc, 0) ?? 0;
                const resultScore =
                  scoreFromThrows > 0
                    ? scoreFromThrows
                    : scorecard.Results[props.holeId].Result;
                return resultScore;
              });

              return (
                <>
                  <div class="flex flex-col overflow-hidden">
                    <div class="flex items-center justify-between space-x-4">
                      <div class="flex items-center space-x-4">
                        <Avatar>
                          {/* <AvatarImage src="/avatars/03.png" /> */}
                          <AvatarFallback>{scorecard.Name}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p class="text-sm font-medium leading-none">
                            {scorecard.Name}
                          </p>
                          <p class="text-sm text-muted-foreground">
                            {scorecard.ID}
                          </p>
                        </div>
                      </div>
                      <div class="flex space-x-4 items-center">
                        <Button
                          classList={{
                            hidden: !(
                              throwsForHole()?.at(-1)?.landed === "Basket"
                            ),
                          }}
                          disabled={
                            updateScoresMutation.isPending ||
                            (parseInt(
                              scorecard.Results[props.holeId].Result
                            ) === currentScore() &&
                              parseInt(
                                scorecard.Results[props.holeId].Penalty
                              ) ===
                                throwsForHole()?.filter(
                                  (t) => t.landed === "Penalty"
                                ).length)
                          }
                          onclick={() => {
                            const throws = throwsForHole();
                            if (!throws) return;

                            const scoreFromThrows =
                              throws
                                .map((x) => (x.landed === "Penalty" ? 2 : 1))
                                .reduce((acc, curr) => curr + acc, 0) ?? 0;

                            const penalties = throws.filter(
                              (t) => t.landed === "Penalty"
                            ).length;

                            updateScoresMutation.mutate([
                              {
                                competitionParticipantId: scorecard.ID,
                                holeIndex: props.holeId,
                                result: scoreFromThrows,
                                penalties: penalties,
                              },
                            ]);
                          }}
                        >
                          Save to metrix
                        </Button>
                        <Button
                          onclick={() => {
                            const throwIds = throwsForHole()?.map(
                              (x) => x.throwId
                            );
                            if (!throwIds || throwIds.length < 1) return;
                            const lastThrowId = Math.max(...throwIds);
                            props.store.removeThrow(
                              scorecard.ID,
                              props.holeId,
                              lastThrowId
                            );
                          }}
                          disabled={(throwsForHole() ?? []).length === 0}
                        >
                          -
                        </Button>
                        <div>{currentScore()}</div>
                        <DropdownMenu
                          open={dropdownOpen()}
                          onOpenChange={(isOpen) => setDropdownOpen(isOpen)}
                        >
                          <DropdownMenuTrigger
                            as={Button<"button">}
                            disabled={
                              throwsForHole()?.at(-1)?.landed === "Basket"
                            }
                          >
                            +
                          </DropdownMenuTrigger>
                          <DropdownMenuContent class="w-48">
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Basket")}
                            >
                              <span>In Basket</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Circle0 0-3m")}
                            >
                              <span>Circle0 0-3m</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Circle1 0-10m")}
                            >
                              <span>Circle1 0-10m</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Circle2 10-20m")}
                            >
                              <span>Circle1 10-20m</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Fairway")}
                            >
                              <span>Fairway</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Off fairway")}
                            >
                              <span>Off fairway</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onclick={handleDropdownClick("Penalty")}
                            >
                              <span>OB/Penalty</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div class="flex space-x-4 overflow-auto">
                      <For each={throwsForHole()}>
                        {(t) => <div>{t.landed}</div>}
                      </For>
                    </div>
                  </div>
                </>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
}
import { createStore as createIdbStore, get, set as setIdb } from "idb-keyval";
import { Accessor, createEffect, createSignal, For } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
} from "../ui/pagination";
import { createQuery } from "@tanstack/solid-query";
import { getCompetitionThrowsQueryOptions } from "../mapbox/query/query";
import { QueryBoundary } from "../queryBoundary";
import { CompetitionThrowsResponse } from "~/apiWrapper/getCompetitionThrows";

const idbStore = createIdbStore("w-db", "competition-throws");

type ParticipantThrows = {
  participants: {
    participantId: number;
    holes: {
      holeId: number;
      throws: {
        throwId: number;
        landed:
          | "Basket"
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
    setStoreThrows(competitionId(), unwrap(getThrows));
  });

  return {
    setThrow: (
      participantId: number,
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
    get throws() {
      return getThrows.participants;
    },
    getThrowsForHole: (participantId: number, holeId: number) =>
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
  // TODO enter results.
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
  return (
    <>
      <div class="space-y-4">
        <h4 class="text-sm font-medium">Lorem ipsum dolor sit.</h4>
        <div class="grid gap-6">
          <For each={props.competitionData.scorecards}>
            {(scorecard) => (
              <>
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
                  <div> - </div>
                  <div>{scorecard.Results[props.holeId].Result ?? 0}</div>
                  <div> + </div>
                </div>
              </>
            )}
          </For>
        </div>
      </div>
    </>
  );
}

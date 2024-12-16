import { createStore as createIdbStore, get, set as setIdb } from "idb-keyval";
import { Accessor, createEffect, createSignal } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";

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

function setStoreThrows(competitionId: number, throwsData: ParticipantThrows) {
  return setIdb(competitionId, throwsData, idbStore);
}

function getStoreThrows(competitionId: number) {
  return get<ParticipantThrows>(competitionId, idbStore);
}

function useParticipantThrows(competitionId: Accessor<number>) {
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
    get isInitialized() {
      return isInitialized();
    },
  };
}

export function EnterCompetitionResults(props: { competitionId: number }) {
  // TODO enter results.
  // Do the custom keyboard with simple input?
  // use native keyboard? (slower :( )
  // Enter single hole stats?

  // Enter throw by throw, then auto fill hole stats? store temporary throws (maybe in localstorage? so it won't die on refresh), until hole submit
  // Don't need custom keyboard, just select is throw was OB or not (Udisc has more options, like fairway, and such)
  // If using GPS, then single click. (Unless OB, can't say for certain)
  // No api to store GPS throw location. Just store it in IDB locally?

  const throwsStore = useParticipantThrows(() => props.competitionId);

  return <></>;
}

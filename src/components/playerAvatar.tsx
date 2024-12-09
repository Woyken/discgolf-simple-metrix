import { createQuery } from "@tanstack/solid-query";
import { Accessor, createMemo, Match, Suspense, Switch } from "solid-js";
import { discGolfMetrixGetPlayer } from "~/apiWrapper/player";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function usePlayerQuery(id: Accessor<number>) {
  return createQuery(() => ({
    queryKey: ["playerData", id()],
    queryFn: async () => {
      const result = await discGolfMetrixGetPlayer(id());
      return result;
    },
  }));
}

export function PlayerAvatar(props: { playerId: number; playerName?: string }) {
  return (
    <Avatar>
      <Suspense
        fallback={
          <PlayerAvatarFromNameBody
            playerName={props.playerName ?? props.playerId.toString()}
          />
        }
      >
        <PlayerAvatarWithQuery playerId={props.playerId} />
      </Suspense>
    </Avatar>
  );
}

export function PlayerAvatarFromName(props: { playerName: string }) {
  return <AvatarFallback>{props.playerName}</AvatarFallback>;
}

function PlayerAvatarFromNameBody(props: { playerName: string }) {
  const shortName = createMemo(() => getPlayerNameInitials(props.playerName));
  return <AvatarFallback>{shortName()}</AvatarFallback>;
}

function PlayerAvatarWithQuery(props: { playerId: number }) {
  const playerQuery = usePlayerQuery(() => props.playerId);

  return (
    <Switch>
      <Match when={playerQuery.data?.profilePictureUrl}>
        {(profilePictureUrl) => <AvatarImage src={profilePictureUrl().href} />}
      </Match>
      <Match when={playerQuery.data?.playerName}>
        {(name) => <PlayerAvatarFromNameBody playerName={name()} />}
      </Match>
    </Switch>
  );
}

function getPlayerNameInitials(name: string) {
  const split = name.split(" ");
  if (split.length < 2) return name.slice(0, 2);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked length
  return [split[0], split.at(-1)!]
    .map((x) => x.slice(0, 1))
    .join("")
    .toUpperCase();
}

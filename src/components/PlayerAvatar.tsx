import { createQuery } from '@tanstack/solid-query';
import { type Accessor, Suspense, createMemo } from 'solid-js';
import { discGolfMetrixGetPlayer } from '~/apiWrapper/player';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar.tsx';

function usePlayerQuery(id: Accessor<number>) {
  return createQuery(() => ({
    queryKey: ['playerData', id()],
    queryFn: async () => {
      const result = await discGolfMetrixGetPlayer(id());
      return result;
    },
  }));
}

export function PlayerAvatar(props: { playerId: number; playerName?: string }) {
  const playerQuery = usePlayerQuery(() => props.playerId);

  return (
    <Avatar>
      <Suspense
        fallback={
          <PlayerAvatarFromNameBody
            playerName={props.playerName ?? props.playerId.toString()}
          />
        }
      >
        <AvatarImage src={playerQuery.data?.profilePictureUrl?.href} />
        <PlayerAvatarFromNameBody
          playerName={playerQuery.data?.playerName ?? ''}
        />
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

function getPlayerNameInitials(name: string) {
  const split = name.split(' ');
  if (split.length < 2) return name.slice(0, 2);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked length
  return [split[0], split.at(-1)]
    .map((x) => x?.slice(0, 1))
    .join('')
    .toUpperCase();
}

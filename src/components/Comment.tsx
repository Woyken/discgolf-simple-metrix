import { For, Show, createSignal } from 'solid-js';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx';
import { Button } from './ui/button.tsx';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card.tsx';

interface CommentProps {
  author: string;
  avatar?: string;
  date: string;
  content: string;
  replies?: CommentProps[];
}

export function Comment({
  author,
  avatar,
  date,
  content,
  replies,
}: CommentProps) {
  const [showReplies, setShowReplies] = createSignal(true);

  return (
    <Card class="mb-4">
      <CardHeader class="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          {avatar ? (
            <AvatarImage src={avatar} alt={`${author}'s avatar`} />
          ) : (
            <AvatarFallback>
              {author
                .split(' ')
                .map((name) => name[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 class="font-semibold">{author}</h3>
          <p class="text-sm text-muted-foreground">{date}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      {replies && replies.length > 0 && (
        <CardFooter>
          <Button variant="ghost" onClick={() => setShowReplies((x) => !x)}>
            <Show
              when={showReplies()}
              fallback={`Show ${replies.length} Replies`}
            >
              Hide Replies
            </Show>
          </Button>
        </CardFooter>
      )}
      <Show when={showReplies() && replies}>
        <CardContent class="pt-0">
          <div class="pl-6 border-l">
            <For each={replies}>{(reply) => <Comment {...reply} />}</For>
          </div>
        </CardContent>
      </Show>
    </Card>
  );
}

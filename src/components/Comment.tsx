import { For, Show, createSignal } from 'solid-js';
import { CommentForm } from './CommentForm.tsx';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.tsx';
import { Button } from './ui/button.tsx';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card.tsx';

interface CommentProps {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  content: string;
  replies?: CommentProps[];
}

export function Comment(props: {
  onAddReply: (parentId: string, content: string) => void;
  comment: CommentProps;
}) {
  const [showReplies, setShowReplies] = createSignal(true);
  const [showReplyForm, setShowReplyForm] = createSignal(false);

  const handleAddReply = (content: string) => {
    props.onAddReply(props.comment.id, content);
    setShowReplyForm(false);
    setShowReplies(true);
  };

  return (
    <Card class="mb-4">
      <CardHeader class="flex flex-row items-center gap-4 space-y-0">
        <Avatar>
          {props.comment.avatar ? (
            <AvatarImage
              src={props.comment.avatar}
              alt={`${props.comment.author}'s avatar`}
            />
          ) : (
            <AvatarFallback>
              {props.comment.author
                .split(' ')
                .map((name) => name[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 class="font-semibold">{props.comment.author}</h3>
          <p class="text-sm text-muted-foreground">{props.comment.date}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{props.comment.content}</p>
      </CardContent>

      <CardFooter class="flex flex-col items-start gap-4">
        <div class="flex gap-4">
          <Button variant="ghost" onClick={() => setShowReplyForm((x) => !x)}>
            Reply
          </Button>
          <Show
            when={props.comment.replies && props.comment.replies.length > 0}
          >
            <Button variant="ghost" onClick={() => setShowReplies((x) => !x)}>
              <Show
                when={showReplies()}
                fallback={`Show ${props.comment.replies?.length} Replies`}
              >
                Hide Replies
              </Show>
            </Button>
          </Show>
        </div>

        <Show when={showReplyForm()}>
          <CommentForm
            onSubmit={handleAddReply}
            placeholder="Write a reply..."
            buttonText="Post Reply"
          />
        </Show>
      </CardFooter>

      <Show when={showReplies() && props.comment.replies}>
        <CardContent class="pt-0">
          <div class="pl-6 border-l">
            <For each={props.comment.replies}>
              {(reply) => (
                <Comment comment={reply} onAddReply={props.onAddReply} />
              )}
            </For>
          </div>
        </CardContent>
      </Show>
    </Card>
  );
}

import { For } from 'solid-js';
import { Comment } from './Comment.tsx';

type CommentType = {
  id: string;
  author: string;
  avatar?: string;
  date: string;
  content: string;
  replies: CommentType[];
};

export function CommentList(props: {
  comments: CommentType[];
  onAddReply: (parentId: string, content: string) => void;
}) {
  return (
    <div class="space-y-4">
      <For each={props.comments}>
        {(comment) => (
          <Comment comment={comment} onAddReply={props.onAddReply} />
        )}
      </For>
    </div>
  );
}

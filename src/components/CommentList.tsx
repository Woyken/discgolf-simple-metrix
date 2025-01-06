import { For } from 'solid-js';
import { Comment } from './Comment.tsx';

type CommentType = {
  author: string;
  avatar?: string;
  date: string;
  content: string;
  replies: CommentType[];
};

interface CommentListProps {
  comments: CommentType[];
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div class="space-y-4">
      <For each={comments}>{(comment) => <Comment {...comment} />}</For>
    </div>
  );
}

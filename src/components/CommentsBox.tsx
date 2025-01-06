import { createQuery } from '@tanstack/solid-query';
import {
  type discGolfMetrixGetCompetitionComments,
  getDiscGolfMetrixGetCompetitionCommentsQueryOptions,
} from '~/apiWrapper/getCompetitionComments';
import { CommentList } from './CommentList.tsx';
import { QueryBoundary } from './queryBoundary.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.tsx';

function commentToComment(
  comments: Awaited<
    ReturnType<typeof discGolfMetrixGetCompetitionComments>
  >['comments'],
  comment: Awaited<
    ReturnType<typeof discGolfMetrixGetCompetitionComments>
  >['comments'][0],
): Parameters<typeof CommentList>[0]['comments'][0] {
  return {
    author: comment.authorName,
    avatar: comment.profileImgUrl,
    content: comment.content,
    date: comment.id,
    replies: comments
      .filter((x) => x.replyTo === comment.id)
      .map((x) => commentToComment(comments, x)),
  };
}

export function CommentsBox(props: { competitionId: string }) {
  const query = createQuery(() =>
    getDiscGolfMetrixGetCompetitionCommentsQueryOptions(props.competitionId),
  );

  return (
    <Card class="min-w-[50%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <QueryBoundary query={query}>
          {(data) => (
            <CommentList
              comments={data.comments
                .filter((x) => !x.replyTo)
                .map((x) => commentToComment(data.comments, x))}
            />
          )}
        </QueryBoundary>
      </CardContent>
    </Card>
  );
}

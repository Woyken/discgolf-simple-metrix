import { query } from '@solidjs/router';
import { queryOptions } from '@tanstack/solid-query';
import { getDomParser } from './domParser.ts';
import { discGolfMetrixUrl } from './urlBase.ts';

type Comment = {
  id: string;
  authorName: string;
  content: string;
  userId?: string;
  profileImgUrl?: string;
  replyTo?: string;
};

type CompetitionComments = {
  comments: Comment[];
};

const userIdFromImgUrlRegex = /\/profile\/300x300_(\d+)/;

export const discGolfMetrixGetCompetitionComments = query(
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO
  async (competitionId: string) => {
    'use server';
    const url = new URL(
      `${encodeURIComponent(competitionId)}&view=comments`,
      discGolfMetrixUrl,
    );
    const response = await fetch(url);
    if (!response.ok) throw new Error('Request failed');

    const text = await response.text();
    const domParser = await getDomParser();
    const parser = new domParser();
    const parsedHtml = parser.parseFromString(text, 'text/html');
    const column = parsedHtml.querySelector('#content_auto .column');
    if (!column)
      return {
        comments: [],
      };
    let lastValidCommentAnchorId: string | undefined;
    const commentsResponse: CompetitionComments = {
      comments: [],
    };
    for (const comment of column.children) {
      // Ignore new comment box
      if (comment.querySelector('textarea#comment')) continue;
      if (comment.tagName === 'A') {
        // anchor before next comment, will contain id if "root level"
        if (comment.id === '') continue;
        const commentId = comment.id.replace('comment-', '');
        if (commentId !== '') lastValidCommentAnchorId = commentId;
        else lastValidCommentAnchorId = undefined;
        continue;
      }

      const commentDate = comment.querySelector(
        '.comment-data a span',
      )?.textContent;
      if (!commentDate) continue;
      const commentContent =
        comment
          .querySelector('.comment-box')
          ?.childNodes[2].textContent?.trim() ?? '';
      const commentAuthorName = comment.querySelector(
        '.comment-title strong',
      )?.textContent;
      if (!commentAuthorName) continue;
      const profileImgUrl = comment
        .querySelectorAll('.profile-face-small')
        .values()
        .filter((x) => x.childElementCount)
        .toArray()[0]
        .querySelector('img')?.src;
      const userId = profileImgUrl?.match(userIdFromImgUrlRegex)?.[1];

      const commentUrlStr = comment
        .querySelector('.comment-data')
        ?.querySelector('a')?.href;
      if (!commentUrlStr) continue;

      const commentUrl = new URL(commentUrlStr, discGolfMetrixUrl);
      const commentId = commentUrl.hash.replace('#comment-', '');
      const replyTo =
        lastValidCommentAnchorId === commentId
          ? undefined
          : lastValidCommentAnchorId;
      commentsResponse.comments.push({
        id: commentId,
        replyTo,
        content: commentContent,
        userId,
        profileImgUrl,
        authorName: commentAuthorName,
      });
    }

    return commentsResponse;
  },
  'discGolfMetrixGetCompetitionComments',
);

export function getDiscGolfMetrixGetCompetitionCommentsQueryOptions(
  competitionId: string,
) {
  return queryOptions({
    queryKey: ['competition comments', competitionId],
    queryFn: async () => {
      const result = await discGolfMetrixGetCompetitionComments(competitionId);
      return result;
    },
    throwOnError: true,
  });
}

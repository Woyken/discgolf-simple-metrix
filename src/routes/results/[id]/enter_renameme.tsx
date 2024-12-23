import { useParams } from '@solidjs/router';
import { clientOnly } from '@solidjs/start';

const EnterCompetitionResultsWithQuery = clientOnly(() =>
  import('~/components/enterResults/enterResults_renameme').then((x) => ({
    default: x.EnterCompetitionResultsWithQuery,
  })),
);

// biome-ignore lint/style/noDefaultExport: Required for route
export default function EnterResults() {
  const params = useParams<{ id: string }>();
  return <EnterCompetitionResultsWithQuery competitionId={params.id} />;
}

import { useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";

const EnterCompetitionResultsWithQuery = clientOnly(
  () => import("~/components/enterResults/enterResults")
);

export default function EnterResults() {
  const params = useParams<{ id: string }>();
  return <EnterCompetitionResultsWithQuery competitionId={params.id} />;
}

import { redirect } from "next/navigation";
import { legacyVocabRedirectTarget } from "@/lib/wordMission/legacyRedirects";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy route — Word Mission is the single word-learning leg. */
export default async function VocabularioPage({ searchParams }: PageProps) {
  redirect(legacyVocabRedirectTarget(await searchParams));
}

import { redirect } from "next/navigation";
import { legacyPronunciationRedirectTarget } from "@/lib/wordMission/legacyRedirects";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy route — Word Mission is the single word-learning leg. */
export default async function PronunciationPage({ searchParams }: PageProps) {
  redirect(legacyPronunciationRedirectTarget(await searchParams));
}

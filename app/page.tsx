import HomePageClient from "@/components/content/homePageClient";

type HomeSearchParams = Promise<Record<string, string | string[] | undefined>>;

function getInitialSubPageParam(searchParams?: Record<string, string | string[] | undefined>) {
  const subPageParam = searchParams?.p;
  return Array.isArray(subPageParam) ? subPageParam[0] ?? null : subPageParam ?? null;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: HomeSearchParams;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <HomePageClient initialSubPageParam={getInitialSubPageParam(resolvedSearchParams)} />
  );
}

import HomePageClient from "@/components/content/homePageClient";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomePageClient />
    </Suspense>
  );
}

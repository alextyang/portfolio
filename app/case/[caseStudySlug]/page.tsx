import { CaseBody } from "@/components/content/caseBody";
import { redirect } from "next/navigation";
import { caseStudies, CaseStudy } from "../../../content/cases";

export default async function Page({
    params,
}: {
    params: Promise<{ caseStudySlug: string }>
}) {
    const { caseStudySlug } = await params;
    const c = (caseStudies as CaseStudy[]).find((caseStudy) => caseStudy.slug === caseStudySlug);

    if (!c)
        redirect("/");

    return (
        <div className="flex min-h-screen items-start justify-center px-(--page-x-margin) pt-(--page-top) ">
            <main className="max-w-(--page-width) w-full ">

                <a href="/" className="inline-block group">
                    <div className="relative opacity-25 group-hover:opacity-25 translate-0 group-hover:-translate-x-2 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.65em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="square" strokeLinejoin="round" className="absolute -left-8">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                        </svg>
                    </div>
                    <h2 className="opacity-40 inline-block group-hover:opacity-40 transition-opacity">Alexander Yang</h2>
                </a>

                <h1 className="mt-2">{c.title}</h1>
                {/* <div className="mt-2! flex flex-col flex-wrap gap-1 items-left">
                    {
                        c.toolTags.map((tag) => (
                            <p key={tag} className="opacity-60 sans small m-0!">{tag}</p>
                        ))
                    }
                </div> */}


                {/* Case content from markdown, with figures inserted */}
                <CaseBody caseStudy={c} />

                {/* Back button & next case study button */}
            </main>
        </div>
    );
}

import { CaseBody } from "@/components/content/caseBody";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { caseStudies, CaseStudy } from "../../../content/cases";

type CasePageProps = {
    params: Promise<{ caseStudySlug: string }>
};

export async function generateMetadata({
    params,
}: CasePageProps): Promise<Metadata> {
    const { caseStudySlug } = await params;
    const c = (caseStudies as CaseStudy[]).find((caseStudy) => caseStudy.slug === caseStudySlug);

    if (!c || c.isWip) {
        return {
            title: "Alexander Yang",
            alternates: {
                canonical: "/",
            },
        };
    }

    return {
        title: c.title,
        description: c.subtitle,
        alternates: {
            canonical: `/case/${c.slug}`,
        },
        openGraph: {
            title: c.title,
            description: c.subtitle,
            url: `/case/${c.slug}`,
            images: [
                {
                    url: `/case/${c.slug}/${c.coverImageFilename}`,
                    alt: c.coverImageAlt || c.previewTitle,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: c.title,
            description: c.subtitle,
            images: [`/case/${c.slug}/${c.coverImageFilename}`],
        },
    };
}

export default async function Page({
    params,
}: CasePageProps) {
    const { caseStudySlug } = await params;
    const c = (caseStudies as CaseStudy[]).find((caseStudy) => caseStudy.slug === caseStudySlug);

    if (!c)
        redirect("/");

    if (c.isWip)
        redirect("/");

    return (
        <div className="flex min-h-screen items-start justify-center px-(--page-x-margin) pt-(--page-top) ">
            <main className="max-w-(--page-width) w-full ">

                <Link href="/" className="inline-block group">
                    <div className="relative opacity-25 group-hover:opacity-25 translate-0 group-hover:-translate-x-2 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.65em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="square" strokeLinejoin="round" className="absolute -left-8">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                        </svg>
                    </div>
                    <h2 className="opacity-40 inline-block group-hover:opacity-40 transition-opacity">Alexander Yang</h2>
                </Link>

                <h1 className="mt-2">{c.title}</h1>
                <h2 className="mt-2 font-normal!">{c.subtitle}</h2>
                <div className="mt-4.5! mb-7.5! grid grid-cols-2 opacity-60">
                    <p className=" sans small m-0!">{c.fieldDescription}</p>
                    <p className=" sans small m-0!">{c.affiliationDescription}</p>
                </div>

                {/* <p className="opacity-15 my-2.5! block w-full h-0 "><span className="block w-full h-[0px] border-b-1"></span></p> */}
                {/* <div className="mb-12! grid grid-cols-2 gap-y-1">
                    {
                        c.toolTags.map((tag) => (
                            <p key={tag} className="opacity-80 sans small m-0!">{tag}</p>
                        ))
                    }
                </div> */}



                {/* Case content from markdown, with figures inserted */}
                <CaseBody caseStudy={c} />

                {/* Back button & next case study button */}
                <div className=" mt-20 mb-16 flex flex-row justify-between items-center ">

                    <Link href="/" className="inline group">
                        <div className="relative opacity-70 group-hover:opacity-25 translate-0 group-hover:-translate-x-2 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.65em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="square" strokeLinejoin="round" className="absolute -left-8">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                            </svg>
                        </div>
                        <h2 className="opacity-85 inline-block group-hover:opacity-100 transition-opacity">Return</h2>
                    </Link>
                    <Link href="/">
                        <h2 className="opacity-25 inline-block group-hover:opacity-40 transition-opacity">Alexander Yang</h2>
                    </Link>
                </div>

            </main>
        </div>
    );
}

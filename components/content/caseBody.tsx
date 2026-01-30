import { CaseStudy } from "@/content/cases";
import Markdown from "react-markdown";


export async function CaseBody({ caseStudy }: { caseStudy: CaseStudy }) {
    const c = caseStudy;
    const slug = c.slug;

    const content = await import(`@/content/${slug}/content.tsx`).then((mod) => mod.default as string);

    const figures = await import(`@/content/${slug}/figures.tsx`).then((mod) => mod.default as { [key: string]: React.ReactNode });

    return (
        <>
            {
                content.split("FIGURE").map((section, index) => {
                    if (index === 0) return <Markdown key={index}>{section}</Markdown>;

                    const figureName = section.substring(section.indexOf("(") + 1, section.indexOf(")"));

                    if (!figures[figureName]) {
                        console.log(`[WARNING] Figure "${figureName}" not found in figures.tsx for case study "${slug}".`);

                        return <Markdown key={index}>{section.substring(section.indexOf(")") + 1)}</Markdown>;
                    }

                    return (
                        <div key={index} className="">
                            <div className="figure-container">
                                {figures[figureName]}
                            </div>
                            <Markdown>{section.substring(section.indexOf(")") + 1)}</Markdown>
                        </div>
                    );
                })
            }
        </>
    );
}
import { CaseStudy } from "@/content/cases";
import { Tooltip } from "@mantine/core";
import { default as Markdown } from "react-markdown";
import rehypeRaw from "rehype-raw";

const SafeTooltip = ({ children, title }: { children: React.ReactNode, title: string }) => (
    <Tooltip
        label={
            title
        }
        inline
        multiline
        position='bottom'
        w={360}
        events={{ hover: true, focus: true, touch: true }}
        bg={'white'}
        c={'black'}
        classNames={{ 'tooltip': ' tooltip-shadow sans text-[0.95rem]! font-light! text-(--text-light-large)! rounded-lg! px-4! pb-3! pt-2.5!' }}
    >
        <span className="underline underline-offset-4 decoration-(--underline-color-inline) decoration-1 opacity-100 hover:opacity-60 transition-all cursor-pointer">
            {children}
        </span>
    </Tooltip>
);

export async function CaseBody({ caseStudy }: { caseStudy: CaseStudy }) {
    const c = caseStudy;
    const slug = c.slug;

    const content = await import(`@/content/${slug}/content.tsx`).then((mod) => mod.default as string);

    const figures = await import(`@/content/${slug}/figures.tsx`).then((mod) => mod.default as { [key: string]: (caption?: string, mobileCaption?: string) => React.ReactNode });

    return (
        <>
            {
                content.split("FIGURE").map((section, index) => {
                    if (index === 0) return <Markdown key={index}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            abbr: ({ node, children, title }) => (
                                <SafeTooltip title={title ?? ''}>{children}</SafeTooltip>
                            ),
                        }}
                    >{section}</Markdown>;

                    const figureDeclaration = section.substring(section.indexOf("(") + 1, section.indexOf(")")).trim();
                    const figureName = figureDeclaration.split("|")[0].trim();
                    const figureCaption = figureDeclaration.split("|")[1]?.trim() ?? '';
                    const figureMobileCaption = figureDeclaration.split("|")[2]?.trim() ?? '';

                    if (!figures[figureName]) {
                        console.log(`[WARNING] Figure "${figureName}" not found in figures.tsx for case study "${slug}".`);

                        return <Markdown key={index}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                abbr: ({ node, children, title }) => (
                                    <SafeTooltip title={title ?? ''}>{children}</SafeTooltip>
                                ),
                            }}
                        >{section.substring(section.indexOf(")") + 1)}</Markdown>;
                    }

                    return (
                        <div key={index} className="">
                            <div className="figure-container">
                                {figures[figureName](figureCaption, figureMobileCaption)}
                            </div>
                            <Markdown
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    abbr: ({ node, children, title }) => (
                                        <SafeTooltip title={title ?? ''}>{children}</SafeTooltip>
                                    ),
                                }}
                            >
                                {section.substring(section.indexOf(")") + 1)}
                            </Markdown>
                        </div>
                    );
                })
            }
        </>
    );
}
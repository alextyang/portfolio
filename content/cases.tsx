
export type CaseStudy = {
    slug: string;
    isWip?: boolean;

    // For preview cards
    previewTitle: string;
    previewSubtitle: string;

    primaryField: string;
    fieldTags: readonly string[];
    fieldDescription?: string;

    toolTags: readonly string[];

    projectAffiliation: string;
    affiliationDescription: string;

    coverImageFilename: string;
    coverImageAlt: string;

    // For case study page
    title: string;
    subtitle: string;
};

export const caseStudies: readonly CaseStudy[] = [
    {
        slug: "emails",

        // For preview cards
        previewTitle: "Email Production App",
        previewSubtitle: "An internal app that cut active production time by 75% across a workflow sending roughly 5 million emails a month.",

        primaryField: "Full-stack",
        fieldTags: ["Backend", "Frontend Integration"],
        fieldDescription: "Internal tools + email operations",

        toolTags: ["Framework - React, Next.js", "Language - TypeScript", "Styles - TailwindCSS", "Components - MantineUI", "Storage - Airtable", "Integrations - Google Drive, ActiveCampaign, Postmark, Notion, Slack"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "Web Developer, Center Centre, 2025",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "Automating Email Production",
        subtitle: "Cutting active production time by 75% while preserving the team's editing tools and final QA review.",
    },
    {
        slug: "cache",

        // For preview cards
        previewTitle: "Faster Enrollment Data",
        previewSubtitle: "A 270-line cache service that moved cohort data from a 5–10-second wait to first-render availability on snapshot hits, without changing the static hosting model.",

        primaryField: "Backend",
        fieldTags: ["Backend", "Frontend"],
        fieldDescription: "Caching + Airtable integration",

        toolTags: ["Tools - React, Vite, Airtable, Next.js", "Technology - TypeScript, RESTful, Linux"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "Web Developer, Center Centre, 2025",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "Preloading Enrollment Data on Static Course Sites",
        subtitle: "How I evolved a runtime Airtable proxy into a browser-side cache snapshot while preserving the original direct-request fallback.",
    },
    {
        slug: "songs",
        isWip: true,

        // For preview cards
        previewTitle: "Spotify Research Companion",
        previewSubtitle: "A Spotify-synced app that finds and summarizes journalism about the song currently playing.",

        primaryField: "Full-stack",
        fieldTags: ["Frontend", "Backend", "Product Design", "UX/UI"],
        fieldDescription: "",

        toolTags: [""],

        projectAffiliation: "Independent",
        affiliationDescription: "",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "",
        subtitle: "",
    },
    {
        slug: "brands",
        isWip: true,

        // For preview cards
        previewTitle: "Accountability Wiki",
        previewSubtitle: "A MediaWiki-based community site for tracking recurring anti-consumer practices by major brands.",

        primaryField: "Full-stack",
        fieldTags: ["Frontend", "Backend", "Product Design", "UX/UI"],
        fieldDescription: "",

        toolTags: [""],

        projectAffiliation: "Independent",
        affiliationDescription: "",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "",
        subtitle: "",
    },
    {
        slug: "iot",
        isWip: true,

        // For preview cards
        previewTitle: "Timeline-Based Smart Home Automation",
        previewSubtitle: "A prototype comparing a timeline interface with a conventional smart-home automation flow.",

        primaryField: "UX/UI",
        fieldTags: ["UX/UI", "Frontend", "Product Design"],
        fieldDescription: "",

        toolTags: [""],

        projectAffiliation: "Independent",
        affiliationDescription: "",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "",
        subtitle: "",
    },
];

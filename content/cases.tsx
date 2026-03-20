
export type CaseStudy = {
    slug: string;

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
        previewSubtitle: "An internal email templating & publishing tool, start-to-finish managing 5 million sends/month.",

        primaryField: "Fullstack",
        fieldTags: ["Backend", "Frontend Integration"],
        fieldDescription: "",

        toolTags: ["Framework - React, Next.js", "Language - TypeScript", "Styles - TailwindCSS", "Components - MantineUI", "Storage - Airtable", "Integrations - Google Drive, ActiveCampaign, Postmark, Notion, Slack"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "Email Production App",
        subtitle: "",
    },
    {
        slug: "cache",

        // For preview cards
        previewTitle: "Prehydrated Data Service",
        previewSubtitle: "A helper that eliminated latency for 3rd-party data on our static websites.",

        primaryField: "Backend",
        fieldTags: ["Backend", "Frontend"],
        fieldDescription: "Frontend + backend integration",

        toolTags: ["Tools - React, Vite, Airtable, Next.js", "Technology - TypeScript, RESTful, Linux"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "Center Centre, 2025",

        coverImageFilename: "poster.png",
        coverImageAlt: "",

        // For case study page
        title: "Prehydrated Data Service",
        subtitle: "Implementing a cache service that anticipates data needs of static websites, and automatically adapts to variation on both sides of the stack.",
    },
    {
        slug: "songs",

        // For preview cards
        previewTitle: "Spotify Research Companion",
        previewSubtitle: "A Spotify-synced web app that finds and summarizes journalism on the current song.",

        primaryField: "Fullstack",
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

        // For preview cards
        previewTitle: "Accountability Wiki",
        previewSubtitle: "A Mediawiki-powered platform to track anti-consumer behavior and patterns of corporate abuse.",

        primaryField: "Fullstack",
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

        // For preview cards
        previewTitle: "Smart Home Automation UX",
        previewSubtitle: "An alternative vision for IoT automation interfaces, outperforming the current convention.",

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

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
    coverImageMinGlyphSize?: number;

    // For case study page
    title: string;
    subtitle: string;
};

export const caseStudies: readonly CaseStudy[] = [
    {
        slug: "emails",

        // For preview cards
        previewTitle: "Email Publishing Engine",
        previewSubtitle: "An end-to-end internal email production wizard that sends 5 million emails a month.",

        primaryField: "Fullstack",
        fieldTags: ["Backend", "Frontend Integration"],
        fieldDescription: "",

        toolTags: ["Framework - React, Next.js", "Language - TypeScript", "Styles - TailwindCSS", "Components - MantineUI", "Storage - Airtable", "Integrations - Google Drive, ActiveCampaign, Postmark, Notion, Slack"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "",

        coverImageFilename: "poster.png",
        coverImageAlt: "",
        coverImageMinGlyphSize: 8,

        // For case study page
        title: "",
        subtitle: "",
    },
    {
        slug: "cache",

        // For preview cards
        previewTitle: "'Prehydrated' Static Cache",
        previewSubtitle: "Reducing latency of remote data to 0ms on client-only websites.",

        primaryField: "Backend",
        fieldTags: ["Backend", "Frontend"],
        fieldDescription: "Frontend + backend integration",

        toolTags: ["Tools - React, Vite, Airtable, Next.js", "Technology - TypeScript, RESTful, Linux"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "Center Centre, 2025",

        coverImageFilename: "poster.png",
        coverImageAlt: "",
        coverImageMinGlyphSize: 8,

        // For case study page
        title: "'Prehydrated' Static Cache",
        subtitle: "Designing a unique cache strategy that instantly delivers data to static websites, and automatically adapts to variation on both sides of the stack.",
    },
    {
        slug: "iot",

        // For preview cards
        previewTitle: "Prehydrated Static Cache",
        previewSubtitle: "Reducing latency of critical data to +0ms on serverless websites.",

        primaryField: "Fullstack",
        fieldTags: ["Backend", "Frontend Integration"],
        fieldDescription: "",

        toolTags: ["Framework - React, Next.js", "Language - TypeScript", "Styles - TailwindCSS", "Components - MantineUI", "Storage - Airtable", "Integrations - Google Drive, ActiveCampaign, Postmark, Notion, Slack"],

        projectAffiliation: "Center Centre",
        affiliationDescription: "",

        coverImageFilename: "poster.png",
        coverImageAlt: "",
        coverImageMinGlyphSize: 14,

        // For case study page
        title: "",
        subtitle: "",
    },
];
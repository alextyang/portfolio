
export type CaseStudy = {
    slug: string;

    // For preview cards
    previewTitle: string;
    previewSubtitle: string;

    primaryField: string;
    fieldTags?: readonly string[];
    toolTags: readonly string[];

    projectAffiliation: string;

    coverImageFilename: string;
    coverImageAlt: string;
    coverImageMinGlyphSize?: number;

    // For case study page
    title: string;
};

export const caseStudies: readonly CaseStudy[] = [
    {
        slug: "emails",

        // For preview cards
        previewTitle: "Email Publishing Engine",
        previewSubtitle: "An end-to-end internal email production wizard that sends 5 million emails a month.",

        primaryField: "Fullstack",
        toolTags: ["Framework - React, Next.js", "Language - TypeScript", "Styles - TailwindCSS", "Components - MantineUI", "Storage - Airtable", "Integrations - Google Drive, ActiveCampaign, Postmark, Notion, Slack"],

        projectAffiliation: "Center Centre",

        coverImageFilename: "poster.png",
        coverImageAlt: "",
        coverImageMinGlyphSize: 8,

        // For case study page
        title: "",
    },
    {
        slug: "cache",

        // For preview cards
        previewTitle: "Prehydrated Static Cache",
        previewSubtitle: "Reducing latency of critical data to +0ms on serverless websites.",

        primaryField: "Fullstack",
        toolTags: ["Framework - React", "Language - TypeScript", "Storage - Airtable, NoSQL", "Tools - Vite"],

        projectAffiliation: "Center Centre",

        coverImageFilename: "poster.png",
        coverImageAlt: "",
        coverImageMinGlyphSize: 8,

        // For case study page
        title: "Prehydrated Static Cache",
    },
    {
        slug: "iot",

        // For preview cards
        previewTitle: "Prehydrated Static Cache",
        previewSubtitle: "Reducing latency of critical data to +0ms on serverless websites.",

        primaryField: "Fullstack",
        toolTags: ["Framework - React, Next.js", "Language - TypeScript", "Styles - TailwindCSS", "Components - MantineUI", "Storage - Airtable", "Integrations - Google Drive, ActiveCampaign, Postmark, Notion, Slack"],

        projectAffiliation: "Center Centre",

        coverImageFilename: "poster.png",
        coverImageAlt: "",
        coverImageMinGlyphSize: 14,

        // For case study page
        title: "",
    },
];
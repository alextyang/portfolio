import Image from "next/image";

export default {
    // Images
    "Heavy email calendar in Notion": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/email-calendar.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Course schedule sheet vs schedule documentation": (caption: string) => (
        <></>
    ),
    "Image of content doc template with highlighted placeholders": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/highlighted-template-doc.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Image of Stripo editor": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/stripo-editor.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Image of ActiveCampaign campaign": (caption: string) => (
        <></>
    ),
    "Image of ActiveCampaign automations": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/ac-automation.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Comparison of two instances of the same email type": (caption: string) => (
        <></>
    ),
    "Airtable with only website fields": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/airtable.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Notion or screenshot of schedule configuration": (caption: string) => (
        <></>
    ),
    "Image of schedule page of app": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/eta-schedule.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Stripo templates, transforms notion page": (caption: string) => (
        <></>
    ),
    "Settings code, settings Notion page": (caption: string) => (
        <></>
    ),
    "Image of filling variables stage": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/eta-template-editor.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Marketing email publishing stage in app": (caption: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/eta-publisher.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Image of automation assistant": (caption: string) => (
        <></>
    ),

    // Compound figures
    "Component, notion article, and video of the variable system I created": (caption: string) => (
        <></>
    ),
    "Map of full process": (caption: string) => (
        <></>
    ),
    "Map of final email process": (caption: string) => (
        <></>
    ),
    "Chart of one-off email speed": (caption: string) => (
        <></>
    ),

} as { [key: string]: (caption: string) => React.ReactNode }; 
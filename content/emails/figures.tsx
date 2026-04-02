import { SegmentedContent } from "@/components/content/segmentedContent";
import Image from "next/image";

export default {
    // Images
    "Heavy email calendar in Notion": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full ">
            <Image src={'/case/emails/email-calendar.png'} width={625} height={300} alt='' className="rounded-2xl "></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Course schedule sheet vs schedule documentation": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full mt-6 flex flex-col lg:flex-row">
                <Image
                    width={625} height={300}
                    src={'/case/emails/calendar-sot-sheet-win.png'}
                    className="relative left-0 lg:-left-35 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                    alt=""
                />
                <Image
                    width={625} height={300}
                    src={'/case/emails/email-scheduling-checklist.png'}
                    className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-0 right-0 lg:-right-35 rounded-md w-full sm:max-w-112 lg:max-w-99 shadow-md"
                    alt=""
                />
            </div>
            <p className="sans small opacity-60 mt-5! hidden lg:block">{caption}</p>
            <p className="sans small opacity-60 mt-5! lg:hidden block">{mobileCaption}</p>
        </>
    ),
    "Image of content doc template with highlighted placeholders": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/highlighted-template-doc.png'} width={450} height={300} alt='' className="rounded-2xl mx-auto shadow-md pt-4"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Image of Stripo editor": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/stripo-editor.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Image of ActiveCampaign campaign": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/ac-campaign.png'} width={600} height={300} alt='' className="rounded-2xl mx-auto shadow-md -mt-1!"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Image of ActiveCampaign automations": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/ac-automation.png'} width={650} height={300} alt='' className="rounded-2xl mx-auto shadow-md mt-16! scale-110 "></Image>
            <p className="sans small opacity-60 mt-12!">{caption}</p>
        </div>
    ),
    "Comparison of two instances of the same email type": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full mt-6">
                <Image
                    width={400} height={300}
                    src={'/case/emails/metrics-example1.png'}
                    className="relative -left-10 xs:-left-25 lg:-left-22.5 rounded-xl max-w-90 sm:max-w-110 shadow-md"
                    alt=""
                />
                <Image
                    width={400} height={300}
                    src={'/case/emails/metrics-example2.png'}
                    className="absolute top-0 mt-25 xs:mt-15 lg:mt-0 sm:ml-auto -right-10 xs:-right-25 lg:-right-22.5 rounded-md max-w-90 sm:max-w-110 shadow-md"
                    alt=""
                />
            </div>
            <p className="sans small opacity-60 mt-31! sm:mt-31.5! lg:mt-5!">{caption}</p>
        </>
    ),
    "Airtable with only website fields": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full -mt-2.5">
            <Image src={'/case/emails/airtable.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Notion or screenshot of schedule configuration": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Documentation', 'Code']} segments={[
                (
                    <div className="relative w-full mt-3.5">
                        <Image src={'/case/emails/schedule-config-example.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
                    </div>
                ),
                (
                    <div className="relative w-full mt-3.5">
                        <Image src={'/case/emails/schedule-config.png'} width={625} height={300} alt='' className="bg-[#1f1f1f] pl-3 pt-4 rounded-2xl"></Image>
                    </div>
                )
            ]} />
            <p className="sans small opacity-60 mt-3!">{caption}</p>
        </>
    ),
    "Video of schedule page of app": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full mt-10!">
                <video
                    src={'/case/emails/eta-schedule.mp4'}
                    className="relative rounded-2xl w-full shadow-md overflow-hidden "
                    muted={true}
                    autoPlay
                    loop
                />
            </div>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),
    "Stripo templates, transforms notion page": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Stripo Template', 'Transformation Documentation']} segments={[
                (
                    <div className="relative w-full mt-4">
                        <Image src={'/case/emails/dynamic-template-transactional.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[0] ?? ''}</p>
                    </div>
                ),
                (
                    <div className="relative w-full mt-4.5">
                        <Image src={'/case/emails/eta-transformation-doc.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[1] ?? ''}</p>
                    </div>
                )
            ]} />
        </>
    ),
    "Settings code, settings Notion page": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Code', 'Documentation']} segments={[
                (
                    <div className="relative w-full mt-4">
                        <Image src={'/case/emails/eta-value-config.png'} width={625} height={300} alt='' className="shadow-md bg-[#1f1f1f] pl-1 py-1.5 rounded-2xl"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[0] ?? ''}</p>
                    </div>
                ),
                (
                    <div className="relative w-full mt-4.5">
                        <Image src={'/case/emails/eta-value-config-docs.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[1] ?? ''}</p>
                    </div>
                )
            ]} />
        </>
    ),
    "Marketing email publishing stage in app": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full">
            <Image src={'/case/emails/eta-publisher.png'} width={525} height={300} alt='' className="rounded-2xl mx-auto shadow-md bg-white p-3.5"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),
    "Video of automation assistant": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full mt-6!">
                <video
                    src={'/case/emails/eta-automation-assistant.mp4'}
                    className="relative rounded-2xl w-full shadow-md bg-white px-5 pt-1 pb-0"
                    muted={true}
                    autoPlay
                    loop
                />
            </div>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),

    // Compound figures
    "Component, notion article, and video of the variable system I created": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Email Production Tool', 'Variable Documentation']} segments={[
                (
                    <div className="relative w-full mt-4">
                        <video
                            src={'/case/emails/eta-template-population.mp4'}
                            className="relative rounded-2xl w-full shadow-md"
                            muted={true}
                            autoPlay
                            loop
                        />
                    </div>
                ),
                (
                    <div className="relative w-full mt-3.5">
                        <Image src={'/case/emails/eta-variables-doc.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
                    </div>
                )
            ]} />
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),

    "Map of full process": (caption: string, mobileCaption?: string) => (
        <></>
    ),
    "Map of final email process": (caption: string, mobileCaption?: string) => (
        <></>
    ),
    "Chart of one-off email speed": (caption: string, mobileCaption?: string) => (
        <></>
    ),

} as { [key: string]: (caption: string, mobileCaption?: string) => React.ReactNode }; 
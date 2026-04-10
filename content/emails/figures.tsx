import { SegmentedContent } from "@/components/content/segmentedContent";
import Image from "next/image";
import { ErrorsSavedEstimate, ErrorsSavedSnippet, HoursSavedSnippet, IncidentsSavedSnippet, TimeSavedEstimate } from "./clientFigures";

export default {
    // Images
    "Heavy email calendar in Notion": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full ">
            <Image src={'/case/emails/email-calendar.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
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
    "Simple Stripo template, variable documentation page": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Template-ized Design', 'Variable System Documentation']} segments={[
                (
                    <div className="relative w-full mt-4">
                        <Image src={'/case/emails/dynamic-template-simple.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[0] ?? ''}</p>
                    </div>
                ),
                (
                    <div className="relative w-full mt-3.5">
                        <Image src={'/case/emails/eta-variables-doc.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[1] ?? ''}</p>
                    </div>
                )
            ]} />
        </>
    ),
    "Transformation Stripo templates": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Transactional Template', 'Marketing Template']} segments={[
                (
                    <div className="relative w-full mt-4">
                        <Image src={'/case/emails/dynamic-template-transactional.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[0] ?? ''}</p>
                    </div>
                ),
                (
                    <div className="relative w-full mt-4.5">
                        <Image src={'/case/emails/dynamic-template-marketing.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                        <p className="sans small opacity-60 mt-4!">{caption.split('_')[1] ?? ''}</p>
                    </div>
                ),
            ]} />
        </>
    ),
    "Transformation documentation": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full mt-4.5">
                <Image src={'/case/emails/eta-transformation-doc.png'} width={625} height={300} alt='' className="rounded-2xl shadow-md"></Image>
                <p className="sans small opacity-60 mt-4!">{caption.split('_')[0] ?? ''}</p>
            </div>
        </>
    ),
    "Variable fill demonstration": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full mt-4">
                <video
                    src={'/case/emails/eta-template-population.mp4'}
                    className="relative rounded-2xl w-full shadow-md"
                    muted={true}
                    autoPlay
                    loop
                />
            </div>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),
    "Settings code, settings Notion page": (caption: string, mobileCaption?: string) => (
        <>
            <SegmentedContent labels={['Settings Config', 'Settings Documentation']} segments={[
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

    // Scripted figures
    "Time saved estimate": (caption: string, mobileCaption?: string) => (
        <TimeSavedEstimate />
    ),

    "Hours saved header": (caption: string, mobileCaption?: string) => (
        <h2 className="block w-fit -mt-2! -mb-3! ">
            a. <span className=" text-2xl! relative -top-0.5 inline-block h-0! "><HoursSavedSnippet /></span> Hours Saved (so Far)
        </h2>
    ),

    "Errors saved estimate": (caption: string, mobileCaption?: string) => (
        <span className="sans opacity-100 font-[350]! text-lg bg-gray-100 px-2 -mt-3! -mb-5! block w-fit">
            <ErrorsSavedEstimate />
        </span>
    ),
    "Errors saved header": (caption: string, mobileCaption?: string) => (
        <h2 className="block w-fit -mt-2! -mb-3! ">
            b. <span className=" text-2xl! relative -top-0.5 inline-block h-0! "><ErrorsSavedSnippet /></span> Mistakes Prevented (<span className=" text-2xl! relative -top-0.5 inline-block h-0! "><IncidentsSavedSnippet /></span> in production)
        </h2>
    ),

    // Compound figures
    "Gallery of email tool": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full flex flex-col gap-5 lg:-mx-20! lg:w-[calc(100%+160px)]">
                <div className="relative w-full flex flex-row gap-5">
                    <div className="flex flex-col gap-4">
                        <div className="">
                            <img
                                src={'/case/emails/eta-demo-edit-popup.png'}
                                className="relative rounded-2xl shadow-md w-full"
                            />
                            <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">A warning system to prevent local & exported versions from conflicting.</p>
                        </div>
                        <div className="">
                            <video
                                src={'/case/emails/eta-demo-publisher.mp4'}
                                className="relative rounded-2xl shadow-md w-full"
                                muted={true}
                                autoPlay
                                loop
                            />
                            <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">Features of the publishing process: undo, smart links, and polling.</p>
                        </div>

                    </div>

                    <div className="">
                        <video
                            src={'/case/emails/eta-demo-dynamic-form.mp4'}
                            className="relative rounded-2xl shadow-md w-full"
                            muted={true}
                            autoPlay
                            loop
                        />
                        <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">Dynamically-generated template form.</p>
                    </div>
                </div>

                <div className="">
                    <video
                        src={'/case/emails/eta-demo-html-editor.mp4'}
                        className="relative rounded-2xl shadow-md w-full"
                        muted={true}
                        autoPlay
                        loop
                    />
                    <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">Built-in HTML editor for one-time adjustments to template styles or layout.</p>
                </div>

                <div className="relative w-full flex flex-row gap-5">

                    <div className="">
                        <video
                            src={'/case/emails/eta-demo-email-saves.mp4'}
                            className="relative rounded-2xl shadow-md w-full"
                            muted={true}
                            autoPlay
                            loop
                        />
                        <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">In-progress emails in sidebar.</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="">
                            <video
                                src={'/case/emails/eta-demo-email-card.mp4'}
                                className="relative rounded-2xl shadow-md w-full"
                                muted={true}
                                autoPlay
                                loop
                            />
                            <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">Quick-access card for manual fallbacks during publishing.</p>
                        </div>
                        <div className="">
                            <video
                                src={'/case/emails/eta-demo-schedule-entry.mp4'}
                                className="relative rounded-2xl shadow-md w-full"
                                muted={true}
                                autoPlay
                                loop
                            />
                            <p className="sans small opacity-60 mt-2! px-2.5 text-xs! h-0 mb-2!">Email-session entry in schedule, with calendar and participant notes integration.</p>
                        </div>

                    </div>


                </div>
            </div>
        </>

    ),
    "Gallery of side projects": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full flex flex-col gap-5 md:-mx-15! lg:gap-8 lg:-mx-25! xl:-mx-45! md:w-[calc(100%+120px)] lg:w-[calc(100%+200px)] xl:w-[calc(100%+360px)] mt-8!">
                <div className="relative w-full flex flex-col md:flex-row gap-8 md:gap-5 lg:gap-8">
                    <div className="">
                        <video
                            src={'/case/emails/backlog-bundle-navigation.mp4'}
                            className="relative rounded-2xl shadow-md w-full"
                            muted={true}
                            autoPlay
                            loop
                        />
                        <p className="sans small opacity-60 mt-3.5! px-2.5 h-0 mb-8!">A bundled-course product, launched with a brand-new data driven website and navigation design.</p>
                    </div>
                    <div className="">
                        <img
                            src={'/case/emails/backlog-redesign.png'}
                            className="relative rounded-2xl shadow-md w-full"
                        />
                        <p className="sans small opacity-60 mt-3.5! px-2.5 h-0 mb-8!">A re-designed landing page with new branding for our flagship 16-week leadership course.</p>
                    </div>
                </div>
                <div className="relative w-full flex flex-col md:flex-row gap-8 md:gap-5 lg:gap-8">
                    <div className="">
                        <img
                            src={'/case/emails/backlog-footer.png'}
                            className="relative rounded-2xl shadow-md w-full"
                        />
                        <p className="sans small opacity-60 mt-3.5! px-2.5 h-0 mb-8!">An new universal footer, providing a newly succinct map of Center Centre programs.</p>
                    </div>
                    <div className="">
                        <video
                            src={'/case/emails/backlog-speaking.mp4'}
                            className="relative rounded-2xl shadow-md w-full"
                            muted={true}
                            autoPlay
                            loop
                        />
                        <p className="sans small opacity-60 mt-3.5! px-2.5 h-0 mb-8!">Call to actions on a new website that explores corporate-oriented services in detail, a key profit driver.</p>
                    </div>
                </div>
            </div>
        </>

    ),
    "Map of final email process": (caption: string, mobileCaption?: string) => (
        <></>
    ),
    "Chart of one-off email speed": (caption: string, mobileCaption?: string) => (
        <>
            <div dangerouslySetInnerHTML={{ __html: '<iframe title="Urgent Email Turnaround Time" aria-label="Scatter Plot" id="datawrapper-chart-Asfta" src="https://datawrapper.dwcdn.net/Asfta/7/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="480" data-external="1"></iframe><script type="text/javascript">window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"]){var e=document.querySelectorAll("iframe");for(var t in a.data["datawrapper-height"])for(var r,i=0;r=e[i];i++)if(r.contentWindow===a.source){var d=a.data["datawrapper-height"][t]+"px";r.style.height=d}}});</script>' }} />
        </>
    ),

    "Chart of email QA speed": (caption: string, mobileCaption?: string) => (
        <>
            <div dangerouslySetInnerHTML={{ __html: '<iframe title="Email QA Review Timelines" aria-label="Scatter Plot" id="datawrapper-chart-OYtBw" src="https://datawrapper.dwcdn.net/OYtBw/7/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="480" data-external="1"></iframe><script type="text/javascript">window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"]){var e=document.querySelectorAll("iframe");for(var t in a.data["datawrapper-height"])for(var r,i=0;r=e[i];i++)if(r.contentWindow===a.source){var d=a.data["datawrapper-height"][t]+"px";r.style.height=d}}});</script>' }} />
        </>
    ),

    "Chart of email error rate": (caption: string, mobileCaption?: string) => (
        <>
            <div dangerouslySetInnerHTML={{ __html: '<iframe title="Email Error Rate by Month" aria-label="Stacked Bars" id="datawrapper-chart-PzUBC" src="https://datawrapper.dwcdn.net/PzUBC/1/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="356" data-external="1"></iframe><script type="text/javascript">window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"]){var e=document.querySelectorAll("iframe");for(var t in a.data["datawrapper-height"])for(var r,i=0;r=e[i];i++)if(r.contentWindow===a.source){var d=a.data["datawrapper-height"][t]+"px";r.style.height=d}}});</script>' }} />
        </>
    ),

} as { [key: string]: (caption: string, mobileCaption?: string) => React.ReactNode };
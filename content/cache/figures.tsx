import { SegmentedContent } from "@/components/content/segmentedContent";
import { VideoSync } from "@/components/media/videoSync";
import { Pill, Table } from "@mantine/core";
import Image from "next/image";

export default {
    // Images
    "Image of Cohort Selector": (
        <div className="relative w-full">
            <Image src={'/case/cache/metrics-homepage.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">A landing page for one of Center Centre's UX courses, featuring a call-to-action that lists the options for upcoming cohorts.</p>
        </div>
    ),


    // Videos
    "Videos of initial loading time - home & cohort pages": (
        <>
            <SegmentedContent labels={['Landing page', 'Cohort-specific pages']} segments={[
                (
                    <div className="relative w-full mt-6">
                        <video
                            src={'/case/cache/home-stage1-page1.mp4'}
                            className="relative left-0 lg:-left-30 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                            muted={true}
                            autoPlay

                            loop
                            id="vid-hs1p1"
                        />
                        <video
                            src={'/case/cache/home-stage1-page2.mp4'}
                            className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-14 right-0 lg:-right-32 rounded-md w-full sm:max-w-112 lg:max-w-106 shadow-md"
                            muted={true}
                            autoPlay
                            loop
                            id="vid-hs1p2"
                        />
                        <VideoSync leaderID="vid-hs1p1" followerIDs={["vid-hs1p2"]} />
                    </div>
                ),
                (
                    <div className="relative w-full mt-6">
                        <video
                            src={'/case/cache/cohort-stage1-page1.mp4'}
                            className="relative left-0 lg:-left-30 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                            muted={true}
                            autoPlay

                            loop
                            id="vid-cs1p1"
                        />
                        <video
                            src={'/case/cache/cohort-stage1-page2.mp4'}
                            className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-14 right-0 lg:-right-32 rounded-md w-full sm:max-w-112 lg:max-w-106 shadow-md"
                            muted={true}
                            autoPlay
                            loop
                            id="vid-cs1p2"
                        />
                        <VideoSync leaderID="vid-cs1p1" followerIDs={["vid-cs1p2"]} />
                    </div>
                )
            ]} />
            <p className="sans small opacity-60 mt-5!">The delay before data populated could take up to 10 seconds. Almost all pages featured dynamic content above the fold, and cohort-specific pages were almost entirely data-driven. On the timeline, see the sequential/paginated requests play out.</p>
        </>
    ),
    "Videos of runtime cache loading time - home & cohort pages": (
        <>
            <SegmentedContent labels={['Landing page', 'Cohort-specific pages']} segments={[
                (
                    <div className="relative w-full mt-6">
                        <video
                            src={'/case/cache/home-stage2-page1.mp4'}
                            className="relative left-0 lg:-left-30 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                            muted={true}
                            autoPlay

                            loop
                            id="vid-hs2p1"
                        />
                        <video
                            src={'/case/cache/home-stage2-page2.mp4'}
                            className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-14 right-0 lg:-right-32 rounded-md w-full sm:max-w-112 lg:max-w-106 shadow-md"
                            muted={true}
                            autoPlay
                            loop
                            id="vid-hs2p2"
                        />
                        <VideoSync leaderID="vid-hs2p1" followerIDs={["vid-hs2p2"]} />
                    </div>
                ),
                (
                    <div className="relative w-full mt-6">
                        <video
                            src={'/case/cache/cohort-stage2-page1.mp4'}
                            className="relative left-0 lg:-left-30 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                            muted={true}
                            autoPlay

                            loop
                            id="vid-cs2p1"
                        />
                        <video
                            src={'/case/cache/cohort-stage2-page2.mp4'}
                            className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-14 right-0 lg:-right-32 rounded-md w-full sm:max-w-112 lg:max-w-106 shadow-md"
                            muted={true}
                            autoPlay
                            loop
                            id="vid-cs2p2"
                        />
                        <VideoSync leaderID="vid-cs2p1" followerIDs={["vid-cs2p2"]} />
                    </div>
                )
            ]} />
            <p className="sans small opacity-60 mt-5!">The delay was now much better, only a few seconds at most. However, the data-driven pages still suffered from a noticeable awkward content shift.</p>
        </>
    ),
    "Videos of preload solution loading time - home & cohort pages": (
        <>
            <SegmentedContent labels={['Landing page', 'Cohort-specific pages']} segments={[
                (
                    <div className="relative w-full mt-6">
                        <video
                            src={'/case/cache/home-stage3-page1.mp4'}
                            className="relative left-0 lg:-left-30 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                            muted={true}
                            autoPlay

                            loop
                            id="vid-hs3p1"
                        />
                        <video
                            src={'/case/cache/home-stage3-page2.mp4'}
                            className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-14 right-0 lg:-right-32 rounded-md w-full sm:max-w-112 lg:max-w-106 shadow-md"
                            muted={true}
                            autoPlay
                            loop
                            id="vid-hs3p2"
                        />
                        <VideoSync leaderID="vid-hs3p1" followerIDs={["vid-hs3p2"]} />
                    </div>
                ),
                (
                    <div className="relative w-full mt-6">
                        <video
                            src={'/case/cache/cohort-stage3-page1.mp4'}
                            className="relative left-0 lg:-left-30 rounded-xl w-full sm:max-w-132 lg:max-w-124 shadow-md"
                            muted={true}
                            autoPlay

                            loop
                            id="vid-cs3p1"
                        />
                        <video
                            src={'/case/cache/cohort-stage3-page2.mp4'}
                            className="relative lg:absolute sm:-mb-23 lg:mb-0 sm:bottom-24 mt-8 sm:mt-0 sm:ml-auto lg:bottom-14 right-0 lg:-right-32 rounded-md w-full sm:max-w-112 lg:max-w-106 shadow-md"
                            muted={true}
                            autoPlay
                            loop
                            id="vid-cs3p2"
                        />
                        <VideoSync leaderID="vid-cs3p1" followerIDs={["vid-cs3p2"]} />
                    </div>
                )
            ]} />
            <p className="sans small opacity-60 mt-5!">The data was now populating on first render. Even the richest schedules and pages felt completely integrated into the site.</p>
        </>
    ),
    "Videos of aggregated schedules on one page": (
        <>
            <div className="relative w-full mt-10!">
                <video
                    src={'/case/cache/combined-schedules.mp4'}
                    className="relative rounded-2xl w-full  shadow-md"
                    muted={true}
                    autoPlay
                    loop
                />
            </div>
            <p className="sans small opacity-60 mt-5!">A new homepage for Center Centre is in development, full of dynamic content and bridging the gap between various courses, programs, and events.</p>

        </>
    ),

    // Diagrams
    "Flowchart of Initial Solution": (
        <>
            <div className="relative w-full">
                <Image src={'/case/cache/initial-flow.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
                {/* <p className="sans small opacity-60 mt-5!">A map of the initial 'direct fetch' implementation. The static React bundle is downloaded into the browser and begins rendering, then it makes a call directly to Airtable for the schedule data.</p> */}
            </div>
        </>
    ),
    "Pros Cons chart of initial solutions": (
        <>
            <Table data={{
                caption: "",
                head: [" ", "Airtable API calls", "Pre-downloaded data file", "Middleware server cache"],
                body: [
                    [
                        'Implementation',
                        <Pill bg='green' c='white' className=" font-medium">
                            Simple
                        </Pill>,
                        <Pill bg='orange' c='white' className=" font-medium">
                            Moderate
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Simple
                        </Pill>
                    ],
                    [
                        'Added Latency',
                        <Pill bg='red' c='white' className=" font-medium">
                            High (5-10s)
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            Low (1-3s)
                        </Pill>
                    ],
                    [
                        'Reliability',
                        <Pill bg='green' c='white' className=" font-medium">
                            Extremely reliable
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            Risk of out-of-date data
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Falls back to direct API calls if downtime
                        </Pill>,
                    ],
                    [
                        'Regular Maintenance',
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            Risk of regular update needs
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Low risk
                        </Pill>,
                    ],
                    [
                        'Long-term Maintenance',
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                        <Pill bg='orange' c='white' className=" font-medium">
                            High risk of long term change
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Low risk
                        </Pill>,
                    ],
                ]
            }} classNames={{ 'td': 'sans' }} />
        </>
    ),
    "Flow chart of runtime middleman cache": (
        <>
            <Image src={'/case/cache/runtime-flow.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
            {/* <p className="sans small opacity-60 mt-5!">A map of the 'runtime' middleman implementation. Instead of calling to Airtable directly, API calls are made to the Next.js service, which serves cached requests much faster.</p> */}
        </>
    ),
    "Pros Cons chart of final solutions": (
        <>
            <Table data={{
                caption: "",
                head: [" ", "Airtable API calls", "Middleware server cache", "Middleware prehydrated cache"],
                body: [
                    [
                        'Implementation',
                        <Pill bg='green' c='white' className=" font-medium">
                            Simple
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Simple
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Simple
                        </Pill>,
                    ],
                    [
                        'Added Latency',
                        <Pill bg='red' c='white' className=" font-medium">
                            High (5-10s)
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            Low (1-3s)
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                    ],
                    [
                        'Reliability',
                        <Pill bg='green' c='white' className=" font-medium">
                            Extremely reliable
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Falls back to direct API calls if downtime
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Same fallback system
                        </Pill>,
                    ],
                    [
                        'Regular Maintenance',
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Low risk
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Low risk
                        </Pill>,
                    ],
                    [
                        'Long-term Maintenance',
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Low risk
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Low risk
                        </Pill>,
                    ],
                ]
            }} />
        </>
    ),
    "Flowchart of preload solution": (
        <>
            <Image src={'/case/cache/static-flow.png'} width={1225} height={600} alt='' className="rounded-2xl "></Image>
            {/* <p className="sans small opacity-60 mt-5!">A map of the static bundle implementation. The middleman's cache is pre-loaded onto the client, and it can instantly serve itself all cached requests.</p> */}
        </>
    ),

} as { [key: string]: React.ReactNode };
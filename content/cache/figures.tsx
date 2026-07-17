import { SegmentedContent } from "@/components/content/segmentedContent";
import { VideoSync } from "@/components/media/videoSync";
import { Pill, Table } from "@mantine/core";
import Image from "next/image";

export default {
    // Images
    "Image of Cohort Selector": (caption: string, mobileCaption?: string) => (
        <div className="relative w-full">
            <Image src={'/case/cache/metrics-homepage.png'} width={625} height={300} alt='Course landing page with upcoming cohort dates and enrollment links' className="rounded-2xl"></Image>
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </div>
    ),


    // Videos
    "Videos of initial loading time - home & cohort pages": (caption: string, mobileCaption?: string) => (
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
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),
    "Videos of runtime cache loading time - home & cohort pages": (caption: string, mobileCaption?: string) => (
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
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),
    "Videos of preload solution loading time - home & cohort pages": (caption: string, mobileCaption?: string) => (
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
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),
    "Videos of aggregated schedules on one page": (caption: string, mobileCaption?: string) => (
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
            <p className="sans small opacity-60 mt-5!">{caption}</p>
        </>
    ),

    // Diagrams
    "Flowchart of Initial Solution": (caption: string, mobileCaption?: string) => (
        <>
            <div className="relative w-full">
                <Image src={'/case/cache/initial-flow.png'} width={625} height={300} alt='Static course site fetching schedule data directly from Airtable after the application loads' className="rounded-2xl"></Image>
                {/* <p className="sans small opacity-60 mt-5!">A map of the initial 'direct fetch' implementation. The static React bundle is downloaded into the browser and begins rendering, then it makes a call directly to Airtable for the schedule data.</p> */}
            </div>
        </>
    ),
    "Pros Cons chart of initial solutions": (caption: string, mobileCaption?: string) => (
        <>
            <Table data={{
                caption: "Comparison of the approaches considered before building the proxy",
                head: [" ", "Direct Airtable", "Static export", "Runtime proxy"],
                body: [
                    [
                        'Client integration',
                        <Pill bg='green' c='white' className=" font-medium">
                            Existing request path
                        </Pill>,
                        <Pill bg='orange' c='white' className=" font-medium">
                            Load exported data
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Route requests through proxy
                        </Pill>
                    ],
                    [
                        'Observed data wait',
                        <Pill bg='red' c='white' className=" font-medium">
                            5–10 sec
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            None
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            1–2 sec after warm-up
                        </Pill>
                    ],
                    [
                        'Freshness',
                        <Pill bg='green' c='white' className=" font-medium">
                            Request-time
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            Export interval
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Revalidation interval
                        </Pill>,
                    ],
                    [
                        'Miss or failure path',
                        <Pill bg='green' c='white' className=" font-medium">
                            Airtable is the only path
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            Last exported data
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Direct Airtable
                        </Pill>,
                    ],
                    [
                        'New query shapes',
                        <Pill bg='green' c='white' className=" font-medium">
                            Works on next request
                        </Pill>,
                        <Pill bg='orange' c='white' className=" font-medium">
                            Exporter must change
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Cached after first request
                        </Pill>,
                    ],
                ]
            }} classNames={{ 'td': 'sans' }} />
        </>
    ),
    "Flow chart of runtime proxy cache": (caption: string, mobileCaption?: string) => (
        <>
            <Image src={'/case/cache/runtime-flow.png'} width={625} height={300} alt='Course site requesting data through a proxy that returns a cached response or calls Airtable on a miss' className="rounded-2xl"></Image>
            {/* Runtime proxy: the site requests data from the Next.js cache, which calls Airtable on a miss. */}
        </>
    ),
    "Pros Cons chart of final solutions": (caption: string, mobileCaption?: string) => (
        <>
            <Table data={{
                caption: "Observed behavior of the direct, proxy, and snapshot request paths",
                head: [" ", "Direct Airtable", "Runtime proxy", "Preloaded snapshot"],
                body: [
                    [
                        'Client integration',
                        <Pill bg='green' c='white' className=" font-medium">
                            Existing request path
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Route requests through proxy
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Load and check snapshot
                        </Pill>,
                    ],
                    [
                        'Observed data wait',
                        <Pill bg='red' c='white' className=" font-medium">
                            5–10 sec
                        </Pill>,
                        <Pill bg='yellow' c='white' className=" font-medium">
                            1–2 sec after warm-up
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            None on hit
                        </Pill>,
                    ],
                    [
                        'Freshness',
                        <Pill bg='green' c='white' className=" font-medium">
                            Request-time
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Revalidation interval
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Revalidation + snapshot interval
                        </Pill>,
                    ],
                    [
                        'Miss or failure path',
                        <Pill bg='green' c='white' className=" font-medium">
                            Airtable is the only path
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Direct Airtable
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Proxy, then Airtable
                        </Pill>,
                    ],
                    [
                        'New query shape',
                        <Pill bg='green' c='white' className=" font-medium">
                            Works on next request
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Cached after first request
                        </Pill>,
                        <Pill bg='green' c='white' className=" font-medium">
                            Added after first request and next snapshot
                        </Pill>,
                    ],
                ]
            }} />
        </>
    ),
    "Flowchart of preload solution": (caption: string, mobileCaption?: string) => (
        <>
            <Image src={'/case/cache/static-flow.png'} width={1225} height={600} alt='Course site checking a preloaded snapshot, then the runtime proxy, then Airtable' className="rounded-2xl "></Image>
            {/* Snapshot path: the browser checks preloaded data before falling through to the proxy and Airtable. */}
        </>
    ),

} as { [key: string]: (caption: string, mobileCaption?: string) => React.ReactNode };

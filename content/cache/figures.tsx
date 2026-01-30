import Image from "next/image";

export default {
    // Images
    "Image of Cohort Selector": (
        <div className="relative w-full ">
            <Image src={'/case/cache/metrics-homepage.png'} width={625} height={300} alt='' className="rounded-2xl"></Image>
        </div>
    ),


    // Videos
    "Videos of initial loading time - home & cohort pages": (
        <>

        </>
    ),
    "Videos of runtime cache loading time - home & cohort pages": (
        <>

        </>
    ),
    "Videos of preload solution loading time - home & cohort pages": (
        <>

        </>
    ),
    "Videos of aggregated schedules on one page": (
        <>

        </>
    ),

    // Diagrams
    "Flowchart of Initial Solution": (
        <>

        </>
    ),
    "Pros Cons chart of initial solutions": (
        <>

        </>
    ),
    "Flow chart of runtime middleman cache": (
        <>

        </>
    ),
    "Pros Cons chart of final solutions": (
        <>

        </>
    ),
    "Flowchart of preload solution": (
        <>

        </>
    ),

} as { [key: string]: React.ReactNode };
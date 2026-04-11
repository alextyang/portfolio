import { CasePoster } from "@/components/content/casePoster";
import LandingHeader from "@/components/content/landingHeader";
import { caseStudies } from "@/content/cases";

export default function Home() {

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-start px-(--page-x-margin) pt-(--page-top) ">

      <LandingHeader />

      <main className="relative max-w-(--page-width) w-full ">

        <p className="opacity-60 sans small !mt-20 !mb-0">Web Dev Fellow @ Center Centre&nbsp;&nbsp;<span className="opacity-50 ml-1">------------------------------------------------------------------------------------</span></p>

        {/* <p className="mb-8! mt-4! text-base!">Built infrastructure, both user-facing and internal, </p> */}


        <div className="flex flex-row -mx-[2px] gap-8 mt-10 ">
          <CasePoster caseStudy={caseStudies[0]} />
          <CasePoster caseStudy={caseStudies[1]} />
        </div>



        <p className="opacity-60 sans small !mt-20 !mb-0">Independent Work&nbsp;&nbsp;<span className="opacity-50 ml-1">----------------------------------------------------------------------------------------------------</span></p>

        <div className="flex flex-row -mx-1 gap-8 mt-8 mb-20 ">
          <CasePoster caseStudy={caseStudies[2]} />
          <CasePoster caseStudy={caseStudies[3]} />
        </div>
        <div className="flex flex-row -mx-1 gap-8 mt-8 mb-20 ">
          <CasePoster caseStudy={caseStudies[4]} />
        </div>
      </main>
    </div>
  );
}

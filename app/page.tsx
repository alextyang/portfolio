import { CasePoster } from "@/components/content/casePoster";
import { caseStudies } from "@/content/cases";


export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center px-(--page-x-margin) pt-(--page-top) ">
      <main className="max-w-(--page-width) w-full ">
        <h2>Alexander Yang</h2>
        <p>I'm a full-stack developer that closes gaps between design, engineering, and product with a broad toolkit and rapid iteration. <span className="opacity-50">Your impatient PM's favorite developer.</span></p>
        {/* launch-hungry PM, most ambitious designer,  */}
        <div className="mt-4.5! mb-7.5! grid grid-cols-2 ">
          <p className="m-0! text-base! font-light! italic">
            <a href="" className="pr-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline underline-offset-4 ">About</a>
            <a href="" className="px-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline underline-offset-4">Resume</a>
            <a href="" className="pl-1.75 py-1.5 opacity-60 hover:opacity-100 hover:underline underline-offset-4">Contact</a></p>
        </div>



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

import { CasePoster } from "@/components/content/casePoster";
import { caseStudies } from "@/content/cases";


export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center px-(--page-x-margin) pt-(--page-top) ">
      <main className="max-w-(--page-width) w-full ">
        <h2>Alexander Yang</h2>
        <p>I'm a full-stack developer with an interdisciplinary toolkit. Lorem Ipsum is simply dummy text of the printing and typesetting industry. It was popularised in the 1960s with the release of Letraset containing passages.</p>
        <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged, lorem ipsum.</p>




        <p className="opacity-60 sans small !mt-20 !mb-6 ">Recent Projects&nbsp;&nbsp;<span className="opacity-5">-----------------------------------------------------------------------------------------------</span></p>

        <div className="flex flex-row -mx-[2px] gap-8 mt-4 ">
          <CasePoster caseStudy={caseStudies[0]} />
          <CasePoster caseStudy={caseStudies[1]} />
        </div>
        <div className="flex flex-row -mx-1 gap-8 mt-12 ">
          {/* <CasePoster caseStudy={caseStudies[1]} /> */}
        </div>



      </main>
    </div>
  );
}

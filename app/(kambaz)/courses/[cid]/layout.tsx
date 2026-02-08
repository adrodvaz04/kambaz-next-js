import { ReactNode } from "react";
import CourseNavigation from "./navigation";
import { FaAlignJustify } from "react-icons/fa";

export default async function CoursesLayout(
  { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) { // was id -> cid
 const { cid } = await params;
 return (
   <div id="wd-courses">
     <h2 className="text-black">
      <FaAlignJustify className="me-4 fs-4 mb-1"/>
        Course {cid}
     </h2>
     <hr />
     <div className="d-flex">
        <div className="d-mb-block"> {/* was set to d-none, assuming it will be changed to dynamic display eventually */}
          <CourseNavigation/>
        </div>
        <div className="flex-fill">
          {children}
        </div>
     </div>
   </div>
);}

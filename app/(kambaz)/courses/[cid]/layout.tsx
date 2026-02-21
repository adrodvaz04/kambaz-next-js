import { ReactNode } from "react";
import CourseNavigation from "./navigation";
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../../database";
import Breadcrumb from "./Breadcrumb";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) {
  const { cid } = await params;
  const course = courses.find((course) => course._id.includes(cid));
  return (
    <div id="wd-courses">
      <h2 className="text-black">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        <Breadcrumb courseName={course?.name} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-mb-block">
          {" "}
          {/* was set to d-none, assuming it will be changed to dynamic display eventually */}
          <CourseNavigation params={cid} />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}

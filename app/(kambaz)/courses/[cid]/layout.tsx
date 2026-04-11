"use client";

import { ReactNode, useState } from "react";
import CourseNavigation from "./navigation";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";

export default function CoursesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [hideNavBar, setHideNavbar] = useState<boolean>(false);
  const { cid } = useParams();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((c) => (c as any)._id === cid);
  return (
    <div id="wd-courses">
      <h2 className="text-black">
        <FaAlignJustify className="me-4 fs-4 mb-1" onClick={() => setHideNavbar(!hideNavBar)}/>
        <Breadcrumb courseName={(course as any).name} />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-mb-block" hidden={hideNavBar}>
          <CourseNavigation params={cid as string} />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}

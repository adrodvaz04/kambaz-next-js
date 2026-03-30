'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function CourseNavigation({ params }: { params: Readonly<string> }) {
  const path = usePathname();
  let currentLink = path.split("/").pop();

  const cid = params;
  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];


  return (
    <div
      id="wd-courses-navigation"
      className="wd list-group fs-5 rounded-0 me-3"
    >
      {links.map((link) => (
        <Link
          href={`/courses/${cid}/${link.toLowerCase()}`}
          id={`wd-course-${link.toLowerCase()}-link`}
          key={link}
          className={`list-group-item ${link.toLowerCase() === currentLink ? `active` : "text-danger"} border-0`}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}

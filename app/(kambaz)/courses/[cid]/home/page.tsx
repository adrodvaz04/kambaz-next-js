import Modules from "../modules/page";
import CourseStatus from "./status";
export default function Home() {
  return (
    <div id="wd-home">
      <div className="d-flex" id="wd-home">
        <div className="flex-fill me-3 ms-3">
          <Modules />
        </div>
        <div className="d-none d-lg-block ms-2">
          <CourseStatus />
        </div>
      </div>
    </div>
  );
}

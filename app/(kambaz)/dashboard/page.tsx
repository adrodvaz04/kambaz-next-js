'use client';
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image
              src="/images/reactjs.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/001" className="wd=dashboard-course-link">
            <Image
              src="/images/science.jpeg"
              width={200}
              height={150}
              alt="scientific-thinking"
            />
              <div>
                <h5> EEMB1102: Principles of Scientific Thinking </h5>
                <p className="wd-dashboard-course-title">
                  Start your journey towards analytical praxis today.
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/002" className="wd=dashboard-course-link">
            <Image
              src="/images/stock-market.jpeg"
              width={200}
              height={150}
              alt="stock-market"
            />
              <div>
                <h5> ECON5700: Stock Market Simulation </h5>
                <p className="wd-dashboard-course-title">
                  Graduate-level Course Requirement
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/003" className="wd=dashboard-course-link">
            <Image
              src="/images/ancient-phil.jpeg"
              width={200}
              height={150}
              alt="ancient-phil"
            />
              <div>
                <h5> PHIL3329: Recitation for Ancient Philosophy </h5>
                <p className="wd-dashboard-course-title">
                  Meeting times TBD.
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/004" className="wd=dashboard-course-link">
            <Image
              src="/images/storytelling.jpeg"
              width={200}
              height={150}
              alt="storytelling"
            />
              <div>
                <h5> ENGW3000: Advanced Writing for Storytelling </h5>
                <p className="wd-dashboard-course-title">
                  Questions? Contact Professor Seuss at seuss@northeastern.edu
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/005" className="wd=dashboard-course-link">
            <Image
              src="/images/science-lab.jpeg"
              width={200}
              height={150}
              alt="scientific-thinking-lab"
            />
              <div>
                <h5> EEMB1103: Lab for Principles of Scientific Thinking </h5>
                <p className="wd-dashboard-course-title">
                  Attendance is MANDATORY. Please don't forget to fill out...
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/006" className="wd=dashboard-course-link">
            <Image
              src="/images/quantum.jpeg"
              width={200}
              height={150}
              alt="quantum"
            />
              <div>
                <h5> PHYS4003: Quantum Analytics </h5>
                <p className="wd-dashboard-course-title">
                  Covers quantum cryptography, quantum algorithms, and its applications.
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/007" className="wd=dashboard-course-link">
            <Image
              src="/images/anthropology.jpeg"
              width={200}
              height={150}
              alt=""
            />
              <div>
                <h5> SOCL1101: Anthropology for Beginners </h5>
                <p className="wd-dashboard-course-title">
                  Start your journey towards qualitative praxis today.
                </p>
                <button> Go </button>
              </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
 return (
  <div id="wd-people-table">
   <Table striped>
    <thead>
     <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
    </thead>
    <tbody>
     <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Tony</span>{" "}
          <span className="wd-last-name">Stark</span></td>
      <td className="wd-login-id">001234561S</td>
      <td className="wd-section">S101</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2020-10-01</td>
      <td className="wd-total-activity">10:21:32</td></tr>
      <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Adrian</span>{" "}
          <span className="wd-last-name">Rodriguez Vazquez</span></td>
      <td className="wd-login-id">0040506WR</td>
      <td className="wd-section">S103</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">2021-12-23</td>
      <td className="wd-total-activity">01:00:52</td></tr>
      <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Frederica</span>{" "}
          <span className="wd-last-name">Bimmel</span></td>
      <td className="wd-login-id">22444555555KB</td>
      <td className="wd-section">C80</td>
      <td className="wd-role">TA</td>
      <td className="wd-last-activity">2003-01-01</td>
      <td className="wd-total-activity">3:27:00</td></tr>
      <tr><td className="wd-full-name text-nowrap">
          <FaUserCircle className="me-2 fs-1 text-secondary" />
          <span className="wd-first-name">Vilma</span>{" "}
          <span className="wd-last-name">Marchand</span></td>
      <td className="wd-login-id">555666555CW</td>
      <td className="wd-section">S102</td>
      <td className="wd-role">STUDENT</td>
      <td className="wd-last-activity">1903-03-27</td>
      <td className="wd-total-activity">3:56:28</td></tr>
    </tbody>
   </Table>
  </div> );}
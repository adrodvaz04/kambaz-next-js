export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <br /> <br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description" defaultValue="The assignment is available online. Submit a link to the landing page">
        
      </textarea>
      <br /> <br />
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-assignment-group"> Assignment Group </label>
            </td>
            <td>
              <select name="assignment-group" id="wd-assignment-group" defaultValue={"assignments"}>
                <option value="assignments">
                  
                  ASSIGNMENTS
                </option>
                <option value="bonus"> BONUS PROJECTS </option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-grade-display"> Display Grade as</label>
            </td>
            <td>
              <select name="grade-display" id="wd-grade-display" defaultValue={"percentage"}>
                <option value="percentage">
                  
                  Percentage
                </option>
                <option value="fraction"> Fraction </option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type"> Submission Type </label>
            </td>
            <td>
              <select name="submission-type" id="wd-submission-type" defaultValue="online">
                <option value="online">
                  Online
                </option>
                <option value="in-person"> In Person </option>
              </select>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <label htmlFor="wd-online-entry-options">
                
                Online Entry Options
              </label>
              <br />
              <input
                type="checkbox"
                name="online-entry"
                id="wd-online-entry-checkbox-text"
              />
              <label htmlFor="wd-online-entry-checkbox-text">
               
                Text Entry
              </label>
              <br />
              <input
                type="checkbox"
                name="online-entry"
                id="wd-online-entry-checkbox-url"
              />
              <label htmlFor="wd-online-entry-checkbox-url">
                
                Website URL
              </label>
              <br />
              <input
                type="checkbox"
                name="online-entry"
                id="wd-online-entry-checkbox-recording"
              />
              <label htmlFor="wd-online-entry-checkbox-recording">
                
                Media Recordings
              </label>
              <br />
              <input
                type="checkbox"
                name="online-entry"
                id="wd-online-entry-checkbox-annotation"
              />
              <label htmlFor="wd-online-entry-checkbox-annotation">
                
                Student Annotation
              </label>
              <br />
              <input
                type="checkbox"
                name="online-entry"
                id="wd-online-entry-checkbox-file"
              />
              <label htmlFor="wd-online-entry-checkbox-file">
                
                File Uploads
              </label>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              Assign
            </td>
            <td>
              <label htmlFor="wd-assign-to"> Assign to </label>
              <br />
              <input type="text" defaultValue="Everyone"/>
              <br /> <br />

              <label htmlFor="wd-due-date"> Due</label>
              <br />
              <input type="date" defaultValue="05-13-2024" id="wd-due-date" />
              <br /> <br />
              <table>
                <tbody>
                  <tr>
                    <td>
                    <label htmlFor="wd-available-from-date">
                      Available from
                    </label>
                    <br />
                    <input type="date" id="wd-available-from-date" />
                  </td>
                  <td>
                    <label htmlFor="wd-available-until-date"> Until </label>
                    <br />
                    <input type="date" id="wd-available-until-date" />
                  </td>
                  </tr>
                  
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <table width="100%">
        <tbody>
            <tr>
                <td align="right">
                    <button> Cancel </button> 
                    <button> Save </button>
                </td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}

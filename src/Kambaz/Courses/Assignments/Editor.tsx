export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">
        {" "}
        <h2> Assignment Name </h2>
      </label>
      <input id="wd-name" value="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description" style={{ width: "400px", height: "120px" }}>
        The assignment is available online Submit a link to the landing page of
        your Web application running on Netlify. The landing page should include
        the following: Your full name and section Links to each lab assignments
        link to the Kanbas application Links to all relevant source code
        repositories The kanbas application should include a link to navigate
        back to the landing page
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" value={100} />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select id="wd-group">
              <option value="Quiz">QUIZ</option>
              <option selected value="Assignments">
                ASSIGNMENTS
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select id="wd-display-grade-as">
              <option value="Percentage">Percentage</option>
            </select>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type"> Submission Type </label>
          </td>
          <td>
            <select id="wd-submission-type">
              <option value="Online"> Online </option>
            </select>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label>Online Entry Options</label>
          </td>
          <td>
            <br />
            <input type="checkbox" name="check-entry" id="wd-website-url" />
            <label htmlFor="wd-website-url">Website URL</label>
            <br />

            <input
              type="checkbox"
              name="check-entry"
              id="wd-media-recordings"
            />
            <label htmlFor="wd-media-recordings">Media Recordings</label>
            <br />

            <input
              type="checkbox"
              name="check-entry"
              id="wd-student-annotation"
            />
            <label htmlFor="wd-student-annotation">Student Annotations</label>
            <br />

            <input type="checkbox" name="check-entry" id="wd-file-upload" />
            <label htmlFor="wd-file-upload">File Uploads</label>
          </td>
        </tr>

        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor = "wd-assign-to"> Assign Assign to </label>
          </td>
          <td>
            <input type="text" id="wd-text-entry" placeholder="Everyone" />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-due-date">Due</label>
          </td>
          <td>
            <input type="date" id="wd-due-date" value="2024-05-13" />
          </td>
        </tr>

        <tr>
          <td colSpan={2}>
            <div style={{ height: "15px" }} />
          </td>
        </tr>

        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-available-from">Available from</label>
          </td>
          <td>
            <input type="date" id="wd-available-from" value="2024-05-06" />
            <label htmlFor="wd-available-until">Until</label>
            <input type="date" id="wd-available-until" value="2024-05-20" />
          </td>
        </tr>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button type="button" style={{ marginRight: "10px" }}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </div>
  );
}

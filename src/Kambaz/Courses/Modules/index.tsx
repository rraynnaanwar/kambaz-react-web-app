export default function Modules() {
  return (
    <div>
      <button> Collapse All </button>
      <button> View Progress </button>
      <select id = "wd-select">
        <option value = "week1">Week 1</option> 
        <option value = "week2">Week 2</option>
        <option value = "week3">Week 3</option>
        <option selected value = "week4">Publish All</option>
      </select>
      <button> + Module </button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
            <li className = "wd-Reading">
              <span className = "wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full Stack Developer - Chapter 1 - Introduction</li>
                <li className="wd-content-item">Full Stack Developer - Chapter 2 - Creating User</li>
              </ul>
            </li>
            <li className = "wd-Slides">
              <span className = "wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to Web Development</li>
                <li className="wd-content-item">Creating a React Application</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 1, Lecture 2 - Formatting User Interfaced with HTML</div>
        </li>
      </ul>
    </div>
);}

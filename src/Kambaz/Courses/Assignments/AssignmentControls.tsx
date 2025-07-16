import { FaPlus } from "react-icons/fa6";
import { Button, Dropdown } from "react-bootstrap";
import "../../styles.css"
export default function ModulesControls() {
 return (
   <div id="wd-modules-controls" className="text-nowrap">
     <Button variant="danger" size="lg" className="me-1 float-end" id="wd-assignment-btn">
       <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
       Assignment
     </Button>
     <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-group-btn">
       <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
       Group
     </Button>
   </div>
);}

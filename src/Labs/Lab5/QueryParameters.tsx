import { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = import.meta.env.VITE_HTTP_SERVER;

export default function QueryParameters() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <FormControl
        id="wd-query-parameter-a"
        className="mb-2"
        defaultValue={a}
        type="number"
        onChange={(e) => setA(Number(e.target.value))}
      />
      <FormControl
        id="wd-query-parameter-b"
        className="mb-2"
        defaultValue={b}
        type="number"
        onChange={(e) => setB(Number(e.target.value))}
      />
      <a
        id="wd-query-parameter-add"
        href={`${HTTP_SERVER}/lab5/calculator?operation=add&a=${a}&b=${b}`}
      >
        Add {a} + {b}
      </a>
      <br />
      <a
        id="wd-query-parameter-subtract"
        href={`${HTTP_SERVER}/lab5/calculator?operation=subtract&a=${a}&b=${b}`}
      >
        Subtract {a} - {b}
      </a>
      <br />
      <a
        id="wd-query-parameter-multiply"
        href={`${HTTP_SERVER}/lab5/calculator?operation=multiply&a=${a}&b=${b}`}
      >
        Multiply {a} * {b}
      </a>
      <br />
      <a
        id="wd-query-parameter-divide"
        href={`${HTTP_SERVER}/lab5/calculator?operation=divide&a=${a}&b=${b}`}
      >
        Divide {a} / {b}
      </a>
      <hr />
    </div>
  );
}
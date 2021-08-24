import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const ChromePicker = dynamic(
  () => import("react-color").then((mod) => mod.ChromePicker),
  {
    ssr: false,
  }
);

export default function Picker ({ color, onChange }) {
  const node = useRef();
  const [show, setShow] = useState(false);

  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) return;
    setShow(false);
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <div ref={node} className="relative inline-block p-1 bg-white border">
      <div
        className="h-4 w-5"
        style={{ backgroundColor: color }}
        onClick={() => {
          setShow(!show);
        }}
      ></div>
      <div
        className="absolute z-10"
        style={{ display: show ? "block" : "none" }}
      >
        <ChromePicker color={color} onChange={onChange} />
      </div>
    </div>
  );
};


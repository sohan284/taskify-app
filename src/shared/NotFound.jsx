// NotFound.js

import { MdReportGmailerrorred } from "react-icons/md";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div className="flex justify-center text-gray-400">
        <p className="text-[200px]">4</p>{" "}
        <MdReportGmailerrorred
          style={{ fontSize: "200px", marginTop: "50px" }}
        />
        <p className="text-[200px]">4</p>
      </div>
      <h1 className="text-4xl font-semibold text-gray-400"> Page Not Found</h1>
    </div>
  );
};

export default NotFound;

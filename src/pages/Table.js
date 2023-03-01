import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/table.css";
import TableSeat from "../components/table/TableSeat";
import TableInfo from "../components/table/TableInfo";
import Swal from "sweetalert2";
import "animate.css";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 5000,
  color: "var(--black)",
  background: "var(--bg-color)",
  showClass: {
    popup: "animate__animated animate__slideInRight animate__faster",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutDown animate__faster",
  },
});

function Table() {
  const { id } = useParams();
  const [showTableInfo, setShowTableInfo] = useState(false);
  return (
    <>
      {showTableInfo && (
        <TableInfo id={id} setShowTableInfo={setShowTableInfo} Toast={Toast} />
      )}
      <TableSeat
        setShowTableInfo={setShowTableInfo}
        showTableInfo={showTableInfo}
      />
    </>
  );
}

export default Table;

import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/kitchen/OrderCard";
import TableLink from "../components/table/TableLink";


function Management() {
  const [orderInfo, setOrderInfo] = useState([]);
  const [tableNum, setTableNum] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:1802/orderinfo").then((response) => {
      setOrderInfo(response.data);
    });
    axios.get("http://localhost:1802/tablenum").then((response) => {
      setTableNum(response.data);
    });
  }, []);
  return (
    <>
      {orderInfo.length === 0 && <div className="empty"><span>Opps~ 尚無訂單!</span></div>}
      <TableLink tableNum={tableNum} />
      <div className="cards">
        {orderInfo.map((obj, index) => (
          <OrderCard orderInfo={obj} key={index} />
        ))}
      </div>
    </>
  );
}

export default Management;

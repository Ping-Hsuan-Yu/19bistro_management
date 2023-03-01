import axios from "axios";
import React, { useState } from "react";

const ItemList = ({ item, setNotDone }) => {
  const {
    itemNum,
    quantity,
    mealName,
    doneOrNot,
    orderTable,
    deliverTable,
    createTime,
    remark,
  } = item;
  const [lineThrough, setLineThrough] = useState("");
  const [done, setDone] = useState(doneOrNot);
  const lineThroughHandler = () => {
    axios
      .post("http://localhost:1802/handleitemdone", {
        itemNum: itemNum,
        deliverTable: deliverTable,
        createTime: createTime,
        doneOrNot: doneOrNot,
      })
      .then((res) => {
        if (res.data.length === 1) {
          setNotDone(false);
        }
      });
    if (done === 1) {
      setLineThrough("");
      setDone(0);
    } else {
      setLineThrough("lineThrough");
      setDone(1);
    }
  };
  return (
    <>
      <div className="itemList" onClick={lineThroughHandler}>
        <div className="itemBtn">
          <div className="doneBtn">
            <i className="bi bi-hand-index"></i>
            <span>完成</span>
          </div>
          <span className={`name l${done} ${lineThrough}`}>{mealName}</span>
        </div>
        <span className={`quantity l${done} ${lineThrough}`}>{quantity}</span>
      </div>
      {remark && (<span>來自{orderTable}的留言: {remark}</span>)}
    </>
  );
};

export default ItemList;

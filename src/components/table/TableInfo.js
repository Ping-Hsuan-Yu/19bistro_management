import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";

const CheckoutAlert = Swal.mixin({
  backdrop: false,
  showConfirmButton: true,
  confirmButtonText: "完成結帳",
  confirmButtonColor: "var(--seated)",
  showCancelButton: true,
  cancelButtonText: "取消結帳",
  cancelButtonColor: "",
  color: "var(--black)",
  background: "var(--bg-color)",
  width: "25%",
  showClass: {
    popup: "animate__animated animate__fadeIn animate__fast",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOut animate__fast",
  },
  html: `提醒客人記得隨身物品<br>結帳後請至座位檢查`,
});

const ItemList = ({ item }) => {
  const { quantity, mealName } = item;
  return (
    <div className="itemList">
      <span className="og-name">{mealName}</span>
      <span className="og-quantity">{quantity}</span>
    </div>
  );
};

const Ongoing = ({ tableAndTime }) => {
  const { deliverTable, createTime } = tableAndTime;
  const [itemList, setItemList] = useState([]);
  useEffect(() => {
    axios
      .post("http://localhost:1802/ongoingitem", {
        deliverTable: deliverTable,
        createTime: createTime,
      })
      .then((response) => {
        setItemList(response.data);
      });
  }, []);
  return (
    <>
      <div className="cardContent">
        {itemList.map((obj, index) => (
          <ItemList item={obj} key={index} />
        ))}
      </div>
      <div className="createTime">
        <span>訂單時間 </span>
        <span>{createTime}</span>
      </div>
    </>
  );
};

const DoneItems = ({ list }) => {
  const { quantity, mealName, price } = list;
  return (
    <div className="itemList">
      <span className="og-name">{mealName}</span>
      <div className="pq">
        <span className="price">${price}</span>
        <span className="og-quantity">{quantity}</span>
      </div>
    </div>
  );
};

const TableInfo = ({ id, setShowTableInfo, Toast }) => {
  const navigate = useNavigate();

  const closeTableInfo = () => {
    setShowTableInfo(false);
    navigate(`/table`);
  };

  const [onGoingList, setOnGoingList] = useState([]);
  const [doneItemList, setDoneItemList] = useState([]);
  const [total, setTotal] = useState(0);
  const [tableStatus, setTableStatus] = useState(false);
  const [callesStatus, setCallesStatus] = useState(false);

  useEffect(() => {
    axios.post("http://localhost:1802/tableandtime", { deliverTable: id }).then((response) => {
      setOnGoingList(response.data);
    });
    axios.post("http://localhost:1802/doneitem", { orderTable: id }).then((response) => {
      setDoneItemList(response.data);
    });
    axios.post("http://localhost:1802/total", { orderTable: id }).then((response) => {
      setTotal(response.data[0].total);
    });
    axios.post("http://localhost:1802/tablestatus", { tableNum: id }).then((response) => {
      setTableStatus(response.data[0].seated === 0 ? true : false);
      setCallesStatus(response.data[0].called === 1 ? true : false);
    });
  }, []);

  const checkoutHandler = () => {
    CheckoutAlert.fire().then((result) => {
      if (result.isConfirmed) {
        axios.post("http://localhost:1802/checkout", { orderTable: id });
        closeTableInfo();
      }
    });
  };

  const setTableHandler = (x) => {
    axios.post("http://localhost:1802/seated", { orderTable: id, boolean: x });
    x === 0
      ? Toast.fire({ title: id + " 客人離開", color: "var(--gray)" })
      : Toast.fire({ title: id + " 客人入座", color: "var(--seated)" });
    closeTableInfo();
  };

  const provideServerHandler = () => {
    axios.post("http://localhost:1802/cancelcalled", { tableNum: id });
    Toast.fire({ title: id + " 已處理", color: "var(--called)" });
    closeTableInfo();
  };
  return (
    <>
      <div className="ongoing">
        <div className="og-card">
          <div className="cardHead">
            <span className="og-table">{id}</span>

            {(tableStatus && (
              <div
                className="set-table"
                onClick={() => {
                  setTableHandler(1);
                }}
              >
                <span>客人入座</span>
                <i className="bi bi-box-arrow-in-down" />
              </div>
            )) || <span className="number">準備中</span>}
          </div>
          {onGoingList.map((obj, index) => (
            <Ongoing tableAndTime={obj} key={index} />
          ))}
        </div>
      </div>
      <div className="done">
        <div className="og-card">
          <div className="cardHead">
            <div
              className="set-table"
              onClick={() => {
                setTableHandler(0);
              }}
            >
              <span>客人離開</span>
              <i className="bi bi-box-arrow-up" />
            </div>
            {callesStatus && (
              <div className="set-table" onClick={provideServerHandler}>
                <span>取消服務鈴</span>
                <i className="bi bi-check2-circle" />
              </div>
            )}
            <span className="d-table">{id}</span>
            <span className="number">已出餐</span>
          </div>
          <div className="cardContent">
            {doneItemList.map((obj, index) => (
              <DoneItems list={obj} key={index} />
            ))}
          </div>
        </div>
        {(doneItemList.length === 0 ? false : true) && (
          <div className="itemList set-table" onClick={checkoutHandler}>
            <div>
              <i className="bi bi-cart-check"></i>
              <span className="og-name">結帳</span>
            </div>
            <span className="og-quantity">${Intl.NumberFormat("en").format(total)}</span>
          </div>
        )}
      </div>
      <div className="backdrop" onClick={closeTableInfo}></div>
    </>
  );
};

export default TableInfo;

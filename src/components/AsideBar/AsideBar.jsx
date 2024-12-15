import React, { useContext, useEffect, useState } from "react";
import { AddCircle, Assignment } from "@mui/icons-material";
import "./asideBar.css";
import ThemeSwitch from "../Theme/ThemeSwitch";
import { AppThemeContext, DataContext } from "../../App";
import AddBoardModal from "../AddBoardModal/AddBoardModal";
import openIcon from "../../assets/images/sidebar-open.svg";
import closeIcon from "../../assets/images/sidebar-close.svg";

function AsideBar() {
  const { boards, dispatchBoards } = useContext(DataContext);
  const { isDark} = useContext(AppThemeContext);
  const [isOpen, setOpen] = useState(true);

  useEffect(()=>{
    const handleResize = () => {
      if (window.innerWidth <= 770) {
        setOpen(false); 
      }
    };
      window.addEventListener("resize", handleResize);
      handleResize();
      
      return () => {
      window.removeEventListener("resize", handleResize);
    };
  },[isOpen])
  return (
    <aside className={`aside-wrapper ${!isOpen && "minimized"}`}>
      <div className="logo-menu-wrapper">
        <h1 className="logo">
          <span>
            <Assignment className="logo-icon" />
          </span>
          {isOpen && "TaskHub"}
        </h1>
        <button
          type="button"
          className="toggle-menu-btn"
          onClick={() => setOpen(!isOpen)}
        >
          <img
            src={isOpen ? closeIcon : openIcon}
            alt=""
            className="toggle-icon"
            aria-hidden="true"
          />
        </button>
      </div>

      <ul className="board-names">
        {boards?.boardsList?.map((board) => {
          const isCurrent = board?.id === boards?.selectedBoard;
          return (
            <li key={board.id} className="board-item">
              <button
                type="button"
                className={`board-btn ${isCurrent && "current-board"} ${
                  isCurrent && !isOpen && "current-board-closed"
                }`}
                onClick={() =>
                  dispatchBoards({ type: "UPDATE_BOARD", id: board.id })
                }
              >
                <img src={board?.icon} className="board-icon"/>
                {isOpen && board?.title}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="add-board-btn"
        onClick={() =>
          dispatchBoards({ type: "OPEN_MODAL", payload:{key: "boardModal"} })
        }
      >
        <AddCircle />
        {isOpen && "Add new board"}
      </button>

      <ThemeSwitch isOpen={isOpen} />
      {boards?.boardModal && <AddBoardModal host={"add"} />}
      {boards?.editBoardModal && <AddBoardModal boardTitle ={boards?.modalData?.boardTitle} />}
      <div className={`overlay ${!isDark && "light-overlay"}`}></div>
    </aside>
  );
}

export default AsideBar;

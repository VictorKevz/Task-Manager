import React, { useContext, useState } from "react";
import "./mainBoard.css";
import { AppThemeContext, DataContext } from "../../App";
import { AddCircle, Tune } from "@mui/icons-material";
import AddTaskModal from "../AddTaskModal/AddTaskModal";
import TaskCard from "../TaskCard/TaskCard";
import WarningModal from "../WarningModal/WarningModal";
import empty from "../../assets/images/empty.webp"

function MainBoard() {
  const { boards, dispatchBoards } = useContext(DataContext);
  const { isDark } = useContext(AppThemeContext);
  const [optionsOpen, setOptions] = useState(false);
  const currentObj = boards?.boardsList.find(
    (obj) => obj.id === boards?.selectedBoard
  );

  return (
    <section className={`board-wrapper ${!isDark && "light-board-wrapper"}`}>
      {/*
       *
       *
       * HEADER SECTION
       *
       *
       */}
      <header className={`board-header ${!isDark && "light-header"}`}>
        <h2 className="board-name">{currentObj?.title}</h2>
        <div className="options-wrapper">
          <button
            type="button"
            className="open-taskModal-btn"
            onClick={() =>
              dispatchBoards({
                type: "OPEN_MODAL",
                payload: { key: "taskModal" },
              })
            }
          >
            <AddCircle />
            <span className="add-btn-text">Create Task</span>
          </button>

          <button
            type="button"
            className="options-board-btn"
            onClick={() => setOptions(!optionsOpen)}
          >
            <Tune />
          </button>
          {optionsOpen && (
            <ul className={`options-list ${!isDark && "light-card"}`}>
              <li className="option-item">
                <button
                  type="button"
                  className="delete-board-btn"
                  onClick={() => {
                    dispatchBoards({
                      type: "OPEN_MODAL",
                      payload: { key: "boardWarningModal" },
                    });
                    setOptions(false);
                  }}
                  disabled={boards?.boardsList?.length === 0}
                >
                  Delete Board
                </button>
              </li>
              <li className="option-item">
                <button
                  type="button"
                  className="edit-board-btn"
                  onClick={() => {
                    dispatchBoards({
                      type: "OPEN_MODAL",
                      payload: {
                        key: "editBoardModal",
                        modalData: {
                          boardTitle: currentObj?.title,
                        },
                      },
                    });
                    setOptions(false);
                  }}
                  disabled={boards?.boardsList?.length === 0}

                >
                  Edit Board
                </button>
              </li>
            </ul>
          )}
        </div>
      </header>
      {/*
       *
       *
       * BOARD SECTION
       *
       *
       */}
      <div className={`board-container ${!isDark && "light-text"}`}>
        {currentObj?.columns?.map((item, i) => (
          <section key={item?.columnId} className="col-wrapper">
            <header className="col-header">
              <p className="column-item">
                <span
                  className={`dot ${i === 1 && "second"} ${i === 2 && "third"}`}
                ></span>{" "}
                {item?.columnTitle}(
                {item?.tasks?.length > 0 ? item?.tasks?.length : 0})
              </p>
            </header>
            <article className="task-card-wrapper">
              {item?.tasks?.length > 0 ? (
                item.tasks.map((task) => (
                  <TaskCard
                    key={task?.taskId}
                    task={task}
                    columnId={item?.columnId}
                    columnTitle={item?.columnTitle}
                  />
                ))
              ) : (
                <div className="empty-wrapper">
                  <img src={empty} alt="" className="empty-img" />
                  <p className="empty-parag">No tasks available</p>
                </div>
              )}
            </article>
          </section>
        ))}
      </div>
      {boards?.taskModal && <AddTaskModal host="add" />}
      {boards?.editTaskModal && (
        <AddTaskModal
          host="edit"
          taskName={boards?.modalData.taskName}
          taskId={boards?.modalData.taskId}
          taskDescription={boards?.modalData?.taskDescription}
          columnTitle={boards?.modalData?.columnTitle}
          columnId={boards?.modalData?.columnId}
        />
      )}

      {boards.boardWarningModal && (
        <WarningModal
          title={`Want to delete board: '${currentObj?.title}'?`}
          message={
            "This action can't be undone. All columns and tasks on this board will be permanently deleted!"
          }
          id={boards?.selectedBoard}
          host={"board"}
        />
      )}

      {boards.taskWarningModal && (
        <WarningModal
          id={boards?.modalData?.taskId}
          title={`Want to delete task: '${boards?.modalData?.taskName}' ? `}
          message={
            "This action can't be undone. This task and its description will be permanently deleted!"
          }
          host={"task"}
          columnId={boards?.modalData?.columnId}
        />
      )}
    </section>
  );
}

export default MainBoard;

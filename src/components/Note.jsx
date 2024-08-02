import React from "react";

function Note(props) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <p>Status: {props.status}</p>
      <p>Due Date: {props.dueDate}</p>
      <button onClick={() => props.editTask(props.index)}>Edit</button>
      <button onClick={() => props.updateStatus(props.index, "In Progress")}>
        Update Status to In Progress
      </button>
      <button onClick={() => props.updateStatus(props.index, "Done")}>
        Update Status to Done
      </button>
      <button onClick={() => props.deleteTask(props.index)}>Delete</button>
    </div>
  );
}

export default Note;
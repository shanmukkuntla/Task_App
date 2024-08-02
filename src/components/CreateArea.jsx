import React, { useState } from "react";


function CreateArea(props) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: ""
  });

  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false); // new state to toggle create task form

  function handleChange(event) {
    const { name, value } = event.target;

    setTask(prevTask => {
      return {
        ...prevTask,
        [name]: value
      };
    });
  }

  function submitTask(event) {
    event.preventDefault();
    setTasks([...tasks, task]);
    setTask({
      title: "",
      description: "",
      status: "To-Do",
      dueDate: ""
    });
    setShowCreateTask(false); // hide create task form after submission
  }

  function updateTask(index, updatedTask) {
    setTasks(tasks.map((task, i) => (i === index ? updatedTask : task)));
  }

  function deleteTask(index) {
    setTasks(tasks.filter((task, i) => i !== index));
  }

  function editTask(index) {
    setEditing(index);
  }

  function saveEditTask(index, updatedTask) {
    updateTask(index, updatedTask);
    setEditing(null);
  }

  function updateStatus(index, status) {
    updateTask(index, { ...tasks[index], status });
  }

  return (
    <div>
      <header>
        <nav>
          <h1>Task Managment</h1>
          <button className="round-button" onClick={() => setShowCreateTask(!showCreateTask)}>
            {showCreateTask ? "-" : "+"}
          </button>
        </nav>
      </header>
      {
        showCreateTask && (
          <form onSubmit={submitTask}>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Title"
            />
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Description"
              rows="3"
            />
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
            >
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              placeholder="Due Date"
            />
            <button type="submit">Add</button>
          </form>
        )
      }
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {editing === index ? (
              <form>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={(event) =>
                    setTask({ ...task, title: event.target.value })
                  }
                />
                <textarea
                  name="description"
                  value={task.description}
                  onChange={(event) =>
                    setTask({ ...task, description: event.target.value })
                  }
                  rows="3"
                />
                <select
                  name="status"
                  value={task.status}
                  onChange={(event) =>
                    setTask({ ...task, status: event.target.value })
                  }
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={(event) =>
                    setTask({ ...task, dueDate: event.target.value })
                  }
                />
                <button onClick={() => saveEditTask(index, task)}>Save</button>
              </form>
            ) : (
              <div>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <p>Due Date: {task.dueDate}</p>
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => updateStatus(index, "In Progress")}>
                  Update Status to In Progress
                </button>
                <button onClick={() => updateStatus(index, "Done")}>
                  Update Status to Done
                </button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div >
  );
}

export default CreateArea;
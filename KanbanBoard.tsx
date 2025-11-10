import React, { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Task {
  id: string;
  text: string;
  status: string;
}

const KanbanBoard: React.FC = () => {
  const columns = ["To Do", "In Progress", "Done"];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("To Do");
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Load saved tasks
  useEffect(() => {
    const stored = localStorage.getItem("kanban-tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // ✅ Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTask, status: newStatus },
      ]);
      setNewTask("");
      inputRef.current?.focus();
    }
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  // ✅ Unique color themes for each column
  const columnColors: Record<string, string> = {
    "To Do": "bg-pink-100 border-pink-300",
    "In Progress": "bg-indigo-100 border-indigo-300",
    Done: "bg-emerald-100 border-emerald-300",
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start p-8">
      {/* ✨ Glitter / Gradient Animated Background */}
      <div className="absolute inset-0 animate-glitter bg-[linear-gradient(120deg,_#a1c4fd,_#c2e9fb,_#fbc2eb,_#a6c0fe,_#f68084)] bg-[length:400%_400%] opacity-90 -z-10"></div>

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
        ✨ Kanban Board
      </h1>

      {/* Add Task Form */}
      <div className="mb-6 p-4 bg-white/90 rounded-xl shadow-lg flex flex-wrap gap-2 justify-center backdrop-blur-md">
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="p-2 border rounded-md w-56"
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="p-2 border rounded-md"
        >
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all"
        >
          Add Task
        </button>
      </div>

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
          {columns.map((column) => (
            <div
              key={column}
              className={`p-4 rounded-xl shadow-lg border ${columnColors[column]} backdrop-blur-sm`}
            >
              <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                {column}
              </h2>

              <Droppable droppableId={column}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[120px] transition-all"
                  >
                    {tasks
                      .filter((task) => task.status === column)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-3 mb-3 bg-white/90 border rounded-lg shadow-md flex justify-between items-center hover:bg-white transition-all backdrop-blur-sm"
                            >
                              <span className="text-gray-700 font-medium">
                                {task.text}
                              </span>
                              <button
                                onClick={() => handleDelete(task.id)}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;

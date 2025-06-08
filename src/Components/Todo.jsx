import { useMemo, useState } from "react";
import styles from "./Todo.module.css";
import { Button, Form, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import AddTaskModal from "../Components/Modal/AddTaskModal";
import TodoCard from "./Card/TodoCard";
import { todoDemo } from "../Constant/Test";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs from "dayjs";
import { STATUS_TYPE } from "../Constant/Constants";

// Database Name
const db = new Dexie('todoApp')
// version and add keys
db.version(1).stores({
  todos: '++id,title,description,date,priority,status'
})

const { todos } = db

export default function Todo() {
  const [form] = Form.useForm();
  // hook for getting all todo data from db
  const todoList = useLiveQuery(() => todos.toArray(), [])
  // Open or close modal
  const [openModal, setModalOpen] = useState(false);
  // Selected task for edit
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null)
  // Store each task
  const handleCreatedTask = async (values) => {
    try {
      if (selectedTaskForEdit) {
        await todos.update(selectedTaskForEdit?.id,
          {
            ...values,
            date: dayjs(values?.date).format("DD-MM-YYYY"),
            status: STATUS_TYPE.PENDING
          })
      } else {
        // To update existing todo
        await todos.add({
          title: values?.title,
          description: values?.description,
          date: dayjs(values?.date).format("DD-MM-YYYY"),
          priority: values?.priority,
          status: STATUS_TYPE.PENDING
        })
      }
    }
    catch (err) {
      console.error(err);
    }
    closeModal();
  };

  // CloseModal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Edit a task
  const onEditTask = (task) => {
    setSelectedTaskForEdit(task);
    setModalOpen(true)
  }

  // Delete a task
  const onDeleteTask = async (task) => {
    try {
      await todos.delete(task?.id)
    }
    catch (err) {
      console.err(err);
    }
  }

  // Set a todo as complete 
  const onTaskStatusChange = async (task, status) => {
    try {
      if (status === STATUS_TYPE.PENDING) {
        await todos.update(task?.id, { status: STATUS_TYPE.COMPLETE })
      }
      else if (status === STATUS_TYPE.COMPLETE) {
        await todos.update(task?.id, { status: STATUS_TYPE.PENDING })
      }
    }
    catch (err) {
      console.error(err);
    }
  }

  // Memoize the Todo component
  const memoizedTodo = useMemo(() => {
    return (<TodoCard list={todoList} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onTaskStatusChange={onTaskStatusChange} />)
  }, [todoList])

  return (
    <div className={styles.wrapper}>
      <Layout style={{ height: "100vh" }}>
        <Header setModalOpen={setModalOpen} />
        <Content className={styles.contentStyle}>
          {openModal && (
            <AddTaskModal
              form={form}
              onTaskSubmit={handleCreatedTask}
              closeModal={closeModal}
              activeTask={selectedTaskForEdit}
            />
          )}
          {memoizedTodo}
        </Content>
      </Layout>
    </div>
  );
}

const Header = ({ setModalOpen }) => {
  // Handle Add task button
  const handleButtonClick = () => {
    setModalOpen(true);
  };

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <h1 style={{ fontSize: "30px", color: "#1677ff" }}>
          Task
          <span style={{ color: "#A1EEBD", fontSize: "30px" }}>Ensure</span>
        </h1>
        <p style={{ fontStyle: "italic" }}>Your Life, Perfectly Orchestrated</p>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleButtonClick}
      >
        Add Task
      </Button>
    </div>
  );
};

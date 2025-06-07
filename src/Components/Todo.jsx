import { useMemo, useState } from "react";
import styles from "./Todo.module.css";
import { Button, Form, Layout } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import AddTaskModal from "../Components/Modal/AddTaskModal";
import TodoCard from "./Card/TodoCard";
import { todoDemo } from "../Constant/Test";

export default function Todo() {
  const [form] = Form.useForm();
  // Open or close modal
  const [openModal, setModalOpen] = useState(false);
  // State that stores todo list
  const [todoList, setTodoList] = useState(todoDemo);
  // Selected task for edit
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null)
  // Store each task
  const handleCreatedTask = (values) => {
    // To update existing todo
    if (selectedTaskForEdit) {
      setTodoList((prev) =>
        prev?.map((item) =>
          item?.id === selectedTaskForEdit?.id ? { id: item?.id, ...values } : item
        )
      )
    }
    else {
      setTodoList((prev) => [
        ...prev,
        { id: Math.floor(Math.random() * 10000), ...values, status: "Pending" },
      ]);
    }
    closeModal();
  };

  // CloseModal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Update to-do list on edit, delete and status change
  const updateTodo = (updatedTodo) => {
    setTodoList([...updatedTodo])
  }

  const onEditTask = (task) => {
    setSelectedTaskForEdit(task);
    setModalOpen(true)
  }

  // Memoize the Todo component
  const memoizedTodo = useMemo(() => {
    return (<TodoCard list={todoList} updateTodo={updateTodo} onEditTask={onEditTask} />)
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

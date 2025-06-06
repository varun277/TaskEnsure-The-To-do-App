import { useState } from "react";
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
  // Store each task
  const handleCreatedTask = (values) => {
    setTodoList((prev) => [
      ...prev,
      { id: Math.floor(Math.random() * 10000), ...values, status: "pending" },
    ]);
    closeModal();
  };
  // CloseModal
  const closeModal = () => {
    setModalOpen(false);
  };

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
            />
          )}
          <TodoCard list={todoList} />
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

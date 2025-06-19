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
import { cardBg, STATUS_TYPE } from "../Constant/Constants";
import Header from "./Header";

// Database Name
const db = new Dexie('todoApp')
// version and add keys
db.version(1).stores({
  todos: '++id,title,description,date,priority,status,backgroundColor'
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
  // Get random bg color for cards
  const getRandomBackground = async (array) => {
    const randomIndex = Math.floor(Math.random() * array?.length)
    return array?.[randomIndex] || array[1]
  }

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
          status: STATUS_TYPE.PENDING,
          backgroundColor: await getRandomBackground(cardBg)
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
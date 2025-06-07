import { DatePicker, Form, Input, Modal, Select, Tag } from "antd";
import styles from "./AddTaskModal.module.css";
import { useEffect } from "react";
import dayjs from "dayjs";
const { TextArea } = Input;

function AddTaskModal({ form, onTaskSubmit, closeModal, activeTask }) {

  // if user is updating the task
  useEffect(() => {
    if (activeTask) {
      form.setFieldsValue({
        id: activeTask?.id,
        title: activeTask?.title,
        description: activeTask?.description,
        priority: activeTask?.priority,
        status: activeTask?.status,
        date: dayjs(activeTask.date)
      })
    }
  }, [])

  // Validate the form values
  const onSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      onTaskSubmit(formValues);
    } catch (err) {
      console.error(err);
    }
  };
  // Type of priorities
  const priorityOptions = [
    { label: <Tag color="green">Low</Tag>, value: "Low" },
    { label: <Tag color="gold">Medium</Tag>, value: "Medium" },
    { label: <Tag color="red">High</Tag>, value: "High" },
  ];

  return (
    <Modal
      open={true}
      title="Create New Task"
      okText="Create"
      onOk={onSubmit}
      onCancel={closeModal}
    >
      <Form form={form} name="todo" layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          className={styles.formStyle}
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input
            placeholder="What would you like to do"
            count={{
              show: true,
              max: 100,
            }}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          className={styles.formStyle}
        >
          <TextArea rows={3} showCount />
        </Form.Item>
        <Form.Item name="priority" label="Priority">
          <Select
            defaultValue={priorityOptions[0]}
            style={{ width: 120 }}
            options={priorityOptions}
          />
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddTaskModal;

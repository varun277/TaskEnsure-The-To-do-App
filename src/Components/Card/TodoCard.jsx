import {
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Empty, Row, Tag, Tooltip, Typography } from "antd";
import styles from "./TodoCard.module.css";
import Meta from "antd/es/card/Meta";
const { Text } = Typography;
import { cardBg, STATUS_TYPE, tagColor } from "../../Constant/Constants";
import { useCallback } from "react";

function TodoCard({ list, onEditTask, onDeleteTask, onTaskStatusChange }) {
  // If no todo list available
  if (list?.length === 0) {
    return (
      <Empty
        className={styles.emptyImage}
        image={
          <PlusCircleOutlined
            className={styles.addIconLarge}
          />
        }
        description={
          <span style={{ fontSize: "var(--medium_font)" }}>
            No tasks yet? No worries! Click 'Add Task' to start building your
            perfectly orchestrated day.
          </span>
        }
      />
    );
  }

  // Get random bg color for cards
  const getRandomBackground = (array) => {
    const randomIndex = Math.floor(Math.random() * array?.length)
    return array?.[randomIndex] || array[1]
  }

  // Get tag color according to status
  const getTagColor = useCallback((statusType) => {
    if (!statusType) return tagColor["pending"];
    return tagColor[statusType]
  }, [])

  const onDeleteCard = (task) => {
    onDeleteTask(task)
  }

  const onEditCard = (task) => {
    onEditTask(task)
  }

  const handleTaskStatus = (task, status) => {
    onTaskStatusChange(task, status)
  }

  return (
    <>
      <Row gutter={[20, 20]}>
        {list?.map((item, key) => (
          <Col
            span={8}
          >
            <Card
              id={list?.id}
              hoverable
              variant="borderless"
              style={{ background: getRandomBackground(cardBg), border: "1px solid var(--elevate6)" }}
              className={styles.cardStyle}
              actions={[
                <Tooltip title="Edit the task"><EditOutlined key="edit" onClick={() => onEditCard(item)} /></Tooltip>,
                <Tooltip title="Delete the task"><DeleteOutlined key="setting" onClick={() => onDeleteCard(item)} /></Tooltip>,
                <>{item?.status === "Pending" ? < Tooltip title="Mark as complete"><CheckOutlined key="completed" onClick={() => handleTaskStatus(item, item?.status)} /></Tooltip > : < Tooltip title="Mark as incomplete"><UndoOutlined key="incomplete" onClick={() => handleTaskStatus(item, item?.status)} /></Tooltip >}</>
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title={
                  <>
                    <p className={`${styles.titleStyle} ${item?.status === STATUS_TYPE.COMPLETE ? styles.statusComplete : ''}`}>{item?.title}</p>
                    <Tag color={getTagColor(item?.status)}>{item?.status || STATUS_TYPE.PENDING}</Tag>
                  </>
                }
                description={
                  <>
                    <p className={`${styles.descriptionStyle}  ${item?.status === STATUS_TYPE.COMPLETE ? styles.statusComplete : ''}`}>
                      {item?.description}
                    </p>
                    <Text className={`${styles.dateStyle} ${item?.status === STATUS_TYPE.COMPLETE ? styles.statusComplete : ''}`}>
                      <CalendarOutlined
                        style={{
                          marginRight: "4px",
                          color: "var(--elevated2)",
                        }}
                      />
                      {item?.date}
                    </Text>
                  </>
                }
              />
            </Card>
          </Col >
        ))
        }
      </Row >
    </>
  );
}

export default TodoCard;

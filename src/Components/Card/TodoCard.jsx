import {
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Empty, Row, Tag, Tooltip, Typography } from "antd";
import styles from "./TodoCard.module.css";
import Meta from "antd/es/card/Meta";
const { Text } = Typography;
import { cardBg, tagColor } from "../../Constant/Constants";
import { useCallback } from "react";
import dayjs from "dayjs";

function TodoCard({ list, updateTodo, onEditTask }) {
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
    const filteredList = list?.filter(item => item?.id !== task?.id);
    updateTodo(filteredList)
  }

  const onEditCard = (task) => {
    onEditTask(task)
  }

  const onTaskComplete = (task) => {

  }

  return (
    <>
      <Row gutter={[20, 20]}>
        {list?.map((item, key) => (
          <Col span={8}>
            <Card
              hoverable
              variant="borderless"
              style={{ background: getRandomBackground(cardBg), border: "1px solid var(--elevate6)" }}
              className={styles.cardStyle}
              actions={[
                <Tooltip title="Edit the task"><EditOutlined key="edit" onClick={() => onEditCard(item)} /></Tooltip>,
                <Tooltip title="Delete the task"><DeleteOutlined key="setting" onClick={() => onDeleteCard(item)} /></Tooltip>,
                <Tooltip title="Set as complete"><CheckOutlined key="completed" onClick={() => onTaskComplete(item)} /></Tooltip>
              ]}
            >
              <Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                }
                title={
                  <>
                    <p className={styles.titleStyle}>{item?.title}</p>
                    <Tag color={getTagColor(item?.status)}>{item?.status || "Pending"}</Tag>
                  </>
                }
                description={
                  <>
                    <p className={styles.descriptionStyle}>
                      {item?.description}
                    </p>
                    <Text className={styles.dateStyle}>
                      <CalendarOutlined
                        style={{
                          marginRight: "4px",
                          color: "var(--elevated2)",
                        }}
                      />
                      {dayjs(item?.date).format("DD-MM-YYYY")}
                    </Text>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row >
    </>
  );
}

export default TodoCard;

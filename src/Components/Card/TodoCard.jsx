import {
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Empty, Row, Tag, Typography } from "antd";
import styles from "./TodoCard.module.css";
import Meta from "antd/es/card/Meta";
import moment from "moment";
const { Text } = Typography;
import { cardBg, tagColor } from "../../Constant/Constants";

function TodoCard({ list }) {
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

  const actions = [
    <EditOutlined key="edit" />,
    <DeleteOutlined key="setting" />,
    <CheckOutlined key="completed" />
  ];

  // Get random bg color for cards
  const getRandomBackground = (array) => {
    const randomIndex = Math.floor(Math.random() * array?.length)
    return array?.[randomIndex] || array[1]
  }

  // Get tag color according to status
  const getTagColor = (statusType) => {
    if (!statusType) return tagColor["pending"];
    return tagColor[statusType]
  }

  return (
    <>
      <Row gutter={[20, 20]}>
        {list?.map((item) => (
          <Col span={8}>
            <Card
              hoverable
              variant="borderless"
              style={{ background: getRandomBackground(cardBg), border: "1px solid var(--elevate6)" }}
              className={styles.cardStyle}
              actions={actions}
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
                    <Text strong className={styles.dateStyle}>
                      <CalendarOutlined
                        style={{
                          marginRight: "4px",
                          color: "var(--elevated2)",
                        }}
                      />
                      {moment(item?.date).format("MM-DD-YYYY")}
                    </Text>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default TodoCard;

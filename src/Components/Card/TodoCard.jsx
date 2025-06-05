import {
  CalendarOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Empty, Row, Tag, Typography } from "antd";
import styles from "./TodoCard.module.css";
import Meta from "antd/es/card/Meta";
import moment from "moment";
const { Text } = Typography;

function TodoCard({ list }) {
  // If no todo list available
  if (list?.length === 0) {
    return (
      <Empty
        className={styles.emptyImage}
        image={
          <PlusCircleOutlined
            style={{ fontSize: "72px", marginTop: "15px", color: "#8C8C8C" }}
          />
        }
        description={
          <span style={{ fontSize: "14px" }}>
            No tasks yet? No worries! Click 'Add Task' to start building your
            perfectly orchestrated day.
          </span>
        }
      />
    );
  }

  const actions = [
    <EditOutlined key="edit" />,
    <SettingOutlined key="setting" />,
    <EllipsisOutlined key="ellipsis" />,
  ];

  return (
    <>
      <Row gutter={[20, 20]}>
        {list?.map((item) => (
          <Col span={8}>
            <Card
              hoverable
              variant="borderless"
              style={{ background: "#DDF6D2" }}
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
                    <Tag color="blue">Pending</Tag>
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

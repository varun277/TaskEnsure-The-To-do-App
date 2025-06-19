import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Todo from "./Components/Todo";
import { ConfigProvider } from "antd";
import { themeConfig } from "./helper/themeConfig";

export default function App() {
  return (
    <>
      <ConfigProvider theme={themeConfig}>
        <Router>
          <Routes>
            <Route path="/" element={<Todo />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </>
  );
}

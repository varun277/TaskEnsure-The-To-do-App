import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Todo from "./Components/Todo";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Todo />} />
        </Routes>
      </Router>
    </>
  );
}

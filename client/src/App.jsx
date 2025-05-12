import { useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Header from './components/Header';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleTaskAdded = () => {
    setRefresh(prev => !prev); 
  };

  return (
    <div className="app-container">
      <Header />
      <TaskInput onTaskAdded={handleTaskAdded} />
      <TaskList refresh={refresh} />
    </div>
  );
}

export default App;

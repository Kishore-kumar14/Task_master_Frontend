import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';

const API_URL ='https://task-master-backend-fhlp.onrender.com/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Connection Error:", err);
    }
  };

const addTask = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  try {
    const res = await axios.post(API_URL, { 
      text: input, 
      priority: priority,
      dueDate: dueDate // Send the date to the backend
    });
    setTasks([res.data, ...tasks]);
    setInput('');
    setDueDate(''); // Clear the date after adding
  } catch (err) {
    console.error("Add Error:", err);
  }
};

  const toggleComplete = async (task) => {
    try {
      const res = await axios.put(`${API_URL}/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Logic for filtering and searching tasks combined
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || 
                         (filter === 'Completed' && t.completed) || 
                         (filter === 'Pending' && !t.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'system-ui' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#1f2937', fontSize: '2.5rem' }}>Task Master</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#6b7280' }}>
          <span>Total: <b>{tasks.length}</b></span>
          <span>Done: <b style={{ color: '#10b981' }}>{tasks.filter(t => t.completed).length}</b></span>
        </div>
      </header>
      
      {/* Input Section */}
      <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task name..."
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #e5e7eb' }}
        />
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb', background: 'white' }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Plus size={20} />
        </button>
      </form>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="🔍 Search your tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            boxSizing: 'border-box',
            fontSize: '16px',
            outline: 'none'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['All', 'Pending', 'Completed'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '6px 15px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              backgroundColor: filter === f ? '#6366f1' : '#f3f4f6',
              color: filter === f ? 'white' : '#4b5563'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.map(task => (
          <div key={task._id} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '16px', background: 'white', borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            borderLeft: `6px solid ${task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={() => toggleComplete(task)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                {task.completed ? <CheckCircle2 color="#10b981" /> : <Circle color="#d1d5db" />}
              </button>
              <span style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#9ca3af' : '#1f2937',
                fontWeight: '500'
              }}>
                {task.text}
              </span>
            </div>
            {task.dueDate && (
  <span style={{ 
    fontSize: '12px', 
    padding: '4px 8px', 
    borderRadius: '4px',
    backgroundColor: new Date(task.dueDate) < new Date() ? '#fee2e2' : '#f3f4f6',
    color: new Date(task.dueDate) < new Date() ? '#ef4444' : '#6b7280'
  }}>
    Due: {new Date(task.dueDate).toLocaleDateString()}
  </span>
)}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>{task.priority}</span>
              <button onClick={() => deleteTask(task._id)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
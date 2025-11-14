import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Message.css';

export default function MessageForm() {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await axios.post('/api/v1/messages', { username, content }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      navigate('/messages');
    } catch (err) {
      console.error('submit error', err);
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
      else setErrors(['Unexpected error']);
    }
  };

  return (
    <div className="mc-container">
      <h1>New Message</h1>
      {errors.length > 0 && (
        <div className="mc-errors">
          {errors.map((er, i) => <div key={i}>{er}</div>)}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mc-form">
        <div className="mc-form-row">
          <label>ユーザー名</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mc-form-row">
          <label>メッセージ</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
        </div>
        <div className="mc-form-actions">
          <button type="submit" className="mc-btn">投稿</button>
        </div>
      </form>
    </div>
  );
}

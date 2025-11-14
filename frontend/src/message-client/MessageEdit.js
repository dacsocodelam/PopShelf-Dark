import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Message.css';

export default function MessageEdit() {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const res = await axios.get(`/api/v1/messages/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const m = res.data;
        setUsername(m.username || '');
        setContent(m.content || '');
      } catch (err) {
        console.error('fetch one error', err);
        alert('Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await axios.put(`/api/v1/messages/${id}`, { username, content }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      navigate('/messages');
    } catch (err) {
      console.error('update error', err);
      if (err?.response?.data?.errors) setErrors(err.response.data.errors);
      else setErrors(['Unexpected error']);
    }
  };

  if (loading) return <div className="mc-loading">Loading…</div>;

  return (
    <div className="mc-container">
      <h1>Edit Message</h1>
      {errors.length > 0 && (
        <div className="mc-errors">{errors.map((er,i)=>(<div key={i}>{er}</div>))}</div>
      )}
      <form onSubmit={handleSubmit} className="mc-form">
        <div className="mc-form-row">
          <label>ユーザー名</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        <div className="mc-form-row">
          <label>メッセージ</label>
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={5} />
        </div>
        <div className="mc-form-actions">
          <button type="submit" className="mc-btn">更新</button>
        </div>
      </form>
    </div>
  );
}

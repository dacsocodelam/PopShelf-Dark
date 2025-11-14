import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Message.css';

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('/api/v1/messages', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setMessages(res.data || []);
      } catch (err) {
        console.error('fetch messages error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`/api/v1/messages/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('delete failed', err);
      alert('Delete failed');
    }
  };

  if (loading) return <div className="mc-loading">Loading messages…</div>;

  return (
    <div className="mc-container">
      <h1>Messages</h1>
      <div className="mc-actions">
        <Link to="/messages/new" className="mc-btn">New Message</Link>
      </div>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="mc-list">
          {messages.map((m) => (
            <li key={m.id} className="mc-item">
              <div className="mc-item-head">
                <strong className="mc-username">{m.username || 'Anonymous'}</strong>
                <span className="mc-date">{new Date(m.created_at || m.createdAt || Date.now()).toLocaleString()}</span>
              </div>
              <div className="mc-content">{m.content}</div>
              <div className="mc-item-actions">
                <Link to={`/messages/${m.id}/edit`} className="mc-link">Edit</Link>
                <button className="mc-link mc-delete" onClick={() => handleDelete(m.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

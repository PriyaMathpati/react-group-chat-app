
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

const initialRooms = ['General', 'Technology', 'Random'];
const initialMessages = {
  General: [
    { id: 1, sender: 'Admin', text: 'Welcome to the group chat!', time: new Date().toISOString() }
  ],
  Technology: [],
  Random: []
};


function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) return fallback;

    const parsed = JSON.parse(value);

    if (key === 'chatUser') {
      return parsed &&
        typeof parsed.name === 'string' &&
        parsed.name.trim()
        ? parsed
        : fallback;
    }

    if (key === 'chatRooms') {
      return Array.isArray(parsed) &&
        parsed.every(room => typeof room === 'string' && room.trim())
        ? parsed
        : fallback;
    }

    if (key === 'chatMessages') {
      const validMessages =
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed) &&
        Object.values(parsed).every(
          roomMessages =>
            Array.isArray(roomMessages) &&
            roomMessages.every(
              msg =>
                msg &&
                typeof msg.sender === 'string' &&
                typeof msg.text === 'string' &&
                typeof msg.time === 'string' &&
                (typeof msg.id === 'string' ||
                  typeof msg.id === 'number')
            )
        );

      return validMessages ? parsed : fallback;
    }

    return fallback;
  } catch {
    return fallback;
  }
}


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function login(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    if (username.trim().toLowerCase() !== 'priya' || password !== 'chat123') {
      setError('Invalid username or password.');
      return;
    }

    localStorage.setItem('chatUser', JSON.stringify({ name: 'priya' }));
    navigate('/chat');
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={login}>
        <div className="chat-icon">💬</div>
        <h1>Welcome Back!</h1>
        <p className="subtitle">Sign in to your group chat</p>

        <label htmlFor="username">Username</label>
        <input id="username" value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password" />

        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>

        <p className="demo-info">
          Demo username: <b>priya</b><br />
          Demo password: <b>chat123</b>
        </p>
      </form>
    </main>
  );
}

function Chat() {
  const navigate = useNavigate();
  const user = readStorage('chatUser', null);

  const [rooms, setRooms] = useState(() =>
    readStorage('chatRooms', initialRooms)
  );
  const [messages, setMessages] = useState(() =>
    readStorage('chatMessages', initialMessages)
  );
  const [activeRoom, setActiveRoom] = useState('General');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  if (!user) return <Navigate to="/" replace />;

  const roomMessages = (messages[activeRoom] || []).filter(msg =>
    msg.text.toLowerCase().includes(search.toLowerCase())
  );

  function sendMessage(e) {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: user.name,
      text: message.trim(),
      time: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), newMessage]
    }));
    setMessage('');
    setShowEmoji(false);
  }

  function createRoom(e) {
    e.preventDefault();
    const name = newRoom.trim();

    if (!name) return;
    if (rooms.some(room => room.toLowerCase() === name.toLowerCase())) {
      alert('This room already exists.');
      return;
    }

    setRooms(prev => [...prev, name]);
    setMessages(prev => ({ ...prev, [name]: [] }));
    setActiveRoom(name);
    setNewRoom('');
    setShowRoomInput(false);
    setShowSidebar(false);
  }

  function logout() {
    localStorage.removeItem('chatUser');
    navigate('/');
  }

  function formatTime(time) {
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <main className="chat-app">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setShowSidebar(!showSidebar)}>
          ☰
        </button>
        <div className="brand">💬 GroupChat</div>
        <div className="profile">
          <span className="avatar">{user.name[0].toUpperCase()}</span>
          <span>{user.name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="chat-layout">
        <aside className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
          <div className="sidebar-heading">
            <h3>Chat Rooms</h3>
            <button onClick={() => setShowRoomInput(!showRoomInput)}>＋</button>
          </div>

          {showRoomInput && (
            <form className="room-form" onSubmit={createRoom}>
              <input value={newRoom} onChange={e => setNewRoom(e.target.value)}
                placeholder="Room name" autoFocus />
              <button type="submit">Add</button>
            </form>
          )}

          {rooms.map(room => (
            <button key={room}
              className={`room-item ${activeRoom === room ? 'selected' : ''}`}
              onClick={() => {
                setActiveRoom(room);
                setSearch('');
                setShowSidebar(false);
              }}>
              <span> # </span>{room}
              <span className="online-dot" />
            </button>
          ))}

          <div className="online-section">
            <h4>Members</h4>
            <p><span className="status-dot" /> You — Online</p>
            <p><span className="status-dot offline" /> Alex — Offline</p>
            <p><span className="status-dot" /> Sam — Online</p>
          </div>
        </aside>

        <section className="chat-main">
          <div className="room-header">
            <div>
              <h2># {activeRoom}</h2>
              <p>{roomMessages.length} messages matching your search</p>
            </div>
            <input className="search-input" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search messages..." />
          </div>

          <div className="messages-area">
            {roomMessages.length === 0 ? (
              <div className="empty-state">
                <span>💬</span>
                <h3>{search ? 'No matching messages' : 'No messages yet'}</h3>
                <p>{search ? 'Try another search term.' : 'Start the conversation in this room!'}</p>
              </div>
            ) : roomMessages.map(msg => (
              <article className="message" key={msg.id}>
                <div className="avatar message-avatar">
                  {msg.sender[0].toUpperCase()}
                </div>
                <div className="message-content">
                  <div className="message-meta">
                    <strong>{msg.sender}</strong>
                    <time>{formatTime(msg.time)}</time>
                  </div>
                  <p>{msg.text}</p>
                </div>
              </article>
            ))}
          </div>

          {showEmoji && (
            <div className="emoji-panel">
              {['😀', '😂', '❤️', '👍', '🎉', '😊', '🔥', '👏', '🙏', '💡'].map(emoji => (
                <button key={emoji} onClick={() => setMessage(prev => prev + emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <form className="message-form" onSubmit={sendMessage}>
            <button type="button" className="emoji-button"
              onClick={() => setShowEmoji(!showEmoji)} aria-label="Choose emoji">
              😊
            </button>
            <input value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Message #${activeRoom}`}
              aria-label="Message" />
            <button type="submit" className="send-button">Send ➤</button>
          </form>
          <p className="input-hint">Press Enter to send your message</p>
        </section>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

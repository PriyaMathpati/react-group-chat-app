
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const initialRooms = ['General', 'Technology', 'Random'];

const demoMembers = [
  'priya',
  'Alex',
  'Sam',
  'Rahul',
  'Amit',
  'Sneha'
];

const initialRoomMembers = {
  General: ['priya', 'Alex', 'Sam'],
  Technology: ['priya', 'Rahul'],
  Random: ['priya', 'Sam']
};

const initialMessages = {
  General: [
    {
      id: 1,
      sender: 'Admin',
      text: 'Welcome to the group chat!',
      time: new Date().toISOString()
    }
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
        parsed.every(
          room => typeof room === 'string' && room.trim()
        )
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

    if (key === 'chatRoomMembers') {
      const validMembers =
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed) &&
        Object.values(parsed).every(
          members =>
            Array.isArray(members) &&
            members.every(member => typeof member === 'string')
        );

      return validMembers ? parsed : fallback;
    }

    return fallback;
  } catch {
    return fallback;
  }
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

  const [roomMembers, setRoomMembers] = useState(() =>
    readStorage('chatRoomMembers', initialRoomMembers)
  );

  const [activeRoom, setActiveRoom] = useState(() => {
    const savedRooms = readStorage('chatRooms', initialRooms);
    return savedRooms.includes('General')
      ? 'General'
      : savedRooms[0];
  });

  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newRoomMembers, setNewRoomMembers] = useState(['priya']);

  useEffect(() => {
    localStorage.setItem('chatRooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(
      'chatRoomMembers',
      JSON.stringify(roomMembers)
    );
  }, [roomMembers]);

  if (!user) return <Navigate to="/" replace />;

  const currentMembers = roomMembers[activeRoom] || [user.name];

  const availableMembers = demoMembers.filter(
    member => !currentMembers.includes(member)
  );

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
      [activeRoom]: [
        ...(prev[activeRoom] || []),
        newMessage
      ]
    }));

    setMessage('');
    setShowEmoji(false);
  }

  function toggleMember(member, isNewRoom = false) {
    if (isNewRoom) {
      setNewRoomMembers(prev =>
        prev.includes(member)
          ? prev.filter(item => item !== member)
          : [...prev, member]
      );
    } else {
      setSelectedMembers(prev =>
        prev.includes(member)
          ? prev.filter(item => item !== member)
          : [...prev, member]
      );
    }
  }

  function createRoom(e) {
    e.preventDefault();

    const name = newRoom.trim();

    if (!name) {
      alert('Please enter a room name.');
      return;
    }

    if (rooms.some(room => room.toLowerCase() === name.toLowerCase())) {
      alert('This room already exists.');
      return;
    }

    setRooms(prev => [...prev, name]);

    setMessages(prev => ({
      ...prev,
      [name]: []
    }));

    setRoomMembers(prev => ({
      ...prev,
      [name]: [...new Set([user.name, ...newRoomMembers])]
    }));

    setActiveRoom(name);
    setNewRoom('');
    setNewRoomMembers([user.name]);
    setShowRoomInput(false);
    setShowSidebar(false);
  }

  function openMembersModal() {
    setSelectedMembers([]);
    setShowMembersModal(true);
  }

  function addMembersToRoom() {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member.');
      return;
    }

    setRoomMembers(prev => ({
      ...prev,
      [activeRoom]: [
        ...new Set([
          ...(prev[activeRoom] || [user.name]),
          ...selectedMembers
        ])
      ]
    }));

    setSelectedMembers([]);
    setShowMembersModal(false);
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
      <Header
  user={user}
  showSidebar={showSidebar}
  setShowSidebar={setShowSidebar}
  logout={logout}
/>

      <div className="chat-layout">
        <Sidebar
  showSidebar={showSidebar}
  user={user}
  rooms={rooms}
  activeRoom={activeRoom}
  setActiveRoom={setActiveRoom}
  setSearch={setSearch}
  setShowSidebar={setShowSidebar}
  showRoomInput={showRoomInput}
  setShowRoomInput={setShowRoomInput}
  newRoom={newRoom}
  setNewRoom={setNewRoom}
  createRoom={createRoom}
  demoMembers={demoMembers}
  newRoomMembers={newRoomMembers}
  toggleMember={toggleMember}
  currentMembers={currentMembers}
  openMembersModal={openMembersModal}
/>

        <section className="chat-main">
          <div className="room-header">
            <div>
              <h2># {activeRoom}</h2>

              <p>
                {roomMessages.length} messages matching your search
              </p>

              <p className="room-member-count">
                👥 {currentMembers.length} members
              </p>
            </div>

            <div className="room-header-actions">
              <input
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Search messages..."
            />

            <button
                type="button"
                className="add-members-btn"
                onClick={openMembersModal}
            >
                ＋ Add Members
            </button>
            </div>
        </div>

        <MessageList
            roomMessages={roomMessages}
            search={search}
            formatTime={formatTime}
        />

        <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            showEmoji={showEmoji}
            setShowEmoji={setShowEmoji}
            activeRoom={activeRoom}
        />

        <p className="input-hint">
            Press Enter to send your message
        </p>
        </section>
    </div>

      {showMembersModal && (
        <div
          className="modal-backdrop"
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowMembersModal(false);
            }
          }}
        >
          <div
            className="members-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="members-modal-title"
          >
            <h2 id="members-modal-title">Add Members</h2>

            <p>
              Select members to add to <strong>{activeRoom}</strong>.
            </p>

            {availableMembers.length === 0 ? (
              <p>
                All available demo members are already in this room.
              </p>
            ) : (
              <div className="members-checkbox-list">
                {availableMembers.map(member => (
                  <label key={member} className="member-option">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member)}
                      onChange={() => toggleMember(member)}
                    />

                    <span className="avatar member-avatar">
                      {member[0].toUpperCase()}
                    </span>

                    <span>{member}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="members-modal-actions">
              <button
                type="button"
                className="cancel-members-btn"
                onClick={() => {
                  setShowMembersModal(false);
                  setSelectedMembers([]);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="add-members-btn"
                onClick={addMembersToRoom}
                disabled={selectedMembers.length === 0}
              >
                Add Members
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Chat;


function Sidebar({
  showSidebar,
  user,
  rooms,
  activeRoom,
  setActiveRoom,
  setSearch,
  setShowSidebar,
  showRoomInput,
  setShowRoomInput,
  newRoom,
  setNewRoom,
  createRoom,
  demoMembers,
  newRoomMembers,
  toggleMember,
  currentMembers,
  openMembersModal
}) {
  return (
    <aside
      className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`}
    >
      <div className="sidebar-heading">
        <h3>Chat Rooms</h3>

        <button
          onClick={() => setShowRoomInput(!showRoomInput)}
          aria-label="Create chat room"
        >
          ＋
        </button>
      </div>

      {showRoomInput && (
        <form className="room-form" onSubmit={createRoom}>
          <input
            value={newRoom}
            onChange={e => setNewRoom(e.target.value)}
            placeholder="Room name"
            autoFocus
          />

          <div className="room-member-picker">
            <p>Select members:</p>

            {demoMembers
              .filter(member => member !== user.name)
              .map(member => (
                <label key={member} className="member-option">
                  <input
                    type="checkbox"
                    checked={newRoomMembers.includes(member)}
                    onChange={() => toggleMember(member, true)}
                  />
                  {member}
                </label>
              ))}
          </div>

          <button type="submit">Add</button>
        </form>
      )}

      {rooms.map(room => (
        <button
          key={room}
          className={`room-item ${
            activeRoom === room ? 'selected' : ''
          }`}
          onClick={() => {
            setActiveRoom(room);
            setSearch('');
            setShowSidebar(false);
          }}
        >
          <span>#</span>
          {room}
          <span className="online-dot" />
        </button>
      ))}

      <div className="online-section">
        <h4>Members ({currentMembers.length})</h4>

        {currentMembers.map(member => (
          <p key={member}>
            <span
              className={`status-dot ${
                member === 'Alex' ? 'offline' : ''
              }`}
            />
            {member}
            {member === user.name ? ' (You)' : ''}
          </p>
        ))}

        <button
          type="button"
          className="add-members-btn"
          onClick={openMembersModal}
        >
          ＋ Add Members
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

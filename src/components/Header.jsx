function Header({ user, showSidebar, setShowSidebar, logout }) {
  return (
    <header className="topbar">
      <button
        className="mobile-menu"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        ☰
      </button>

      <div className="brand">💬 GroupChat</div>

      <div className="profile">
        <span className="avatar">
          {user.name[0].toUpperCase()}
        </span>

        <span>{user.name}</span>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
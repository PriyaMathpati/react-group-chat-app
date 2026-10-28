function MessageList({ roomMessages, search, formatTime }) {
  return (
    <div className="messages-area">
      {roomMessages.length === 0 ? (
        <div className="empty-state">
          <span>💬</span>
          <h3>
            {search ? 'No matching messages' : 'No messages yet'}
          </h3>
          <p>
            {search
              ? 'Try another search term.'
              : 'Start the conversation in this room!'}
          </p>
        </div>
      ) : (
        roomMessages.map(msg => (
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
        ))
      )}
    </div>
  );
}

export default MessageList;
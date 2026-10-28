function MessageInput({
  message,
  setMessage,
  sendMessage,
  showEmoji,
  setShowEmoji,
  activeRoom
}) {
  const emojis = ['😀', '😂', '❤️', '👍', '🎉', '😊', '🔥', '👏', '🙏', '💡'];

  return (
    <>
      {showEmoji && (
        <div className="emoji-panel">
          {emojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setMessage(prev => prev + emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form className="message-form" onSubmit={sendMessage}>
        <button
          type="button"
          className="emoji-button"
          onClick={() => setShowEmoji(!showEmoji)}
          aria-label="Choose emoji"
        >
          😊
        </button>

        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={`Message #${activeRoom}`}
          aria-label="Message"
        />

        <button type="submit" className="send-button">
          Send ➤
        </button>
      </form>

      <p className="input-hint">Press Enter to send your message</p>
    </>
  );
}

export default MessageInput;
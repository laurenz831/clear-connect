import React, { useEffect, useRef } from 'react';

// Zeigt den kompletten Gesprächsverlauf als Liste von Nachrichten.
// Scrollt automatisch nach unten wenn eine neue Nachricht ankommt.

const ABSENDER = {
  doctor:  'Arzt',
  patient: 'Patient',
  system:  'System',
};

export default function ConversationHistory({ conversation }) {
  const bottomRef = useRef(null);

  // Jedes Mal wenn eine neue Nachricht dazu kommt, nach unten scrollen
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <>
      <div className="panel-title">
        <span>Gesprächsverlauf</span>
        <span className="count-badge">{conversation.length}</span>
      </div>

      <div className="history-body">
        {conversation.length === 0 ? (
          <div className="history-empty">Noch keine Nachrichten</div>
        ) : (
          conversation.map((msg, i) => (
            <div key={i} className={`history-msg ${msg.sender}`}>
              <div className="msg-sender">{ABSENDER[msg.sender] ?? msg.sender}</div>
              <div className="msg-text">{msg.text}</div>
              <div className="msg-time">{msg.timestamp}</div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </>
  );
}

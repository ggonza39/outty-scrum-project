'use client';

import { FormEvent, useState } from 'react';
import MobilePage from '@/components/MobilePage';

export default function MessagePage() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey! I really liked your profile.', self: false },
    { id: 2, text: 'Thanks. Your travel photos looked fun.', self: true },
    { id: 3, text: 'Want to grab coffee this weekend?', self: false },
  ]);
  const [draft, setDraft] = useState('Sounds good to me. Saturday afternoon works.');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((current) => [...current, { id: Date.now(), text: draft.trim(), self: true }]);
    setDraft('');
  };

  return (
    <MobilePage>
      <section className="hero">
        <h1>Messages</h1>
        <p>Chat is interactive here, so you can type and send new messages.</p>
      </section>

      <main className="content">
        <section className="card">
          <div className="message-list">
            {messages.map((message) => (
              <div key={message.id} className={`message-bubble ${message.self ? 'self' : 'other'}`}>
                {message.text}
              </div>
            ))}
          </div>
        </section>

        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="draft">Reply</label>
            <textarea
              id="draft"
              className="textarea"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: 18 }}>
            Send message
          </button>
        </form>
      </main>
    </MobilePage>
  );
}

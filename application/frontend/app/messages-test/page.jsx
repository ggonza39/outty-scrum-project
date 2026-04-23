'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function MessagesTestPage() {
  const [inputConversationId, setInputConversationId] = useState('')
  const [activeConversationId, setActiveConversationId] = useState('')
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [userId, setUserId] = useState(null)
  const [recipientId, setRecipientId] = useState('')
  const [status, setStatus] = useState('Idle')
  const [presenceStatus, setPresenceStatus] = useState('Not connected')
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        setStatus(`Auth error: ${error.message}`)
        return
      }

      setUserId(user?.id ?? null)
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (!activeConversationId || !userId) return

    async function loadConversationAndMessages() {
      setStatus('Loading conversation...')

      const { data: conversationData, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', activeConversationId)
        .single()

      if (conversationError) {
        setConversation(null)
        setMessages([])
        setRecipientId('')
        setStatus(`Conversation load error: ${conversationError.message}`)
        return
      }

      setConversation(conversationData)

      const otherUserId =
        conversationData.user1_id === userId
          ? conversationData.user2_id
          : conversationData.user1_id

      setRecipientId(otherUserId)

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true })

      if (messageError) {
        setMessages([])
        setStatus(`Message load error: ${messageError.message}`)
        return
      }

      setMessages(messageData || [])

      const { error: readError } = await supabase.rpc('mark_conversation_as_read', {
        p_conversation_id: activeConversationId,
      })

      if (readError) {
        setStatus(`Loaded messages, but read receipt error: ${readError.message}`)
        return
      }

      setStatus('Conversation loaded')
    }

    loadConversationAndMessages()
  }, [activeConversationId, userId])

  useEffect(() => {
    if (!activeConversationId || !userId) return

    const channel = supabase
      .channel(`messages-${activeConversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const newMessage = payload.new

          setMessages((current) => {
            const exists = current.some((message) => message.id === newMessage.id)
            if (exists) return current
            return [...current, newMessage]
          })
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.values(state)
          .flat()
          .map((entry) => entry.user_id)
          .filter(Boolean)

        setOnlineUsers([...new Set(users)])
        setPresenceStatus('Synced')
      })
      .on('presence', { event: 'join' }, () => {
        setPresenceStatus('User joined')
      })
      .on('presence', { event: 'leave' }, () => {
        setPresenceStatus('User left')
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { error } = await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          })

          if (error) {
            setPresenceStatus(`Track error: ${error.message}`)
            return
          }

          setPresenceStatus('Connected')
        }
      })

    return () => {
      setOnlineUsers([])
      setPresenceStatus('Not connected')
      supabase.removeChannel(channel)
    }
  }, [activeConversationId, userId])

  function handleLoadConversation(event) {
    event.preventDefault()

    const trimmedId = inputConversationId.trim()

    if (!trimmedId) {
      setStatus('Enter a conversation ID')
      return
    }

    setConversation(null)
    setMessages([])
    setRecipientId('')
    setActiveConversationId(trimmedId)
    setStatus('Preparing conversation...')
  }

  async function handleSendMessage(event) {
    event.preventDefault()

    const trimmedDraft = draft.trim()

    if (!trimmedDraft) {
      setStatus('Message cannot be empty')
      return
    }

    if (!activeConversationId) {
      setStatus('Load a conversation first')
      return
    }

    if (!userId) {
      setStatus('No authenticated user found')
      return
    }

    if (!recipientId) {
      setStatus('Recipient has not been resolved yet')
      return
    }

    const { error } = await supabase.from('messages').insert({
      conversation_id: activeConversationId,
      sender_id: userId,
      recipient_id: recipientId,
      content: trimmedDraft,
    })

    if (error) {
      setStatus(`Send error: ${error.message}`)
      return
    }

    setDraft('')
    setStatus('Message inserted')
  }

  return (
    <main style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Messages Test Page</h1>
      <p>Temporary page for testing Supabase Realtime.</p>

      <form onSubmit={handleLoadConversation} style={{ marginBottom: '24px' }}>
        <label htmlFor="conversationId">Conversation ID</label>
        <br />
        <input
          id="conversationId"
          type="text"
          value={inputConversationId}
          onChange={(event) => setInputConversationId(event.target.value)}
          placeholder="Paste a conversation UUID"
          style={{ width: '100%', maxWidth: '700px', padding: '8px', marginTop: '8px' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '12px', padding: '8px 12px' }}>
          Load conversation
        </button>
      </form>

      <form onSubmit={handleSendMessage} style={{ marginBottom: '24px' }}>
        <label htmlFor="draft">Message</label>
        <br />
        <textarea
          id="draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message"
          style={{
            width: '100%',
            maxWidth: '700px',
            minHeight: '100px',
            padding: '8px',
            marginTop: '8px',
          }}
        />
        <br />
        <button type="submit" style={{ marginTop: '12px', padding: '8px 12px' }}>
          Send message
        </button>
      </form>

      <h2>Status</h2>
      <pre>{status}</pre>

      <h2>Presence Status</h2>
      <pre>{presenceStatus}</pre>

      <h2>Online Users</h2>
      <pre>{JSON.stringify(onlineUsers, null, 2)}</pre>

      <h2>Current User ID</h2>
      <pre>{JSON.stringify(userId, null, 2)}</pre>

      <h2>Active Conversation</h2>
      <pre>{JSON.stringify(conversation, null, 2)}</pre>


      <h2>Messages</h2>
      <div
        style={{
          maxWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => {
            const isSelf = message.sender_id === userId

            return (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: isSelf ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '12px 14px',
                    borderRadius: '16px',
                    backgroundColor: isSelf ? '#dbeafe' : '#f3f4f6',
                    border: '1px solid #d1d5db',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>{message.content}</div>

                  <div style={{ fontSize: '12px', color: '#555' }}>
                    <div>{new Date(message.created_at).toLocaleString()}</div>
                    <div>{message.is_read ? 'Read' : 'Unread'}</div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

    </main>
  )
}
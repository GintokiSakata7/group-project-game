import { useEffect, useMemo, useRef, useState } from 'react';
import { Hash, Lock, MessageCircle, Paperclip, Search, Send, Smile, Sparkles, Users, Pin } from 'lucide-react';
import { useGameStore } from '../game/store';
import { Avatar, DotStatus, Pill } from './shared';

export default function ChatApp() {
  const { companyName, channels, messages, employees, day, sendMessage } = useGameStore();
  const [active, setActive] = useState('general');
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const channel = channels.find((item) => item.id === active) ?? channels[0];
  const channelMessages = useMemo(() => messages.filter((message) => message.channelId === active && message.day <= day), [messages, active, day]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [channelMessages.length, active]);

  const submit = () => {
    if (!draft.trim()) return;
    sendMessage(active, draft);
    setDraft('');
  };

  const groups = [
    { title: 'CHANNELS', items: channels.filter((item) => item.type === 'group') },
    { title: 'DIRECT / UNINVITED', items: channels.filter((item) => item.type === 'direct') },
    { title: 'EXTERNAL', items: channels.filter((item) => item.type === 'client') },
  ];
  const currentMember = employees.find((person) => person.id === active);
  const nameColor = (id: string) => employees.find((person) => person.id === id)?.color ?? '#dce6c7';
  const emoji = (id: string) => employees.find((person) => person.id === id)?.avatar ?? (id === 'prakash' ? '👨🏻‍💼' : id === 'bunty' ? '🧑🏻‍💻' : 'P');
  const filteredGroups = groups.map((group) => ({ ...group, items: group.items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) }));

  const getSenderRole = (senderId: string, senderName: string): string | null => {
    if (senderId === 'player' || senderName === 'You') return 'Founder';
    if (senderId === 'system' || senderName === 'ALMOSTOS') return 'System';
    if (senderName === 'BUILD MONITOR') return 'System Monitor';
    if (senderId === 'prakash' || senderName.includes('Prakash')) return 'Client';
    if (senderId === 'bunty' || senderName.includes('Bunty')) return "Client's Nephew";
    const person = employees.find((p) => p.id === senderId || p.name.toLowerCase() === senderName.toLowerCase());
    if (person) {
      if (person.id === 'kunal') return 'Client Relations';
      if (person.id === 'aarav') return 'Full-Stack Vibe Coder';
      if (person.id === 'varun') return 'Technical Lead';
      if (person.id === 'meera') return 'Quality Assurance';
      if (person.id === 'nikhil') return 'Backend Developer';
      return person.role || person.title;
    }
    return null;
  };

  return <div className="chat-app">
    <aside className="chat-sidebar">
      <div className="chat-workspace"><span className="workspace-mark">P</span><span><strong>{companyName}</strong><small>Founder workspace</small></span><span className="workspace-menu">⌄</span></div>
      <div className="chat-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a conversation" /></div>
      <div className="chat-sidebar-channels">
        {filteredGroups.map((group) => <div className="chat-nav-group" key={group.title}><div className="chat-group-title">{group.title}</div>{group.items.map((item) => <button key={item.id} className={`chat-nav-item ${active === item.id ? 'active' : ''}`} onClick={() => setActive(item.id)}>{item.type === 'group' ? <Hash size={14} /> : item.type === 'client' ? <span className="external-icon">↗</span> : <span className="dm-avatar" style={{ background: nameColor(item.id) }}>{emoji(item.id)}</span>}<span>{item.name}{item.type === 'direct' && getSenderRole(item.id, item.name) ? <small className="chat-nav-role"> ({getSenderRole(item.id, item.name)})</small> : ''}</span>{item.id === 'nikhil' && <span className="offline-mark" />}</button>)}</div>)}
      </div>
      <div className="chat-sidebar-bottom">
        <span className="profile-mini">F</span>
        <div className="profile-info">
          <strong>You (Founder & CEO)</strong>
          <small>Accountability is online</small>
        </div>
        <span className="online-mark" />
      </div>
    </aside>
    <section className="chat-main">
      <header className="chat-header"><div><h3>{channel.type === 'group' ? <Hash size={17} /> : channel.type === 'client' ? <span>↗</span> : <span className="header-avatar" style={{ background: nameColor(active) }}>{emoji(active)}</span>}{channel.name}{channel.type === 'direct' && getSenderRole(active, channel.name) ? <span className="chat-header-role"> ({getSenderRole(active, channel.name)})</span> : ''}</h3><p>{channel.subtitle}</p></div><div className="chat-header-actions"><Pill tone={channel.type === 'client' ? 'warning' : 'neutral'}>{channel.type === 'client' ? 'CLIENT' : channel.type === 'direct' ? 'DIRECT MESSAGE' : `${channel.memberIds.length} MEMBERS`}</Pill><span className="chat-member-icon" title="Open People for employee profiles"><Users size={16} /></span></div></header>
      <div className="chat-pinned-banner">
        <Pin size={12} />
        <span><strong>PINNED:</strong> Workstream ownership active · Deliver Phase 1 by Day 7</span>
      </div>
      <div className="chat-thread" ref={scrollRef}>
        <div className="chat-day-divider"><span>DAY {day} · COMPANY TIME</span></div>
        {channelMessages.length === 0 && <div className="chat-empty">No messages yet. This is either peaceful or suspicious.</div>}
        {channelMessages.map((message, index) => {
          const own = message.senderId === 'player';
          const previous = channelMessages[index - 1];
          const compact = previous && previous.senderId === message.senderId && previous.time === message.time;
          const role = getSenderRole(message.senderId, message.senderName);
          const alreadyHasRole = message.senderName.includes('(');
          return <div key={message.id} className={`message-row ${own ? 'own-message' : ''} ${message.kind === 'system' ? 'system-message' : ''} ${compact ? 'message-compact' : ''}`}>
            {!compact && <Avatar name={message.senderName} emoji={emoji(message.senderId)} color={nameColor(message.senderId)} size="sm" />}
            <div className="message-content">{!compact && <div className="message-meta"><strong>{message.senderName}{role && !alreadyHasRole && <span className="meta-role-tag"> ({role})</span>}</strong>{message.kind === 'client' && <Pill tone="warning">CLIENT</Pill>}<time>{message.time}</time></div>}<div className={`message-bubble ${message.kind === 'funny' ? 'funny-bubble' : ''} ${message.kind === 'system' ? 'system-bubble' : ''}`}>{message.text}</div></div>
          </div>;
        })}
        {channel.type === 'direct' && currentMember?.id === 'nikhil' && <div className="presence-note"><span className="offline-dot" /> Nikhil’s last seen status is not a reliable concept of time.</div>}
      </div>
      <div className="chat-compose-wrap"><div className="compose-context"><Sparkles size={13} /> Messages can affect trust, morale and scope. Choose your words like a founder.</div><div className="chat-compose"><button className="compose-tool" title="Attachments are not enabled in this build" disabled><Paperclip size={16} /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} placeholder={`Message ${channel.type === 'group' ? `#${channel.name}` : channel.name}…`} /><button className="compose-tool" title="Add a little optimism" onClick={() => setDraft((current) => `${current}😅`)}><Smile size={16} /></button><button className="send-button" onClick={submit} disabled={!draft.trim()} title="Send message"><Send size={16} /></button></div></div>
    </section>
  </div>;
}

"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  activity,
  attention,
  chatMessages,
  clients,
  conversations,
  documents,
  initialTasks,
  metrics,
  navItems,
  pipelineColumns,
  pipelineStageLabel,
  quotes,
  settingsGroups,
  type Client,
  type NavKey,
} from "@/app/lib/crm-data";

type SetView = (view: NavKey) => void;

const viewTitles: Record<NavKey, { title: string; subtitle: string }> = {
  dashboard: { title: "Good morning, Olivia.", subtitle: "Here’s what needs your attention today." },
  conversations: { title: "Conversations", subtitle: "Monitor WhatsApp messages, intent and response needs." },
  pipeline: { title: "Client pipeline", subtitle: "Move every opportunity forward with a clear next step." },
  clients: { title: "Clients", subtitle: "Search, review and manage your complete book of business." },
  tasks: { title: "Tasks & follow-ups", subtitle: "Stay ahead of every promise and client deadline." },
  quotes: { title: "Quotes", subtitle: "Compare carrier options and track every recommendation." },
  documents: { title: "Documents", subtitle: "Review protected client files and AI-extracted information." },
  analytics: { title: "Analytics", subtitle: "Understand lead quality, conversion and sales performance." },
  team: { title: "Team", subtitle: "Workload, roles and availability across your brokerage." },
  settings: { title: "Settings", subtitle: "Configure your CRM without changing application code." },
};

function Avatar({ initials, tone = "blue", small = false }: { initials: string; tone?: string; small?: boolean }) {
  return <span className={`avatar tone-${tone} ${small ? "small" : ""}`}>{initials}</span>;
}

function Status({ children, tone = "green" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

export default function CRMApp() {
  const [view, setView] = useState<NavKey>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [modal, setModal] = useState<"client" | "task" | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [toast, setToast] = useState("");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return clients.filter((client) => [client.name, client.phone, client.email, client.vin, pipelineStageLabel(client.pipelineStage)].some((value) => value.toLowerCase().includes(normalized))).slice(0, 5);
  }, [query]);

  function navigate(next: NavKey) {
    setView(next);
    setMobileOpen(false);
    setSelectedClient(null);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">×</button>
        <button className="brand" onClick={() => navigate("dashboard")}><span className="brand-mark">A</span><span>Avexa</span></button>
        <nav aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map((item) => (
            <button className={`nav-item ${view === item.key ? "active" : ""}`} key={item.key} onClick={() => navigate(item.key)}>
              <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
              {item.count && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
          <p className="nav-label secondary-label">Manage</p>
          <button className={`nav-item ${view === "team" ? "active" : ""}`} onClick={() => navigate("team")}><span className="nav-icon">♧</span><span>Team</span></button>
          <button className={`nav-item ${view === "settings" ? "active" : ""}`} onClick={() => navigate("settings")}><span className="nav-icon">⚙</span><span>Settings</span></button>
        </nav>
        <div className="sidebar-foot">
          <div className="connection-dot" />
          <div><strong>WhatsApp integration</strong><span>360dialog · Server-side key</span></div>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

      <section className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="search">
            <span>⌕</span><input aria-label="Search" placeholder="Search clients, phone, VIN..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd>
            {query && <button className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
            {searchResults.length > 0 && (
              <div className="search-results">
                <p>Clients</p>
                {searchResults.map((client) => <button key={client.id} onClick={() => { setSelectedClient(client); setView("clients"); setQuery(""); }}><Avatar initials={client.initials} tone={client.tone} small /><span><strong>{client.name}</strong><em>{client.phone} · {pipelineStageLabel(client.pipelineStage)}</em></span><b>→</b></button>)}
              </div>
            )}
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications" onClick={() => setShowNotifications((open) => !open)}>♢<span className="alert-dot" /></button>
            <div className="profile"><Avatar initials="OA" tone="green" /><div><strong>Olivia Adams</strong><span>Broker</span></div><span className="chevron">⌄</span></div>
          </div>
          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} setView={navigate} />}
        </header>

        <div className={`content ${view === "conversations" ? "conversation-content" : ""}`}>
          {view !== "dashboard" && view !== "conversations" && !selectedClient && (
            <PageHeader view={view} onAddClient={() => setModal("client")} onNewTask={() => setModal("task")} />
          )}
          {view === "dashboard" && <DashboardView setView={navigate} onAddClient={() => setModal("client")} onNewTask={() => setModal("task")} showToast={showToast} />}
          {view === "conversations" && <ConversationsView showToast={showToast} />}
          {view === "pipeline" && <PipelineView onOpenClient={(client) => { setSelectedClient(client); setView("clients"); }} showToast={showToast} />}
          {view === "clients" && (selectedClient ? <ClientProfile client={selectedClient} onBack={() => setSelectedClient(null)} setView={navigate} showToast={showToast} /> : <ClientsView onOpen={setSelectedClient} />)}
          {view === "tasks" && <TasksView onNewTask={() => setModal("task")} showToast={showToast} />}
          {view === "quotes" && <QuotesView showToast={showToast} />}
          {view === "documents" && <DocumentsView showToast={showToast} />}
          {view === "analytics" && <AnalyticsView />}
          {view === "team" && <TeamView />}
          {view === "settings" && <SettingsView showToast={showToast} />}
        </div>
      </section>

      {modal && <QuickModal type={modal} onClose={() => setModal(null)} onSave={(message) => { setModal(null); showToast(message); }} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}

function PageHeader({ view, onAddClient, onNewTask }: { view: NavKey; onAddClient: () => void; onNewTask: () => void }) {
  const info = viewTitles[view];
  return <section className="welcome-row page-heading"><div><p className="eyebrow">Insurance CRM</p><h1>{info.title}</h1><p>{info.subtitle}</p></div><div className="welcome-actions"><button className="button secondary" onClick={onAddClient}>＋ Add client</button><button className="button primary" onClick={onNewTask}>＋ New task</button></div></section>;
}

function DashboardView({ setView, onAddClient, onNewTask, showToast }: { setView: SetView; onAddClient: () => void; onNewTask: () => void; showToast: (message: string) => void }) {
  const [done, setDone] = useState<number[]>([]);
  return <>
    <section className="welcome-row"><div><p className="eyebrow">Tuesday, August 18</p><h1>Good morning, Olivia.</h1><p>Here’s what needs your attention today.</p></div><div className="welcome-actions"><button className="button secondary" onClick={onAddClient}>＋ Add client</button><button className="button primary" onClick={onNewTask}>＋ New task</button></div></section>
    <section className="metrics-grid" aria-label="Daily metrics">
      {metrics.map((metric) => <button className="metric-card" key={metric.label} onClick={() => setView(metric.view)}><div className={`metric-icon ${metric.tone}`}>{metric.tone === "green" ? "↗" : metric.tone === "amber" ? "⌛" : metric.tone === "blue" ? "✓" : "!"}</div><div className="metric-copy"><p>{metric.label}</p><strong>{metric.value}</strong><span className={metric.tone}>{metric.note}</span></div><b>→</b></button>)}
    </section>
    <section className="dashboard-grid">
      <article className="card attention-card"><div className="card-heading"><div><h2>Today’s priorities</h2><p>Your action queue, sorted by urgency.</p></div><button onClick={() => setView("tasks")}>View all <span>→</span></button></div><div className="attention-list">
        {attention.map((item) => <div className={`attention-row ${done.includes(item.id) ? "task-done" : ""}`} key={item.name}><button className="check" onClick={() => { setDone((items) => items.includes(item.id) ? items.filter((id) => id !== item.id) : [...items, item.id]); showToast("Task status updated"); }} aria-label={`Complete task for ${item.name}`}>✓</button><Avatar initials={item.initials} tone={item.tone} /><div className="person-copy"><strong>{item.name}</strong><span>{item.detail}</span></div><Status tone={item.tone}>{item.tag}</Status><span className="row-time">{item.time}</span><button className="more" aria-label="More actions">•••</button></div>)}
      </div></article>
      <article className="card pipeline-card"><div className="card-heading"><div><h2>Pipeline snapshot</h2><p>48 active opportunities</p></div><button onClick={() => setView("pipeline")}>View pipeline <span>→</span></button></div><div className="pipeline-total"><strong>$84.2k</strong><span>Estimated annual premium</span></div><div className="pipeline-bar"><i /><i /><i /><i /><i /></div><div className="pipeline-legend"><div><span className="dot d1" /><p>New leads</p><strong>12</strong></div><div><span className="dot d2" /><p>Quoting</p><strong>18</strong></div><div><span className="dot d3" /><p>Quote provided</p><strong>9</strong></div><div><span className="dot d4" /><p>Ready to bind</p><strong>7</strong></div><div><span className="dot d5" /><p>Binding</p><strong>2</strong></div></div></article>
      <article className="card conversations-card"><div className="card-heading"><div><h2>WhatsApp inbox</h2><p><span className="live-dot" /> 12 unread conversations</p></div><button onClick={() => setView("conversations")}>Open inbox <span>→</span></button></div><div className="conversation-list">{conversations.slice(0, 3).map((item) => <button className="conversation-row" key={item.name} onClick={() => setView("conversations")}><Avatar initials={item.initials} tone={item.tone} /><div className="conversation-copy"><div><strong>{item.name}</strong><span>{item.time}</span></div><p>{item.message}</p><em>{item.status}</em></div><span className="unread">{item.unread}</span></button>)}</div></article>
      <article className="card performance-card"><div className="card-heading"><div><h2>This month</h2><p>Sales performance</p></div><button className="period">August ⌄</button></div><div className="sales-number"><strong>28</strong><span>Policies bound</span><em>↑ 18.4%</em></div><div className="chart" aria-label="Policies bound trend">{[35,48,42,62,57,74,89].map((height,index) => <span className={index === 6 ? "current" : ""} style={{height:`${height}%`}} key={height} />)}</div><div className="chart-labels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div><div className="performance-foot"><div><span>Conversion rate</span><strong>32.8%</strong></div><div><span>Avg. premium</span><strong>$3,084</strong></div></div></article>
    </section>
  </>;
}

function ConversationsView({ showToast }: { showToast: (message: string) => void }) {
  const [selectedId, setSelectedId] = useState(1);
  const [messages, setMessages] = useState(chatMessages);
  const [reply, setReply] = useState("");
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  function send(event: FormEvent) { event.preventDefault(); if (!reply.trim()) return; setMessages((items) => [...items, { id: Date.now(), side: "out", text: reply.trim(), time: "Now" }]); setReply(""); showToast("WhatsApp reply queued for delivery"); }
  return <div className="inbox-shell">
    <section className="inbox-list"><div className="inbox-title"><div><h1>Conversations</h1><p>12 unread · 4 need a reply</p></div><button aria-label="New conversation">＋</button></div><div className="inbox-search">⌕ <input placeholder="Search conversations" aria-label="Search conversations" /></div><div className="inbox-tabs"><button className="active">All <b>12</b></button><button>Unread</button><button>Priority</button></div><div className="inbox-scroll">{conversations.map((conversation) => <button className={`inbox-item ${selectedId === conversation.id ? "selected" : ""}`} key={conversation.id} onClick={() => setSelectedId(conversation.id)}><Avatar initials={conversation.initials} tone={conversation.tone} /><div><span><strong>{conversation.name}</strong><time>{conversation.time}</time></span><p>{conversation.message}</p><Status tone={conversation.tone}>{conversation.status}</Status></div>{conversation.unread > 0 && <b className="unread">{conversation.unread}</b>}</button>)}</div></section>
    <section className="chat-panel"><header className="chat-header"><Avatar initials={selected.initials} tone={selected.tone} /><div><strong>{selected.name}</strong><span><i /> WhatsApp · {selected.phone}</span></div><Status tone="green">{selected.status}</Status><button aria-label="Call client">⌕</button><button aria-label="More actions">•••</button></header><div className="chat-body"><div className="chat-day"><span>Today</span></div>{messages.map((message) => <div className={`message-wrap ${message.side}`} key={message.id}><div className={`message-bubble ${message.file ? "file-message" : ""}`}>{message.file && <span className="file-icon">▤</span>}<div><p>{message.text}</p>{message.file && <em>{message.text.endsWith("pdf") ? "922 KB · PDF" : "1.8 MB · Image"}</em>}<time>{message.time} {message.side === "out" && "✓✓"}</time></div></div></div>)}</div><form className="reply-box" onSubmit={send}><div className="reply-suggest"><span>AI suggested reply</span><button type="button" onClick={() => setReply("Great — I’ll prepare the binding documents. Before we proceed, please confirm your preferred payment date.")}>Use suggestion</button></div><div className="reply-input"><button type="button" aria-label="Attach file">＋</button><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Type a WhatsApp message..." aria-label="WhatsApp reply" /><button className="send-button" aria-label="Send reply">↑</button></div></form></section>
    <aside className="insight-panel"><div className="insight-heading"><span>✦</span><div><strong>AI assistant</strong><p>Message understanding</p></div><Status tone="green">High confidence</Status></div><div className="intent-card"><p>Detected intent</p><strong>Ready to bind</strong><span>94% confidence</span><blockquote>“I’d like to go ahead with the Aviva quote.”</blockquote></div><div className="insight-section"><h3>Suggested next steps</h3><button onClick={() => showToast("Binding review task created")}><span>✓</span><div><strong>Create binding task</strong><p>Assigned to Olivia · Today</p></div><b>＋</b></button><button onClick={() => showToast("Document request opened")}><span>□</span><div><strong>Request void cheque</strong><p>Still missing from checklist</p></div><b>＋</b></button></div><div className="document-check"><h3>Document checklist <b>2 of 4</b></h3><p className="complete"><span>✓</span> Driver licence <em>Verified</em></p><p className="complete"><span>✓</span> Vehicle ownership <em>Review</em></p><p><span>○</span> Void cheque <em>Missing</em></p><p><span>○</span> Signed application <em>Not sent</em></p></div><div className="human-note"><span>!</span><p><strong>Human approval required</strong>Binding and coverage decisions are never automated.</p></div></aside>
  </div>;
}

function PipelineView({ onOpenClient, showToast }: { onOpenClient: (client: Client) => void; showToast: (message: string) => void }) {
  return <><div className="filter-row"><div><button className="filter active">All opportunities <b>48</b></button><button className="filter">My clients</button><button className="filter">Needs attention <b>9</b></button></div><div><button className="button secondary">☷ Filter</button><button className="button secondary">↕ Sort</button></div></div><section className="kanban-board">{pipelineColumns.map((column) => <article className="kanban-column" key={column.title}><header><span className={`kanban-dot ${column.color}`} /><strong>{column.title}</strong><b>{column.count}</b><button aria-label="Column actions">•••</button></header><div className="column-value"><span>EST. PREMIUM</span><strong>{column.value}</strong></div>{column.cards.map((client, index) => <button className="lead-card" key={`${column.title}-${client.name}`} onClick={() => onOpenClient(client)}><div className="lead-top"><Avatar initials={client.initials} tone={client.tone} /><div><strong>{client.name}</strong><span>{client.product} · {client.source}</span></div><b>•••</b></div><div className="lead-premium"><span>{client.premium}</span><Status tone={index === 0 ? column.color : "slate"}>{index === 0 ? (column.title === "Ready to Bind" ? "High intent" : "Active") : "Follow-up"}</Status></div><div className="lead-foot"><span>◷ {client.updated}</span><span className="owner-chip">{client.owner.slice(0,1)}</span></div></button>)}<button className="add-lead" onClick={() => showToast(`New card ready for ${column.title}`)}>＋ Add opportunity</button></article>)}</section></>;
}

function ClientsView({ onOpen }: { onOpen: (client: Client) => void }) {
  const [filter, setFilter] = useState("All stages");
  const visible = filter === "All stages" ? clients : clients.filter((client) => client.pipelineStage === filter);
  return <article className="table-card"><div className="table-toolbar"><div className="table-search">⌕ <input placeholder="Search clients..." aria-label="Search clients" /></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by pipeline stage"><option>All stages</option>{Array.from(new Set(clients.map((client) => client.pipelineStage))).map((pipelineStage) => <option key={pipelineStage} value={pipelineStage}>{pipelineStageLabel(pipelineStage)}</option>)}</select><select aria-label="Filter by owner"><option>All owners</option><option>Olivia</option><option>Noah</option></select><span className="record-count">{visible.length} clients</span></div><div className="crm-table"><div className="table-row table-head"><span>Client</span><span>Stage</span><span>Product</span><span>Premium</span><span>Assigned</span><span>Last activity</span><span /></div>{visible.map((client) => <button className="table-row" key={client.id} onClick={() => onOpen(client)}><span className="client-cell"><Avatar initials={client.initials} tone={client.tone} /><span><strong>{client.name}</strong><em>{client.phone}</em></span></span><span><Status tone={client.tone}>{pipelineStageLabel(client.pipelineStage)}</Status></span><span>{client.product}</span><strong>{client.premium}</strong><span>{client.owner}</span><span>{client.updated}</span><span className="table-arrow">→</span></button>)}</div></article>;
}

function ClientProfile({ client, onBack, setView, showToast }: { client: Client; onBack: () => void; setView: SetView; showToast: (message: string) => void }) {
  const [tab, setTab] = useState("Overview");
  return <><button className="back-button" onClick={onBack}>← Back to clients</button><section className="profile-hero"><div className="profile-identity"><Avatar initials={client.initials} tone={client.tone} /><div><div><h1>{client.name}</h1><Status tone={client.tone}>{pipelineStageLabel(client.pipelineStage)}</Status></div><p>{client.phone} · {client.email}</p></div></div><div className="profile-actions"><button className="button secondary" onClick={() => setView("conversations")}>◎ WhatsApp</button><button className="button secondary" onClick={() => showToast("Note pinned to client profile")}>＋ Add note</button><button className="button primary" onClick={() => showToast("Next action menu opened")}>Next action ⌄</button></div></section><nav className="profile-tabs">{["Overview","Activity","Quotes","Documents","Tasks","Notes"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}{item === "Documents" && <b>2</b>}</button>)}</nav>
    {tab === "Overview" && <div className="profile-grid"><section className="profile-main"><article className="profile-card"><div className="section-title"><h2>Personal information</h2><button>Edit</button></div><div className="detail-grid"><Detail label="Full name" value={client.name} /><Detail label="Date of birth" value={client.dob} /><Detail label="Phone" value={client.phone} /><Detail label="Email" value={client.email} /><Detail label="Address" value={client.address} wide /><Detail label="Lead source" value={client.source} /><Detail label="Assigned broker" value={client.owner} /></div></article><article className="profile-card"><div className="section-title"><h2>Driver & vehicle</h2><button>Edit</button></div><div className="driver-row"><div className="vehicle-symbol">◇</div><div><strong>{client.name}</strong><p>G licence · 12 years licensed · No convictions</p></div><Status tone="green">Primary driver</Status></div><div className="driver-row"><div className="vehicle-symbol">▱</div><div><strong>{client.vehicle}</strong><p>VIN {client.vin} · Personal use · 15,000 km/year</p></div><Status tone="blue">Primary vehicle</Status></div></article><article className="profile-card"><div className="section-title"><h2>Recent activity</h2><button onClick={() => setTab("Activity")}>View all</button></div><ActivityList items={activity.slice(0,4)} /></article></section><aside className="profile-aside"><article className="profile-card next-action"><span className="spark">✦</span><div><p>AI recommended action</p><h3>Prepare binding documents</h3><span>Client confirmed they want to proceed with Aviva. Void cheque is still missing.</span><button onClick={() => showToast("Binding task created and assigned to you")}>Create binding task</button></div></article><article className="profile-card"><div className="section-title"><h2>Document checklist</h2><span>2 of 5</span></div><ul className="checklist"><li className="complete"><b>✓</b><span>Driver licence<em>Verified by Olivia</em></span></li><li className="complete"><b>✓</b><span>Vehicle ownership<em>AI extracted · Review</em></span></li><li><b>○</b><span>Void cheque<em>Missing</em></span></li><li><b>○</b><span>Signed application<em>Not sent</em></span></li><li><b>○</b><span>Payment confirmation<em>Not received</em></span></li></ul><button className="request-button" onClick={() => showToast("Document request drafted in WhatsApp")}>Request missing documents</button></article><article className="profile-card summary-card"><div><span>Selected quote</span><strong>Aviva · $318/mo</strong></div><div><span>Annual premium</span><strong>$3,816</strong></div><div><span>Quote expires</span><strong>September 16</strong></div></article></aside></div>}
    {tab === "Activity" && <article className="profile-card tab-panel"><div className="section-title"><h2>Complete activity timeline</h2><button>Export</button></div><ActivityList items={activity} /></article>}
    {tab === "Quotes" && <QuotesView clientFilter={client.name} showToast={showToast} compact />}
    {tab === "Documents" && <DocumentsView clientFilter={client.name} showToast={showToast} compact />}
    {tab === "Tasks" && <TasksView clientFilter={client.name} onNewTask={() => showToast("Task form opened for this client")} showToast={showToast} compact />}
    {tab === "Notes" && <article className="profile-card tab-panel notes-panel"><div className="pinned-note"><span>★</span><div><strong>Preferred contact: WhatsApp</strong><p>Client works until 4 PM. Send messages rather than calling during business hours.</p><em>Olivia · Today, 9:58 AM</em></div></div><textarea aria-label="Internal note" placeholder="Add an internal note (not visible to client)..." /><button className="button primary" onClick={() => showToast("Internal note saved")}>Save note</button></article>}
  </>;
}

function Detail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) { return <div className={wide ? "wide" : ""}><span>{label}</span><strong>{value}</strong></div>; }
function ActivityList({ items }: { items: typeof activity }) { return <div className="activity-list">{items.map((item, index) => <div className="activity-item" key={`${item.time}-${item.title}`}><span className={`activity-icon ${item.type}`}>{item.type === "ai" ? "✦" : item.type === "quote" ? "$" : item.type === "document" ? "□" : item.type === "message" ? "◎" : "+"}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div><time>{item.time}</time>{index < items.length - 1 && <i />}</div>)}</div>; }

function TasksView({ onNewTask, showToast, clientFilter, compact = false }: { onNewTask: () => void; showToast: (message: string) => void; clientFilter?: string; compact?: boolean }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [tab, setTab] = useState("Today");
  const visible = tasks.filter((task) => (!clientFilter || task.client === clientFilter) && (tab === "All" || (tab === "Completed" ? task.status === "Completed" : task.date === tab)));
  function toggle(id: number) { setTasks((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "Completed" ? "To do" : "Completed" } : item)); showToast("Task status updated"); }
  return <article className={`table-card ${compact ? "compact-view" : ""}`}><div className="task-tabs"><div>{["Today","Upcoming","Overdue","Completed","All"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}{item === "Today" && <b>5</b>}{item === "Overdue" && <b className="danger">1</b>}</button>)}</div><button className="button primary" onClick={onNewTask}>＋ New task</button></div><div className="task-list"><div className="task-row task-head"><span /><span>Task</span><span>Due</span><span>Priority</span><span>Status</span><span>Assigned</span><span /></div>{visible.length ? visible.map((task) => <div className={`task-row ${task.status === "Completed" ? "task-done" : ""}`} key={task.id}><button className="check" onClick={() => toggle(task.id)}>✓</button><span className="task-client"><Avatar initials={task.initials} small /><span><strong>{task.task}</strong><em>{task.client}</em></span></span><span className={task.date === "Overdue" ? "overdue-text" : ""}>{task.date}<em>{task.due}</em></span><span><Status tone={task.priority === "High" ? "red" : task.priority === "Medium" ? "amber" : "slate"}>{task.priority}</Status></span><span><Status tone={task.status === "In progress" ? "blue" : task.status === "Completed" ? "green" : "slate"}>{task.status}</Status></span><span>{task.owner}</span><button className="more">•••</button></div>) : <div className="empty-state"><span>✓</span><strong>No tasks here</strong><p>You’re all caught up in this view.</p></div>}</div></article>;
}

function QuotesView({ showToast, clientFilter, compact = false }: { showToast: (message: string) => void; clientFilter?: string; compact?: boolean }) {
  const visible = quotes.filter((quote) => !clientFilter || quote.client === clientFilter);
  return <article className={`table-card ${compact ? "compact-view" : ""}`}><div className="table-toolbar"><div className="table-search">⌕ <input placeholder="Search quotes..." aria-label="Search quotes" /></div><select><option>All companies</option><option>Aviva</option><option>Intact</option><option>Echelon</option></select><select><option>All statuses</option><option>Provided</option><option>Selected</option></select><button className="button primary" onClick={() => showToast("New quote comparison opened")}>＋ New quote</button></div><div className="quote-table"><div className="quote-row table-head"><span>Quote</span><span>Client / company</span><span>Premium</span><span>Coverage</span><span>Status</span><span>Expiry</span><span /></div>{visible.map((quote) => <div className="quote-row" key={quote.id}><span><strong>{quote.id}</strong></span><span><strong>{quote.client}</strong><em>{quote.company}</em></span><span><strong>{quote.monthly}/mo</strong><em>{quote.annual}/year</em></span><span>{quote.coverage}<em>{quote.deductible} deductible</em></span><span><Status tone={quote.status === "Selected" ? "green" : quote.status === "Expiring" ? "red" : "blue"}>{quote.status}</Status></span><span>{quote.expires}</span><button className="table-action" onClick={() => showToast(`${quote.id} opened for review`)}>Review →</button></div>)}</div></article>;
}

function DocumentsView({ showToast, clientFilter, compact = false }: { showToast: (message: string) => void; clientFilter?: string; compact?: boolean }) {
  const visible = documents.filter((document) => !clientFilter || document.client === clientFilter);
  return <><section className="document-stats"><article><span className="doc-stat-icon green">✓</span><div><strong>34</strong><p>Verified this month</p></div></article><article><span className="doc-stat-icon amber">!</span><div><strong>6</strong><p>Need staff review</p></div></article><article><span className="doc-stat-icon blue">✦</span><div><strong>91%</strong><p>Extraction accuracy</p></div></article></section><article className={`table-card ${compact ? "compact-view" : ""}`}><div className="table-toolbar"><div className="table-search">⌕ <input placeholder="Search documents..." aria-label="Search documents" /></div><select><option>All document types</option><option>Driver licence</option><option>Vehicle ownership</option></select><select><option>All verification</option><option>Needs review</option><option>Verified</option></select><button className="button primary" onClick={() => showToast("Secure upload window opened")}>↑ Upload file</button></div><div className="document-table"><div className="document-row table-head"><span>File</span><span>Client</span><span>Type</span><span>Received</span><span>AI processing</span><span>Verification</span><span /></div>{visible.map((document) => <div className="document-row" key={document.id}><span className="file-cell"><i>{document.name.endsWith("pdf") ? "PDF" : "JPG"}</i><span><strong>{document.name}</strong><em>{document.size}</em></span></span><span>{document.client}</span><span>{document.type}</span><span>{document.received}<em>{document.source}</em></span><span><Status tone="blue">✦ {document.processing}</Status></span><span><Status tone={document.verification === "Verified" ? "green" : "amber"}>{document.verification}</Status></span><button className="table-action" onClick={() => showToast("Secure document review opened")}>Review →</button></div>)}</div><div className="privacy-foot"><span>▣</span><p><strong>Private document storage</strong>Files are protected and accessed through time-limited secure links. They are never publicly exposed.</p></div></article></>;
}

function AnalyticsView() {
  const conversion = [{ month: "Jan", value: 22 }, { month: "Feb", value: 28 }, { month: "Mar", value: 27 }, { month: "Apr", value: 31 }, { month: "May", value: 30 }, { month: "Jun", value: 34 }, { month: "Jul", value: 33 }, { month: "Aug", value: 37 }];
  const carriers = [["Aviva", "34", "18", "52.9%", "$342"], ["Intact", "22", "11", "50.0%", "$318"], ["Pembridge", "17", "7", "41.2%", "$405"], ["Echelon", "12", "5", "41.7%", "$476"]];
  const ages: Array<[string, number]> = [["Under 21", 18], ["21–25", 28], ["26–30", 43], ["31–40", 68], ["41–50", 54], ["51–60", 41], ["60+", 30]];
  return <>
    <section className="analytics-metrics"><article><p>New leads</p><strong>142</strong><span className="positive">↑ 12.7%</span><em>vs. last month</em></article><article><p>Quotes completed</p><strong>89</strong><span className="positive">↑ 8.2%</span><em>62.7% of leads</em></article><article><p>Policies bound</p><strong>46</strong><span className="positive">↑ 18.4%</span><em>32.4% conversion</em></article><article><p>Written premium</p><strong>$186k</strong><span className="positive">↑ 14.1%</span><em>Annualized</em></article></section>
    <section className="analytics-grid">
      <article className="card analytics-chart large"><div className="card-heading"><div><h2>Lead to policy conversion</h2><p>January–August 2026</p></div><button className="period">Monthly ⌄</button></div><div className="conversion-chart"><div className="chart-scale"><span>40%</span><span>30%</span><span>20%</span><span>10%</span><span>0</span></div><div className="conversion-bars">{conversion.map((point) => <div key={point.month}><i><b style={{ height: `${point.value * 2.25}%` }}><em>{point.value}%</em></b></i><span>{point.month}</span></div>)}</div></div><div className="chart-summary"><div><span>Average conversion</span><strong>31.8%</strong></div><div><span>Best month</span><strong>August · 36.5%</strong></div><div><span>Avg. time to bind</span><strong>4.2 days</strong></div></div></article>
      <article className="card source-chart"><div className="card-heading"><div><h2>Lead sources</h2><p>Conversion by channel</p></div><button>View report →</button></div><div className="donut-wrap"><div className="donut"><span><strong>142</strong><em>Total leads</em></span></div></div><div className="source-legend"><div><i className="s1" /><span>WhatsApp direct</span><strong>42%</strong></div><div><i className="s2" /><span>Facebook</span><strong>24%</strong></div><div><i className="s3" /><span>Referral</span><strong>18%</strong></div><div><i className="s4" /><span>Website & other</span><strong>16%</strong></div></div></article>
      <article className="card carrier-table"><div className="card-heading"><div><h2>Carrier performance</h2><p>Quotes and policies bound this month</p></div><button>View all →</button></div>{carriers.map((row, index) => <div className="carrier-row" key={row[0]}><span className={`carrier-logo c${index}`}>{row[0].slice(0, 1)}</span><strong>{row[0]}</strong><span>{row[1]} quotes</span><span>{row[2]} bound</span><span><b>{row[3]}</b> conversion</span><span>{row[4]} avg.</span></div>)}</article>
      <article className="card age-chart"><div className="card-heading"><div><h2>Conversion by age</h2><p>Policies bound by age group</p></div></div><div className="horizontal-bars">{ages.map(([label, value]) => <div key={label}><span>{label}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div>)}</div></article>
    </section>
  </>;
}

function TeamView() {
  const team = [{name:"Olivia Adams",role:"Senior Broker",initials:"OA",tasks:12,clients:38,status:"Online",tone:"green"},{name:"Noah Carter",role:"Broker",initials:"NC",tasks:8,clients:27,status:"Online",tone:"blue"},{name:"Emma Chen",role:"Assistant",initials:"EC",tasks:15,clients:19,status:"In a call",tone:"purple"},{name:"Liam Wilson",role:"Administrator",initials:"LW",tasks:3,clients:0,status:"Away",tone:"amber"}];
  return <><section className="team-summary"><article><span>4</span><p>Active team members</p></article><article><span>38</span><p>Open tasks</p></article><article><span>84</span><p>Assigned clients</p></article><article><span>92%</span><p>On-time follow-ups</p></article></section><section className="team-grid">{team.map((member) => <article className="team-card" key={member.name}><div><Avatar initials={member.initials} tone={member.tone} /><Status tone={member.status === "Online" ? "green" : member.status === "Away" ? "amber" : "purple"}>{member.status}</Status></div><h2>{member.name}</h2><p>{member.role}</p><div className="team-numbers"><span><strong>{member.tasks}</strong>Open tasks</span><span><strong>{member.clients}</strong>Clients</span></div><button className="button secondary">View workload</button></article>)}</section></>;
}

function SettingsView({ showToast }: { showToast: (message: string) => void }) {
  const [active, setActive] = useState(0);
  const group = settingsGroups[active];
  return <section className="settings-shell"><aside className="settings-nav"><p>CRM configuration</p>{settingsGroups.map((item,index) => <button className={active === index ? "active" : ""} key={item.title} onClick={() => setActive(index)}><span>{["◇","▱","↗","□"][index]}</span><div><strong>{item.title}</strong><em>{item.subtitle}</em></div><b>›</b></button>)}<p>Automation & access</p><button><span>✦</span><div><strong>AI & workflows</strong><em>Rules and confidence</em></div><b>›</b></button><button><span>♧</span><div><strong>Roles & permissions</strong><em>4 roles</em></div><b>›</b></button></aside><article className="settings-card"><div className="settings-head"><div><h2>{group.title}</h2><p>These options are used throughout Avexa CRM and can be changed at any time.</p></div><button className="button primary" onClick={() => showToast(`New ${group.title.toLowerCase()} item ready`)}>＋ Add new</button></div><div className="config-list">{group.items.map((item,index) => <div key={item}><span className="drag-handle">⠿</span><span className={`config-color color-${index}`} /><strong>{item}</strong><em>{index === 0 ? "Default" : "Active"}</em><button onClick={() => showToast(`${item} settings opened`)}>Edit</button><button>•••</button></div>)}</div><div className="settings-note"><span>i</span><p>Changes update CRM options immediately. Historical records retain their original values for audit purposes.</p></div></article></section>;
}

function NotificationPanel({ onClose, setView }: { onClose: () => void; setView: SetView }) {
  return <div className="notification-panel"><header><div><h2>Notifications</h2><p>4 require attention</p></div><button onClick={onClose}>×</button></header>{[["Ready to bind","Jordan Lee confirmed the Aviva quote","2 min","green","pipeline"],["Document needs review","Ownership received from Ravi Kumar","8 min","blue","documents"],["Follow-up overdue","Ethan Brown · Licence request","1 hr","red","tasks"],["AI uncertain","New message from unknown contact","2 hr","amber","conversations"]].map((item) => <button className="notification-item" key={item[0]} onClick={() => { setView(item[4] as NavKey); onClose(); }}><span className={`notification-icon ${item[3]}`}>{item[3] === "green" ? "✓" : item[3] === "red" ? "!" : "✦"}</span><div><strong>{item[0]}</strong><p>{item[1]}</p><time>{item[2]}</time></div></button>)}<button className="notification-footer" onClick={() => { setView("tasks"); onClose(); }}>View all notifications →</button></div>;
}

function QuickModal({ type, onClose, onSave }: { type: "client" | "task"; onClose: () => void; onSave: (message: string) => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={type === "client" ? "Add a client" : "Create a task"}><button type="button" className="modal-backdrop-dismiss" onClick={onClose} aria-label="Close dialog" /><form className="quick-modal" onSubmit={(event) => { event.preventDefault(); onSave(type === "client" ? "New client added to pipeline" : "Task created and assigned"); }}><header><div><p>{type === "client" ? "NEW LEAD" : "NEW TASK"}</p><h2>{type === "client" ? "Add a client" : "Create a task"}</h2></div><button type="button" onClick={onClose}>×</button></header>{type === "client" ? <div className="modal-fields"><label><span>Full name</span><input required placeholder="e.g. Alex Morgan" /></label><div><label><span>Phone</span><input required placeholder="+1 416 555 0123" /></label><label><span>Email</span><input type="email" placeholder="alex@email.com" /></label></div><div><label><span>Lead source</span><select><option>WhatsApp direct</option><option>Facebook</option><option>Referral</option><option>Website</option></select></label><label><span>Assigned to</span><select><option>Olivia Adams</option><option>Noah Carter</option><option>Unassigned</option></select></label></div><label><span>Notes</span><textarea placeholder="Add any helpful context..." /></label></div> : <div className="modal-fields"><label><span>Task</span><input required placeholder="What needs to be done?" /></label><label><span>Client</span><select><option>Select a client</option>{clients.map((client) => <option key={client.id}>{client.name}</option>)}</select></label><div><label><span>Due date</span><input type="date" required defaultValue="2026-08-18" /></label><label><span>Time</span><input type="time" defaultValue="10:00" /></label></div><div><label><span>Priority</span><select><option>Medium</option><option>High</option><option>Low</option></select></label><label><span>Assigned to</span><select><option>Olivia Adams</option><option>Noah Carter</option></select></label></div></div>}<footer><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary">{type === "client" ? "Add client" : "Create task"}</button></footer></form></div>;
}

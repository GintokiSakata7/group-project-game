import { useMemo, useState } from 'react';
import { ArrowDownUp, CalendarDays, CheckCircle2, CircleDashed, CircleDot, UserRound, Zap } from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill, ProgressBar } from './shared';
import type { TaskStatus } from '../game/types';
import ActiveMissionHUD from '../components/ActiveMissionHUD';

const columns: { id: TaskStatus; title: string; tone: string }[] = [
  { id: 'backlog', title: 'Backlog', tone: 'gray' }, { id: 'assigned', title: 'Assigned', tone: 'blue' }, { id: 'in_progress', title: 'In progress', tone: 'orange' }, { id: 'review', title: 'Review', tone: 'purple' }, { id: 'done', title: 'Done', tone: 'green' },
];

export default function SprintBoard() {
  const { tasks, employees, assignTask, approveTask, actionsLeft, day } = useGameStore();
  const [filter, setFilter] = useState('all');
  const grouped = useMemo(() => columns.map((column) => ({ ...column, tasks: tasks.filter((task) => task.status === column.id && (filter === 'all' || task.category === filter)) })), [tasks, filter]);
  const statusIcon = (status: TaskStatus) => status === 'done' ? <CheckCircle2 size={13} /> : status === 'in_progress' ? <CircleDot size={13} /> : <CircleDashed size={13} />;

  return <div className="app-scroll sprint-app">
    <AppHeading kicker={`WORK MANAGEMENT · DAY ${day}`} title="Task Board" subtitle="Assignments, verified progress and code approvals." right={<Pill tone={actionsLeft > 0 ? 'good' : 'warning'}><Zap size={12} /> {actionsLeft} actions</Pill>} />
    <ActiveMissionHUD app="sprint" />
    <div className="sprint-toolbar"><div className="sprint-filter"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>{['frontend', 'backend', 'content', 'testing', 'deployment'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="sprint-meta"><span><CalendarDays size={13} /> Due Day 7</span><span><ArrowDownUp size={13} /> {tasks.length} tasks</span></div></div>
    <div className="kanban-board">{grouped.map((column) => <section className="kanban-column" key={column.id}><header><span className={`kanban-col-dot ${column.tone}`} /><strong>{column.title}</strong><span className="kanban-count">{column.tasks.length}</span></header><div className="kanban-cards">{column.tasks.map((task) => <article className="kanban-card" key={task.id}><div className="kanban-card-top"><Pill tone={task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : 'neutral'}>{task.priority}</Pill></div><h4>{task.title}</h4><p>{task.description}</p><div className="task-card-meta"><span>{statusIcon(task.status)} {task.category}</span><span>Due D{task.dueDay}</span></div><div className="task-progress-label"><span>Verified</span><b>{Math.round(task.verifiedProgress)}%</b></div><ProgressBar value={task.verifiedProgress} tone={task.reportedProgress - task.verifiedProgress > 20 ? 'warning' : 'default'} />{task.reportedProgress - task.verifiedProgress > 20 && <div className="claim-warning">Claimed {Math.round(task.reportedProgress)}% · verified {Math.round(task.verifiedProgress)}%</div>}<label className="assign-select"><UserRound size={13} /><select value={task.assignedTo ?? ''} onChange={(event) => assignTask(task.id, event.target.value || null)} disabled={actionsLeft <= 0 && task.assignedTo !== null}><option value="">Unassigned</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} ({employee.role})</option>)}</select></label>{task.status === 'review' && <button className="approve-task-button" onClick={() => approveTask(task.id)} disabled={actionsLeft <= 0 || task.progress < 85 || task.quality < 42}>APPROVE · 1 ACTION</button>}</article>)}</div></section>)}</div>
  </div>;
}

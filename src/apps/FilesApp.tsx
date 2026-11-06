import { useState } from 'react';
import { FileArchive, FileCheck2, FileImage, FileText, Folder, FolderOpen, LockKeyhole, Search } from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, Pill } from './shared';

const documents = [
  { id: 'sow', name: 'RF-001_statement-of-work.pdf', kind: 'PDF', size: '184 KB', date: 'Day 1', icon: FileCheck2, note: 'Signed Phase 1 scope, payment terms and exclusions.' },
  { id: 'requirements', name: 'client_requirements_v1.docx', kind: 'DOCX', size: '42 KB', date: 'Day 1', icon: FileText, note: 'The original wishlist. Includes “like Swiggy, but simple”.' },
  { id: 'brand', name: 'royal-feast-brand-assets.zip', kind: 'ZIP', size: '3.2 MB', date: 'Day 1', icon: FileArchive, note: 'Client-provided logo, menu imagery and brand assets.' },
  { id: 'wireframe', name: 'homepage_wireframe.fig', kind: 'FIG', size: '1.1 MB', date: 'Day 2', icon: FileImage, note: 'Early layout direction for the website.' },
  { id: 'qa', name: 'release-blockers_day5.xlsx', kind: 'XLSX', size: '96 KB', date: 'Day 5', icon: FileText, note: 'Meera’s carefully colour-coded defect register.' },
  { id: 'handover', name: 'client_handover_notes.docx', kind: 'DOCX', size: 'Draft', date: 'Day 7', icon: FileText, note: 'Final delivery notes. Currently a blank document.' },
];

export default function FilesApp() {
  const { day } = useGameStore();
  const [selected, setSelected] = useState('sow');
  const [search, setSearch] = useState('');
  const active = documents.find((item) => item.id === selected) ?? documents[0];
  const visible = documents.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && (item.date === 'Day 7' ? day >= 7 : true));
  const Icon = active.icon;
  return <div className="app-scroll files-app">
    <AppHeading kicker="FILE SYSTEM / COMPANY DRIVE" title="Project files" subtitle="The place where important documents go to become final_final_v2." right={<Pill tone="neutral"><LockKeyhole size={12} /> Private workspace</Pill>} />
    <div className="file-manager-toolbar"><div className="file-breadcrumb"><FolderOpen size={15} /> Company Drive <span>/</span> Royal Feast</div><label className="repo-search"><Search size={13} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search files" /></label></div>
    <div className="file-manager-layout"><aside className="folder-tree"><div><Folder size={15} /> Company Drive</div><div className="folder-tree-child active"><FolderOpen size={15} /> Royal Feast</div><div className="folder-tree-child"><Folder size={15} /> Brand assets</div><div className="folder-tree-child"><Folder size={15} /> Archive</div></aside><section className="file-list">{visible.map((file) => { const FileIcon = file.icon; return <button key={file.id} className={`file-row ${selected === file.id ? 'active' : ''}`} onClick={() => setSelected(file.id)}><FileIcon size={18} /><span><strong>{file.name}</strong><small>{file.kind} · {file.size}</small></span><small>{file.date}</small></button>; })}</section></div>
    <div className="file-preview"><div className="preview-icon"><Icon size={26} /></div><div><span className="app-kicker">SELECTED DOCUMENT</span><strong>{active.name}</strong><p>{active.note}</p></div><Pill tone={active.date === 'Day 7' && day < 7 ? 'warning' : 'good'}>{active.date === 'Day 7' && day < 7 ? 'DRAFT NOT READY' : 'AVAILABLE'}</Pill></div>
    <div className="file-footnote">Files are narrative props in this simulated company drive. They are not stored as external documents.</div>
  </div>;
}

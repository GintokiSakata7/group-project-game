import { ArrowDownLeft, ArrowUpRight, BadgeIndianRupee, Banknote, CircleDollarSign, ReceiptText, TrendingUp, Wallet } from 'lucide-react';
import { useGameStore } from '../game/store';
import { AppHeading, MetricCard, Pill } from './shared';

export default function FinanceApp() {
  const { metrics, day, contractValue } = useGameStore();
  const advance = Math.round(contractValue * 0.5);
  const remaining = contractValue - advance;
  const currency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
  const expenses = Math.max(0, advance - metrics.cash);
  return <div className="app-scroll finance-app">
    <AppHeading kicker={`FINANCE / PANIC LABS · DAY ${day}`} title="Money, technically" subtitle="A founder’s favourite spreadsheet: the one that says the company is not yet bankrupt." right={<Pill tone="good"><Wallet size={12} /> Local ledger</Pill>} />
    <div className="finance-hero"><div><span>AVAILABLE COMPANY CASH</span><strong>₹{Math.round(metrics.cash).toLocaleString('en-IN')}</strong><small>Includes client advance and simulated change requests.</small></div><div className="finance-hero-icon"><BadgeIndianRupee size={34} /></div></div>
    <div className="metric-grid finance-grid"><MetricCard label="CONTRACT VALUE" value={currency(contractValue)} note="Royal Feast Phase 1" tone="lime" /><MetricCard label="ADVANCE RECEIVED" value={currency(advance)} note="50% on contract signing" tone="blue" /><MetricCard label="BALANCE ON ACCEPTANCE" value={currency(remaining)} note="Paid after delivery approval" tone="orange" /><MetricCard label="SIMULATED EXPENSES" value={`₹${expenses.toLocaleString('en-IN')}`} note="Team and tooling overhead" tone="pink" /></div>
    <section className="panel-block ledger-block"><div className="panel-title-row"><div><span className="app-kicker">TRANSACTION LEDGER</span><h3>Company account</h3></div><span className="ledger-tag">INR · ₹</span></div><div className="ledger-row"><span className="ledger-icon income"><ArrowDownLeft size={15} /></span><div><strong>Royal Feast · 50% advance</strong><small>Contract RF-001 · Day 1</small></div><b className="income-text">{`+${currency(advance)}`}</b></div><div className="ledger-row"><span className="ledger-icon expense"><ArrowUpRight size={15} /></span><div><strong>Development environment & snacks</strong><small>Simulated operating expense</small></div><b>−₹0</b></div>{metrics.scopeCreep > 0 && <div className="ledger-row"><span className="ledger-icon income"><ArrowDownLeft size={15} /></span><div><strong>Client change request</strong><small>Additional scope conversation</small></div><b className="income-text">+₹500</b></div>}</section>
    <div className="finance-note"><ReceiptText size={16} /><div><strong>Founder note</strong><p>The remaining 50% is not revenue until the client accepts the delivery. Do not spend money you have not collected. Bunty's payment gateway proposal is not a financial plan.</p></div></div>
  </div>;
}

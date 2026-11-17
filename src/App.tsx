import { useEffect } from 'react';
import TitleScreen from './components/TitleScreen';
import Prologue from './components/Prologue';
import ClientMeeting from './components/ClientMeeting';
import ContractSigned from './components/ContractSigned';
import OfficeHub from './components/OfficeHub';
import Desktop from './components/Desktop';
import ClientDemoCall from './components/ClientDemoCall';
import GameOver from './components/GameOver';
import DeliveryResults from './components/DeliveryResults';
import { useGameStore } from './game/store';

export default function App() {
  const phase = useGameStore((state) => state.phase);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const debugPhase = params.get('phase');
    if (debugPhase) {
      useGameStore.setState({ phase: debugPhase as any });
    }
    const debugApp = params.get('app');
    if (debugApp) {
      useGameStore.setState({ activeAppOnDesktop: debugApp as any });
    }
    const debugDay = params.get('day');
    if (debugDay) {
      useGameStore.setState({ day: parseInt(debugDay, 10) });
    }
    const debugEnding = params.get('ending');
    if (debugEnding === 'deadline') {
      useGameStore.setState({
        phase: 'ending',
        ending: {
          kind: 'deadline',
          title: 'DEADLINE: 0 · PANIC: 100',
          subtitle: 'The delivery never materialised',
          rating: 'DEADLINE MISSED',
          body: 'Only 2 of 4 scoped deliverables reached a usable state. 3 were required for acceptance. The client opened the link, saw a loading spinner and asked whether that was the final logo.',
          score: 64,
          breakdown: [
            { label: 'Deliverable coverage', score: 20, detail: '2 of 4 core deliverables reached 75%.' },
            { label: 'Product quality', score: 18, detail: 'Average verified quality: 71%.' },
            { label: 'Client trust', score: 15, detail: 'Client confidence: 100%.' },
            { label: 'Release stability', score: 7, detail: '1 critical defect remains open.' },
            { label: 'Team health', score: 4, detail: 'Team morale: 89%.' },
          ],
        },
      });
    } else if (debugEnding === 'success') {
      useGameStore.setState({
        phase: 'ending',
        ending: {
          kind: 'success',
          title: 'SOMEHOW, YOU COOKED',
          subtitle: 'LEGENDARY DELIVERY',
          rating: 'LEGENDARY DELIVERY',
          body: 'Royal Feast has accepted the Phase 1 delivery. The team survived seven days, several questionable commits and at least one motivational playlist. Mr. Prakash has confirmed the handover. Your first client is officially in the books.',
          score: 92,
          breakdown: [
            { label: 'Deliverable coverage', score: 40, detail: '4 of 4 core deliverables reached 75%.' },
            { label: 'Product quality', score: 24, detail: 'Average verified quality: 92%.' },
            { label: 'Client trust', score: 15, detail: 'Client confidence: 95%.' },
            { label: 'Release stability', score: 15, detail: 'No critical defects remain open.' },
            { label: 'Team health', score: 5, detail: 'Team morale: 94%.' },
          ],
        },
      });
    }
  }, []);

  if (phase === 'prologue') return <Prologue />;
  if (phase === 'client_meeting' || phase === 'negotiation') return <ClientMeeting />;
  if (phase === 'contract_signed') return <ContractSigned />;
  if (phase === 'kickoff_meeting') {
    useGameStore.getState().completeKickoff();
    return <OfficeHub />;
  }
  if (phase === 'office') return <OfficeHub />;
  if (phase === 'desktop') return <Desktop />;
  if (phase === 'live_demo') return <ClientDemoCall />;
  if (phase === 'game_over') return <GameOver />;
  if (phase === 'ending') return <DeliveryResults />;

  return <TitleScreen />;
}

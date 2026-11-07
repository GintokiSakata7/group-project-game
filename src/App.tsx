import TitleScreen from './components/TitleScreen';
import Prologue from './components/Prologue';
import ClientMeeting from './components/ClientMeeting';
import ContractSigned from './components/ContractSigned';
import TeamKickoff from './components/TeamKickoff';
import OfficeHub from './components/OfficeHub';
import Desktop from './components/Desktop';
import ClientDemoCall from './components/ClientDemoCall';
import GameOver from './components/GameOver';
import DeliveryResults from './components/DeliveryResults';
import { useGameStore } from './game/store';

export default function App() {
  const phase = useGameStore((state) => state.phase);

  if (phase === 'prologue') return <Prologue />;
  if (phase === 'client_meeting' || phase === 'negotiation') return <ClientMeeting />;
  if (phase === 'contract_signed') return <ContractSigned />;
  if (phase === 'kickoff_meeting') return <TeamKickoff />;
  if (phase === 'office') return <OfficeHub />;
  if (phase === 'desktop') return <Desktop />;
  if (phase === 'live_demo') return <ClientDemoCall />;
  if (phase === 'game_over') return <GameOver />;
  if (phase === 'ending') return <DeliveryResults />;

  return <TitleScreen />;
}

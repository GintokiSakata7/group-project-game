import TitleScreen from './components/TitleScreen';
import Negotiation from './components/Negotiation';
import Desktop from './components/Desktop';
import EndingScreen from './components/EndingScreen';
import { useGameStore } from './game/store';

export default function App() {
  const phase = useGameStore((state) => state.phase);
  if (phase === 'negotiation') return <Negotiation />;
  if (phase === 'desktop') return <Desktop />;
  if (phase === 'ending') return <EndingScreen />;
  return <TitleScreen />;
}

import { motion } from 'motion/react';
import { RotateCcw, Skull, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../game/store';
import { CharacterSprite } from './CharacterSprite';

export default function GameOver() {
  const gameOver = useGameStore((state) => state.gameOver);
  const resetGame = useGameStore((state) => state.resetGame);
  const title = gameOver?.title ?? 'GAME OVER';
  const subtitle = gameOver?.subtitle ?? 'PANIC LABS HAS COLLAPSED';
  const body = gameOver?.body ?? 'Your first opportunity disappeared faster than Nikhil during a stand-up call.';
  return (
    <main className="game-over-screen new-game-over-screen">
      <motion.div className="new-game-over-card" initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <div className="game-over-icon-box"><Skull size={42} /></div>
        <span className="new-game-over-kicker">CAMPAIGN FAILED · THE INTERNET WILL REMEMBER</span>
        <h1>{title}</h1><h2>{subtitle}</h2>
        <div className="new-game-over-cast"><CharacterSprite character="prakash" size="lg" expression="smug" /><CharacterSprite character="bunty" size="lg" expression="happy" /><CharacterSprite character="founder" size="lg" expression="exhausted" /></div>
        <p>{body}</p>
        <div className="new-game-over-quote">“No hard feelings. Bunty found a guy who will do it for ₹150 and a plate of samosas.”</div>
        <button className="new-game-over-retry" onClick={resetGame}><RotateCcw size={18} /> RESTART THE STORY</button>
        <button className="new-game-over-home" onClick={resetGame}><ArrowLeft size={16} /> BACK TO TITLE</button>
      </motion.div>
    </main>
  );
}

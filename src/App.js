import React, { useEffect, memo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { create } from 'zustand';

// --- KEYFRAMES ---
const armPunch = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(-30deg) translateX(-10px); }
  50% { transform: rotate(90deg) scaleX(1.8) translateX(20px); filter: brightness(1.5); }
  100% { transform: rotate(0); }
`;

const legKick = keyframes`
  0% { transform: rotate(0); }
  30% { transform: rotate(-60deg) translateY(-20px); }
  60% { transform: rotate(110deg) scaleY(1.4) translateX(30px); }
  100% { transform: rotate(0); }
`;

const bodyHurt = keyframes`
  0% { transform: translateX(0); filter: contrast(4) invert(0.2); }
  20% { transform: translateX(40px) rotate(5deg); }
  100% { transform: translateX(0); filter: contrast(1); }
`;

const breathe = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.03) translateY(-2px); }
`;

// --- STORE ---
const useGameStore = create((set, get) => ({
  player: { hp: 100, ap: 4, anim: 'idle', lastId: 0 },
  opponent: { hp: 100, anim: 'idle', lastId: 0 },
  game: { shake: false },

  tick: () => {
    const { player, opponent } = get();
    if (opponent.hp <= 0 || player.hp <= 0) return;
    set((s) => ({ player: { ...s.player, ap: Math.min(5, s.player.ap + 0.15) } }));
  },

  performMove: (type, dmg, cost, hitDelay) => {
    const { player, opponent } = get();
    if (player.anim !== 'idle' || player.ap < cost || opponent.hp <= 0) return;

    set(s => ({ player: { ...s.player, anim: type, ap: s.player.ap - cost, lastId: Date.now() } }));

    setTimeout(() => {
      if (get().opponent.hp <= 0) return;
      set(s => ({ 
        opponent: { ...s.opponent, hp: Math.max(0, s.opponent.hp - dmg), anim: 'hurt', lastId: Date.now() },
        game: { shake: true }
      }));
      setTimeout(() => set(s => ({ game: { shake: false } })), 100);
      setTimeout(() => {
        set(s => ({ player: { ...s.player, anim: 'idle' }, opponent: { ...s.opponent, anim: 'idle' } }));
        if (get().opponent.hp > 0) get().aiCounter();
      }, 400);
    }, hitDelay);
  },

  aiCounter: () => {
    setTimeout(() => {
      if (get().opponent.hp <= 0) return;
      set(s => ({ opponent: { ...s.opponent, anim: 'kick', lastId: Date.now() } }));
      setTimeout(() => {
        if (get().opponent.hp <= 0) return;
        set(s => ({ 
          player: { ...s.player, hp: Math.max(0, s.player.hp - 15), anim: 'hurt', lastId: Date.now() },
          game: { shake: true }
        }));
        setTimeout(() => set(s => ({ game: { shake: false } })), 150);
        setTimeout(() => set(s => ({ player: { ...s.player, anim: 'idle' }, opponent: { ...s.opponent, anim: 'idle' } })), 400);
      }, 450);
    }, 800);
  }
}));

// --- STYLED COMPONENTS ---
const Stage = styled.div`
  width: 100vw; height: 100vh; background: #0a0a0a;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: 'Inter', sans-serif; overflow: hidden;
`;

const Arena = styled.div`
  width: 100%; max-width: 1000px; height: 450px;
  background: radial-gradient(circle at 50% 90%, #1a1a2e 0%, #0a0a0a 80%);
  border-bottom: 20px solid #222; position: relative;
  display: flex; justify-content: space-around; align-items: flex-end; padding-bottom: 60px;
  ${p => p.$shake && css`transform: translate(10px, -10px);`}
`;

const SpriteContainer = styled.div`
  position: relative; width: 150px; height: 300px;
  display: flex; flex-direction: column; align-items: center;
  animation: ${p => p.$anim === 'idle' ? css`${breathe} 3s infinite` : 'none'};
  ${p => p.$side === 'right' && css`transform: scaleX(-1);`}
  ${p => p.$anim === 'hurt' && css`animation: ${bodyHurt} 0.4s forwards;`}
`;

const Limb = styled.div`
  position: absolute; width: 20px; height: 70px; background: #f3c1ad;
  border: 4px solid #000; border-radius: 12px;
  transform-origin: top center;

  /* Conditional Logic using the 'css' helper to avoid interpolation errors */
  ${p => p.$type === 'arm' && p.$anim === 'punch' && css`
    animation: ${armPunch} 0.5s ${p.$delay || '0s'} forwards;
  `}
  
  ${p => p.$type === 'leg' && p.$anim === 'kick' && css`
    animation: ${legKick} 0.6s forwards;
  `}
`;

const Fighter = memo(({ data, side, isPlayer }) => (
  <SpriteContainer $anim={data.anim} $side={side} key={data.lastId}>
    <div style={{ width: 52, height: 60, background: '#f3c1ad', border: '4px solid #000', borderRadius: '45%', zIndex: 5 }}>
      <div style={{ width: '110%', height: 10, background: isPlayer ? '#c0392b' : '#333', marginTop: 20, marginLeft: '-5%', border: '2px solid #000' }} />
    </div>
    
    <div style={{ width: 85, height: 110, background: isPlayer ? '#fff' : '#1a1a1a', border: '4px solid #000', borderRadius: 12, marginTop: -10, position: 'relative' }}>
      
      {/* Arms - Passing props with $ prefix to avoid DOM warnings */}
      <Limb $type="arm" $anim={data.anim} style={{ left: -18, top: 10 }} />
      <Limb $type="arm" $anim={data.anim} $delay="0.1s" style={{ right: -18, top: 10 }} />

      {/* Legs */}
      <Limb $type="leg" $anim={data.anim} style={{ left: 15, top: 95, height: 90, background: isPlayer ? '#fff' : '#1a1a1a' }} />
      <Limb style={{ right: 15, top: 95, height: 90, background: isPlayer ? '#fff' : '#1a1a1a' }} />
    </div>
  </SpriteContainer>
));

const Bar = styled.div`
  width: 44%; height: 30px; background: #222; border: 3px solid #000; overflow: hidden;
  div { height: 100%; width: ${p => p.$pct}%; background: ${p => p.$side === 'left' ? '#2ecc71' : '#e74c3c'}; transition: width 0.3s; }
`;

export default function App() {
  const s = useGameStore();

  useEffect(() => {
    const timer = setInterval(() => s.tick(), 100);
    return () => clearInterval(timer);
  }, [s]);

  return (
    <Stage>
      <div style={{ width: '100%', maxWidth: 900, padding: 20, display: 'flex', justifyContent: 'space-between' }}>
        <Bar $side="left" $pct={s.player.hp}><div /></Bar>
        <div style={{ color: '#fff', fontWeight: 900 }}>VS</div>
        <Bar $side="right" $pct={s.opponent.hp}><div style={{ float: 'right' }} /></Bar>
      </div>

      <div style={{ width: '100%', maxWidth: 900, display: 'flex', gap: 8, padding: '0 20px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ width: 18, height: 18, border: '2px solid #000', background: i <= s.player.ap ? '#3498db' : '#222' }} />
        ))}
      </div>

      <Arena $shake={s.game.shake}>
        <Fighter data={s.player} side="left" isPlayer />
        <Fighter data={s.opponent} side="right" />
        {s.opponent.hp <= 0 && <h1 style={{ position: 'absolute', top: '20%', fontSize: '8rem', color: '#ffd700', fontWeight: 900 }}>KO</h1>}
      </Arena>

      <div style={{ width: '100%', maxWidth: 900, padding: 30, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <button disabled={s.player.ap < 1 || s.player.anim !== 'idle' || s.opponent.hp <= 0} onClick={() => s.performMove('punch', 10, 1, 250)} style={{ padding: 20, fontWeight: 900, cursor: 'pointer' }}>PUNCH</button>
        <button disabled={s.player.ap < 2.5 || s.player.anim !== 'idle' || s.opponent.hp <= 0} onClick={() => s.performMove('kick', 25, 2.5, 350)} style={{ padding: 20, fontWeight: 900, cursor: 'pointer' }}>KICK</button>
        <button onClick={() => window.location.reload()} style={{ padding: 20, fontWeight: 900, cursor: 'pointer' }}>RESET</button>
      </div>
    </Stage>
  );
}
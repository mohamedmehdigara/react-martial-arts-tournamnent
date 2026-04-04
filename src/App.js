import React, { useEffect, memo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { create } from 'zustand';

// --- ANIMATIONS ---
const armPunch = keyframes`
  0% { transform: rotate(0); }
  20% { transform: rotate(-45deg) translateX(-10px); }
  50% { transform: rotate(105deg) scaleX(1.8) translateX(25px); filter: brightness(1.4); }
  100% { transform: rotate(0); }
`;

const legKick = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(-65deg) translateY(-20px); }
  55% { transform: rotate(120deg) scaleY(1.5) translateX(35px); filter: contrast(1.2); }
  100% { transform: rotate(0); }
`;

const bodyHurt = keyframes`
  0% { transform: translateX(0); filter: contrast(4) invert(0.2); }
  15% { transform: translateX(50px) rotate(8deg); }
  100% { transform: translateX(0); filter: contrast(1) invert(0); }
`;

const breathe = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.04) translateY(-3px); }
`;

// --- GAME STATE ---
const useCombatStore = create((set, get) => ({
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

    // Trigger Attack
    set(s => ({ player: { ...s.player, anim: type, ap: s.player.ap - cost, lastId: Date.now() } }));

    // Impact Logic
    setTimeout(() => {
      if (get().opponent.hp <= 0) return;
      set(s => ({ 
        opponent: { ...s.opponent, hp: Math.max(0, s.opponent.hp - dmg), anim: 'hurt', lastId: Date.now() },
        game: { shake: true }
      }));
      setTimeout(() => set(s => ({ game: { shake: false } })), 100);
      
      // Recovery
      setTimeout(() => {
        set(s => ({ player: { ...s.player, anim: 'idle' }, opponent: { ...s.opponent, anim: 'idle' } }));
        if (get().opponent.hp > 0) get().aiThink();
      }, 400);
    }, hitDelay);
  },

  aiThink: () => {
    setTimeout(() => {
      if (get().opponent.hp <= 0 || get().player.hp <= 0) return;
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
    }, 1000);
  }
}));

// --- STYLED COMPONENTS ---
const Stage = styled.div`
  width: 100vw; height: 100vh; background: #0a0a0c;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: 'Inter', sans-serif; overflow: hidden; color: white;
`;

const Arena = styled.div`
  width: 100%; max-width: 1000px; height: 480px;
  background: radial-gradient(circle at 50% 90%, #1a1a35 0%, #0a0a0c 85%);
  border-bottom: 25px solid #111; position: relative;
  display: flex; justify-content: space-around; align-items: flex-end; padding-bottom: 80px;
  ${p => p.$shake && css`transform: translate(12px, -12px);`}
`;

const SpriteContainer = styled.div`
  position: relative; width: 160px; height: 320px;
  display: flex; flex-direction: column; align-items: center;
  animation: ${p => p.$anim === 'idle' ? css`${breathe} 2.5s infinite ease-in-out` : 'none'};
  ${p => p.$side === 'right' && css`transform: scaleX(-1);`}
  ${p => p.$anim === 'hurt' && css`animation: ${bodyHurt} 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;`}
`;

const Limb = styled.div`
  position: absolute; width: 22px; height: 75px; background: #f3c1ad;
  border: 4px solid #000; border-radius: 12px; transform-origin: top center;

  /* Only animate specific limbs based on the action type */
  ${p => p.$isArm && p.$anim === 'punch' && css`
    animation: ${armPunch} 0.5s ${p.$delay || '0s'} forwards;
  `}
  ${p => p.$isLeg && p.$anim === 'kick' && css`
    animation: ${legKick} 0.6s forwards;
  `}
`;

const Fighter = memo(({ data, side, isPlayer }) => (
  // The 'key' here ensures animations reset every time a move is made
  <SpriteContainer $anim={data.anim} $side={side} key={data.lastId}>
    {/* Head */}
    <div style={{ width: 54, height: 62, background: '#f3c1ad', border: '4px solid #000', borderRadius: '48%', zIndex: 10 }}>
      <div style={{ width: '110%', height: 12, background: isPlayer ? '#c0392b' : '#333', marginTop: 22, marginLeft: '-5%', border: '3px solid #000' }} />
    </div>
    
    {/* Torso & Limbs */}
    <div style={{ width: 92, height: 125, background: isPlayer ? '#fff' : '#1a1a1a', border: '4px solid #000', borderRadius: 15, marginTop: -15, position: 'relative' }}>
      {/* Arm 1 & 2 */}
      <Limb $isArm $anim={data.anim} style={{ left: -24, top: 12 }} />
      <Limb $isArm $anim={data.anim} $delay="0.1s" style={{ right: -24, top: 12 }} />
      
      {/* Leg 1 (The Kicking Leg) & Leg 2 (Static) */}
      <Limb $isLeg $anim={data.anim} style={{ left: 18, top: 110, height: 100, background: isPlayer ? '#fff' : '#1a1a1a' }} />
      <Limb style={{ right: 18, top: 110, height: 100, background: isPlayer ? '#fff' : '#1a1a1a' }} />
    </div>
  </SpriteContainer>
));

const UIBar = styled.div`
  width: 44%; height: 35px; background: #222; border: 4px solid #000; position: relative;
  div { 
    height: 100%; width: ${p => p.$pct}%; 
    background: ${p => p.$side === 'left' ? '#2ecc71' : '#e74c3c'}; 
    transition: width 0.4s ease-out; 
    ${p => p.$side === 'right' && 'float: right;'}
  }
`;

export default function App() {
  const s = useCombatStore();

  useEffect(() => {
    const loop = setInterval(() => s.tick(), 100);
    return () => clearInterval(loop);
  }, [s]);

  return (
    <Stage>
      <div style={{ width: '100%', maxWidth: 1000, padding: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <UIBar $side="left" $pct={s.player.hp}><div /></UIBar>
        <div style={{ fontWeight: 900, fontSize: 32, fontStyle: 'italic' }}>VS</div>
        <UIBar $side="right" $pct={s.opponent.hp}><div /></UIBar>
      </div>

      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', gap: 10, padding: '0 25px', marginBottom: 15 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ 
            width: 22, height: 22, border: '3px solid #000', borderRadius: 4,
            background: i <= s.player.ap ? '#3498db' : '#1a1a1a',
            boxShadow: i <= s.player.ap ? '0 0 10px #3498db' : 'none'
          }} />
        ))}
      </div>

      <Arena $shake={s.game.shake}>
        <Fighter data={s.player} side="left" isPlayer />
        <Fighter data={s.opponent} side="right" />
        {s.opponent.hp <= 0 && <h1 style={{ position: 'absolute', top: '20%', fontSize: '12rem', color: '#ffd700', fontWeight: 900, textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>KO</h1>}
      </Arena>

      <div style={{ width: '100%', maxWidth: 1000, padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
        <button 
          disabled={s.player.ap < 1 || s.player.anim !== 'idle' || s.opponent.hp <= 0} 
          onClick={() => s.performMove('punch', 12, 1, 250)}
          style={{ padding: 22, background: '#111', color: '#fff', border: '4px solid #444', fontWeight: 900, cursor: 'pointer', fontSize: 18 }}
        >JAB (1 AP)</button>
        <button 
          disabled={s.player.ap < 2.5 || s.player.anim !== 'idle' || s.opponent.hp <= 0} 
          onClick={() => s.performMove('kick', 30, 2.5, 400)}
          style={{ padding: 22, background: '#111', color: '#fff', border: '4px solid #444', fontWeight: 900, cursor: 'pointer', fontSize: 18 }}
        >KICK (2.5 AP)</button>
        <button onClick={() => window.location.reload()} style={{ padding: 22, background: '#111', color: '#e74c3c', border: '4px solid #444', fontWeight: 900, cursor: 'pointer', fontSize: 18 }}>RESET</button>
      </div>
    </Stage>
  );
}
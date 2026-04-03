import React, { useEffect, useState, memo, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { create } from 'zustand';

// --- KEYFRAMES ---
const punchFlow = keyframes`
  0% { transform: translate(0, 0); }
  15% { transform: translate(-25px, 8px) rotate(-8deg); } 
  40% { transform: translate(85px, -8px) rotate(8deg); filter: brightness(1.4); } 
  100% { transform: translate(0, 0); }
`;

const kickFlow = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(-40deg) translateY(-30px); } 
  50% { transform: rotate(120deg) translateX(65px); } 
  100% { transform: rotate(0); }
`;

const hurtReact = keyframes`
  0% { transform: translateX(0); filter: contrast(4) brightness(2.5); }
  15% { transform: translateX(35px) skew(-12deg); }
  100% { transform: translateX(0); filter: contrast(1) brightness(1); }
`;

const breathe = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.04) translateY(-3px); }
`;

// --- STORE ---
const useCombatStore = create((set, get) => ({
  player: { hp: 100, ap: 4, anim: 'idle' },
  opponent: { hp: 100, anim: 'idle' },
  worldFx: { shake: false },
  aiTimer: null,

  regenAp: () => {
    const { player, opponent } = get();
    if (opponent.hp <= 0 || player.hp <= 0 || player.ap >= 5) return;
    set((state) => ({
      player: { ...state.player, ap: Math.min(5, state.player.ap + 0.1) }
    }));
  },

  executeMove: (type, dmg, cost, hitDelay) => {
    const { player, opponent } = get();
    if (player.anim !== 'idle' || player.ap < cost || opponent.hp <= 0) return;

    set((state) => ({ 
      player: { ...state.player, anim: type, ap: state.player.ap - cost } 
    }));

    setTimeout(() => {
      if (get().opponent.hp <= 0) return;

      set((state) => ({ 
        opponent: { ...state.opponent, hp: Math.max(0, state.opponent.hp - dmg), anim: 'hurt' },
        worldFx: { shake: true }
      }));

      setTimeout(() => set({ worldFx: { shake: false } }), 100); 

      setTimeout(() => {
        set((state) => ({ 
          player: { ...state.player, anim: 'idle' },
          opponent: { ...state.opponent, anim: 'idle' }
        }));
        if (get().opponent.hp > 0) get().aiBrain();
      }, 400);
    }, hitDelay);
  },

  aiBrain: () => {
    if (get().opponent.anim !== 'idle' || get().opponent.hp <= 0 || get().player.hp <= 0) return;
    
    const timer = setTimeout(() => {
      if (get().opponent.hp <= 0) return;
      set((state) => ({ opponent: { ...state.opponent, anim: 'kick' } }));
      
      setTimeout(() => {
        if (get().opponent.hp <= 0) return;
        set((state) => ({ 
          player: { ...state.player, hp: Math.max(0, state.player.hp - 15), anim: 'hurt' },
          worldFx: { shake: true }
        }));
        
        setTimeout(() => set({ worldFx: { shake: false } }), 200);
        setTimeout(() => set((state) => ({ 
            player: { ...state.player, anim: 'idle' },
            opponent: { ...state.opponent, anim: 'idle' } 
        })), 400);
      }, 450);
    }, 1000);

    set({ aiTimer: timer });
  }
}));

// --- STYLES ---
const Stage = styled.div`
  width: 100vw; height: 100vh; background: #050505;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  overflow: hidden; font-family: 'Inter', sans-serif;
`;

const Arena = styled.div`
  width: 100%; max-width: 1000px; height: 500px;
  background: radial-gradient(circle at center, #1a1a2e 0%, #050505 100%);
  border-bottom: 20px solid #111; position: relative;
  display: flex; justify-content: space-around; align-items: flex-end; padding-bottom: 80px;
  ${props => props.shake && css`transform: translate(8px, -8px);`}
`;

const FighterWrapper = styled.div`
  position: relative; width: 160px; height: 300px;
  display: flex; flex-direction: column; align-items: center;
  
  ${p => p.anim === 'idle' && css`animation: ${breathe} 3s infinite ease-in-out;`}
  ${props => props.side === 'right' && css`transform: scaleX(-1);`}
  ${props => props.anim === 'punch' && css`animation: ${punchFlow} 0.5s forwards;`}
  ${props => props.anim === 'kick' && css`animation: ${kickFlow} 0.6s forwards;`}
  ${props => props.anim === 'hurt' && css`animation: ${hurtReact} 0.4s forwards;`}
`;

const Limb = styled.div`
  position: absolute; width: 20px; height: 70px; background: #f3c1ad;
  border: 4px solid #000; border-radius: 14px; top: 15px;
  ${p => p.left ? 'left: -18px;' : 'right: -18px;'}
  transform-origin: top center;
`;

const BodyPart = styled.div`
  background: ${p => p.bg || '#f3c1ad'}; border: 4px solid #000;
`;

// --- COMPONENTS ---
const Fighter = memo(({ anim, side, isPlayer }) => (
  <FighterWrapper anim={anim} side={side}>
    <BodyPart bg="#f3c1ad" style={{ width: 52, height: 58, borderRadius: '48%', zIndex: 10, position: 'relative' }}>
      <div style={{ position: 'absolute', width: '115%', height: 10, background: isPlayer ? '#e74c3c' : '#333', top: 20, left: '-7.5%', border: '2px solid #000' }} />
    </BodyPart>
    <BodyPart bg={isPlayer ? '#fff' : '#1a1a1a'} style={{ width: 85, height: 115, borderRadius: 14, marginTop: -10, position: 'relative' }}>
      <Limb left /><Limb />
      <Limb left style={{ top: 90, height: 90, background: isPlayer ? '#fff' : '#1a1a1a', left: 14 }} />
      <Limb style={{ top: 90, height: 90, background: isPlayer ? '#fff' : '#1a1a1a', right: 14 }} />
    </BodyPart>
  </FighterWrapper>
));

export default function App() {
  const s = useCombatStore();

  useEffect(() => {
    const timer = setInterval(() => s.regenAp(), 100);
    return () => {
      clearInterval(timer);
      if (s.aiTimer) clearTimeout(s.aiTimer);
    };
  }, [s]);

  return (
    <Stage>
      <div style={{ width: '100%', maxWidth: 900, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
          <div style={{ width: '44%', height: 30, background: '#222', border: '4px solid #000' }}>
            <div style={{ height: '100%', width: `${s.player.hp}%`, background: '#2ecc71', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 30 }}>VS</div>
          <div style={{ width: '44%', height: 30, background: '#222', border: '4px solid #000', display: 'flex', flexDirection: 'row-reverse' }}>
            <div style={{ height: '100%', width: `${s.opponent.hp}%`, background: '#2ecc71', transition: 'width 0.3s ease' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ width: 18, height: 18, border: '3px solid #000', background: i <= s.player.ap ? '#3498db' : '#222' }} />
          ))}
        </div>
      </div>

      <Arena shake={s.worldFx.shake}>
        <Fighter anim={s.player.anim} side="left" isPlayer />
        <Fighter anim={s.opponent.anim} side="right" />
        {s.opponent.hp <= 0 && <h1 style={{ position: 'absolute', top: '20%', color: '#e74c3c', fontSize: '8rem', fontWeight: 900, textShadow: '4px 4px 0 #000' }}>K.O.</h1>}
      </Arena>

      <div style={{ width: '100%', maxWidth: 900, padding: 25, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <button 
          disabled={s.player.ap < 1 || s.player.anim !== 'idle' || s.opponent.hp <= 0} 
          onClick={() => s.executeMove('punch', 12, 1, 200)}
          style={{ padding: 20, background: '#111', color: '#fff', border: '4px solid #333', fontWeight: 900, cursor: 'pointer' }}
        >PUNCH (1 AP)</button>
        
        <button 
          disabled={s.player.ap < 2.5 || s.player.anim !== 'idle' || s.opponent.hp <= 0} 
          onClick={() => s.executeMove('kick', 30, 2.5, 300)}
          style={{ padding: 20, background: '#111', color: '#fff', border: '4px solid #333', fontWeight: 900, cursor: 'pointer' }}
        >KICK (2.5 AP)</button>
        
        <button onClick={() => window.location.reload()} style={{ padding: 20, background: '#111', color: '#fff', border: '4px solid #333', fontWeight: 900, cursor: 'pointer' }}>RESET</button>
      </div>
    </Stage>
  );
}
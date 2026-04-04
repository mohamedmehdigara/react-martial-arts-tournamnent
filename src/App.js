import React, { useEffect, memo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { create } from 'zustand';

// --- KEYFRAMES ---
const armPunch = keyframes`
  0% { transform: rotate(0); }
  20% { transform: rotate(-45deg) translateX(-15px); }
  45% { transform: rotate(100deg) scaleX(2) translateX(30px); filter: brightness(1.7); }
  100% { transform: rotate(0); }
`;

const legKick = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(-75deg) translateY(-30px); }
  55% { transform: rotate(125deg) scaleY(1.6) translateX(40px); filter: contrast(1.5); }
  100% { transform: rotate(0); }
`;

const bodyHurt = keyframes`
  0% { transform: translateX(0); filter: contrast(5) invert(0.3); }
  15% { transform: translateX(55px) rotate(10deg); }
  100% { transform: translateX(0); filter: contrast(1) invert(0); }
`;

const sparkPop = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(3.5); opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.06) translateY(-4px); }
`;

// --- GAME STORE ---
const useCombatStore = create((set, get) => ({
  player: { hp: 100, ap: 4, anim: 'idle', lastId: 0 },
  opponent: { hp: 100, anim: 'idle', lastId: 0 },
  fx: { shake: false, freeze: false, particles: [] },

  tick: () => {
    const { player, opponent, fx } = get();
    if (opponent.hp <= 0 || player.hp <= 0 || fx.freeze) return;
    set((state) => ({
      player: { ...state.player, ap: Math.min(5, state.player.ap + 0.18) }
    }));
  },

  spawnParticle: (x, y) => {
    const id = Math.random();
    set(state => ({ fx: { ...state.fx, particles: [...state.fx.particles, { id, x, y }] } }));
    setTimeout(() => {
      set(state => ({ fx: { ...state.fx, particles: state.fx.particles.filter(p => p.id !== id) } }));
    }, 400);
  },

  performMove: (type, dmg, cost, hitDelay) => {
    const { player, opponent } = get();
    if (player.anim !== 'idle' || player.ap < cost || opponent.hp <= 0) return;

    // Phase 1: Windup
    set(state => ({ 
      player: { ...state.player, anim: type, ap: state.player.ap - cost, lastId: Date.now() } 
    }));

    // Phase 2: Impact
    setTimeout(() => {
      if (get().opponent.hp <= 0) return;
      
      const impactX = side => side === 'left' ? 650 : 350;
      get().spawnParticle(630, 240); // Hardcoded relative impact point

      set(state => ({ 
        opponent: { ...state.opponent, hp: Math.max(0, state.opponent.hp - dmg), anim: 'hurt', lastId: Date.now() },
        fx: { ...state.fx, shake: true, freeze: true } 
      }));

      // Release Hit-Stop
      setTimeout(() => set(state => ({ fx: { ...state.fx, shake: false, freeze: false } })), 70);

      // Phase 3: Recovery
      setTimeout(() => {
        set(state => ({ 
          player: { ...state.player, anim: 'idle' },
          opponent: { ...state.opponent, anim: 'idle' } 
        }));
        if (get().opponent.hp > 0) get().aiTurn();
      }, 350);
    }, hitDelay);
  },

  aiTurn: () => {
    if (get().opponent.hp <= 0 || get().player.hp <= 0) return;
    
    // AI Reacts faster as it gets "angry" (lower HP)
    const reactionTime = get().opponent.hp < 40 ? 600 : 1200;

    setTimeout(() => {
      if (get().opponent.hp <= 0 || get().opponent.anim !== 'idle') return;
      
      set(state => ({ opponent: { ...state.opponent, anim: 'kick', lastId: Date.now() } }));

      setTimeout(() => {
        if (get().opponent.hp <= 0) return;
        get().spawnParticle(370, 240);
        set(state => ({ 
          player: { ...state.player, hp: Math.max(0, state.player.hp - 18), anim: 'hurt', lastId: Date.now() },
          fx: { ...state.fx, shake: true }
        }));
        setTimeout(() => set(state => ({ fx: { ...state.fx, shake: false } })), 150);
        setTimeout(() => set(state => ({ 
          player: { ...state.player, anim: 'idle' },
          opponent: { ...state.opponent, anim: 'idle' } 
        })), 450);
      }, 450);
    }, reactionTime);
  }
}));

// --- STYLED COMPONENTS ---
const Stage = styled.div`
  width: 100vw; height: 100vh; background: #050508;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-family: 'Inter', system-ui, sans-serif; overflow: hidden;
`;

const Arena = styled.div`
  width: 100%; max-width: 1100px; height: 500px;
  background: radial-gradient(circle at 50% 90%, #1a1a35 0%, #050508 85%);
  border-bottom: 30px solid #111; position: relative;
  display: flex; justify-content: space-around; align-items: flex-end; padding-bottom: 80px;
  ${p => p.$shake && css`transform: translate(12px, -12px);`}
`;

const ParticleFX = styled.div`
  position: absolute; width: 100px; height: 100px;
  background: radial-gradient(circle, #fff 0%, #f1c40f 30%, transparent 70%);
  filter: blur(2px); z-index: 99; pointer-events: none;
  animation: ${sparkPop} 0.4s ease-out forwards;
  left: ${p => p.$x}px; top: ${p => p.$y}px;
`;

const FighterWrapper = styled.div`
  position: relative; width: 160px; height: 320px;
  display: flex; flex-direction: column; align-items: center;
  animation: ${p => p.$anim === 'idle' ? css`${breathe} 3s infinite ease-in-out` : 'none'};
  ${p => p.$side === 'right' && css`transform: scaleX(-1);`}
  ${p => p.$anim === 'hurt' && css`animation: ${bodyHurt} 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;`}
`;

const Part = styled.div`
  position: absolute; width: 24px; height: 75px; background: #f3c1ad;
  border: 4px solid #000; border-radius: 14px; transform-origin: top center;

  ${p => p.$isArm && p.$anim === 'punch' && css`
    animation: ${armPunch} 0.5s ${p.$delay || '0s'} forwards;
  `}
  ${p => p.$isLeg && p.$anim === 'kick' && css`
    animation: ${legKick} 0.6s forwards;
  `}
`;

const Fighter = memo(({ data, side, isPlayer }) => (
  <FighterWrapper $anim={data.anim} $side={side} key={data.lastId}>
    {/* Head */}
    <div style={{ width: 58, height: 65, background: '#f3c1ad', border: '4px solid #000', borderRadius: '48%', zIndex: 10 }}>
      <div style={{ width: '110%', height: 14, background: isPlayer ? '#c0392b' : '#333', marginTop: 22, marginLeft: '-5%', border: '3px solid #000' }} />
    </div>
    {/* Torso */}
    <div style={{ width: 95, height: 125, background: isPlayer ? '#fff' : '#1a1a1a', border: '4px solid #000', borderRadius: 15, marginTop: -15, position: 'relative' }}>
      <Part $isArm $anim={data.anim} style={{ left: -24, top: 12 }} />
      <Part $isArm $anim={data.anim} $delay="0.1s" style={{ right: -24, top: 12 }} />
      <Part $isLeg $anim={data.anim} style={{ left: 18, top: 110, height: 100, background: isPlayer ? '#fff' : '#1a1a1a' }} />
      <Part style={{ right: 18, top: 110, height: 100, background: isPlayer ? '#fff' : '#1a1a1a' }} />
    </div>
  </FighterWrapper>
));

const HealthBar = styled.div`
  width: 45%; height: 38px; background: #222; border: 4px solid #000; position: relative; overflow: hidden;
  div { 
    height: 100%; width: ${p => p.$pct}%; 
    background: ${p => p.$side === 'left' ? '#2ecc71' : '#e74c3c'}; 
    transition: width 0.4s cubic-bezier(0, 1, 0.5, 1);
    ${p => p.$side === 'right' && 'position: absolute; right: 0;'}
  }
`;

const ApOrb = styled.div`
  width: 24px; height: 24px; border: 4px solid #000; border-radius: 4px;
  background: ${p => p.$on ? '#3498db' : '#111'};
  box-shadow: ${p => p.$on ? '0 0 15px #3498db' : 'none'};
  transition: all 0.2s;
`;

export default function Game() {
  const s = useCombatStore();

  useEffect(() => {
    const loop = setInterval(() => s.tick(), 100);
    return () => clearInterval(loop);
  }, [s]);

  return (
    <Stage>
      <div style={{ width: '100%', maxWidth: 1000, padding: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <HealthBar $side="left" $pct={s.player.hp}><div /></HealthBar>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 32, fontStyle: 'italic', letterSpacing: 4 }}>VS</div>
        <HealthBar $side="right" $pct={s.opponent.hp}><div /></HealthBar>
      </div>

      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', gap: 12, padding: '0 30px', marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map(i => <ApOrb key={i} $on={i <= s.player.ap} />)}
      </div>

      <Arena $shake={s.fx.shake}>
        {s.fx.particles.map(p => <ParticleFX key={p.id} $x={p.x} $y={p.y} />)}
        <Fighter data={s.player} side="left" isPlayer />
        <Fighter data={s.opponent} side="right" />
        {s.opponent.hp <= 0 && <h1 style={{ position: 'absolute', top: '20%', fontSize: '12rem', color: '#ffd700', fontWeight: 900, textShadow: '0 0 40px rgba(255,215,0,0.4)' }}>KO</h1>}
      </Arena>

      <div style={{ width: '100%', maxWidth: 1000, padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
        <button 
          disabled={s.player.ap < 1 || s.player.anim !== 'idle' || s.opponent.hp <= 0} 
          onClick={() => s.performMove('punch', 12, 1, 250)}
          style={{ padding: 22, background: '#111', color: '#fff', border: '4px solid #444', fontWeight: 900, cursor: 'pointer', fontSize: 18 }}
        >PUNCH (1.0)</button>
        <button 
          disabled={s.player.ap < 2.5 || s.player.anim !== 'idle' || s.opponent.hp <= 0} 
          onClick={() => s.performMove('kick', 30, 2.5, 400)}
          style={{ padding: 22, background: '#111', color: '#fff', border: '4px solid #444', fontWeight: 900, cursor: 'pointer', fontSize: 18 }}
        >KICK (2.5)</button>
        <button onClick={() => window.location.reload()} style={{ padding: 22, background: '#111', color: '#e74c3c', border: '4px solid #444', fontWeight: 900, cursor: 'pointer', fontSize: 18 }}>RESET</button>
      </div>
    </Stage>
  );
}
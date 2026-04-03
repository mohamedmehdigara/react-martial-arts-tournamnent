import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { create } from 'zustand';

// --- ANIMATIONS ---
const breathe = keyframes`
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-5px) scaleY(1.02); }
`;

const impactSpark = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

const cameraShake = keyframes`
  0% { transform: translate(0,0); }
  25% { transform: translate(5px, -5px); filter: saturate(2); }
  50% { transform: translate(-5px, 5px); }
  100% { transform: translate(0,0); }
`;

// --- ZUSTAND STORE ---
const useDojoStore = create((set, get) => ({
  gameState: 'fight',
  player: { hp: 100, maxHp: 100, ap: 4, anim: 'idle', stance: 'ready' },
  opponent: { hp: 100, maxHp: 100, anim: 'idle', stance: 'ready' },
  sparks: [], // [{id, x, y}]
  worldEffect: 'none', // 'hit', 'heavy', 'none'

  triggerSpark: (side) => {
    const id = Date.now();
    const x = side === 'left' ? '60%' : '40%';
    set(s => ({ sparks: [...s.sparks, { id, x }] }));
    setTimeout(() => set(s => ({ sparks: s.sparks.filter(p => p.id !== id) })), 400);
  },

  executeMove: (type) => {
    const { player, opponent, triggerSpark } = get();
    if (player.anim !== 'idle' || player.ap <= 0) return;

    const moveMap = {
      jab: { dmg: 8, ap: 1, delay: 200 },
      kick: { dmg: 22, ap: 2, delay: 400 },
      special: { dmg: 40, ap: 4, delay: 600 }
    };

    const move = moveMap[type];
    set({ 
      player: { ...player, anim: type, ap: player.ap - move.ap },
      worldEffect: type === 'special' ? 'heavy' : 'none'
    });

    // Impact Timing
    setTimeout(() => {
      const newOppHp = Math.max(0, opponent.hp - move.dmg);
      triggerSpark('left');
      set({ 
        opponent: { ...opponent, hp: newOppHp, anim: 'hurt' },
        worldEffect: 'hit'
      });

      // Reset Impact
      setTimeout(() => {
        set({ 
          player: { ...get().player, anim: 'idle' },
          opponent: { ...get().opponent, anim: 'idle' },
          worldEffect: 'none'
        });
        if (newOppHp > 0) get().aiCounter();
      }, 300);
    }, move.delay);
  },

  aiCounter: () => {
    setTimeout(() => {
      set({ opponent: { ...get().opponent, anim: 'kick' } });
      setTimeout(() => {
        const newHp = Math.max(0, get().player.hp - 15);
        get().triggerSpark('right');
        set({ 
          player: { ...get().player, hp: newHp, anim: 'hurt', ap: Math.min(4, get().player.ap + 1) },
          opponent: { ...get().opponent, anim: 'idle' },
          worldEffect: 'hit'
        });
        setTimeout(() => set({ player: { ...get().player, anim: 'idle' }, worldEffect: 'none' }), 300);
      }, 400);
    }, 1000);
  }
}));

// --- STYLED COMPONENTS ---
const Viewport = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0a0a0c;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  perspective: 1000px;
`;

const Arena = styled.div`
  width: 100%;
  max-width: 1000px;
  height: 500px;
  position: relative;
  background: 
    linear-gradient(to bottom, rgba(0,0,0,0.4), transparent),
    url('https://www.transparenttextures.com/patterns/dark-wood.png');
  border-bottom: 20px solid #1a1a1a;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 60px;
  
  ${props => props.effect === 'hit' && css`animation: ${cameraShake} 0.2s;`}
  ${props => props.effect === 'heavy' && css`filter: contrast(1.5) brightness(1.2) blur(1px);`}
`;

const Spark = styled.div`
  position: absolute;
  top: 40%;
  left: ${props => props.left};
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #fff, #f1c40f, transparent);
  border-radius: 50%;
  z-index: 10;
  animation: ${impactSpark} 0.4s ease-out forwards;
`;

const FighterBody = styled.div`
  position: relative;
  width: 150px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${breathe} 3s infinite ease-in-out;

  ${props => props.side === 'right' && css`transform: scaleX(-1);`}
  
  /* Animation States */
  ${props => props.anim === 'jab' && css`transform: translateX(60px) scale(1.05);`}
  ${props => props.anim === 'kick' && css`transform: translateX(40px) rotate(-10deg);`}
  ${props => props.anim === 'hurt' && css`transform: translateX(-30px) rotate(15deg); filter: sepia(1) saturate(5) hue-rotate(-50deg);`}
`;

const Gi = styled.div`
  width: 70px;
  height: 100px;
  background: ${props => props.color};
  border-radius: 5px;
  position: relative;
  border: 3px solid #000;
  z-index: 2;
`;

const Head = styled.div`
  width: 45px;
  height: 50px;
  background: #f3c1ad;
  border-radius: 40% 40% 50% 50%;
  border: 3px solid #000;
  margin-bottom: -5px;
  position: relative;
  &::after { content: '🕶️'; position: absolute; top: 10px; left: 5px; font-size: 20px; }
`;

const Arm = styled.div`
  position: absolute;
  width: 15px;
  height: 60px;
  background: #f3c1ad;
  border: 3px solid #000;
  top: 10px;
  transition: 0.2s;
  transform-origin: top center;
  ${props => props.right ? 'right: -12px;' : 'left: -12px;'}
  
  ${props => props.activeAnim === 'jab' && !props.right && css`
    transform: rotate(-90deg) scaleY(1.5);
    background: #fff;
  `}
`;

const Leg = styled.div`
  position: absolute;
  width: 20px;
  height: 80px;
  background: ${props => props.color};
  border: 3px solid #000;
  bottom: -70px;
  ${props => props.right ? 'right: 10px;' : 'left: 10px;'}
  
  ${props => props.activeAnim === 'kick' && props.right && css`
    transform: rotate(-110deg) translateX(20px);
    background: #f3c1ad;
  `}
`;

const UI = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  background: rgba(0,0,0,0.8);
  border: 1px solid #333;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Gauge = styled.div`
  width: 45%;
  .label { font-size: 12px; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
  .bar { height: 14px; background: #222; border-radius: 10px; overflow: hidden; border: 1px solid #444; }
  .fill { height: 100%; width: ${props => props.val}%; background: ${props => props.color}; transition: 0.3s; }
`;

const CommandCenter = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const MoveBtn = styled.button`
  background: ${props => props.special ? 'linear-gradient(45deg, #e74c3c, #f1c40f)' : '#2c3e50'};
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #1a1a1a;
  &:active { transform: translateY(2px); box-shadow: 0 2px 0 #1a1a1a; }
  &:disabled { opacity: 0.3; filter: grayscale(1); }
`;

// --- MAIN COMPONENT ---
export default function App() {
  const store = useDojoStore();

  return (
    <Viewport>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', margin: 0, letterSpacing: '10px' }}>KYOKUSHIN</h2>
        <small style={{ color: '#e74c3c' }}>REAL-TIME COMBAT ENGINE</small>
      </div>

      <Arena effect={store.worldEffect}>
        {store.sparks.map(s => <Spark key={s.id} left={s.x} />)}
        
        {/* Player */}
        <FighterBody anim={store.player.anim}>
          <Head />
          <Gi color="#fff">
            <Arm activeAnim={store.player.anim} />
            <Arm right activeAnim={store.player.anim} />
            <Leg color="#fff" />
            <Leg right color="#fff" activeAnim={store.player.anim} />
          </Gi>
        </FighterBody>

        {/* Opponent */}
        <FighterBody side="right" anim={store.opponent.anim}>
          <Head />
          <Gi color="#000">
            <Arm activeAnim={store.opponent.anim} />
            <Arm right activeAnim={store.opponent.anim} />
            <Leg color="#000" />
            <Leg right color="#000" activeAnim={store.opponent.anim} />
          </Gi>
        </FighterBody>
      </Arena>

      <UI>
        <StatusBar>
          <Gauge val={store.player.hp} color="#2ecc71">
            <div className="label">Challenger HP</div>
            <div className="bar"><div className="fill" /></div>
            <div style={{ marginTop: 5 }}>AP: {'💎'.repeat(store.player.ap)}</div>
          </Gauge>
          <Gauge val={store.opponent.hp} color="#e74c3c">
            <div className="label" style={{ textAlign: 'right' }}>Sensei Ryu HP</div>
            <div className="bar"><div className="fill" /></div>
          </Gauge>
        </StatusBar>

        <CommandCenter>
          <MoveBtn 
            disabled={store.player.ap < 1 || store.player.anim !== 'idle'} 
            onClick={() => store.executeMove('jab')}
          >
            QUICK JAB (1 AP)
          </MoveBtn>
          <MoveBtn 
            disabled={store.player.ap < 2 || store.player.anim !== 'idle'} 
            onClick={() => store.executeMove('kick')}
          >
            ROUNDHOUSE (2 AP)
          </MoveBtn>
          <MoveBtn 
            special
            disabled={store.player.ap < 4 || store.player.anim !== 'idle'} 
            onClick={() => store.executeMove('special')}
          >
            HADOKEN (4 AP)
          </MoveBtn>
        </CommandCenter>
        
        {store.opponent.hp <= 0 && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(231, 76, 60, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
             <h1 style={{ fontSize: '5rem', color: '#fff' }}>KO</h1>
          </div>
        )}
      </UI>
    </Viewport>
  );
}
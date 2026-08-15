import React from 'react';

/**
 * Animated steam particle layer representing a fresh out-of-the-oven hot pizza.
 */
export const SteamLayer: React.FC = React.memo(() => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-20px',
        borderRadius: '50%',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 7,
      }}
    >
      <div
        className="pizza-steam-particle"
        style={{
          position: 'absolute',
          left: '30%',
          bottom: '20%',
          width: '30px',
          height: '60px',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(8px)',
          animation: 'steamFloat 4s ease-in-out infinite',
        }}
      />
      <div
        className="pizza-steam-particle"
        style={{
          position: 'absolute',
          left: '55%',
          bottom: '25%',
          width: '40px',
          height: '70px',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(10px)',
          animation: 'steamFloat 4s ease-in-out infinite 1.5s',
        }}
      />
    </div>
  );
});

SteamLayer.displayName = 'SteamLayer';

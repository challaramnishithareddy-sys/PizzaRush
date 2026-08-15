import React from 'react';
import type {
  BuilderSize,
  BuilderCrustId,
  BuilderSauceId,
  BuilderCheeseId,
} from '../../../types/builderTypes';
import { ToppingPiece } from './ToppingPiece';

interface ToppingLayerProps {
  toppingId: string;
  quantity: number;
  size: BuilderSize;
  crust: BuilderCrustId;
  sauce: BuilderSauceId;
  cheese: BuilderCheeseId;
}

/**
 * Component representing a single topping type on the pizza.
 * Uses React.memo with strict comparison so other topping edits do not trigger re-renders.
 */
export const ToppingLayer: React.FC<ToppingLayerProps> = React.memo(
  ({ toppingId, quantity, size, crust, sauce, cheese }) => {
    // Generate piece instances: 3 pieces per quantity level (max 9 pieces total)
    const pieceCount = Math.min(quantity * 3, 12);
    const pieceIndices = Array.from({ length: pieceCount }, (_, i) => i);

    return (
      <div
        aria-label={`Topping layer ${toppingId}`}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        {pieceIndices.map((pieceIdx) => (
          <ToppingPiece
            key={`${toppingId}-${pieceIdx}`}
            toppingId={toppingId}
            pieceIndex={pieceIdx}
            size={size}
            crust={crust}
            sauce={sauce}
            cheese={cheese}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.toppingId === nextProps.toppingId &&
    prevProps.quantity === nextProps.quantity &&
    prevProps.size === nextProps.size &&
    prevProps.crust === nextProps.crust &&
    prevProps.sauce === nextProps.sauce &&
    prevProps.cheese === nextProps.cheese
);

ToppingLayer.displayName = 'ToppingLayer';

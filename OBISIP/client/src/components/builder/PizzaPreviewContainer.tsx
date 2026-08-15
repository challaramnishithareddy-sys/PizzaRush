import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { PizzaPreview } from './PizzaPreview';

/**
 * Container component for PizzaPreview.
 * Uses atomic Zustand state selectors to isolate re-renders strictly to visual props.
 */
export const PizzaPreviewContainer: React.FC = () => {
  const size = useBuilderStore((s) => s.config.size);
  const crust = useBuilderStore((s) => s.config.crust);
  const sauce = useBuilderStore((s) => s.config.sauce);
  const cheese = useBuilderStore((s) => s.config.cheese);
  const toppings = useBuilderStore((s) => s.config.toppings);

  return (
    <PizzaPreview
      size={size}
      crust={crust}
      sauce={sauce}
      cheese={cheese}
      toppings={toppings}
    />
  );
};

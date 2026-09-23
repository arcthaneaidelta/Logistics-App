import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeVal = hoverVal !== null ? hoverVal : value;

  return (
    <div className="flex items-center gap-1 select-none" role={interactive ? 'radiogroup' : 'group'}>
      {Array.from({ length: max }).map((_, idx) => {
        const starNum = idx + 1;
        const isFilled = starNum <= activeVal;

        return (
          <button
            key={idx}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starNum)}
            onMouseEnter={() => interactive && setHoverVal(starNum)}
            onMouseLeave={() => interactive && setHoverVal(null)}
            className={`transition-transform duration-100 ${
              interactive
                ? 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-1 focus:ring-accent rounded-sm'
                : 'cursor-default pointer-events-none'
            }`}
            aria-label={`${starNum} of ${max} stars`}
          >
            <Star
              className={`${starSizes[size]} transition-colors duration-150 ${
                isFilled
                  ? 'fill-accent text-accent'
                  : 'text-border-strong fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

import { useEffect } from 'react';

type StateSetter = (value: boolean) => void;

type iStateAndConditionals = {
  stateSetter: StateSetter;
  isOpen: boolean;
};

function useEscapeKeyHandler(stateAndConditionals: iStateAndConditionals[]) {
  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        stateAndConditionals.forEach(({ stateSetter, isOpen }) => {
          if (isOpen) stateSetter(false);
        });
      }
    };

    window.addEventListener('keydown', handleEscapeKeyPress);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [stateAndConditionals]);
}

export default useEscapeKeyHandler;
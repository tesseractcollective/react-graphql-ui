import {useState, useEffect} from 'react';

export default function useDebounce(
  callback: () => void,
  debounceMillisconds: number
): () => void {
  const [timeoutId, setTimeoutId] = useState<any | undefined>();
  const [shouldResetTimeout, setShouldResetTimeout] = useState(false);

  const reset = () => {
    setShouldResetTimeout(true);
  };

  useEffect(() => {
    if (shouldResetTimeout) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setTimeoutId(setTimeout(callback, debounceMillisconds));
      setShouldResetTimeout(false);
    }
  }, [timeoutId, shouldResetTimeout]);

  return reset;
}

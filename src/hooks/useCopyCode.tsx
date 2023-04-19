import { useCallback, useEffect, useRef } from 'react';
import { message } from 'antd';
import { copyToClipboard } from '@utils';

const useCopyCode = (tip?: string) => {
  const listenerRef = useRef(null);

  const copyListener = useCallback(
    (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const copyClass = '.copy-code';
      if (el.matches(copyClass) || el.parentElement?.matches(copyClass)) {
        const btnEl = el.nodeName === 'BUTTON' ? el : el.parentElement;
        const codeEl = btnEl.nextElementSibling as HTMLElement;
        if (!codeEl) return;
        const text = codeEl.innerText;
        if (!text) return;
        copyToClipboard(text);
        if (tip) {
          message.success(tip);
        }
      }
    },
    [tip]
  );

  useEffect(() => {
    listenerRef.current = copyListener;
  }, [copyListener]);

  useEffect(() => {
    const previousListener = listenerRef.current;
    if (previousListener) {
      window.removeEventListener('click', previousListener);
    }

    window.addEventListener('click', copyListener);

    return () => {
      window.removeEventListener('click', copyListener);
    };
  }, [copyListener]);
};

export default useCopyCode;

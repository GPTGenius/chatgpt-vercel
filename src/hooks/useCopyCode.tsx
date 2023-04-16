import { useCallback, useEffect } from 'react';
import { message } from 'antd';
import { copyToClipboard } from '@utils';

const useCopyCode = (tip?: string) => {
  const copyListener = useCallback((e: MouseEvent) => {
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
  }, []);
  useEffect(() => {
    window.addEventListener('click', copyListener);

    return () => {
      window.removeEventListener('click', copyListener);
    };
  }, []);
};

export default useCopyCode;

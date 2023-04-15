import MarkdownIt from 'markdown-it';
import mdHighlight from 'markdown-it-highlightjs';
import mdKbd from 'markdown-it-kbd';

const markdown = MarkdownIt({
  linkify: true,
  breaks: true,
})
  .use(mdHighlight, {
    inline: true,
  })
  .use(mdKbd);

export default markdown;

export const hasMathJax = () => !!window.MathJax;

export const initMathJax: () => Promise<void> = (callback?: () => void) => {
  if (hasMathJax()) return Promise.resolve(null);
  return new Promise((res) => {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$']],
        displayMath: [['$$', '$$']],
        processEnvironments: true,
        processRefs: true,
      },
      options: {
        skipHtmlTags: ['noscript', 'style', 'textarea', 'pre', 'code'],
        ignoreHtmlClass: 'tex2jax_ignore',
      },
      startup: {
        pageReady: () => {
          callback?.();
          res(null);
        },
      },
      svg: {
        fontCache: 'global',
      },
    };

    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.min.js';
    script.async = true;
    document.head.appendChild(script);
  });
};

// async function
export const renderMaxJax: () => Promise<void> = () =>
  window.MathJax.typesetPromise(document.getElementsByClassName('prose'));

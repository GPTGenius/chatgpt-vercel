import MarkdownIt from 'markdown-it';
import mdHighlight from 'markdown-it-highlightjs';
import mdKbd from 'markdown-it-kbd';

const preCopyPlugin = (md: MarkdownIt) => {
  // Override the default renderer for code blocks
  const defaultRender = md.renderer.rules.fence;
  // eslint-disable-next-line no-param-reassign
  md.renderer.rules.fence = (...args) => {
    // Get the original code block HTML
    const codeBlockHtml = defaultRender(...args);

    const copyButtonHtml = `<button class="copy-code w-9 h-9 absolute top-0 right-0"><i class="ri-file-copy-line"></i></button>`;

    // Return the modified HTML
    return codeBlockHtml.replace(
      '<pre>',
      `<pre class="relative">${copyButtonHtml}`
    );
  };
};

const markdown = MarkdownIt({
  linkify: true,
  breaks: true,
})
  .use(mdHighlight, {
    inline: true,
  })
  .use(mdKbd)
  .use(preCopyPlugin);

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

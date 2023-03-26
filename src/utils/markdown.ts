import MarkdownIt from 'markdown-it';
import mdKatex from 'markdown-it-katex';
import mdHighlight from 'markdown-it-highlightjs';
import mdKbd from 'markdown-it-kbd';

const markdown = MarkdownIt({
  linkify: true,
  breaks: true,
})
  .use(mdKatex)
  .use(mdHighlight, {
    inline: true,
  })
  .use(mdKbd);

export default markdown;

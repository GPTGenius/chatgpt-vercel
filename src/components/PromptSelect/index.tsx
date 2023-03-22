import { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import GlobalContext from '@contexts/global';
import { Prompt } from '@interfaces';
import { Dropdown } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import './index.css';

const PromptSelect: FC<{
  keyword: string;
  showPrompt: boolean;
  onSelect: (prompt: string) => void;
  children?: ReactNode;
}> = ({ keyword, showPrompt, onSelect, children }) => {
  const { lang } = useContext(GlobalContext);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filterPrompts, setFilterPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const getPrompt = async () => {
      let promptList: Prompt[] = [];
      try {
        if (lang === 'zh') {
          promptList = (await import('prompts/prompt_zh.json')).default;
        } else {
          promptList = (await import('prompts/prompt_en.json')).default;
        }
      } catch (e) {
        promptList = [];
      }
      setPrompts(promptList);
    };

    getPrompt();
  }, []);

  // filter prompts by keyword
  useEffect(() => {
    setFilterPrompts(
      prompts.filter(
        (prompt) =>
          prompt.act.includes(keyword) || prompt.prompt.includes(keyword)
      )
    );
  }, [keyword, prompts]);

  const items: ItemType[] = useMemo(
    () =>
      filterPrompts.map((prompt) => ({
        key: prompt.act,
        label: (
          <div
            className="p-1"
            style={{
              width: 'calc(100vw - 8rem)',
              maxWidth: 'var(--content-width)',
            }}
            onClick={() => onSelect(prompt.prompt)}
          >
            <div className="font-bold leading-8">{prompt.act}</div>
            <div>{prompt.prompt}</div>
          </div>
        ),
      })),
    [filterPrompts, onSelect]
  );

  return (
    <Dropdown menu={{ items }} placement="topLeft" open={showPrompt}>
      {children}
    </Dropdown>
  );
};

export default PromptSelect;

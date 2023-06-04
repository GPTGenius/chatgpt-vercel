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
  const {
    configs: { lang },
  } = useContext(GlobalContext);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filterPrompts, setFilterPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const getPrompt = async () => {
      let promptList: Prompt[] = [];
      if (!lang) return;
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
  }, [lang]);

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
      filterPrompts.map((prompt, index) => ({
        key: `${prompt.act}${index}`,
        label: (
          <div className="p-1" onClick={() => onSelect(prompt.prompt)}>
            <div className="font-bold leading-8">{prompt.act}</div>
            <div>{prompt.prompt}</div>
          </div>
        ),
      })),
    [filterPrompts, onSelect]
  );

  return (
    <Dropdown
      overlayClassName="input-prompt common-scrollbar"
      menu={{ items }}
      placement="topLeft"
      open={items.length > 0 && showPrompt}
      getPopupContainer={(node) => node.parentElement}
      autoAdjustOverflow={false}
    >
      {children}
    </Dropdown>
  );
};

export default PromptSelect;

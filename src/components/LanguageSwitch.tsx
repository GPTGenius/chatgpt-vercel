import { FC, useContext } from 'react';
import { Dropdown, MenuProps } from 'antd';
import GlobalContext from '@contexts/global';
import { globalConfigLocalKey } from '@configs';

const LanguageSwitch: FC = () => {
  const { configs } = useContext(GlobalContext);

  const { lang } = configs;

  const items: MenuProps['items'] = [
    {
      label: '中文',
      key: 'zh',
    },
    {
      label: 'English',
      key: 'en',
    },
  ];

  const onClick = (e) => {
    const selectedLang = e.key;
    localStorage.setItem(
      globalConfigLocalKey,
      JSON.stringify({ ...configs, lang: selectedLang })
    );
    if (selectedLang !== lang) {
      window.location.reload();
    }
  };

  return (
    <Dropdown
      menu={{ items, selectedKeys: [lang], onClick }}
      trigger={['click']}
      placement="bottomRight"
      overlayStyle={{ minWidth: 120 }}
    >
      <div className="mr-2 cursor-pointer">
        <i className="ri-translate-2 text-[18px]" />
        <i className="ri-arrow-down-s-line text-[18px]" />
      </div>
    </Dropdown>
  );
};

export default LanguageSwitch;

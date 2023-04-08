import { FC, useContext } from 'react';
import GlobalContext from '@contexts/global';
import ConfigIcon from '@components/ConfigIcon';
import { Conversation, GlobalConfig, ReactSetState } from '@interfaces';
import { Divider, Input, Select, Slider, Switch } from 'antd';
import {
  defaultConversation,
  globalConfigLocalKey,
  supportedImgSizes,
  supportedLanguages,
  supportedModels,
} from '@configs';

interface ConfigurationProps {
  setActiveSetting: ReactSetState<boolean>;
  setConfigs: ReactSetState<Partial<GlobalConfig>>;
  setConversations: ReactSetState<Record<string, Conversation>>;
}

const Configuration: FC<ConfigurationProps> = ({
  setActiveSetting,
  setConfigs,
  setConversations,
}) => {
  const { i18n, configs } = useContext(GlobalContext);

  const updateConfigsAndStorages = (updates: Partial<GlobalConfig>) => {
    const newConfigs = { ...configs, ...updates };
    setConfigs(newConfigs);
    localStorage.setItem(globalConfigLocalKey, JSON.stringify(newConfigs));
  };

  return (
    <div className="w-2/5 border-l border-l-[#edeeee]">
      <div className="h-[60px] border-b border-b-[#edeeee] pl-5 pr-5 flex justify-between items-center text-[#232629]">
        <div>{i18n.configuration}</div>
        <div>
          <ConfigIcon
            name="ri-delete-bin-line mr-2"
            onClick={() =>
              setConversations({
                [defaultConversation.id]: {
                  ...defaultConversation,
                  title: i18n.status_empty,
                },
              })
            }
          />
          <ConfigIcon
            name="ri-close-line"
            onClick={() => setActiveSetting(false)}
          />
        </div>
      </div>
      <div className="pl-5 pr-5 pt-4 pb-4 text-sm ">
        <div className="mb-2">
          <div className="mb-2">OpenAI Api Key:</div>
          <Input
            className="w-full"
            type="password"
            autoComplete="off"
            value={configs.openAIApiKey}
            onChange={(e) =>
              updateConfigsAndStorages({ openAIApiKey: e.target.value })
            }
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>{i18n.config_language}</div>
          <Select
            className="w-1/2"
            value={configs.lang}
            options={supportedLanguages}
            onChange={(lang) => updateConfigsAndStorages({ lang })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>{i18n.config_save}</div>
          <Switch
            className={
              !configs.save
                ? 'bg-[rgb(0,0,0,0.25)] hover:bg-[rgb(0,0,0,0.4)]'
                : ''
            }
            checked={configs.save}
            onChange={(save) => updateConfigsAndStorages({ save })}
          />
        </div>
        <Divider orientation="left" plain>
          {i18n.chat_mode_text}
        </Divider>
        <div className="flex items-center justify-between mb-3">
          <div>{i18n.config_model}</div>
          <Select
            className="w-1/2"
            value={configs.model}
            options={supportedModels.map((model) => ({
              label: model,
              value: model,
            }))}
            onChange={(model) => updateConfigsAndStorages({ model })}
          />
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>{i18n.config_continuous}</div>
          <Switch
            className={
              !configs.continuous
                ? 'bg-[rgb(0,0,0,0.25)] hover:bg-[rgb(0,0,0,0.4)]'
                : ''
            }
            defaultChecked
            checked={configs.continuous}
            onChange={(continuous) => updateConfigsAndStorages({ continuous })}
          />
        </div>
        <div className="mb-3">
          <div className="mb-3">{i18n.config_messages_count}</div>
          <Slider
            // className={isMobile ? 'w-1/2' : 'w-1/4'}
            className="w-full"
            min={2}
            max={24}
            step={2}
            disabled={!configs.continuous}
            defaultValue={4}
            value={configs.messagesCount}
            onChange={(messagesCount) =>
              updateConfigsAndStorages({ messagesCount })
            }
          />
        </div>
        <div className="mb-3">
          <div className="mb-3">{i18n.config_temperature}</div>
          <Slider
            // className={isMobile ? 'w-1/2' : 'w-1/4'}
            className="w-full"
            min={0}
            max={2}
            step={0.1}
            defaultValue={1}
            value={configs.temperature}
            onChange={(temperature) =>
              updateConfigsAndStorages({ temperature })
            }
          />
        </div>
        <Divider orientation="left" plain>
          {i18n.chat_mode_image}
        </Divider>
        <div className="mb-3">
          <div className="mb-3">{i18n.config_images_count}</div>
          <Slider
            // className={isMobile ? 'w-1/2' : 'w-1/4'}
            className="w-full"
            min={1}
            max={10}
            step={1}
            defaultValue={1}
            value={configs.imagesCount}
            onChange={(imagesCount) =>
              updateConfigsAndStorages({ imagesCount })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>{i18n.config_images_size}</div>
          <Select
            className="w-1/2"
            value={configs.imageSize}
            options={supportedImgSizes.map((size) => ({
              label: size,
              value: size,
            }))}
            onChange={(imageSize) => updateConfigsAndStorages({ imageSize })}
          />
        </div>
      </div>
    </div>
  );
};

export default Configuration;

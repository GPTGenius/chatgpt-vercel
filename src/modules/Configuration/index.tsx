import { FC, useContext } from 'react';
import GlobalContext from '@contexts/global';
import ConfigIcon from '@components/ConfigIcon';
import { GlobalConfig, ReactSetState } from '@interfaces';
import { Collapse, Input, Select, Slider, Switch, Tooltip } from 'antd';
import {
  defaultConversation,
  globalConfigLocalKey,
  layoutConfig,
  supportedImageModels,
  supportedImgSizes,
  supportedLanguages,
  supportedModels,
} from '@configs';
import { setClassByLayout } from '@utils';

const { Panel } = Collapse;

interface ConfigurationProps {
  setActiveSetting: ReactSetState<boolean>;
  setConfigs: ReactSetState<Partial<GlobalConfig>>;
}

const Configuration: FC<ConfigurationProps> = ({
  setActiveSetting,
  setConfigs,
}) => {
  const { i18n, configs, setConversations, setCurrentId, inVercel, isMobile } =
    useContext(GlobalContext);

  const updateConfigsAndStorages = (updates: Partial<GlobalConfig>) => {
    const newConfigs = { ...configs, ...updates };
    setConfigs(newConfigs);
    localStorage.setItem(globalConfigLocalKey, JSON.stringify(newConfigs));
  };

  return (
    <div className="border-l border-l-[#edeeee] h-full flex flex-col">
      <div className="h-[60px] border-b border-b-[#edeeee] pl-5 pr-5 flex justify-between items-center text-[#232629]">
        <div>{i18n.configuration}</div>
        <div>
          <Tooltip title={i18n.action_clear}>
            <ConfigIcon
              name="ri-delete-bin-line mr-2"
              onClick={() => {
                setConversations({
                  [defaultConversation.id]: {
                    ...defaultConversation,
                    createdAt: Date.now(),
                  },
                });
                setCurrentId(defaultConversation.id);
              }}
            />
          </Tooltip>
          <ConfigIcon
            name="ri-close-line"
            onClick={() => setActiveSetting(false)}
          />
        </div>
      </div>
      <Collapse
        className="bg-transparent flex-1 overflow-auto common-scrollbar"
        bordered={false}
        accordion
        defaultActiveKey={['1']}
      >
        <Panel header={i18n.config_general} key="1">
          <div className="mb-6">
            <div className="mb-2">{i18n.config_password}</div>
            <Input
              className="w-full"
              type="password"
              autoComplete="off"
              value={configs.password}
              onChange={(e) =>
                updateConfigsAndStorages({ password: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
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
          <div className="flex items-center justify-between mb-6">
            <div>{i18n.config_language}</div>
            <Select
              className="w-1/2"
              value={configs.lang}
              options={supportedLanguages}
              onChange={(lang) => updateConfigsAndStorages({ lang })}
            />
          </div>
          {!isMobile ? (
            <div className="flex items-center justify-between mb-6">
              <div>{i18n.config_layout}</div>
              <Select
                className="w-1/2"
                value={configs.layout}
                options={layoutConfig.map((layout) => ({
                  label: i18n[`layout_${layout}`],
                  value: layout,
                }))}
                onChange={(layout) => {
                  updateConfigsAndStorages({ layout });
                  setClassByLayout(layout);
                }}
              />
            </div>
          ) : null}
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
        </Panel>
        <Panel header={i18n.chat_mode_text} key="2">
          <div className="flex items-center justify-between mb-6">
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
          <div className="flex items-center justify-between mb-6">
            <div>{i18n.config_continuous}</div>
            <Switch
              className={
                !configs.continuous
                  ? 'bg-[rgb(0,0,0,0.25)] hover:bg-[rgb(0,0,0,0.4)]'
                  : ''
              }
              defaultChecked
              checked={configs.continuous}
              onChange={(continuous) =>
                updateConfigsAndStorages({ continuous })
              }
            />
          </div>
          <div className="mb-6">
            <div className="mb-2">{i18n.config_messages_count}</div>
            <Slider
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
          <div>
            <div className="mb-2">{i18n.config_temperature}</div>
            <Slider
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
        </Panel>
        <Panel header={i18n.chat_mode_image} key="3">
          <div className="flex items-center justify-between mb-6">
            <div>{i18n.config_model}</div>
            <Select
              className="w-1/2"
              value={configs.imageModel}
              options={supportedImageModels.map((model) => ({
                label: model,
                value: model,
                disabled: model === 'Replicate' && inVercel,
              }))}
              onChange={(imageModel) =>
                updateConfigsAndStorages({ imageModel })
              }
            />
          </div>
          {configs.imageModel === 'DALL-E' ||
          configs.imageModel === 'Replicate' ? (
            <div className="flex items-center justify-between mb-6">
              <div>{i18n.config_images_size}</div>
              <Select
                className="w-1/2"
                value={configs.imageSize}
                options={supportedImgSizes.map((size) => ({
                  label: size,
                  value: size,
                }))}
                onChange={(imageSize) =>
                  updateConfigsAndStorages({ imageSize })
                }
              />
            </div>
          ) : null}
          {configs.imageModel === 'DALL-E' ? (
            <div>
              <div className="mb-2">{i18n.config_images_count}</div>
              <Slider
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
          ) : null}
          {configs.imageModel === 'Midjourney' ? (
            <>
              <div className="mb-6">
                <div className="mb-2">Discord Server Id:</div>
                <Input
                  className="w-full"
                  autoComplete="off"
                  value={configs.discordServerId}
                  onChange={(e) =>
                    updateConfigsAndStorages({
                      discordServerId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-6">
                <div className="mb-2">Discord Channel Id:</div>
                <Input
                  className="w-full"
                  autoComplete="off"
                  value={configs.discordChannelId}
                  onChange={(e) =>
                    updateConfigsAndStorages({
                      discordChannelId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-6">
                <div className="mb-2">Discord Token:</div>
                <Input
                  className="w-full"
                  type="password"
                  autoComplete="off"
                  value={configs.discordToken}
                  onChange={(e) =>
                    updateConfigsAndStorages({ discordToken: e.target.value })
                  }
                />
              </div>
            </>
          ) : null}
        </Panel>
      </Collapse>
    </div>
  );
};

export default Configuration;

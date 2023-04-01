import { FC, useContext, useState } from 'react';
import { GlobalConfig } from '@interfaces';
import { globalConfigLocalKey, supportedModels } from '@configs';
import GlobalContext from '@contexts/global';
import { Divider, Input, InputNumber, Popover, Select, Switch } from 'antd';

const GlobalConfigs: FC<{
  setConfigs: (configs: GlobalConfig) => void;
}> = ({ setConfigs }) => {
  const { i18n, configs } = useContext(GlobalContext);
  const [showConfigs, setShowConfigs] = useState(false);

  const updateConfigsAndStorages = (updates: Partial<GlobalConfig>) => {
    const newConfigs = { ...configs, ...updates };
    setConfigs(newConfigs);
    localStorage.setItem(globalConfigLocalKey, JSON.stringify(newConfigs));
  };
  return (
    <Popover
      open={showConfigs}
      onOpenChange={setShowConfigs}
      content={
        <div
          style={{
            width: 'calc(100vw - 4rem - 24px)',
            maxWidth: 'var(--content-width)',
          }}
        >
          <div className="flex items-center justify-between mb-[12px]">
            <div>OpenAI Api Key:</div>
            <Input
              className="w-1/2"
              type="password"
              autoComplete="off"
              value={configs.openAIApiKey}
              onChange={(e) =>
                updateConfigsAndStorages({ openAIApiKey: e.target.value })
              }
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
          <div className="flex items-center justify-between mb-[12px]">
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
          <div className="flex items-center justify-between">
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
          <Divider orientation="left" plain>
            {i18n.chat_mode_image}
          </Divider>
          <div className="flex items-center justify-between">
            <div>{i18n.config_images_count}</div>
            <InputNumber
              defaultValue={1}
              value={configs.imagesCount}
              onChange={(imagesCount) =>
                updateConfigsAndStorages({ imagesCount })
              }
              max={10}
              min={1}
              formatter={(val) => Math.floor(val).toString()}
            />
          </div>
        </div>
      }
      trigger="click"
      placement="bottomRight"
    >
      <div className={`w-[36px] text-center rounded-[4px]`}>
        <i
          className={`${
            showConfigs ? 'ri-settings-4-fill' : 'ri-settings-4-line'
          } text-[24px] cursor-pointer`}
        />
      </div>
    </Popover>
  );
};

export default GlobalConfigs;

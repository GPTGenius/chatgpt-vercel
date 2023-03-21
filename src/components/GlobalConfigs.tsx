import { FC, useContext, useState } from 'react';
import { GlobalConfig } from '@interfaces';
import { globalConfigLocalKey, supportedModels } from '@configs';
import GlobalContext from '@contexts/global';
import { Input, Popover, Select, Switch } from 'antd';

const GlobalConfigs: FC<{
  configs: GlobalConfig;
  setConfigs: (configs: GlobalConfig) => void;
}> = ({ configs, setConfigs }) => {
  const { i18n } = useContext(GlobalContext);
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
              onChange={(e) => ({ openAIApiKey: e.target.value })}
            />
          </div>
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
            <div>{i18n.config_save}</div>
            <Switch
              style={{
                background: !configs.save ? 'rgba(0, 0, 0, 0.45)' : undefined,
              }}
              checked={configs.save}
              onChange={(save) => updateConfigsAndStorages({ save })}
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

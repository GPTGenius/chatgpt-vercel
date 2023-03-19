import { FC, useEffect, useState } from 'react';
import { GlobalConfig } from '@interfaces';
import { globalConfigLocalKey } from '@configs';

const GlobalConfigs: FC<{
  configs: GlobalConfig;
  setConfigs: (configs: GlobalConfig) => void;
}> = ({ configs, setConfigs }) => {
  const [showConfigs, setShowConfigs] = useState(false);

  useEffect(() => {
    // read from localstorage in the first time
    const localConfigs = localStorage.getItem(globalConfigLocalKey);
    if (localConfigs) {
      try {
        setConfigs(JSON.parse(localConfigs));
      } catch (e) {
        //
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateConfigsAndStorages = (newConfigs: GlobalConfig) => {
    setConfigs(newConfigs);
    localStorage.setItem(globalConfigLocalKey, JSON.stringify(newConfigs));
  };

  return (
    <div
      className={`w-[36px] text-center rounded-[4px] relative ${
        showConfigs ? 'bg-[#f1f2f6]' : ''
      }`}
    >
      <i
        className="ri-settings-4-line text-[24px] cursor-pointer"
        onClick={() => setShowConfigs((show) => !show)}
      />
      {showConfigs ? (
        <div
          className="absolute right-0 top-[44px]"
          style={{
            width: 'calc(100vw - 4rem)',
            maxWidth: 'calc(var(--content-width) - 4rem)',
          }}
        >
          <div className="bg-[#f1f2f6] rounded-[4px] p-3 text-left shadow-md">
            <div className="flex items-center justify-between mb-[8px]">
              <div>OpenAI Api Key:</div>
              <input
                type="password"
                autoComplete="off"
                value={configs.openAIApiKey}
                onChange={(e) => {
                  const { value } = e.target;
                  const newConfigs = { ...configs, openAIApiKey: value };
                  updateConfigsAndStorages(newConfigs);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>Model:</div>
              <input
                value={configs.model}
                onChange={(e) => {
                  const { value } = e.target;
                  const newConfigs = { ...configs, model: value };
                  updateConfigsAndStorages(newConfigs);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GlobalConfigs;

import React, { createContext } from 'react';

const EMPTY = Symbol('CREATE_MODEL');

interface ModelProviderProps<InitParams = unknown> {
  initParams?: InitParams;
  children: React.ReactNode;
}

interface Model<Value, InitParams = unknown> {
  Provider: React.FC<ModelProviderProps<InitParams>>;
  useContext: () => Value;
}

const createModel = <Value, InitParams = unknown>(
  useHooks: (initValue?: InitParams) => Value
): Model<Value, InitParams> => {
  const HooksContext = createContext<Value | typeof EMPTY>(EMPTY);

  const Provider = (props: ModelProviderProps<InitParams>) => {
    const useHooksValue = useHooks(props.initParams);
    return (
      <HooksContext.Provider value={useHooksValue}>
        {props.children}
      </HooksContext.Provider>
    );
  };

  const useContext = () => {
    const value = React.useContext(HooksContext);
    if (value === EMPTY) {
      throw new Error('Component must be wrapped with <Model.Provider>');
    }
    return value;
  };

  return {
    Provider,
    useContext,
  };
};

export default createModel;

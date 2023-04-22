import { FC, useContext } from 'react';
import { Button, Input, Modal, ModalProps, Space } from 'antd';
import GlobalContext from '@contexts/global';
import { ReactSetState } from '@interfaces';

interface EditModalProps {
  value: string;
  setValue: ReactSetState<string>;
  onOk: () => void;
}

const EditModal: FC<EditModalProps & Omit<ModalProps, 'onOk'>> = ({
  value,
  setValue,
  onOk,
  ...rest
}) => {
  const { i18n, isMobile } = useContext(GlobalContext);
  return (
    <Modal
      title={i18n.action_edit_title}
      footer={null}
      width={isMobile ? '90vw' : '50vw'}
      style={{ maxWidth: 600 }}
      {...rest}
    >
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="mt-[12px] flex items-center flex-row-reverse">
        <Space>
          <Button onClick={onOk} disabled={!value}>
            {i18n.action_ok}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default EditModal;

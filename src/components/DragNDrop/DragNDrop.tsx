import React, {FC, useState } from 'react';
import type { TransferProps } from 'antd/lib/transfer';
import {Switch, Transfer} from "../../bundles/AntD.tsx";


const DragNDrop: FC<{data: any[], onSelect: (P: any) => any }> = ({ data = [], onSelect }) => {
    const [targetKeys, setTargetKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [disabled, setDisabled] = useState(false);

    const handleChange: TransferProps['onChange'] = (newTargetKeys, direction, moveKeys) => {
        setTargetKeys(newTargetKeys);
        const d = data.filter(i => newTargetKeys.includes(i.key));
        onSelect(d);
    };

    const handleSelectChange: TransferProps['onSelectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
    ) => {
        const data = [...sourceSelectedKeys, ...targetSelectedKeys];
        setSelectedKeys(data);

    };

    const handleScroll: TransferProps['onScroll'] = (direction, e) => {
        // console.log('direction:', direction);
        // console.log('target:', e.target);
    };

    const handleDisable = (checked: boolean) => {
        setDisabled(checked);
    };

    return (
        data && data.length > 0 && <>
            <Transfer
                dataSource={data}
                listStyle={{ width: '100%', height: '300px' }}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onScroll={handleScroll}
                render={(item) => item.title}
                disabled={disabled}
                oneWay
                style={{ marginBottom: 16 }}
            />
            {/*<Switch*/}
            {/*    unCheckedChildren="disabled"*/}
            {/*    checkedChildren="disabled"*/}
            {/*    checked={disabled}*/}
            {/*    onChange={handleDisable}*/}
            {/*/>*/}
        </>
    );
};

export default DragNDrop;
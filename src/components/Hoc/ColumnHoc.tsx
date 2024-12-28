import React, {useRef} from "react";
import {Button, Input, Space, DatePicker} from "../../bundles/AntD.tsx";
import {SearchOutlined} from "../../bundles/Icons.tsx";
import dayjs from "dayjs";
import { TableColumnType } from "antd/lib/index";
import {ColumnTitle} from "antd/lib/table/interface";

export interface ExtendedTableColumnType<DataType> extends TableColumnType<DataType> {
    inputType?: 'INPUT' | 'DATE' | 'NONE';
    searchColumns?: string[]
}
const ColumnHoc = (Component: any): any => {

    const simpleSearch = (
        selectedKeys: string[],
        setSelectedKeys: any,
        searchInput: any,
        dataIndex: string,
        handleSearch: (selectedKeys: string[], confirm: () => void, dataIndex: string) => void,
        confirm: (T?: any) => void,
        clearFilters: () => void,
        handleReset: (clearFilters: () => void, confirm: () => void) => void,
        setSearchText: (T: string) => void,
        setSearchedColumn: (T: string) => void,
        close: () => void,
        label: ColumnTitle<string> = ''
    ) => {
        return <div style={{padding: 8}} onKeyDown={e => e.stopPropagation()}>

            <Input
                ref={searchInput}
                placeholder={`Search ${label}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{marginBottom: 8, display: 'block'}}
            />
            <Space>
                <Button type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size='small'
                        style={{width: 90}}>Search</Button>
                <Button onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size='small'
                        style={{width: 90}}>Reset</Button>
                {/*<Button type='link'*/}
                {/*        size='small'*/}
                {/*        onClick={() => {*/}
                {/*            confirm({closeDropdown: false});*/}
                {/*            setSearchText(selectedKeys[0]);*/}
                {/*            setSearchedColumn(dataIndex);*/}
                {/*        }}>Filter</Button>*/}
                {/*<Button type='link' size='small' onClick={() => {*/}
                {/*    close();*/}
                {/*}}>close</Button>*/}
            </Space>
        </div>
    }

    const dateSearch = (
        selectedKeys: string[],
        setSelectedKeys: any,
        searchInput: any,
        dataIndex: string,
        handleSearch: (selectedKeys: string[], confirm: () => void, dataIndex: string) => void,
        confirm: (T?: any) => void,
        clearFilters: () => void,
        handleReset: (clearFilters: () => void, confirm: () => void) => void,
        setSearchText: (T: string) => void,
        setSearchedColumn: (T: string) => void,
        close: () => void,
        label: ColumnTitle<string> = ''
    ) => {
        return <div style={{padding: 8}} onKeyDown={e => e.stopPropagation()}>

            <DatePicker
                ref={searchInput}
                mode={'date'}
                format={'DD/MM/YYYY'}
                placeholder={`Search ${label}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys([e])}
                onOk={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{marginBottom: 8, display: 'block'}}
            />
            <Space>
                <Button type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size='small'
                        style={{width: 90}}>Search</Button>
                <Button onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size='small'
                        style={{width: 90}}>Reset</Button>
                {/*<Button type='link'*/}
                {/*        size='small'*/}
                {/*        onClick={() => {*/}
                {/*            confirm({closeDropdown: false});*/}
                {/*            setSearchText(selectedKeys[0]);*/}
                {/*            setSearchedColumn(dataIndex);*/}
                {/*        }}>Filter</Button>*/}
                {/*<Button type='link' size='small' onClick={() => {*/}
                {/*    close();*/}
                {/*}}>close</Button>*/}
            </Space>
        </div>
    }

    const ColumnProps = (props: ExtendedTableColumnType<any>) => {
        const [searchText, setSearchText] = React.useState<string>('');
        const [searchedColumn, setSearchedColumn] = React.useState<string>('');
        const searchInput = useRef();

        const handleSearch = (selectedKeys: any, confirm: () => void, dataIndex: string) => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
        };

        const handleReset = (clearFilters: () => void, confirm: () => void) => {
            clearFilters();
            setSearchText('');
            setSearchedColumn('');
            confirm();
        };

        const searchProps = ({
                                 title,
                                 key,
                                 dataIndex,
                                 inputType,
                                 searchColumns = [],
                                 render = (text: any) => text,
                                 ...rest
        }: ExtendedTableColumnType<any>) => {
            const filterDropDownComponent = ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}: any) => {
                switch (inputType) {
                    case 'INPUT':
                        return simpleSearch(
                            selectedKeys,
                            setSelectedKeys,
                            searchInput,
                            dataIndex,
                            handleSearch,
                            confirm,
                            clearFilters,
                            handleReset,
                            setSearchText,
                            setSearchedColumn,
                            close,
                            title
                        );
                    case 'DATE':
                        return dateSearch(
                            selectedKeys,
                            setSelectedKeys,
                            searchInput,
                            dataIndex,
                            handleSearch,
                            confirm,
                            clearFilters,
                            handleReset,
                            setSearchText,
                            setSearchedColumn,
                            close,
                            title
                        );
                }
            }

            const onFilterComponent = (value: string, record: { [key: string]: any }) => {
                let searchParam = value;
                // let resultData = record[dataIndex];
                const getNestedData = (obj: any, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
                let resultData = getNestedData(record, dataIndex);
                if (inputType === 'DATE') {
                    searchParam = dayjs(searchParam).format('DD/MM/YYYY');
                    resultData = dayjs(record[dataIndex]).format('DD/MM/YYYY');
                }
                let isFound = resultData != null ? resultData.toString().toLowerCase().includes(searchParam.toString().toLowerCase()) : false;
                if (searchColumns.length > 0) {
                    isFound = searchColumns.some(column => {
                        let columnData = getNestedData(record, column);
                        columnData = inputType === 'DATE' ? dayjs(columnData).format('DD/MM/YYYY') : columnData;
                        return columnData != null ? columnData.toString().toLowerCase().includes(searchParam.toString().toLowerCase()) : false;
                    });
                }
                return isFound;
            }

            const filterIcon = (isFiltered: boolean) => {
                return <SearchOutlined style={{color: isFiltered ? '#1677ff' : undefined}}/>
            }
            const colProps: { [key: string]: any } = {
                onFilterDropdownOpenChange: (visible: boolean) => {
                    if (visible) {
                        const focusMethods: any = {
                            'DATE': 'focus',
                            'INPUT': 'select',
                            'SELECT': 'focus'
                        }
                        const method = focusMethods[inputType];
                        // @ts-ignore
                        setTimeout(() => searchInput.current && searchInput.current[method] && searchInput.current[method](), 100);
                    }
                },
                render: (text: string, record: { [key: string]: any }) => {
                    const nestedData = dataIndex.split('.').reduce((obj: any, key: string) => obj && obj[key], record);
                    const parts = nestedData != null ? nestedData.toString().split(new RegExp(`(${searchText})`, 'gi')) : [];
                    let res = inputType === 'DATE' && nestedData != null ? dayjs(nestedData).format('DD/MM/YYYY') : nestedData;
                    const _searchText = inputType === 'DATE' && searchText != null ? dayjs(searchText).format('DD/MM/YYYY') : searchText;
                    return render(
                        searchedColumn === dataIndex
                            ? <div>
                                {parts.map((part: string, index: number) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: part.toLowerCase() === (_searchText || '').toLowerCase() ? 'orange' : 'transparent',
                                            color: 'black'
                                        }}>{inputType === 'DATE' ? dayjs(part).format('DD/MM/YYYY'): part}</span>
                                ))}
                            </div>
                            : res, record, dataIndex
                    )
                }
            };

            if (inputType === 'INPUT' || inputType === 'DATE') {
                colProps.filterDropdown = filterDropDownComponent;
                colProps.filterIcon = filterIcon;
                colProps.onFilter = onFilterComponent;
            }
            return {...rest, ...colProps, dataIndex, key, title};
        }
        return <Component {...props} columnProps={searchProps}></Component>;
    }
    return ColumnProps;
}

export default ColumnHoc;
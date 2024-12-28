import {Button, Input, Space, Table} from "../../bundles/AntD.tsx";
import React, {useEffect, useRef, useState} from "react";
import {TableProps} from "antd/lib/table";
import {ExtendedTableColumnType} from "../Hoc/ColumnHoc.tsx";
import {GetProp, TableColumnsType} from "antd/lib/index";
import type {FilterDropdownProps, SorterResult, TablePaginationConfig} from "antd/es/table/interface";
import {InputRef} from "antd";
import {SearchOutlined} from "../../bundles/Icons.tsx";
import axios from "../../core/api.ts";
import {ComponentInfo, DataStatus} from "../Status/Status.tsx";

interface AsyncTableProps<RecordType> extends TableProps<RecordType> {
    apiUrl: string;
    columns: TableColumnsType<any>;
}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const AsyncTable = <RecordType extends object>(props: AsyncTableProps<RecordType>) => {

    const {apiUrl, columns, ...restProps} = props;
    const [dataSource, setDataSource] = useState<{ meta: {recordCount: number}, data: any[] }>({
        meta: {
            recordCount: 0
        },
        data: []
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [filters, setFilters] = useState<any>({});
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const [tableComponentInfo, setTableComponentInfo] = useState<ComponentInfo>({
        status: DataStatus.Loaded,
        callback: () => fetchData()
    });

    const fetchData = () => {
        setTableComponentInfo(prev => ({...prev, status: DataStatus.Loading}));
        axios.post(props.apiUrl).then(res => {
            setTableComponentInfo(prev => ({...prev, status: DataStatus.Loaded}));
            setDataSource({data: res.data, meta: {recordCount: 0}});
            setTableParams(prev => ({...prev, pagination: {
                ...tableParams.pagination,
                total: res['recordCount']
            }}));
        }).catch(err => {
            console.log(err);
            setTableComponentInfo(prev => ({...prev, status: DataStatus.ErrorState}));
        });
    }

    const setColumnProps = ({
                                title,
                                key,
                                dataIndex,
                                render = (text: any) => text,
                                ...rest
                            }: ExtendedTableColumnType<any>) => {

        const handleSearch = (
            selectedKeys: string[],
            confirm: FilterDropdownProps['confirm'],
            dataIndex: string,
        ) => {
            confirm();
            setSearchText(selectedKeys[0]);
            setSearchedColumn(dataIndex);
            setFilters((prevFilters: any) => ({
                ...prevFilters,
                [dataIndex]: selectedKeys[0],
            }));
        };

        const handleReset = (clearFilters: () => void) => {
            clearFilters();
            setSearchText('');
            setFilters((prevFilters: any) => {
                const newFilters = {...prevFilters};
                delete newFilters[dataIndex];
                return newFilters;
            });
        };

        const filterDropDownComponent = ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => {
            return <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({closeDropdown: false});
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        }

        const filterIcon = (isFiltered: boolean) => {
            return <SearchOutlined style={{color: isFiltered ? '#1677ff' : undefined}}/>
        }

        const onFilterComponent = (value: string, record: { [key: string]: any }) => {
            return true;
        }

        const colProps: { [key: string]: any } = {
            onFilterDropdownOpenChange: (visible: boolean) => {
                return "Blank Something";
            },
            render: (text: string, record: { [key: string]: any }) => {
                return text;
            }
        };

        colProps.filterIcon = filterIcon;
        colProps.filterDropdown = filterDropDownComponent;
        colProps.onFilter = onFilterComponent;

        return {...rest, ...colProps, dataIndex, key, title};
    }

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
    };

    useEffect(() => {
        console.log(filters);
        fetchData();
    }, [filters]);
    return <Table
        {...restProps}
        loading={tableComponentInfo.status === DataStatus.Loading}
        dataSource={dataSource.data}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        columns={columns.map(setColumnProps)}
    />
}

export default AsyncTable;
import React, {FC} from "react";
import {LoadingOutlined, ReloadOutlined, SyncOutlined} from "../../bundles/Icons.tsx";
import {Spin, Tag, Typography} from "../../bundles/AntD.tsx";
import useStyles from "../../Styles.tsx";


export enum DataStatus {
    Loading = 'Loading',
    Loaded = 'Loaded',
    ErrorState = 'ErrorState'
}

export interface ContentInfoProps {
    children: React.ReactNode;
    componentInfos: ComponentInfo[];
    isShowRetry?: boolean;
    showLoadingText?: boolean;
    showContent?: boolean;
    showNotchLoader?: boolean;
}

export interface ComponentInfo {
    status: DataStatus,
    callback?: (T: any) => void;
    callbackArgs?: any;
}

const Status: FC<ContentInfoProps> = ({
                                          children,
                                          componentInfos = [],
                                          showLoadingText = false,
                                          isShowRetry = false,
                                          showContent = false,
                                          showNotchLoader = false,
                                      }) => {

    const globalStyles = useStyles();
    const isLoading = componentInfos.some(info => info.status === DataStatus.Loading);
    const hasError = componentInfos.some(info => info.status === DataStatus.ErrorState);
    const isLoaded = componentInfos.every(info => info.status === DataStatus.Loaded);

    const reFetchAll = () => {
        componentInfos.forEach(item => {
            if (item.callback != null) {
                item.callback(item.callbackArgs);
            }
        });
    }

    return <>
        {
            showNotchLoader && isLoading && <div className={'notch-loader'}><Tag icon={<SyncOutlined size={20} spin={true}/>}
                                                                    color="processing">processing</Tag></div>
        }
        {
            isLoading
            &&
            <div className="imgloader"
                 style={{position: 'absolute', top: '50%', left: '50%', zIndex: 9999, textAlign: 'center'}}>
                <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                {showLoadingText && <Typography.Text
                    style={{marginTop: '10px', fontWeight: "bolder", display: 'block'}}>Loading...</Typography.Text>}
            </div>
        }
        {
            hasError && isShowRetry &&
            <Typography.Text type={'danger'}
                             strong
                             className={`${globalStyles.cursorPointer} has-error`}
                             style={{textAlign: 'center'}}
                             onClick={() => reFetchAll()}>
                Retry <ReloadOutlined/>
            </Typography.Text>
        }
        {
            isLoaded && children
        }
        {
            hasError && showContent && children
        }
        {
            !isShowRetry && showContent
            && isLoading
            && <span
                className={isLoading ? globalStyles.bgTransparent : ''}>{children}</span>
        }
        {
            !isShowRetry
            && !showContent
            && hasError
            && <Typography.Text type={'danger'} strong>Error !! Please contact customer service..</Typography.Text>
        }
    </>
}

export default Status;
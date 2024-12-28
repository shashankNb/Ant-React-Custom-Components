import React, {FC} from "react";
import {Card, Col, Row, Space, Flex} from "../../bundles/AntD.tsx";
import useStyles from "../../Styles.tsx";
import {CardProps} from "antd";


export interface IContentLayoutProps {
    contentTitle?: any;
    children: React.ReactNode;
    classes?: { [key: string]: string };
    rightContentRef?: any;
    cardStyles?: {
        body?: React.CSSProperties;
    }
}

const ContentLayout: FC<IContentLayoutProps> = ({contentTitle = null, children, rightContentRef = [], cardStyles }) => {

    const globalStyles = useStyles();
    const titleExpand = () => {
        return (
            (contentTitle != null || rightContentRef.length > 0) && <Row gutter={16} justify="space-between" align={'stretch'}>
                {contentTitle &&
                    <Col span={12}>
                        <span>{contentTitle}</span>
                    </Col>}
                {
                    rightContentRef.length > 0 &&
                    <Col span={12}>
                        <Flex justify={'end'}>
                            <Space>
                                {rightContentRef.map((item: any, index: number) => <span key={index}>{item}</span>)}
                            </Space>
                        </Flex>
                    </Col>
                }
            </Row>
        )
    }

    return (
        <>
            <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
                <Col className="gutter-row" span={24}>
                    <Card title={titleExpand()} styles={cardStyles} className={globalStyles.h130}>
                        {children}
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ContentLayout;
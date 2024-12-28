import {useForm} from "antd/lib/form/Form";
import {FC, forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Col, Form, Input, Row, Select} from "../../bundles/AntD.tsx";
import FileUploader from "../Uploader/FileUploader.tsx";
import TinyMCE from "../Editor/TinyMCE.tsx";
import {ComponentInfo, DataStatus} from "../Status/Status.tsx";
import {AppAPI, AppUrlConstants} from "../../AppUtil.ts";

type ComposeEmailState = {
    templateList: any[],
    attachments: any[]
}
const Mail: FC<any> = forwardRef(({templateRef, state}, ref) => {

    const [mailForm] = useForm();
    const editorRef = useRef(null);
    const [attachments, setAttachments] = useState<any[]>([]);

    useImperativeHandle(ref, () => ({
        getMailValues: () => {
            const message = editorRef.current.getContent();
            let values = mailForm.getFieldsValue();
            values = {...values, message: message, attachments: attachments};
            return values;
        }
    }), []);

    const [componentState, setComponentState] = useState<ComposeEmailState>({
        templateList: [],
        attachments: []
    });

    const [templateComponentInfo, setTemplateComponentInfo] = useState<ComponentInfo>({
        status: DataStatus.Loaded,
        callback: () => fetchEmailTemplates()
    });


    const onSendBtnClick = (values: { [key: string]: any }) => {
        console.log(values);
    }

    const fetchEmailTemplates = () => {
        setTemplateComponentInfo(prev => ({...prev, status: DataStatus.Loading}));
        AppAPI.makeRequest(AppUrlConstants.FETCH, {
            context: 'email_templates',
            fields: ['*'],
            condition: {deleted_at: null}
        }).then((res: any) => {
            setComponentState(prev => ({...prev, templateList: res}));
            setTemplateComponentInfo(prev => ({...prev, status: DataStatus.Loaded}));
        }).catch(err => {
            console.log(err);
            setTemplateComponentInfo(prev => ({...prev, status: DataStatus.ErrorState}));
        });
    }


    useEffect(() => {
        fetchEmailTemplates();
    }, [state.current_user]);

    return (
        <Form name="compose-email-form" form={mailForm} layout={'vertical'} onFinish={onSendBtnClick}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                    <Form.Item name="template_id" label={'Select Email Template'}>
                        <Select optionFilterProp={'label'}
                                placeholder={'-- SELECT TEMPLATE --'}
                                allowClear={true}
                                showSearch={true}
                                onChange={(val, options) => {
                                    editorRef.current.setContent(val);
                                    mailForm.setFieldValue("subject", options.subject);
                                }}
                                options={componentState.templateList.map(item => ({
                                    ...item,
                                    label: item.template_name,
                                    value: item.message
                                }))}></Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name="subject" label={'Subject'} rules={[{required: true, message: 'Subject is required'}]}>
                <Input placeholder={'Enter Subject'}/>
            </Form.Item>
            <Form.Item>
                <FileUploader uploaderType={'ATTACHMENTS'}
                              state={state}
                              onDelete={(file) => {
                                  setAttachments(prev => {
                                      return prev.filter(item => item.uid !== file.uid);
                                  });
                              }}
                              onUploadSuccess={(file) => {
                                  setAttachments(prev => {
                                      prev.push(file);
                                      return prev;
                                  });
                              }}></FileUploader>
            </Form.Item>
            <Form.Item name="message" label={'Message'}>
                <TinyMCE editorRef={editorRef}></TinyMCE>
            </Form.Item>
        </Form>
    )
});

export default Mail;
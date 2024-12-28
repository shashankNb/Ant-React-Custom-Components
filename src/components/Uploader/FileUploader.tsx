import {CloseOutlined, DeleteOutlined, InboxOutlined, LoadingOutlined, PlusOutlined} from "../../bundles/Icons.tsx";
import {Button, Image, message, Modal, Upload} from "../../bundles/AntD.tsx";
import {FC, forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import dayjs from "dayjs";
import {UploadFile} from "antd";
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import {UploadOutlined} from "@ant-design/icons";

const {Dragger} = Upload;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback({url: reader.result, type: img.type}));
    reader.readAsDataURL(img);
};

export type ACL = 'private' | 'public-read' | 'public-read-write';

export interface FileUploaderProps {
    state: {[key: string]: any},
    uploadPath?: string;
    fetchFileList?: () => any;
    onUploadSuccess?: (T: any) => any;
    onDelete?: (T: UploadFile) => any;
    thumbType?: 'picture' | 'text' | 'picture-card' | 'picture-circle';
    uploaderType?: 'DRAGDROP' | 'AVATAR' | 'NORMAL' | 'ATTACHMENTS';
    allowRemove?: boolean;
    acl?: ACL,
    onChange?: (val: any) => any;
    disabled?: boolean;
    previewOnly?: boolean;
}

/**
 *
 * @param uploadPath Give the name of the folder where you want to save into your bucket every directory automatically get created if not exists
 * @param fetchFileList Must be an array of UploadFile[] which is coming from ant Component itself
 * @param dragNDrop
 * @param onUploadSuccess Do something once each of your single file gets uploaded. It will receive the file argument which you can modify and do anything with a url
 * @param onDelete Deletes from your bucket and then receives a file param which you can use to delete it from your database from parent component
 * @constructor
 */
const FileUploader: FC<FileUploaderProps> = forwardRef(({
                                                 state,
                                                 uploadPath = '',
                                                 fetchFileList = async () => {
                                                 },
                                                 uploaderType = 'DRAGDROP',
                                                 thumbType = 'picture-circle',
                                                 onUploadSuccess = () => {
                                                 },
                                                 onDelete = async () => {
                                                 },
                                                 allowRemove = true,
                                                 acl = 'private',
                                                 onChange,
                                                 disabled = false,
                                                 previewOnly = false
                                             }, ref) => {

    const [componentState, setComponentState] = useState<{ loading: boolean }>({loading: false});
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState(null);
    const s3ClientRef = useRef<S3Client | null>(null);
    const breakPoint = useBreakpoint();

    useImperativeHandle(ref, () => ({
        clearFileList: () => setFileList([])
    }), []);

    const onFileUpload = async ({file, onSuccess}: any) => {
        const toast = message.loading("Uploading file. Please wait..", 0);
        const filename = `${dayjs(new Date()).format('YYYYMMDDHHmmss')}_${file.name}`;
        try {
            let newFile: UploadFile = {
                name: filename,
                status: 'uploading',
                uid: filename
            }
            setComponentState(prev => ({...prev, loading: true}));
            if (uploaderType === 'DRAGDROP') {
                setFileList(prev => [...prev, newFile]);
            } else if (uploaderType === 'AVATAR' || uploaderType === 'ATTACHMENTS') {
                setFileList([]);
            }
            if (uploaderType !== 'ATTACHMENTS') {
                const params = new PutObjectCommand({
                    Bucket: state.settings.aws_bucket_name,
                    Key: `${uploadPath}${filename}`,
                    Body: file,
                    ACL: acl
                });
                await s3ClientRef.current.send(params);
            }
            getBase64(file, (result: {url: string, type: string}) => {
                newFile = {...newFile, thumbUrl: result.url, url: result.url, status: 'done', type: result.type};
                setFileList(prev => {
                    const files = prev.filter(item => item.name !== filename);
                    const newFiles = [...files, newFile];
                    if (onChange) {
                        onChange(newFiles);
                    }
                    return newFiles;
                });
                onSuccess(newFile);
                onUploadSuccess(newFile);
                setComponentState(prev => ({...prev, loading: false}));
                message.success(`${newFile.name} file uploaded successfully.`);
            });

        } catch (e) {
            console.log(e);
            const list = fileList.filter(i => i.fileName !== filename);
            const uploadFile: UploadFile = {uid: filename, status: 'error', percent: 100, name: filename};
            setFileList([...list, uploadFile]);
            message.error("Upload Failed");
        } finally {
            toast();
        }
    }

    const onFileRemove = (file: UploadFile) => {
        Modal.confirm({
            title: 'Delete ?',
            content: `Are you sure you want to delete the file named ${file.name}?`,
            okText: 'Delete',
            onOk: () => {
                const toast = message.loading("Deleting file.. Please wait.", 0);
                onDelete(file).then(() => {
                    // fetchFileList().then(res => {
                    //     if (uploaderType === 'AVATAR') {
                    //         setFileList([])
                    //     } else {
                    //         setFileList([...res])
                    //     }
                    // });
                    const fList = fileList.filter(item => item.uid !== file.uid);
                    setFileList(fList);
                    onChange(fList);
                    message.success("File as been removed");
                }).catch(err => {
                    console.log(err);
                    message.error("Failed to remove the file. Please try again..");
                }).finally(() => toast());
            },
            okButtonProps: {loading: componentState.loading},
            footer: (_, {OkBtn, CancelBtn}) => {
                return <>
                    <OkBtn/>
                    <CancelBtn/>
                </>
            }

        })
    }

    const onFilePreview = async (file: UploadFile) => {
        const key = `${uploadPath}${file.name}`;
        if (file.thumbUrl == null) {
            const toast = message.loading("Opening file preview. Please wait..", 0);
            try {
                const url = await getSignedUrl(
                    s3ClientRef.current,
                    new GetObjectCommand({
                        Bucket: state.settings.aws_bucket_name,
                        Key: key
                    }),
                    {expiresIn: 3600} // URL expires in 1 hour
                );
                file.url = url;
                file.thumbUrl = url;
            } catch (err) {
                console.log(err);
                message.error("Cannot preview the file. Please try again...");
            } finally {
                toast();
            }

            // const command = new GetObjectCommand({
            //     Bucket: state.settings.aws_bucket_name,
            //     Key: key
            // });
            //
            // const data: any = await s3ClientRef.current.send(command);
            // file.type = data.ContentType;
            const lastDotIndex = file.name.lastIndexOf('.');
            const extension = file.name.slice(lastDotIndex + 1).toLowerCase();
            if (extension === 'pdf') {
                file.type = 'application/pdf';
            } else if (extension === 'png' || extension === 'jpeg' || extension === 'jpg') {
                file.type = `image/${extension}`;
            }
        }

        if (file.type === 'application/pdf') {
            if (breakPoint.lg || breakPoint.xl) {
                Modal.confirm({
                    width: '90%',
                    closeIcon: <CloseOutlined/>,
                    icon: null,
                    style: {height: '90%', padding: 0, top: 10},
                    styles: {body: {padding: 0}, content: {padding: 0, margin: 0}},
                    maskClosable: true,
                    footer: null,
                    content: <iframe width={'100%'}
                                     style={{height: '90vh'}}
                                     src={file.thumbUrl}/>
                });
            } else {
                window.open(file.thumbUrl, '_blank');
            }
        } else if (file.type.startsWith('image/')) {
            setPreviewImage(file.url);
        } else {
            window.open(file.thumbUrl, '_blank');
        }
    }

    const onAttachmentUpload = async ({file, onSuccess}: any) => {
        getBase64(file, (res: { url: string, type: string }) => {
            const newFile = {...file};
            newFile.url = res.url;
            newFile.filename = file.name;
            newFile.thumbUrl = res.url;
            newFile.type = res.type;
            onUploadSuccess(newFile);
            onSuccess(newFile);
        });
    }

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            {componentState.loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>Upload</div>
        </button>
    );

    const restoreFileList = (pref) => {
        if (fetchFileList) {
            fetchFileList().then(res => {
                if (res != null) {
                    if (uploaderType === 'AVATAR') {
                        res.forEach(async item => {
                            if (item.name != null) {
                                const url = await getSignedUrl(
                                    s3ClientRef.current,
                                    new GetObjectCommand({
                                        Bucket: pref.aws_bucket_name,
                                        Key: `${uploadPath}${item.name}`
                                    }),
                                    {expiresIn: 3600} // URL expires in 1 hour
                                );
                                item.url = url;
                                item.thumbUrl = url;
                            }
                        })
                    } else {
                        res = res.map((item: any, index: number) => ({
                            ...item,
                            key: index,
                            type: 'application/pdf',
                            url: '#'
                        }));
                    }
                    setFileList([...res]);
                }
            });
        }
    }

    useEffect(() => {
        s3ClientRef.current = new S3Client({
            region: state.settings.aws_default_region,
            credentials: {
                accessKeyId: state.settings.aws_access_key_id,
                secretAccessKey: state.settings.aws_access_key_secret
            },
        });
        restoreFileList(state.settings);
    }, [state.current_user]);

    return (
        <>
            {
                uploaderType === 'DRAGDROP' && <Dragger multiple={true}
                                                        accept='.pdf, .jpg, .jpeg, .png'
                                                        customRequest={onFileUpload}
                                                        onRemove={onFileRemove}
                                                        disabled={disabled}
                                                        fileList={fileList}
                                                        maxCount={5}
                                                        onPreview={onFilePreview}
                                                        listType={'picture'}>
                    <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
            }
            {
                uploaderType === 'AVATAR' && <>
                    <Upload
                        name="avatar"
                        listType={thumbType}
                        className="avatar-uploader"
                        showUploadList={{showPreviewIcon: true, showRemoveIcon: !previewOnly}}
                        fileList={fileList}
                        disabled={disabled}
                        onPreview={(file) => setPreviewImage(file.thumbUrl)}
                        onRemove={allowRemove ? onFileRemove : null}
                        customRequest={onFileUpload}>
                        {(componentState.loading || fileList.length === 0) && uploadButton}
                    </Upload>
                </>
            }
            {
                uploaderType === 'ATTACHMENTS' && <>
                    <Upload customRequest={onAttachmentUpload}
                            onPreview={onFilePreview}
                            disabled={disabled}
                            showUploadList={{
                                showRemoveIcon: true,
                                removeIcon: <DeleteOutlined/>,
                            }}
                            onRemove={(file) => onDelete(file)}>
                        <Button icon={<UploadOutlined/>}>Upload Attachments</Button>
                    </Upload>
                </>
            }
            {previewImage && <Image wrapperStyle={{display: 'none'}} preview={{
                visible: previewImage,
                onVisibleChange: (visible) => setPreviewImage(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(null),
            }} src={previewImage}/>}
        </>
    )
});

export default FileUploader;
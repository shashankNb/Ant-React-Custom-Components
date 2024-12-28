import { Editor } from '@tinymce/tinymce-react';

export default function TinyMCE({ editorRef, initialContent = null, height = 300 }: any) {
    return (
        <>
            <Editor
                apiKey='2733wbvcgftzoungwwe2kdgjt0itn0hnmehsua6aauevz07r'
                onInit={(_evt, editor) => editorRef.current = editor}
                initialValue={initialContent}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            {/*<button onClick={log}>Log editor content</button>*/}
        </>
    );
}
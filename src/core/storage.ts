import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export const Storage = {
    get: async (fileId: string, state: any) => {
        const s3Client = new S3Client({
            region: state.settings.aws_default_region,
            credentials: {
                accessKeyId: state.settings.aws_access_key_id,
                secretAccessKey: state.settings.aws_access_key_secret
            },
        });
        const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: state.settings.aws_bucket_name,
                Key: fileId
            }),
            {expiresIn: 3600} // URL expires in 1 hour
        );
        return url;
    }
}
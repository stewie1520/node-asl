import S3 from "aws-sdk/clients/s3";

const s3Options = {
  region: process.env.S3_REGION,
  sslEnabled: true,
  s3ForcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
};

export class S3Service {
  private static readonly s3 = new S3({
    region: s3Options.region,
    sslEnabled: s3Options.sslEnabled,
    s3ForcePathStyle: s3Options.s3ForcePathStyle,
    endpoint: s3Options.endpoint,
    signatureVersion: "v4",
    credentials: {
      accessKeyId: s3Options.accessKeyId,
      secretAccessKey: s3Options.secretAccessKey,
    },
  });

  public static async assertKeyExist(
    key: string,
    bucketName: string = process.env.S3_BUCKET_NAME,
  ) {
    await this.s3
      .headObject({
        Key: key,
        Bucket: bucketName,
      })
      .promise();
  }

  public static async getLocation(
    key: string,
    {
      region = process.env.S3_REGION,
      bucket = process.env.S3_BUCKET_NAME,
    }: {
      region?: string;
      bucket?: string;
    } = {
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET_NAME,
    },
  ) {
    key = String(key).replace(/^(\/|\\)/, "");
    return `http://s3.${region}.amazonaws.com/${bucket}/${key}`;
  }

  public static getBucketAndKey(srcUrl: string) {
    try {
      const { host, pathname } = new URL(srcUrl);

      if (!/^s3.([a-z0-9-]){1,}.amazonaws.com$/.test(host)) {
        return {
          Bucket: host.split(".")[0],
          Key: pathname.slice(1),
        };
      }

      const [, Bucket, ...keys] = pathname.split("/");
      return {
        Bucket,
        Key: keys.join("/"),
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}

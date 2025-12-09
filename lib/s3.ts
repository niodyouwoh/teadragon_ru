import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "ru-1",
  endpoint: "https://s3.twcstorage.ru",
  credentials: {
    accessKeyId: "COIYK2SG8X3MH8K3MYA",
    secretAccessKey: "OUFPnIud8H1Gk7nwLxZD4hjDjP0bBuIWq1RgV4fGSw",
  },
})

const BUCKET_NAME = "d0bb84a6-35788b9e-6ba9-47ec-a1a8-68e9ea3ac4e9"
const FOLDER_NAME = "teadragonimages"

export async function uploadImage(file: File, fileName: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const key = `${FOLDER_NAME}/${fileName}`

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  )

  return `https://s3.twcstorage.ru/${BUCKET_NAME}/${key}`
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const key = imageUrl.split(`${BUCKET_NAME}/`)[1]
  if (!key) return

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  )
}

export async function listImages(): Promise<string[]> {
  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: FOLDER_NAME,
    })
  )

  return (
    response.Contents?.map((item) => `https://s3.twcstorage.ru/${BUCKET_NAME}/${item.Key}`) || []
  )
}

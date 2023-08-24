import { toast } from 'react-toastify'
import { $api } from '../lib/api'

export async function uploadAccountsToIpfs (file) {
  const bucketUuid = process.env.REACT_APP_BUCKET_UUID
  const data = {
    files: [
      { fileName: file.name }
    ]
  }
  try {
    const uploadSession = await $api.post(`/storage/${bucketUuid}/upload`, data)
    const uploadUrl = uploadSession.data.files[0]

    // Upload to S3
    await fetch(uploadUrl.url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: file
    })

    // End session
    await $api.post(`/storage/${bucketUuid}/upload/${uploadSession.data.sessionUuid}/end`)

    // Start pooling file
    const uploadedFile = await getFile(uploadUrl.fileUuid)

    return `https://ipfs-dev.apillon.io/ipfs/${uploadedFile.file.CID}`
  } catch (error) {
    toast('Error during file upload, please try again later.', { type: 'error' })
  }
  return null
}

async function getFile (fileUuid) {
  return new Promise(function (resolve) {
    const getFileInterval = setInterval(async () => {
      const fileData = await getFilePoll(fileUuid)

      if (fileData && fileData?.file?.CID) {
        clearInterval(getFileInterval)
        resolve(fileData)
      }
    }, 5000)
  })
}

async function getFilePoll (fileUuid) {
  const bucketUuid = process.env.REACT_APP_BUCKET_UUID
  const response = await $api.get(`/storage/${bucketUuid}/file/${fileUuid}/detail`)
  return response.data
}

export function getUploadFieldError(formData: FormData, fieldName: string, label = 'Image') {
  if (formData.get(`${fieldName}_uploading`) === 'true') {
    return `${label} is still uploading. Please wait until the upload finishes.`
  }

  const uploadError = String(formData.get(`${fieldName}_upload_error`) ?? '').trim()

  if (uploadError) {
    return `${label} upload failed: ${uploadError}`
  }

  return null
}

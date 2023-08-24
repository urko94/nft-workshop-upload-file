import React, { useRef } from 'react'
import { uploadAccountsToIpfs } from '../lib/upload'

export const FileUploader = () => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null)

  const handleFile = (file) => {
    console.log(file)
    uploadAccountsToIpfs(file)
  }

  // Programmatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event) => {
    hiddenFileInput.current.click()
  }
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0]
    handleFile(fileUploaded)
  }

  return (
    <div style={{ position: 'absolute', left: '1rem', top: '10px' }}>
      <button className="button-upload" onClick={handleClick}>
        Upload a file
      </button>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: 'none' }} // Make the file input element invisible
      />
    </div>
  )
}

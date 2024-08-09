"use client";

// pages/index.js
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      const file = acceptedFiles[0];

      // TODO: Implement file hashing
      // TODO: Implement blockchain attestation
      // TODO: Implement database entry creation

      // Simulating upload process
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus(`Notarized successfully. UID: sample-uid-123`);
      }, 2000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className='  py-1 flex flex-col justify-center sm:py-8'>
      <div className='relative py-1 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-2 bg-black shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            <div>
              <h1 className='text-2xl font-semibold text-center'>
                ChainProof: Secure Document Notarization
              </h1>
            </div>
            <div className='divide-y divide-gray-200'>
              <div className='py-4 text-base leading-6 space-y-2 text-gray-200 sm:text-lg sm:leading-7'>
                <div
                  {...getRootProps()}
                  className='border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                >
                  <input {...getInputProps()} />
                  <p className='text-center text-sm'>
                    {isDragActive
                      ? "Drop the file here ..."
                      : "Drag 'n' drop a file here, or click to select a file"}
                  </p>
                </div>
                <p className='text-xs font-bold'>
                  Hashing done locally. Your file is not uploaded or stored
                  anywhere.
                </p>
                {isUploading && (
                  <div className='text-center'>
                    <p>Notarizing...</p>
                    <div className='mt-2 w-full bg-gray-200 rounded-full h-2.5'>
                      <div className='bg-green-600 h-2.5 rounded-full w-1/2 animate-pulse'></div>
                    </div>
                  </div>
                )}
                {uploadStatus && (
                  <p className='mt-2 text-sm text-green-600'>{uploadStatus}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

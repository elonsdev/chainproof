"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  ThirdwebProvider,
  ConnectButton,
  useActiveAccount,
  TransactionButton,
} from "thirdweb/react";

import { getContract } from "thirdweb";

import { thirdwebclient } from "@/utils/thirdweb/client";

import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";

const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Sepolia testnet
const schemaUID =
  "0x4a510ad3363fb6ed8c4c3eb0d1224c17b0acda7802611aa578a8dc3e92c6e13a"; // Replace with your actual schema UID

function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [fileHash, setFileHash] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const address = useActiveAccount();

  const hashFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return "0x" + hashHex;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setIsUploading(true);
      try {
        const hash = await hashFile(file);
        setFileHash(hash);
        setFileName(file.name);
      } catch (error: any) {
        console.error("Error processing file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://chainproof.elons.dev/proof/${uploadStatus}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Remove "Copied!" message after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy address:", err);
        // Handle copy failure, e.g., display an error message
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const attestOnBlockchain = async () => {
    if (!address || !fileHash) {
      throw new Error("Please connect your wallet and upload a file first");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder(
      "bytes32 contentHash,string createdAt,string fileName,string Name"
    );

    const encodedData = schemaEncoder.encodeData([
      { name: "contentHash", value: fileHash, type: "bytes32" },
      { name: "createdAt", value: new Date().toISOString(), type: "string" },
      { name: "fileName", value: fileName, type: "string" },
      { name: "Name", value: name, type: "string" },
    ]);

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: BigInt(0),
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();
    setUploadStatus(`${newAttestationUID}`);
    return newAttestationUID;
  };

  return (
    <div className=' flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-black shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            <div>
              <h1 className='text-4xl font-light text-center mb-5'>
                ChainProof: Secure Document Notarization
              </h1>
              <div className='flex justify-center mb-5'>
                <ConnectButton client={thirdwebclient} />
              </div>
            </div>
            <div className='divide-y divide-gray-200'>
              <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                {address ? (
                  <>
                    {!fileHash && (
                      <>
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
                      </>
                    )}

                    {fileHash && (
                      <>
                        <div className=''>
                          <p className='text-gray-500'>Name</p>
                          <input
                            type='text'
                            onChange={(value) => {
                              setName(value.target.value);
                            }}
                            className='p-3 text-sm rounded bg-gray-800 text-white'
                            placeholder={fileName}
                          />
                        </div>
                        <div className=''>
                          <p className='text-gray-500'>File Name</p>
                          <p className='text-gray-300 text-sm'>{fileName}</p>
                        </div>

                        <div className=''>
                          <p className='text-gray-500'>Hash</p>
                          <p className='text-gray-300 text-sm'>
                            {fileHash?.slice(0, 20)}...
                            {fileHash?.slice(-20)}
                          </p>
                        </div>
                        <div className=''>
                          <p className='text-gray-500'>Created</p>
                          <p className='text-gray-300 text-sm'>
                            {new Date().toISOString()}
                          </p>
                        </div>
                        <div className=''>
                          <p className='text-gray-500'>Address</p>
                          <p className='text-gray-300 text-sm'>
                            {address.address}
                          </p>
                        </div>
                      </>
                    )}

                    {fileHash && (
                      <div className='relative'>
                        {!uploadStatus && (
                          <>
                            {" "}
                            <button
                              className='bg-white rounded p-3  font-semibold'
                              onClick={attestOnBlockchain}
                            >
                              Notarize File
                            </button>
                          </>
                        )}

                        <div className='text-white absolute -top-10 -right-10'>
                          <Image
                            alt='Chain Proof Stamp'
                            width={100}
                            height={100}
                            src={"/chainproofstamp1.png"}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className='text-center'>
                    Please connect your wallet to upload and attest documents.
                  </p>
                )}

                {uploadStatus && (
                  <>
                    <div>
                      <p className='text-gray-500'>File Notarized Onchain:</p>
                      <Link
                        className='text-green-300 text-sm'
                        href={`./proof/${uploadStatus}`}
                        target='_blank'
                      >
                        {uploadStatus?.slice(0, 20)}...
                        {uploadStatus?.slice(-20)}
                      </Link>
                      <div>
                        {copied ? (
                          <button className=' bg-white font-semibold rounded text-sm p-3 mt-2'>
                            copied
                          </button>
                        ) : (
                          <button
                            onClick={handleCopy}
                            className=' bg-white font-semibold rounded text-sm p-3 mt-2'
                          >
                            copy link
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {isUploading && (
                  <div className='text-center'>
                    <p>Uploading and hashing...</p>
                    <div className='mt-2 w-full bg-gray-200 rounded-full h-2.5'>
                      <div className='bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse'></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThirdwebProvider>
      <Home />
    </ThirdwebProvider>
  );
}

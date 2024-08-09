"use client";

import { EAS, Attestation } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import Image from "next/image";
import { useState, useEffect } from "react";
import { bytesToString, hexToString } from "thirdweb";

const EASContractAddress = "0x4200000000000000000000000000000000000021"; // Sepolia testnet

export default function AttestationDetails({
  params,
}: {
  params: { uid: string };
}) {
  const [attestation, setAttestation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttestation() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const eas = new EAS(EASContractAddress);
        eas.connect(signer);

        const attest = await eas.getAttestation(params.uid);
        console.log(attest);
        setAttestation(attest);
      } catch (error) {
        console.error("Error fetching attestation:", error);
        setError("Failed to fetch attestation");
      } finally {
        setLoading(false);
      }
    }

    fetchAttestation();
  }, [params.uid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!attestation) {
    return <div>No attestation found for UID: {params.uid}</div>;
  }

  return (
    <div className='flex-1 flex flex-col gap-20 max-w-4xl px-3'>
      <main className='flex-1 flex flex-col gap-6'>
        <div className=' flex flex-col justify-center sm:py-2'>
          <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
            <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
            <div className='relative px-4 py-4 bg-black shadow-lg sm:rounded-3xl sm:p-20'>
              <div>
                <h1 className='text-4xl font-light text-center mb-5'>
                  ChainProof: Notarized Proof Certificate
                </h1>
              </div>
              <div className='divide-y divide-gray-200'>
                <div className='py-8 text-base leading-6 space-y-4 text-gray-500 sm:text-lg sm:leading-7'>
                  <>
                    <div className=''>
                      <p className='text-gray-500'>File Name</p>
                      <p className='text-gray-300 text-sm'>
                        {hexToString(attestation[9].slice(192))}
                      </p>
                    </div>

                    <div className=''>
                      <p className='text-gray-500'>Hash</p>
                      <p className=' text-gray-300 text-sm break-words'>
                        {attestation[9].slice(0, 66)}
                      </p>
                    </div>
                    <div className=''>
                      <p className='text-gray-500'>Created</p>
                      <p className='text-gray-300 text-sm'>
                        {attestation[2].toString()}
                      </p>
                    </div>
                    <div className=''>
                      <p className='text-gray-500'>Signer</p>
                      <p className='text-gray-300 text-sm'>{attestation[7]}</p>
                    </div>
                  </>

                  <h1>The above file hash has been notarized Onchain.</h1>
                  <Image
                    alt='Chain Proof Logo'
                    width={75}
                    height={75}
                    src={"/chainprooflogo.png"}
                  />
                </div>
              </div>
              <div className='text-white absolute bottom-10 -right-10'>
                <Image
                  alt='Chain Proof Stamp'
                  width={100}
                  height={100}
                  src={"/chainproofstamp1.png"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

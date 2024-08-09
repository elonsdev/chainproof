"use client";

import { EAS, Attestation } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { bytesToString } from "thirdweb";

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
    <div>
      <h1>Attestation Details</h1>
      <p>UID: {attestation[0]}</p>
      <p>{attestation[8].toString()}</p>
    </div>
  );
}

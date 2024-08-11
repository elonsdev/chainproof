import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  smalltext: {
    fontSize: 8,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
});

interface CertificatePDFProps {
  fileName: string;
  fileHash: string;
  created: string;
  signer: string;
  url: string;
}

const CertificatePDF: React.FC<CertificatePDFProps> = ({
  fileName,
  fileHash,
  created,
  signer,
  url,
}) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.section}>
        <Image style={styles.image} src='/chainprooflogoblack.png' />
        <Text style={styles.title}>
          ChainProof: Notarized Proof Certificate
        </Text>
        <Text style={styles.text}>File Name: {fileName}</Text>
        <Text style={styles.text}>Hash: {fileHash}</Text>
        <Text style={styles.text}>Created: {created}</Text>
        <Text style={styles.text}>Signer: {signer}</Text>
        <Text style={styles.text}>
          The above file hash has been notarized Onchain using ChainProof.
        </Text>
        <Link src={url} style={styles.smalltext}>
          {url}
        </Link>
        <Image style={styles.image} src='/chainproofstampblack.png' />
      </View>
    </Page>
  </Document>
);

export default CertificatePDF;

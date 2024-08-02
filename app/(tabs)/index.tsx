import { Image, StyleSheet, Platform, Button } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import Arweave from "arweave";
import { useEffect, useState } from "react";
import Transaction from "arweave/node/lib/transaction";

const JWK = {
  // Copy your JWK here
  kty: "RSA",
  e: "AQAB",
  n: "",
  d: "",
  p: "",
  q: "",
  dp: "",
  dq: "",
  qi: "",
};

export default function HomeScreen() {
  const [arweave, setArweave] = useState<Arweave>();
  const [tx, setTx] = useState<Transaction>();
  const [txId, setTxId] = useState("");

  useEffect(() => {
    const ar = Arweave.init({});
    setArweave(ar);
  }, []);

  const createTx = async () => {
    if (!arweave) {
      window.alert("Arweave is not initialized yet");
      return;
    }
    window.alert("Creating Arweave Tx");
    let tempTx;
    try {
      tempTx = await arweave.createTransaction({ data: "Hello World!" }, JWK);
    } catch (err) {
      window.alert(`Couldn't create Tx: ${err}`);
    }
    if (!tempTx) window.alert("Tx is empty!");
    setTx(tempTx);
  };

  const sign = async () => {
    if (!tx) {
      window.alert("No Tx created yet");
      return;
    } else {
      window.alert("Signing tx");
      let tempTx = tx;
      await arweave?.transactions.sign(tempTx, JWK);
      setTx(tempTx);
      setTxId(tempTx.id);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Try Arweave</ThemedText>
        <ThemedText>
          When you're ready, press{" "}
          <Button title="Create Tx" disabled={!arweave} onPress={createTx} />{" "}
          and then press <Button title="Sign" disabled={!tx} onPress={sign} />{" "}
          to sign the Tx with Arweave.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Info</ThemedText>
        <ThemedText>Arweave: {arweave ? "" : "Not "} Initialized</ThemedText>
        <ThemedText>Tx Id: {tx?.id}</ThemedText>
        <ThemedText>Tx Data: {tx?.data}</ThemedText>
        <ThemedText>Tx Sig: {tx?.signature}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

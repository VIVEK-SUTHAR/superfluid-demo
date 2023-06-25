import ConnectWalletButton from "../components/ConnectWalletButton";
import CreateFlow from "../components/CreateFlow";
import MyStreams from "../components/MyStreams";
import useAppState from "../store/appStore";

export default function Home() {
  const { isConnected } = useAppState();
  return (
    <section className="flex  flex-col items-center justify-center">
      <ConnectWalletButton />
      {isConnected && (
        <>
          <CreateFlow />
          <MyStreams />
        </>
      )}
    </section>
  );
}

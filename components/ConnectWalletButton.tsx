import React from "react";
import useAppState from "../store/appStore";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ConnectWalletButton = () => {
  const { currentAddress, isConnected, setCurrentAddress, setIsConnected } =
    useAppState();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get an ethereum wallet");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    connectWallet();
  }, []);

  return !isConnected ? (
    <button
      type="button"
      className="py-2.5 px-5 mr-2 my-16 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  ) : (
    <div className="my-16 flex justify-center items-center gap-4">
      Connected Wallet:
      {`${currentAddress.substring(0, 6)}...${currentAddress.substring(37)}`}
      <button
        type="button"
          className="py-2.5 mr-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={(e) => {
            e.preventDefault();
            setCurrentAddress(null);
            setIsConnected(false)
          }}
      >
        Disconnect
      </button>
    </div>
  );
};

export default ConnectWalletButton;

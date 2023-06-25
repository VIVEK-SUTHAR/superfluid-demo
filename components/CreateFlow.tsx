import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useAppState from "../store/appStore";

function CreateFlow() {
  const { currentAddress } = useAppState();
  const router = useRouter();

  const [recieptAddress, setRecieptAddress] = useState<string>("");
  const [flowRate, setFlowRate] = useState<string>("");
  const [streamToken, setStreamToken] = useState<string>("fDAIx");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const selectToken = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setStreamToken(e.target.value);
  };

  async function createNewFlow() {
    try {
      setIsCreating(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      const SDKInstance = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      });

      const superSigner = SDKInstance.createSigner({ signer: signer });

      console.log("Super-fluid signer", signer);
      const superToken = await SDKInstance.loadSuperToken(streamToken);
      console.log("Super Token", superToken);
      try {
        const balance = await superToken.balanceOf({
          account: currentAddress,
          providerOrSigner: signer,
        });

        if (balance === "0") {
          alert("Looks like you don't have enough funds for streaming");
          return;
        }
        const createFlowOperation = superToken.createFlow({
          sender: await superSigner.getAddress(),
          receiver: recieptAddress,
          flowRate: flowRate,
        });

        console.log(createFlowOperation);

        console.log("Creating your stream...");

        const result = await createFlowOperation.exec(superSigner);
        console.log(result);
        await result.wait();
        console.log(`Congrats - you've just created a money stream!`);
        router.reload();
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        if (error.message.includes("user rejected transaction")) {
          alert("Transaction cancelled by user");
        }
      }
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="flex flex-col justify-center items-center">
      <h1 className="text-2xl">Stream money to any wallet address</h1>
      <form className="flex flex-col gap-7 w-auto my-6">
        <input
          className="block w-auto p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter reciept address(Like 0x8sgbusnhy)"
          required
          type={"text"}
          value={recieptAddress}
          onChange={(e) => {
            setRecieptAddress(e.target.value);
          }}
        />
        <input
          className="block w-auto p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter Flow rate"
          required
          type={"text"}
          value={flowRate}
          onChange={(e) => {
            setFlowRate(e.target.value);
          }}
        />
        <select
          value={streamToken}
          onChange={selectToken}
          title="Select Token"
          className="bg-slate-900"
        >
          Select Token
          <option value={"fDAIx"}>DAI</option>
          <option value={"MATICx"}>Matic</option>
        </select>
      </form>
      {flowRate && (
        <h4 className="text-base text-red-500">
          You will be sending {ethers.utils.formatEther(flowRate)} {streamToken}
          /second
        </h4>
      )}
      <button
        type="button"
        className="my-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
          disabled:bg-slate-300 disabled:hover:bg-slate-400"
        onClick={createNewFlow}
        disabled={!flowRate || !recieptAddress}
      >
        {isCreating ? "Creating your stream..." : "Start Streaming"}
      </button>
    </section>
  );
}

export default CreateFlow;

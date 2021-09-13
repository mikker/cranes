import { useEffect } from "react";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const wcConnector = new WalletConnectConnector({
  infuraId: "9fb83dcc98ca424d887a2ac6348090ee",
});

function getLibrary(provider) {
  return new Web3(provider);
}

export default function WrappedHome() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  );
}

function Home() {
  const { activate, active, account, library } = useWeb3React();

  useEffect(() => {
    if (!library) return;

    console.log(account);
  }, [account]);

  return (
    <main className="md:flex bg-white text-lg md:text-4xl">
      <div className="flex-1 p-5 md:p-16">
        <header className="azaret leading-normal">
          <h1 className="md:text-8xl font-bold md:font-thin">Cranes</h1>
          <h2 className="font-light tracking-tight max-w-5xl italic">
            Cranes are tiny, randomly generated, fully on-chain tokens of luck
            for special* wallets.
          </h2>
          <div className="h-2"></div>
          <p className="text-sm text-green-500">*All wallets are special.</p>
        </header>
        <div className="h-8"></div>
        <div>
          {!active && <ConnectButtons activate={activate} />}
          {active && (
            <div className="flex flex-col space-y-2">
              <MintButton
                onClick={() => {
                  mint();
                }}
              >
                Mint Crane
              </MintButton>
              <MintButton
                onClick={() => {
                  mint();
                }}
              >
                Mint to a friend
              </MintButton>

              <div className="h-2"></div>

              <div className="text-sm space-y-2">
                <p>
                  <strong>Cranes are Ξ0.02</strong>{" "}
                </p>
                <div className="h-2"></div>
                <p>
                  You can mint one for yourself or for a friend &mdash; the
                  colors will be different for each crane # and destination
                  address.
                </p>
              </div>

              <progress max={1000} value={30} />
            </div>
          )}
        </div>
      </div>
      {/* <div className="w-1/4 flex flex-wrap mx-auto max-w-md"> */}
      {/*   <img src="/last-2.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-81.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-12.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-25.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-25.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-12.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-81.svg" className="w-100 flex-0" /> */}
      {/*   <img src="/last-2.svg" className="w-100 flex-0" /> */}
      {/* </div> */}
    </main>
  );
}

function ConnectButtons({ activate }) {
  return (
    <div className="flex flex-col space-y-2">
      <h3>Connect wallet</h3>
      <button
        onClick={() => {
          activate(injected);
        }}
        className="btn bg-white inline-flex images-center space-x-2 text-yellow-600 shadow-md border border-yellow-600 w-100 md:w-auto text-base"
      >
        <img src="/metamask-fox.svg" className="h-5 w-5" />
        <span>Metamask</span>
      </button>
      <button
        onClick={() => {
          activate(wcConnector);
        }}
        className="btn bg-white inline-flex images-center space-x-2 text-blue-500 shadow-md border border-blue-600 w-100 md:w-auto text-base"
      >
        <img src="/walletconnect-logo.svg" className="h-5 w-5" />
        <span>WalletConnect</span>
      </button>
    </div>
  );
}

function MintButton({ ...props }) {
  return (
    <button
      className="btn text-sm tracking-tight bg-black shadow-md azaret font-light text-white rounded-full"
      {...props}
    />
  );
}

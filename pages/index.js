import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { utils } from "web3";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import Web3Provider from "../components/Web3Provider"
import cn from "classnames";
import debounce from "debounce";

const contractAddress =
  process.env.NODE_ENV === "production"
    ? "0xc3F5E8A98B3d97f19938E4673Fd97C7cfd155577"
    : "0xc3F5E8A98B3d97f19938E4673Fd97C7cfd155577";

const soldOut = true; // omg!

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const wcConnector = new WalletConnectConnector({
  infuraId: "cddde80366fc42c2ac9202c6a0f9850b",
});

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "craftForFriend",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "craftForSelf",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "currentYearTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    type: "function",
  },
];

export default function WrappedHome() {
  return (
    <Web3Provider>
      <Home />
    </Web3Provider>
  );
}

function Home() {
  const { activate, active, account, library } = useWeb3React();

  const [working, setWorking] = useState(false);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);
  const [yearTotal, setYearTotal] = useState(0);
  const [friendAddress, setFriendAddress] = useState("");
  const [realFriendAddress, setRealFriendAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const friendField = useRef();

  useEffect(() => {
    if (!library) return;

    const contract = new library.eth.Contract(abi, contractAddress);
    setContract(contract);

    contract.methods
      .currentYearTotalSupply()
      .call()
      .then((res) => {
        setYearTotal(res);
      }, handleError);

    setWorking(false);
  }, [account]);

  useEffect(() => {
    if (!friendAddress) return;

    if (friendAddress.match(/0x[a-fA-F0-9]{40}/)) {
      setRealFriendAddress(friendAddress);
      return;
    }

    if (friendAddress.match(/\./)) {
      debouncedLookup();
    }
  }, [friendAddress]);

  function handleError(err) {
    console.error(err);
    setWorking(false);
    setError(err);
  }

  function craftForSelf() {
    setWorking(true);

    contract.methods
      .craftForSelf()
      .send({ from: account, value: utils.toWei("0.02", "ether") })
      .then((res) => {
        setWorking(false);
        setTransactionHash(res.transactionHash);
      }, handleError);
  }

  function craftForFriend() {
    if (!realFriendAddress) {
      friendField.current.focus();
    }

    setWorking(true);

    contract.methods
      .craftForFriend(realFriendAddress)
      .send({ from: account, value: utils.toWei("0.02", "ether") })
      .then((res) => {
        setWorking(false);
        setTransactionHash(res.transactionHash);
      }, handleError);
  }

  const debouncedLookup = debounce(async () => {
    setWorking(true);
    try {
      const address = await library.eth.ens.getAddress(friendAddress);
      setRealFriendAddress(address);
    } catch {}

    setWorking(false);
  }, 1000);

  return (
    <main className="max-w-4xl mx-auto text-base md:text-2xl">
      <Head>
        <title>Cranes (for special wallets)</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>

      <div className="p-5 md:p-16">
        <header className="leading-normal">
          <h1 className="md:text-8xl font-bold md:font-thin">Cranes</h1>
          <h2 className="font-light tracking-tight md:text-4xl max-w-5xl italic">
            Cranes are tiny, randomly generated, fully on-chain tokens of luck
            for{" "}
            <span className="rainbow bg-clip-text text-transparent font-bold">
              special*
            </span>{" "}
            wallets.
          </h2>
          <div className="h-2"></div>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            *All wallets are special to someone.
          </p>
        </header>

        <div className="h-8"></div>

        <div className="md:flex">
          <div className="w-full flex-auto text-sm order-1 md:ml-6 leading-normal">
            <h3 className="mb-2 text-xl leading-normal">
              <span className="bg-red-500 text-white decoration-clone p-1">Cranes have sold out for 2021!</span>
            </h3>
            <p className="mb-2">
              I'm stoked and surprised and very, very thankful.
            </p>
            <p className="mb-2">
              Had never expected this thing to take off so fast. Thank you to
              all Crane holders. May your wallets be lucky and your cranes
              colorful.
            </p>
            <p className="mb-2">
              I am working on the Special Edition crane now that we reached
              1,000. It will be available here to mint for free (except gas) for
              all Crane holders.
            </p>
            <p className="mb-2">
              If you didn't get a Crane before they sold out, there are a few
              available on{" "}
              <A href="https://opensea.io/collection/cranes-for-special-wallets">
                OpenSea
              </A>
              . There will be another 1,000 to mint when the New Year rolls
              around.
            </p>
            <p>Thank you all so much.</p>
          </div>

          <div className="h-6 md:hidden"></div>

          <div className="flex-0 w-full flex flex-col space-y-4 md:max-w-md">
            {!active && (
              <ConnectButtons setWorking={setWorking} activate={activate} />
            )}
            {active && (
              <div>
                <MintButton
                  disabled={working || soldOut}
                  onClick={craftForSelf}
                  className="rounded-full"
                >
                  Mint Crane (Ξ0.02)
                </MintButton>

                <div className="h-2"></div>

                <div className="flex flex-col">
                  <input
                    ref={friendField}
                    className="input text-sm md:text-lg rounded-2xl rounded-b-none"
                    value={friendAddress}
                    onChange={(event) => {
                      setFriendAddress(event.target.value);
                    }}
                    disabled={working || soldOut}
                    placeholder={"0x… or ENS domain"}
                  />
                  <MintButton
                    disabled={working || soldOut}
                    className="rounded-2xl rounded-t-none"
                    onClick={craftForFriend}
                  >
                    Mint for a friend (Ξ0.02)
                  </MintButton>
                </div>

                {realFriendAddress && (
                  <div className="text-sm truncate">
                    Sending to{" "}
                    <code className="bg-gray-100" title={realFriendAddress}>
                      {realFriendAddress}
                    </code>
                  </div>
                )}

                <div className="h-2"></div>

                {transactionHash && (
                  <div className="text-green-500 text-xs flex flex-col space-y-2">
                    <span>Success!</span>
                    <a
                      href={`https://etherscan.io/tx/${transactionHash}`}
                      className="btn font-normal bg-gray-100 rounded-full shadow-md"
                    >
                      View transaction on Etherscan
                    </a>
                  </div>
                )}
                {error && (
                  <div className="text-red-500 text-xs">{error.message}</div>
                )}

                <div className="text-sm space-y-2 leading-normal">
                  <p>
                    <strong>Cranes are Ξ0.02</strong>{" "}
                  </p>
                  <p>
                    You <del>can</del> could mint one for yourself or for a friend. The result
                    will be different for each crane depending on its number and
                    destination address.
                  </p>

                  <p>
                    {yearTotal}/1,000 cranes have been minted in{" "}
                    {new Date().getFullYear()}.
                  </p>

                  <progress className="w-full" max={1000} value={yearTotal} />

                  <p>
                    If all 1,000 cranes are minted in a year, holders get to
                    mint a <em>Special Edition Mega Luck</em> crane for free (gas only.)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3">
        <img src="/last-67.svg" className="" />
        <img src="/last-1.svg" className="" />
        <img src="/last-13.svg" className="" />
        <img src="/last-4.svg" className="" />
        <img src="/last-7.svg" className="" />
        <img src="/last-8.svg" className="" />
      </div>

      <div className="p-5 md:p-16 space-y-4 md:space-y-16">
        <div className="space-y-4 md:space-y-8 font-light">
          <h2 className="md:text-8xl font-thin">Timeline</h2>
          <div>
            <H4>September 2021</H4>
            <p>Initial release of the first batch.</p>
          </div>
          <div>
            <H4>October 2021</H4>
            <p><strong>First</strong> Special Edition will be released, free to mint (except gas) for Cranes holders.</p>
          </div>
          <div>
            <H4>November 2021</H4>
            <p><strong>Second</strong> Special Edition will be released, free to mint (except gas) for Cranes holders.</p>
          </div>
          <div>
            <H4>December 2021</H4>
            <p><strong>Third</strong> Special Edition will be released, free to mint (except gas) for Cranes holders.</p>
          </div>
          <div>
            <H4>January 2022</H4>
            <p>1,000 more Cranes will be available to mint at 0.02 ETH like the first batch. If all 1,000 Cranes are minted before year's end, Special Editions similar to the above will be made again.</p>
          </div>
          <div>
            <H4>Onwards…</H4>
            <p>Who knows?</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-8 font-light">
          <h2 className="md:text-8xl font-thin">FAQ</h2>
          <div>
            <H4>Who's behind Cranes?</H4>
            <p>
              Cranes are designed and coded by{" "}
              <a
                href="https://mikkelmalmberg.com"
                className="text-blue-500 underline"
              >
                Mikkel Malmberg
              </a>
              .
            </p>
          </div>
          <div>
            <H4>Why paper cranes?</H4>
            <p>
              From{" "}
              <A href="https://en.wikipedia.org/wiki/One_thousand_origami_cranes">
                Wikipedia
              </A>
              :
            </p>
            <blockquote className="pl-6 p-3 italic">
              An ancient Japanese legend promises that anyone who folds a
              thousand origami cranes will be granted a wish by the gods. Some
              stories believe one is granted happiness and eternal good luck,
              instead of just one wish, such as long life or recovery from
              illness or injury. This makes them popular gifts for special
              friends and family.
            </blockquote>
          </div>
          <div>
            <H4>
              What do you mean by <em>fully on-chain</em>?
            </H4>
            <p>
              Everything, even the image data, is stored directly on the
              Ethereum blockchain. Most NFTs hold only the metadata and
              ownership information and then links to an external service for
              the actual asset. This is mostly fine, however the service storing
              that asset may disappear or the data go corrupt. Probably not, but
              maybe. Even if this website disappears at some point, Cranes will
              be around as long as the blockchain itself.
            </p>
          </div>
          <div>
            <H4>How are the Cranes generated?</H4>
            <p>
              The Cranes are generated from the same SVG template, seeded with
              random colors. It isn't true randomness, as we still expect the
              same crane to have the same colors every time we view it. So the
              colors are <em>*randomly*</em> chosen from a few seed values, that
              make it always return the same colors for the same seed, which is
              mint year + token id + destination address.
            </p>
          </div>
          <div>
            <H4>How do I buy one?</H4>
            <p>
              First you need an Ethereum wallet. I recommend{" "}
              <A href="https://rainbow.me">🌈&nbsp;Rainbow</A>.{" "}
              <A href="https://metamask.io/">Metamask</A> is fine too. Then you
              buy some ETH. Then you use this website as long as supplies last.
            </p>
          </div>
          <div>
            <H4>How are Cranes licensed?</H4>
            <p>
              Cranes, the contract code, IP and resulting assets are all{" "}
              <strong className="font-bold">Public Domain</strong>. Feel free to
              build upon the project in any way you'd like.
            </p>
          </div>
        </div>
      </div>
      <div className="text-sm p-5 md:p-16">
        <A href="https://etherscan.io/address/0xc3f5e8a98b3d97f19938e4673fd97c7cfd155577">
          Etherscan
        </A>{" "}
        &bull;{" "}
        <A href="https://opensea.io/collection/cranes-for-special-wallets">
          OpenSea
        </A>{" "}
        &bull; <A href="https://github.com/mikker/cranes">GitHub</A> &bull;{" "}
        <A href="https://twitter.com/mikker">Twitter</A> &bull; There's no
        Discord
      </div>
    </main>
  );
}

const A = (props) => <a className="text-blue-500 underline" {...props} />;
const H4 = (props) => <h4 className="font-bold" {...props} />;
const Answer = (props) => <div className="font-light" {...props} />;

function ConnectButtons({ activate, setWorking }) {
  const cls =
    "btn bg-white dark:bg-gray-900 rounded-full inline-flex images-center space-x-2 shadow-md border w-100 md:w-auto text-base font-normal";
  return (
    <>
      <h3>Connect wallet</h3>
      <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-2">
        <button
          onClick={() => {
            setWorking(true);
            activate(injected);
          }}
          className={cn(cls, "text-yellow-600 border-yellow-600")}
        >
          <img src="/metamask-fox.svg" className="h-5 w-5" />
          <span>Metamask</span>
        </button>
        <button
          onClick={() => {
            setWorking(true);
            activate(wcConnector);
          }}
          className={cn(cls, "text-blue-500 border-blue-600")}
        >
          <img src="/walletconnect-logo.svg" className="h-5 w-5" />
          <span>WalletConnect</span>
        </button>
      </div>
    </>
  );
}

function MintButton({ className, ...props }) {
  return (
    <button
      className={cn(
        "btn md:text-lg text-sm tracking-tight bg-black dark:bg-white dark:text-black shadow-md font-light text-white",
        className
      )}
      {...props}
    />
  );
}

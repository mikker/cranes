import { useEffect, useState, useRef } from "react";
import { utils } from "web3";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import cn from "classnames";
import debounce from "debounce";
import { SelfBuildingSquareSpinner } from "react-epic-spinners";
import { Link } from "react-feather";
import Layout from "../components/Layout";
import Web3Provider from "../components/Web3Provider";
import { address as cranesAddress, abi as cranesABI } from "../src/cranes";
import {
  address as specialsAddress,
  abi as specialsABI,
} from "../src/specials";

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
const wcConnector = new WalletConnectConnector({
  infuraId: "cddde80366fc42c2ac9202c6a0f9850b",
});

export default function WrappedHome() {
  return (
    <Web3Provider>
      <Home />
    </Web3Provider>
  );
}

function Home() {
  const { activate, active, account, library } = useWeb3React();

  const [soldOut, setSoldOut] = useState(true);
  const [success, setSuccess] = useState(false);
  const [working, setWorking] = useState(true);
  const [contract, setContract] = useState(null);
  const [specialsContract, setSpecialsContract] = useState(null);
  const [error, setError] = useState(null);
  const [yearTotal, setYearTotal] = useState(0);
  const [friendAddress, setFriendAddress] = useState("");
  const [realFriendAddress, setRealFriendAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);
  const friendField = useRef();

  useEffect(() => {
    if (!library) return;

    // library.eth.handleRevert = true // fails with TypeError: err.data.substring is not a function

    const contract = new library.eth.Contract(cranesABI, cranesAddress);
    setContract(contract);
    const specialsContract = new library.eth.Contract(
      specialsABI,
      specialsAddress
    );
    setSpecialsContract(specialsContract);

    contract.methods
      .currentYearTotalSupply()
      .call()
      .then((res) => {
        setYearTotal(res);
        setSoldOut(res >= 1000);
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
    setSuccess(false);
    setError(err);
  }

  function craftForSelf() {
    setWorking(true);
    setError(null);

    contract.methods
      .craftForSelf()
      .send(
        { from: account, value: utils.toWei("0.02", "ether") },
        (err, hsh) => {
          if (err) return handleError(err);
          setTransactionHash(hsh);
        }
      )
      .then(() => {
        setWorking(false);
        setSuccess(true);
      }, handleError);
  }

  function craftForFriend() {
    if (!realFriendAddress) {
      friendField.current.focus();
    }

    setWorking(true);
    setError(null);

    contract.methods
      .craftForFriend(realFriendAddress)
      .send(
        { from: account, value: utils.toWei("0.02", "ether") },
        (err, hsh) => {
          if (err) return handleError(err);
          setTransactionHash(hsh);
        }
      )
      .then(() => {
        setWorking(false);
        setSuccess(true);
      }, handleError);
  }

  function craftSpecial(num) {
    return () => {
      setWorking(true);
      setError(null);

      specialsContract.methods
        .craftWithCrane(num)
        .send({ from: account }, (err, hsh) => {
          if (err) return handleError(err);
          setTransactionHash(hsh);
        })
        .then(() => {
          setSuccess(true);
          setWorking(false);
        }, handleError);
    };
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
    <Layout>
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
            <h3 className="mb-2 leading-normal">
              <span className="bg-red-500 text-white decoration-clone p-1">
                Cranes have sold out for 2021!
              </span>
            </h3>
            <p className="mb-2">
              I'm stoked and surprised and very, very thankful.
            </p>
            <p className="mb-2">
              If you didn't get a 2021 Crane before they sold out, there are
              some available on{" "}
              <A href="https://opensea.io/collection/cranes-for-special-wallets">
                OpenSea
              </A>
              .
            </p>
            <p>
              There will be another 1,000 to mint when the New Year rolls
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

                <div className="text-sm space-y-2 leading-normal">
                  <p>
                    <strong>Cranes are Ξ0.02</strong>{" "}
                  </p>
                  <p>
                    You <del>can</del> could mint one for yourself or for a
                    friend. The result will be different for each crane
                    depending on its number and destination address.
                  </p>

                  <p>
                    {yearTotal}/1,000 cranes have been minted in{" "}
                    {new Date().getFullYear()}.
                  </p>

                  <progress className="w-full" max={1000} value={yearTotal} />

                  <p>
                    If all 1,000 cranes are minted in a year, holders get to
                    mint a <em>Special Edition Mega Luck</em> crane for free
                    (gas only.)
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
          <h2 className="md:text-8xl md:font-thin">Specials</h2>
          <p>
            When 1,000 Cranes are crafted in the same calendar year, at least
            one Special Edition Crane will be made to mint for free for all
            Crane holders.
          </p>
          <h2 className="md:text-xl md:font-thin">2021</h2>
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-6 md:space-y-0">
            <div className="w-full md:w-1/3 space-y-2">
              <img src="/special-1.svg" className="block rounded-lg max-w-xs" />
              {active && (
                <>
                  <MintButton
                    disabled={working}
                    onClick={craftSpecial(0)}
                    className="rounded-full"
                  >
                    Mint Special 1
                  </MintButton>
                </>
              )}
              <p className="text-base">Available!</p>
              <p className="text-sm">
                <span className="bg-green-300 inline-block px-2 rounded-lg">
                  ERC1155 / 100% on-chain
                </span>
              </p>
            </div>
            <div className="w-full md:w-1/3 space-y-2">
              <div className="p-4 border-2 rounded-lg block max-w-xs">
                <img src="/dashed.svg" className="" />
              </div>
              {active && (
                <>
                  <MintButton
                    disabled={true || working}
                    onClick={craftSpecial(1)}
                    className="rounded-full"
                  >
                    Mint Special 2
                  </MintButton>
                </>
              )}
              <p className="text-base">Release ~Nov 1, 2021</p>
            </div>
            <div className="w-full md:w-1/3 space-y-2">
              <div className="p-4 border-2 rounded-lg block max-w-xs">
                <img src="/dashed.svg" className="" />
              </div>
              {active && (
                <>
                  <MintButton
                    disabled={true || working}
                    onClick={craftSpecial(2)}
                    className="rounded-full"
                  >
                    Mint Special 3
                  </MintButton>
                </>
              )}
              <p className="text-base">Release ~Dec 1, 2021</p>
            </div>
          </div>
          {!active && (
            <ConnectButtons setWorking={setWorking} activate={activate} />
          )}

          <div className="md:h-16"></div>

          <h2 className="md:text-8xl md:font-thin">Timeline</h2>
          <div>
            <H4>September 2021</H4>
            <p>Initial release of the first batch.</p>
          </div>
          <div>
            <H4>October 2021</H4>
            <p>
              <strong>First</strong> Special Edition will be released, free to
              mint (except gas) for Cranes holders.
            </p>
          </div>
          <div>
            <H4>November 2021</H4>
            <p>
              <strong>Second</strong> Special Edition will be released, free to
              mint (except gas) for Cranes holders.
            </p>
          </div>
          <div>
            <H4>December 2021</H4>
            <p>
              <strong>Third</strong> Special Edition will be released, free to
              mint (except gas) for Cranes holders.
            </p>
          </div>
          <div>
            <H4>January 2022</H4>
            <p>
              1,000 more Cranes will be available to mint at 0.02 ETH like the
              first batch. If all 1,000 Cranes are minted before year's end,
              Special Editions similar to the above will be made again.
            </p>
          </div>
          <div>
            <H4>Onwards…</H4>
            <p>Who knows?</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-8 font-light">
          <h2 className="md:text-8xl md:font-thin">FAQ</h2>
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
      <div className="text-sm p-5 md:p-16 leading-normal mb-8">
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
        <br />
        Specials: <A href="https://etherscan.io/address/0x71ede9894aeb2ff2da92d2ca4865d37d1ab77a1b">Etherscan</A> &bull;{" "}
        <A href="https://opensea.io/collection/cranes-for-special-editions">OpenSea</A>
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 shadow-2xl border-t-2 border-gray-100 py-3 px-5">
        {error && (
          <div className="text-red-500 text-xs md:text-base mb-1">
            There was an error with your transaction. See Etherscan for details.
          </div>
        )}
        {!active && (
          <ConnectButtons setWorking={setWorking} activate={activate} />
        )}
        {active && (
          <div className="h-6 space-x-2 flex items-center">
            <span className="flex-1 block text-xs truncate md:text-base">
              Connected as <code className="text-red-500">{account}</code>
            </span>
            {transactionHash && (
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                className={cn(
                  "btn flex space-x-1 text-xs px-3 font-normal bg-gray-200 rounded-full",
                  success ? "text-green-500" : "text-black",
                  error ? "text-red-500" : "text-black"
                )}
              >
                <Link className="h-3 w-3" />
                <span className="md:hidden">txn</span>
                <span className="hidden md:inline">
                  Transaction on Etherscan
                </span>
              </a>
            )}
            {working && (
              <div className="flex-0">
                <SelfBuildingSquareSpinner size={16} color="currentColor" />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

const A = (props) => <a className="text-blue-500 underline" {...props} />;
const H4 = (props) => <h4 className="font-bold" {...props} />;

function ConnectButtons({ activate, setWorking }) {
  const cls =
    "btn bg-white dark:bg-gray-900 rounded-full inline-flex images-center space-x-2 shadow-md border w-100 md:w-auto px-2 py-1 text-xs md:text-base font-normal";
  return (
    <>
      <div className="flex md:flex-row space-x-2">
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

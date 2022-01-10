import React from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import MyEpicNFT from './utils/MyEpicNFT.json'
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [mintUrl, setMintUrl] = React.useState("");
  const [etherScanUrl, setEtherScanUrl] = React.useState("");

  const checkIfWalletIsCOnnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Install Metamask extension");
      return;
    }
    console.log("we have ethereum object", ethereum);

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      console.log(accounts);
      const account = accounts[0];
      console.log("Found authorized acc: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No accounts found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('get MetaMask');
        return;
      }

      const accounts = ethereum.request({ method: 'eth_requestAccounts' });
      console.log({ accounts });
      setCurrentAccount[0];
    } catch (e) {
      console.error(e);
    }
  };

  const askContrsctToMintNFT = async () => {
    const CONTRACT_ADDRESS = "0x8CBf92CAB3f58580822a01A03DB09f2E6B8A01Db";

    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('get MetaMask');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNFT.abi, signer);
      console.log("Going to pop wallet to pay gas...");
      let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("Mining... please wait.");
      await nftTxn.wait();
      const link = `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`;

      setEtherScanUrl(link);

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        const link = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`;
        console.log({ from, id: tokenId.toNumber(), link });


        alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: ${link}`);
        setMintUrl(link);

      })

    }
    catch (e) { console.error(e); }
  };


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderMintContainer = () => (
    <button onClick={askContrsctToMintNFT} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
  );

  const RenderLink = ({ link, text }) => {
    return (<a href={link} className="cta-button connect-wallet-button" target="_blank">
      {text}
    </a>);
  }

  React.useEffect(() => {
    checkIfWalletIsCOnnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount == "" ? renderNotConnectedContainer() : renderMintContainer()}
        </div>
        {mintUrl && <RenderLink link={mintUrl} text="OpenSea URL" />}

        {etherScanUrl && <RenderLink link={etherScanUrl} text="EtherScan URL" />}

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS'; // Ganti setelah deploy
const ABI = [
  // Masukkan ABI contract SimpleStaking kamu setelah deploy
];

export default function Home() {
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [reward, setReward] = useState('0');

  useEffect(() => {
    if (provider && signer) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contractInstance);
    }
  }, [provider, signer]);

  const connectWallet = async () => {
    if (window.ethereum) {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const accounts = await tempProvider.send('eth_requestAccounts', []);
      setProvider(tempProvider);
      setSigner(tempSigner);
      setAccount(accounts[0]);
    } else {
      alert('Metamask not detected');
    }
  };

  const handleStake = async () => {
    if (!contract) return;
    const tx = await contract.stake({ value: ethers.utils.parseEther(stakeAmount) });
    await tx.wait();
    fetchBalances();
  };

  const handleUnstake = async () => {
    if (!contract) return;
    const tx = await contract.unstake(ethers.utils.parseEther(stakeAmount));
    await tx.wait();
    fetchBalances();
  };

  const fetchBalances = async () => {
    if (!contract || !account) return;
    const staked = await contract.viewStaked(account);
    const rew = await contract.viewReward(account);
    setStakedBalance(ethers.utils.formatEther(staked));
    setReward(ethers.utils.formatEther(rew));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Monad Staking App</h1>
      {!account ? (
        <button onClick={connectWallet} className="p-2 bg-blue-500 text-white rounded">Connect Wallet</button>
      ) : (
        <>
          <div className="mb-4">Connected: {account}</div>
          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              placeholder="Amount to Stake/Unstake (ETH)"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="p-2 border"
            />
            <button onClick={handleStake} className="p-2 bg-green-500 text-white rounded">Stake</button>
            <button onClick={handleUnstake} className="p-2 bg-red-500 text-white rounded">Unstake</button>
            <div className="mt-6">
              <p>Staked Balance: {stakedBalance} ETH</p>
              <p>Pending Reward: {reward} ETH</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

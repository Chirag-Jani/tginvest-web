import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";

const Connect: React.FC = () => {
  const { ready, authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();
  const [username, setUsername] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasCalledAPI = useRef(false);

  // Extract username from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usernameParam = urlParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, []);

  // Function to call the API to add wallet address
  const addWalletToUser = async (username: string, walletAddress: string) => {
    try {
      setIsUpdating(true);
      const response = await fetch("http://localhost:8080/user/add-wallet", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          walletAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Wallet added successfully:", data);
      } else {
        console.error("Failed to add wallet:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get the primary wallet address
  const primaryWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  const walletAddress = primaryWallet?.address || user?.wallet?.address;

  // Call API when wallet is connected and we have both username and wallet address
  useEffect(() => {
    if (authenticated && username && walletAddress && !hasCalledAPI.current) {
      hasCalledAPI.current = true;
      addWalletToUser(username, walletAddress);
    }
  }, [authenticated, username]);

  return (
    <div className="connect-container">
      <div className="connect-card">
        <h1>Connect Wallet</h1>
        {username && (
          <div className="username-display">
            <p>
              Welcome, <span className="username">{username}</span>
            </p>
          </div>
        )}
        <p>Connect your wallet to get started</p>

        {!ready ? (
          <div className="loading-state">
            <p>Loading...</p>
          </div>
        ) : authenticated ? (
          <div className="connected-state">
            <div className="account-info">
              <h3>Connected</h3>
              {walletAddress && (
                <p className="account-address">
                  {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                </p>
              )}
              {isUpdating && (
                <p className="updating-status">Updating user profile...</p>
              )}
            </div>
          </div>
        ) : (
          <button onClick={login} className="connect-btn">
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Connect;

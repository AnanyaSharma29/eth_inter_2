import { useState, useEffect } from "react";
import { ethers } from "ethers";
import HotelRoomBookingSystemAbi from "../artifacts/contracts/HotelRoomBookingSystem.sol/HotelRoomBookingSystem.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [HotelRoomBookingSystem, setHotelRoomBookingSystem] = useState(undefined);
  const [roomAvailability, setRoomAvailability] = useState({});
  const [message, setMessage] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomId, setRoomId] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with your contract address
  const HotelRoomBookingSystemABI = HotelRoomBookingSystemAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getHotelRoomBookingSystemContract();
    } catch (error) {
      setMessage("Error connecting account: " + (error.message || error));
    }
  };

  const getHotelRoomBookingSystemContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const HotelRoomBookingSystemContract = new ethers.Contract(contractAddress, HotelRoomBookingSystemABI, signer);
    setHotelRoomBookingSystem(HotelRoomBookingSystemContract);
  };

  const addRoom = async () => {
    setMessage("");
    if (HotelRoomBookingSystem) {
      try {
        let tx = await HotelRoomBookingSystem.addRoom(roomType);
        await tx.wait();
        setMessage("Room added successfully!");
      } catch (error) {
        setMessage("Error adding room: " + (error.message || error));
      }
    }
  };

  const bookRoom = async () => {
    setMessage("");
    if (HotelRoomBookingSystem) {
      try {
        let tx = await HotelRoomBookingSystem.bookRoom(roomId);
        await tx.wait();
        checkRoomAvailability(roomId);
        setMessage("Room booked successfully!");
      } catch (error) {
        setMessage("Unable to book room: " + (error.message || error));
      }
    }
  };

  const vacateRoom = async () => {
    setMessage("");
    if (HotelRoomBookingSystem) {
      try {
        let tx = await HotelRoomBookingSystem.vacateRoom(roomId);
        await tx.wait();
        checkRoomAvailability(roomId);
        setMessage("Room vacated successfully!");
      } catch (error) {
        setMessage("Unable to vacate room: " + (error.message || error));
      }
    }
  };

  const checkRoomAvailability = async (roomId) => {
    try {
      if (HotelRoomBookingSystem) {
        const [roomType, isBooked] = await HotelRoomBookingSystem.checkRoomAvailability(roomId);
        setRoomAvailability((prev) => ({ ...prev, [roomId]: { roomType, isBooked } }));
      }
    } catch (error) {
      setMessage("Error fetching room availability: " + (error.message || error));
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this booking system.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect MetaMask Wallet</button>;
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <div className="room-actions">
          <input
            type="text"
            placeholder="Room Type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          />
          <button onClick={addRoom}>Add Room</button>

          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={bookRoom}>Book Room</button>
          <button onClick={vacateRoom}>Vacate Room</button>

          <div className="room-info">
            {Object.keys(roomAvailability).map((roomId) => (
              <div key={roomId}>
                <p>Room ID: {roomId}</p>
                <p>Type: {roomAvailability[roomId].roomType}</p>
                <p>Status: {roomAvailability[roomId].isBooked ? "Booked" : "Available"}</p>
                <button onClick={() => checkRoomAvailability(roomId)}>Check Room Availability</button>
              </div>
            ))}
          </div>
        </div>
        {message && <p><strong>{message}</strong></p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to Hotel Room Booking System</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: white;
          color: olive green;
          font-family: "Times New Roman", serif;
          border: 10px solid black;
          border-radius: 20px;
          background-image: url("https://i.pinimg.com/originals/a2/f8/16/a2f8165d4b669b8d8a2336258410d7b3.webp");
          height: 950px;
          width: 1500px;
          opacity: 0.9;
          font-weight: 1000;
          padding: 20px;
        }

        header {
          padding: 10px;
        }

        h1 {
          font-family: "Arial", serif;
          font-size: 60px;
          margin-bottom: 20px;
        }

        .room-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 20px 30px;
          font-size: 24px;
          cursor: pointer;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        button:hover {
          background-color: #388e3c;
        }
      `}</style>
    </main>
  );
}
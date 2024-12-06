import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import AccountCard from "./components/AccountCard";
import Loader from "./components/Loader";

const App = () => {
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [handles, setHandles] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const authenticateAndFetchData = async () => {
    setLoading(true);

    try {
      const authResponse = await axios.post("/api/authenticate", {
        username,
        appPassword,
      });

      const token = authResponse.data.token;
      const handleList = handles.split("\n").map((h) => h.trim());

      const resultsResponse = await axios.post("/api/check-accounts", {
        token,
        handles: handleList,
      });

      setResults(resultsResponse.data);
    } catch (error) {
      alert("Error: Unable to fetch account data. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Bluesky Account Checker
          </h2>
          <input
            type="text"
            placeholder="Bluesky Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-2 p-3 border rounded"
          />
          <input
            type="password"
            placeholder="App Password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            className="w-full mb-2 p-3 border rounded"
          />
          <textarea
            placeholder="Enter account handles (one per line)"
            value={handles}
            onChange={(e) => setHandles(e.target.value)}
            className="w-full mb-4 p-3 border rounded"
          />
          <button
            onClick={aut

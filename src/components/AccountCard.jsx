import React from 'react';

const AccountCard = ({ username, status, followers, following, posts }) => (
  <div className="account-card">
    <h3>{username}</h3>
    <p>Status: {status}</p>
    <p>Followers: {followers}</p>
    <p>Following: {following}</p>
    <p>Posts: {posts}</p>
  </div>
);

export default AccountCard;

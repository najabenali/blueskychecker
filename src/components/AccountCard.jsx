const AccountCard = ({ data }) => (
  <div className="bg-white shadow p-4 rounded mb-4">
    <h2 className="text-lg font-semibold text-gray-700">{data.handle}</h2>
    <p>Status: {data.suspended ? "❌ Suspended" : "✅ Active"}</p>
    <p>Followers: {data.followers}</p>
    <p>Following: {data.followings}</p>
    <p>Posts: {data.posts}</p>
  </div>
);

export default AccountCard;

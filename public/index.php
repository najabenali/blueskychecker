<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\UserController;

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['credentials'])) {
        // Save credentials to the session
        $_SESSION['username'] = $data['credentials']['username'];
        $_SESSION['appPassword'] = $data['credentials']['appPassword'];
        echo json_encode(['status' => 'success']);
        exit;
    }

    if (isset($data['usernames'])) {
        $controller = new UserController($_SESSION['username'], $_SESSION['appPassword']);
        $results = $controller->getUserData($data['usernames']);
        echo json_encode($results);
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlueskyChecker</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="app">
        <header>
            <h1>BlueskyChecker</h1>
            <p>Authenticate and fetch Bluesky user data instantly.</p>
        </header>
        <main>
            <form id="credentialsForm">
                <h2>Step 1: Enter Your Credentials</h2>
                <label for="username">Bluesky Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter your Bluesky username" required>
                <label for="appPassword">App Password:</label>
                <input type="password" id="appPassword" name="appPassword" placeholder="Enter your app password" required>
                <button type="submit">Save Credentials</button>
            </form>

            <form id="userForm" style="display: none;">
                <h2>Step 2: Fetch User Data</h2>
                <label for="usernames">Enter Usernames (comma-separated):</label>
                <input type="text" id="usernames" name="usernames" placeholder="e.g., user1, user2" required>
                <button type="submit">Fetch Data</button>
            </form>

            <div id="results" class="results"></div>
        </main>
    </div>
    <script src="assets/js/main.js"></script>
</body>
</html>

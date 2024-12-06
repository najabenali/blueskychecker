document.getElementById('credentialsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const appPassword = document.getElementById('appPassword').value;

    const response = await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentials: { username, appPassword } })
    });

    const data = await response.json();
    if (data.status === 'success') {
        document.getElementById('credentialsForm').style.display = 'none';
        document.getElementById('userForm').style.display = 'block';
    }
});

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernames = document.getElementById('usernames').value.split(',');

    const response = await fetch(window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames })
    });

    const data = await response.json();
    document.getElementById('results').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
});

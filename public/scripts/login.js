function logIn(event) {
    event.preventDefault();

    const username = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;

    if (username === 'admin' && password === 'admin') {
        window.location.href = 'http://localhost:3000/admin';
    }

    return false;
}
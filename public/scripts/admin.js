const listOfUsers = document.querySelector('.listOfUsers');

window.addEventListener('load', () =>{
    showAll();
})


function generateUserBlock(user) {
    console.log(user);
    const userBlock = document.createElement("tr");
    userBlock.classList.add("users");

    const username = user.username + "Username";
    const email = user.email + "Email";
    const password = user.password + "Password";

    userBlock.innerHTML = `
        <td><input type="text" class="form-control" id="${username}" value="${user.username}"></td>
        <td><input type="text" class="form-control" readonly id="${email}" value="${user.email}"></td>
        <td><input type="text" class="form-control" id="${password}${email}" value="${user.password}"></td>
        <td>
            <button class="btn loginButton text-white px-4" style="background-color: rgb(13, 133, 253);"
            onclick="saveUser('${username}', '${email}', '${password}${email}')">Save</button>
            <button class="btn btn-danger px-4" onclick="deleteUser('${user.email}')">Delete</button>
        </td>
    `;

    listOfUsers.appendChild(userBlock);
}


async function showAll() {
    try {
        const users = await getUsers();
        users.forEach(function(user){
            generateUserBlock(user);
        });
    } catch (error) {
        console.error('Error fetching and displaying users:', error);
    }
}

function clearAll() {
    const users = document.querySelectorAll(".users");

    users.forEach(user => {
        user.remove();
    })
}

async function saveUser(usernameInputId, emailInputId, passwordInputId) {
    try {
        const username = document.getElementById(usernameInputId).value;
        const email = document.getElementById(emailInputId).value;
        const password = document.getElementById(passwordInputId).value;

        const userData = {
            username: username,
            email: email,
            password: password
        };

        const response = await fetch('/admin/updateUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server response:', data);
        clearAll();
        showAll();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function deleteUser(userEmail) {
    try {
        const response = await fetch(`/admin/deleteUser/${encodeURIComponent(userEmail)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User deletion successful:', data);
        clearAll();
        showAll();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function search() {
    clearAll();

    const email = document.getElementById('userEmail').value;

    if (email === "") {
        showAll();
    } else {
        try {
            const user = await getUserByEmail(email);

            if (user) {
                generateUserBlock(user);
            } else {
                console.log(`User with e-mail ${email} not found.`);
            }
        } catch (error) {
            console.error('Error fetching user by e-mail:', error);
        }
    }
}

async function createUser() {
    const newUsername = document.getElementById('newUsername').value;
    const newEmail = document.getElementById('newEmail').value;
    const newPassword = document.getElementById('newPassword').value;

    try {
        const response = await fetch('/admin/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: newUsername,
                email: newEmail,
                password: newPassword
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User added successfully:', data);

        const myModal = document.getElementById('createModal');
        $(myModal).modal('hide');

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function getUsers() {
    try {
        const response = await fetch('/admin/getUsers');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Unable to fetch users');
    }
}

async function getUserByEmail(email) {
    try {
        const response = await fetch(`/admin/getUser/${email}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        console.error(`Error fetching user with email ${email}:`, error);
        throw new Error(`Unable to fetch user with email ${email}`);
    }
}
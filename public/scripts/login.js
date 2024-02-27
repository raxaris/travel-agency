document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('formLogin');
    console.log(formElement);

    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        let body = {};

        for (const input of formElement.elements) {
            if (input.type === 'text' || input.type === 'password') {
                body[input.name] = input.value;
            }
        }

        console.log(JSON.stringify(body));
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log(data);
                window.location.href = "/";
            } else {
                alertMSG(data.message, 'danger');
            }
        } catch (error) {
            console.error('An error occurred while processing your request:', error);
            alertMSG('An error occurred while processing your request', 'danger');
        }
    });
});

function alertMSG(msg, alertType) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
          `<div class="alert alert-${type} alert-dismissible" role="alert" style="width: 400px;">`,
          `   <div>${message}</div>`,
          '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
          '</div>'
        ].join('')
      
        alertPlaceholder.append(wrapper)
    }

    setTimeout(function() {
        bootstrap.Alert.getOrCreateInstance(document.querySelector(".alert")).close();
    }, 2000)

    appendAlert(msg, alertType);
}
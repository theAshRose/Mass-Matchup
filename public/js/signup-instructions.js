const signupButton = document.getElementById('signup-button');

function signupRedirect(event) {
    document.location.replace('/signup');
}

signupButton.addEventListener('click', signupRedirect);
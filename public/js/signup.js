const usernameInputForm = document.getElementById('username-input-form');
const steamIDInputForm = document.getElementById('steam-id-input-form');
const passwordInputForm = document.getElementById('password-input-form');
const verifyPasswordInputForm = document.getElementById('verify-password-input-form');

function loginPage() {
    location.replace('/login')
}  

const signUpUser = async (event) => {
    event.preventDefault();
  
    const username = document.querySelector('#username-input').value.trim();
    const steam_id = document.querySelector('#steam-id-input').value.trim();
    const password = document.querySelector('#password-input').value.trim();
    const verifyPassword = document.querySelector('#verify-password-input').value.trim();
  
    if (username && steam_id && password && verifyPassword) {
      if (password != verifyPassword) {
        alert('Passwords do not match :)')
      } else {
        usernameInputForm.reset();
        steamIDInputForm.reset();
        passwordInputForm.reset();
        verifyPasswordInputForm.reset();

        const response = await fetch('/api/signup', {
          method: 'POST',
          body: JSON.stringify({ username, password, steam_id }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          location.replace('/');
        } else {
  
          alert('Failed to sign-up');
        }
      }
    }
};

$("#posting-signup-button").on("click", signUpUser);
$("#reroute-login-button").on("click", loginPage);

usernameInputForm.addEventListener('submit', signUpUser);
steamIDInputForm.addEventListener('submit', signUpUser);
passwordInputForm.addEventListener('submt', signUpUser);
verifyPasswordInputForm.addEventListener('submit', signUpUser);
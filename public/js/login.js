const usernameInputForm = document.getElementById('username-email-input-form');
const passwordInputForm = document.getElementById('password-input-form');

const loginFormHandler = async (event) => {
  event.preventDefault();
  const username = document.querySelector("#username-input").value.trim();
  const password = document.querySelector("#password-input").value.trim();
  console.log('you made it')
  if (username && password) {
    usernameInputForm.reset();
    passwordInputForm.reset();

    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    if (response.ok) {
      document.location.replace("/");
    } else {
      alert("Failed to log in.");
    }
  }
};

const signUpUser = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-input').value.trim();
  const steam_id = document.querySelector('#steam-id-input').value.trim();
  const password = document.querySelector('#password-input').value.trim();
  const verifyPassword = document.querySelector('#verify-password-input').value.trim();

  if (username && steam_id && password === verifyPassword) {
    if (password != verifyPassword) {
      alert('Passwords do not match :)')
    } else {
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

function loginPage() {
  location.replace('/login')
}

function signupPage() {
  location.replace('/login/signup')
}


$("#posting-signup-button").on("click", signUpUser)
$("#posting-login-button").on("click", loginFormHandler);
$("#reroute-signup-button").on("click", signupPage)
$("#reroute-login-button").on("click", loginPage)
usernameInputForm.addEventListener('submit', loginFormHandler);
passwordInputForm.addEventListener('submit', loginFormHandler);
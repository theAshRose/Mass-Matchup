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
    
    if (response.ok) {
      document.location.replace("/");
    } else {
      alert("Failed to log in.");
    }
  }
};

function signupPage() {
  location.replace('/login/signup')
}

$("#posting-login-button").on("click", loginFormHandler);
$("#reroute-signup-button").on("click", signupPage)
usernameInputForm.addEventListener('submit', loginFormHandler);
passwordInputForm.addEventListener('submit', loginFormHandler);
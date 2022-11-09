const loginFormHandler = async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username-email-input").value.trim();
    const password = document.querySelector("#password-input").value.trim();
  console.log('you made it')
    if (username && password) {
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
  
 $("#login-button").on("click", loginFormHandler);
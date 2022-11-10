///// /user/results

const searchUsers = async (event) => {
    event.preventDefault();
    
    const username = document.querySelector("#username-input").value.trim();
    console.log('VICTORY')
    if (username) {
      const response = await fetch("/user/results", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });
      console.log(response+"victory 2");
      if (response.ok) {
        document.location.replace("/user/content");
      } else {
        alert("No results found");
      }
    }
  };

  $("#search-user-button").on("click", searchUsers)
  $("#search-all-users-button").on("click", searchUsers)
  
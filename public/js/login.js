const usernameInputForm = document.getElementById('username-email-input-form');
const passwordInputForm = document.getElementById('password-input-form');

const modalBodyElement = $('.modal-body');
const loginModal = $('#loginModal');
const loginModalDialog = $('.modal-dialog');

const loginFormHandler = async (event) => {
  event.preventDefault();
  const username = document.querySelector("#username-input").value.trim();
  const password = document.querySelector("#password-input").value.trim();
  // console.log('you made it')
  if (username && password) {
    usernameInputForm.reset();
    passwordInputForm.reset();

    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else if (response.status === 403) {
      const responseBody = await response.json();

      if (!loginModalDialog.is('.modal-lg')) {
        loginModalDialog.addClass('modal-lg');
      }

      modalBodyElement.empty();
      modalBodyElement.append(`<p class="mb-2">${responseBody.message}</p>`);
      modalBodyElement.append(`<p class="mb-2">To edit your <a href="https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276" target="_blank" class="regular-link">profile privacy</a> settings:</p>`);

      const orderedList = $('<ol class="steam-instruction-list m-0">');
      modalBodyElement.append(orderedList);

      orderedList.append(`<li class="mb-1 steam-li-item"><a href="https://store.steampowered.com/login" target="_blank" class="regular-link">Log in</a> to your steam account.`);
      orderedList.append(`<li class="mb-1 steam-li-item">Navigate to your <a href="https://steamcommunity.com/my/edit/settings?snr=" target="_blank" class="regular-link">Profile Privacy Settings Page</a>.`);
      orderedList.append(`<li class="mb-1 steam-li-item">Make your profile settings look like the following image:</li>`);
      orderedList.append($('<div class="d-flex justify-content-center mb-1 pe-4"><img src="/images/make-profile-public.png" class="figure-img img-fluid rounded modal-img" alt="Steam account details"></div>'));
      orderedList.append(`<li class="steam-li-item">Make sure the option "Always keep my total playtime private even if users can see my game details" is <i>unchecked</i>.</li>`);

      loginModal.modal('show');
    } else if (response.status === 400) {
      const responseBody = await response.json();

      if (loginModalDialog.is('.modal-lg')) {
        loginModalDialog.removeClass('modal-lg');
      }

      modalBodyElement.empty();
      modalBodyElement.append(`<p class="mb-2">${responseBody.message}</p>`);
      loginModal.modal('show');
    } else {
      alert("Unknown error occured");
    }
  }
};

function closeModal(event) {
  loginModal.modal('hide');
}

function signupPage() {
  location.replace('/signup')
}

$("#posting-login-button").on("click", loginFormHandler);
$("#reroute-signup-button").on("click", signupPage)
usernameInputForm.addEventListener('submit', loginFormHandler);
passwordInputForm.addEventListener('submit', loginFormHandler);

/* For some reason, hiding the modal via data attributes isn't working. */
$('#modal-close-button').on('click', closeModal);
$('#modal-close-icon').on('click', closeModal);
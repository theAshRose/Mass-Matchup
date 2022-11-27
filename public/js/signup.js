const usernameInputForm = document.getElementById('username-input-form');
const steamIDInputForm = document.getElementById('steam-id-input-form');
const passwordInputForm = document.getElementById('password-input-form');
const verifyPasswordInputForm = document.getElementById('verify-password-input-form');

const modalBodyElement = $('.modal-body');
const signupModal = $('#signupModal');
const signupModalDialog = $('.modal-dialog');

const instructionsButton = document.getElementById('instructions-button');

function closeModal(event) {
  signupModal.modal("hide");
}

function loginPage() {
  location.replace('/login')
}

function instructions(event) {
  document.location.replace('/signup/instructions');
}

const signUpUser = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username-input').value.trim();
  const steam_id = document.querySelector('#steam-id-input').value.trim();
  const password = document.querySelector('#password-input').value.trim();
  const verifyPassword = document.querySelector('#verify-password-input').value.trim();

  if (username && steam_id && password && verifyPassword) {
    if (password != verifyPassword) {
      if (signupModalDialog.is('.modal-lg')) {
        signupModalDialog.removeClass('modal-lg');
      }

      modalBodyElement.empty();
      modalBodyElement.append(`<p class="mb-2">Passwords do not match!</p>`);
      signupModal.modal('show');
    } else if (password.length < 6) {
      if (signupModalDialog.is('.modal-lg')) {
        signupModalDialog.removeClass('modal-lg');
      }

      modalBodyElement.empty();
      modalBodyElement.append(`<p class="mb-2">Password must be at least 6 characters long!</p>`);
      signupModal.modal('show');
    } else {
      usernameInputForm.reset();
      steamIDInputForm.reset();
      passwordInputForm.reset();
      verifyPasswordInputForm.reset();

      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password, steam_id }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        location.replace('/');
      } else if (response.status === 403) {
        const responseBody = await response.json();

        if (!signupModalDialog.is('.modal-lg')) {
          signupModalDialog.addClass('modal-lg');
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

        signupModal.modal('show');
      } else if (response.status === 400) {
        const responseBody = await response.json();
        if (!signupModalDialog.is('.modal-lg')) {
          signupModalDialog.addClass('modal-lg');
        }

        modalBodyElement.empty();
        modalBodyElement.append(`<p class="mb-2">${responseBody.message}</p>`);
        modalBodyElement.append(`<p class="mb-2">To find your <a href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC" target="_blank" class="regular-link">Steam ID</a> take the following steps:</p>`);

        const orderedList = $('<ol class="steam-instruction-list m-0">');
        modalBodyElement.append(orderedList);

        orderedList.append(`<li class="mb-1 steam-li-item"><a href="https://store.steampowered.com/login" target="_blank" class="regular-link">Log in</a> to your steam account.`);
        orderedList.append(`<li class="mb-1 steam-li-item">Click the dropdown menu for your profile in the upper-right corner and select "Account details":</li>`);
        orderedList.append($('<div class="d-flex justify-content-center mb-1 pe-4"><img src="/images/how-to-get-account-details.png" class="figure-img img-fluid rounded modal-img" alt="Steam account details"></div>'));
        orderedList.append(`<li class="mb-1 steam-li-item">Your Steam ID is in the upper-left corner of the screen under the e-mail address tied to your account:</li>`);
        orderedList.append($('<div class="d-flex justify-content-center pe-4"><img src="/images/how-to-get-steam-id-2.png" class="figure-img img-fluid rounded modal-img" alt="Steam account details"></div>'));
        signupModal.modal('show');
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

/* For some reason, hiding the modal via data attributes isn't working. */
$('#modal-close-button').on('click', closeModal);
$('#modal-close-icon').on('click', closeModal);

instructionsButton.addEventListener('click', instructions);
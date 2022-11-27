<base target="_blank">

# Mass Matchup

<a href="#description">Description</a> •
<a href="#usage">Usage</a> •
<a href="#user-stories">User Stories</a> •
<a href="#languages-and-tools-used">Languages and Tools Used</a> •
<a href="#credits">Credits</a> •
<a href="#authors">Authors</a>

---

[Mass Matchup](https://mass-matchup.herokuapp.com/)

![Mass Matchup Demo](/assets/images/Mass%20Matchup.gif)

---

## Description

Mass matchup is a [Steam](https://store.steampowered.com/)-based stats comparison platform. It links accounts to their users steam data and allows you to view news about recently played games, view your personal game stats, and compare stats with other users on the website.

## Usage

Navigate to [https://mass-matchup.herokuapp.com/](https://mass-matchup.herokuapp.com/).  
Either enter the login information of an existing account, or create a new one using your [Steam ID](https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC).

If you want to use a dummy account to see the site, use:

```
username: davinchi
password: davinchi
```

Otherwise, if you want to sign up, get your [Steam ID](https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC) and make everything public in your [profile privacy settings page](https://steamcommunity.com/my/edit/settings?snr=). Enter a username, a password greater than 6 characters and a valid Steam ID with a public profile and public game data, and you can sign up.

If you dont properly make your profile public, you won't be allowed access to the site and a modal dialog will pop up instructing you on how to make your profile public:  
![Private information modal dialog](/assets/images/private-information-modal-dialog.png)

Once you log in, you can click on any one of your friends in the friends sidebar and you have the option to either view their stats or compare your stats against theirs. You can also view your own stats as well. Don't have any friends? No problem! Click on 'user search' and you search for users to send friend requests to. If they accept, you can compare your stats against theirs.

## User Stories

<a href="#login">Login</a> •
<a href="#signup">Signup</a> •
<a href="#game-news">Game News</a> •
<a href="#user-stats">User Stats</a> •
<a href="#compare-stats">Compare Stats</a> •
<a href="#friends-stats">Friends Stats</a> •
<a href="#user-search">User Search</a> •
<a href="#friends-sidebar">Friends Sidebar</a>

### Login

As a user, I want to be able to log in so that my user information is saved, I don't have to log in again, and I can view the content on the home page.

#### Data Model

We have the User sequelize data model with the following attributes:  
![User data model](/assets/images/user-data-model.png)

#### API Route

We have a login POST route that takes the username and password from the inputs on the login page, and searches the database for a User with the username provided in the request body. We encrypt the User's password, so we see if the password matches the password provided in the request body using our encryption package. If the username and password match what exists in our database, we make a request to the Steam Web API to update any Steam information in our database, and set the user id, username, and some other variables like the steam avatar URL so that we can display them later.

#### User Story in Action

![User logging in](/assets/images/user-logging-in.gif)

### Signup

As a user, I want to be able to signup to see my Steam stats if I don't already have an account, so that I can view the site.

#### API Route

We have a signup POST route. It takes the provided Steam ID, makes a request to the Steam Web API to look up for information about the user with that Steam ID, creates a user based on that information, saves all this information with the session information, and sends back information about the newly created user to the front-end:  
![Signup POST route](/assets/images/signup-post-route.png)

#### User Story in Action

![Signup demo](/assets/images/signup-demo.gif)

### Game News

As a user, I want a home page so that I can view my recently played games and news about each one.

#### Route

On the homepage route, we make a query to the Steam Web API using the Steam ID we save in the session information upon login for all recently played games of the User. We then query steam for news about every game, and send all of that information along to handlebars where it is displayed.

#### User Story in Action

![Dashboard demo](/assets/images/dashboard-demo.gif)

### User Stats

As an authorized user, I want to see the stats for games that I own on steam so I can feel good about the time I wasted playing video games.

#### Route

On the player stats route, we make an API call to the Steam Web API to get all the owned games of the user. We then pass all of that information to the handlebars template, where the games are rendered as buttons with the Steam App ID as an attribute inside of the button. Then, when the user clicks on an owned game button, we send a request to the Steam Web API to get the stats for that game. We parse that information, and hand it to the handlebars template where it is rendered on the screen.

#### User Story in Action

![User stats demo](/assets/images/user-stats-demo.gif)

### Compare Stats

As an authorized user, I want to compare my stats against my friend's stats so that I can see who is better at a certain game.

#### Route

When the user clicks the compare stats button on a friend, we query the Steam Web API for the owned games of both users. We then find out which games the two users have in common, and pass that along to the handlebars template, where buttons representing each game the two users have in common are rendered with the app id as an attribute. When the user clicks on a shared game button, we make two API calls to the Steam Web API for the user stats of each user, and pass that information along to handlebars, where you select each stat from a dropdown menu and each of the user's stat for that game is rendered as a bar graph on the screen using chart.js

#### User Story in Action

![Compare stats demo](/assets/images/compare-stats-demo.gif)

### Friends Stats

As an authorized user, I want to see my friends stats for the games they own so that I can see how good they are at a certain game.

#### Route

In the friends stats route, we first query the Steam Web API for a list of owned game using the Steam ID of the other user. We then pass that information to the handlebars template each owned game of your friend is a clickable button with the appid as an attribute of each one. Then, when the user clicks on an owned game button, a fetch request is made to the Steam Web API using the appid in the game button. That information is passed along to handlebars, where it is rendered on the page.

#### User Story in Action

![Friends stats demo](/assets/images/friend-stats-demo.gif)

### User Search

As an authorized user, I want to be able to search for users so that I can send them friend requests and see their stats if they aceept.

#### Route

In the route to the search by username page, we take the input from the username input, search the database for anything like the input username, and pass the result information along to handlebars where handlebars along with bootstrap renders each result as a card. The search all route functions the same way, except it finds all users in the database and sends that information to the View where it is rendered. In both cases, each user is rendered differently depending on whether you've sent a friend request to the user, recieved a friend request from the user, or have done neither, at which point you have the option to send a friend request to the user.

#### User Story in Action

![User search demo](/assets/images/user-search-demo.gif)

### Friends Sidebar

As an authorized user, I want to be able to see my friends and friend requests easily in a sidebar so that I can accept or deny a friend request, view the stats of a friend, compare my stats to a friend, or remove that friend.

#### Model

In order to implement friends and friend requests, we had to set up a table called friends and friend requests that link users to each other:  
![Friends table](/assets/images/friends-table.png)

![Friend requests table](/assets/images/friend-requests-table.png)

Then, since we need that information on every page that the user is logged in, we created a middleware function that pulled infor,ation about the user and all their associated Friends and Friend Requests, and included that function in every get route:  
![Friend and friend requests middleware](/assets/images/friend-and-friend-requests-middleware.png)

#### API Route

For the friend requests sidebar buttons, we need to accept or deny friend requests. When a user accepts a friend request, we have to delete the friend request, and create a new friend relationship. When the user clicks the deny friend request button, we must delete the friend request. Thus, for friend requests, we created a route to delete a friend request and add a new friend relationship. On the remove friend button on each friend, we have to remove the friend relationship on click, thus we created a DELETE route to remove a friend relationship. The compare stats and see stats button for each user just redirects to the appropriate page.

#### User Story in Action

![Friends sidebar demo](/assets/images/friends-sidebar-demo.gif)

## Languages and Tools Used

- ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
- ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
- ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Handlebars](https://img.shields.io/badge/Handlebars.js-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=black)
- ![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
- ![Canva](https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white)
- ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## Credits

Credit goes to Dominic for his idea of an application to see and compare stats using the Steam Web API and his vision of a gaudy, neon site to match it.

## Authors

- Dominic Conradson
  - [GitHub](https://github.com/theDomConrad)
- Mason Davis
  - [Github](https://github.com/Md7113)
- Adam Ferro
  - [Github](https://github.com/GeminiAd)
- Pengteda Cheng
  - [Github](https://github.com/teedaa)

[Project Proposal Doc](https://docs.google.com/document/d/1W_pNLU-kfZEp_vOx4Ei3IMMwLpfrLRorjeLP2dLdJ3A/edit#heading=h.1zoy6hvhnyf)

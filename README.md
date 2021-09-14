# GitHub Repo And Issue Browser

## Setup

### Initial setup

- Install Node and NPM
  - Mac
    - Install [Homebrew](https://docs.brew.sh/Installation)
    - Run `brew install node`
  - Windows
    - Download and run the [Node Windows installer](https://nodejs.org/dist/v14.15.3/node-v14.15.3-x86.msi)
  - Linux
    - See [instructions](https://nodejs.org/en/download/package-manager/) for your distribution's package manager
- Install Yarn
  - Run `npm install -g yarn`

### App setup

- Run `yarn` to install dependencies
- Run `yarn dev` to run the app locally in the development mode on `http://localhost:3000`
- Run `yarn test` to run the test suites. If necessary, press 'a' to run all the tests
- Run `yarn test:coverage` to run the coverage report
- (optional) Run `yarn build` to build a production bundle if needed

## User flow

- User lands on the repo summary page that first displays the login form for the Github API key
- Once a valid API key is entered, it gets stored in the session storage. The next time the app is loaded, the login input field will be pre-filled with the API key that will be masked for security
- Once the user gets authenticated, the login form gets hidden and the user is shown all available repos in a single column layout. Each repo card shows repo name and a number of issues for convenience
- User clicks on each repo and, if available, a column of issues is displayed
- User is able to rearrange the issues in the desired order by dragging and dropping the issues in the issues column
- Each issue features the assignee avatar (or a placeholder default avatar if no assignee), title, created date, and the last updated time
- User has the option to click on other issues and reload the page. The order of the issues will be preserved in the session storage

## Technical decisions

- All technical decisions were based on the available GitHub API and my own GitHub repos
- The styles were built using Styled Components
- Media queries were added at crucial breakpoints to service different screen sizes
- An alert message was utilized to alert the user on the user actions, such as invalid API key input and possible network issues
- Running locally, the App scored above 94 in Lighthouse for accessibility and best practices

## Further improvements

- Further improve user experience by bypassing the login form after authentication and showing the repo list
- Add an option to search the repos based on name
- Add the ability to rearrange the repos in the desired order
- Add functionality to sync the customized issue and repo order with the API
- Further improve the transition from a one column to a two column layout
- Add a caching mechanism to limit the number of network calls
- Integrate the app with analytics and logging platforms

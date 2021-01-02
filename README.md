
# todolist
A todo app made with Vue, Vuetify, and Typescript.

## Setup

### Requirements
- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/getting-started/install)

### Installation
```bash
# Clone the repo
git clone https://github.com/rhydev/todolist.git
# Enter the app folder
cd todolist
# Install dependencies
yarn install
```

### Configuration
Rename `.env.example` to `.env` and add your authentication token like so.
```
VUE_APP_API_TOKEN=YOUR_API_TOKEN
```

### Running
>Note that this project is set up to use a webpack dev proxy server for resolving CORS issues. For production builds a proxy server would need to be created.

```bash
# Compiles and hot-reloads for development
yarn serve
# Compiles and minifies for production
yarn build
```

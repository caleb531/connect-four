# Connect Four

*Copyright 2016, Caleb Evans*  
*Released under the MIT License*

This is the most advanced web app implementation of Connect Four, written using
HTML5, JavaScript, and Mithril.

You can play the app online at:  
http://projects.calebevans.me/connect-four/

## Run the project locally

### 1. Install global dependencies

The project requires Node.js and Brunch, so make sure you have both.

```bash
brew install node
```

```bash
npm install -g brunch
```

You may also wish to install the `http-server`  package so you can serve the app
from a local web server (as opposed to serving via `file://` URL).

```bash
npm install -g http-server
```

### 2. Install project dependencies

From the cloned project directory, run:

```bash
npm install
```

### 3. Build app

If you want to build the app once, run:

```bash
brunch build
```

If you want to build the app whenever files change, run:

```bash
brunch watch
```

### 4. Serve app locally

The `brunch build` will create the generated app under the `public/` directory,
so you can serve from there to view the app locally.

```bash
cd public/
http-server -o
```

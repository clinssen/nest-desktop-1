# nest-desktop

**A NEST Desktop application**

![nest-logo](http://www.nest-simulator.org/wp-content/uploads/2015/03/nest_logo.png)

An interactive desktop application for the [NEural Simulation Tool](http://www.nest-initiative.org/).

To install this application you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Electron](http://electron.atom.io/) installed on your computer. Required version for node at least v6.10.xx and npm v3.10.xx.

If you simulate nest locally, you need [nest-server-simulation](https://github.com/babsey/nest-server-simulation) installed on your computer. The application running with NEST v2.10 has been tested.

## To install requirements

### Ubuntu

Install git with sudo

```
sudo apt-get install git
```

Install node with sudo

```
sudo apt-get install nodejs
```

or compile from [source code](https://nodejs.org/en/download/) Note that nodejs should be removed if you want to install node from source code.

## To install NEST Desktop

Clone nest-desktop from github.

```
git clone http://github.com/babsey/nest-desktop
```

Install required dependencies for nest-desktop.

```
cd nest-desktop
npm install
```

## To update NEST Desktop

pull the latest version of nest-desktop from github (in nest-desktop folder).

```
git pull
```

Updated or install required dependencies for nest-desktop.

```
npm install
```

## To start

Nest-desktop communicates with the nest-server-simulation to run the NEST simulation. Note: Make sure that the nest-server-simulation is running.

Start the app in nest-desktop folder.

```
npm start
```

## To configure

A simple configuration handling for your the nest-desktop application.

### For the app

The configuration for the app is saved as `app.json` file in `./data/config` folder

#### Database

Nest-desktop stores data of the network in the database but without any simulation results to keep space low.

The database name will be generated in the initialization step. User is able to edit the database name but it should be treated with respect.

#### Remoted server

If you want to contribute your networks to the server, edit username, password as well as host and port of the remoted database.

#### Nest simulation server

To edit the host and port if the nest simulation server operates on other computer.
### For the window interface with electron

The configuration for the electron is saved as `electron.json` file in `./data/config` folder.

#### Window configuration

The application create a window with these window properties - width, height, frame, fullscreen.

## FAQ

### Why is the app not working?

First, be assure that you installed all required npm packages (`npm install`).

If still not working, the configuation may be deprecated. In this case, delete the config folder or just empty `db_name` in the `app.json`, then restart the app. It will generate new config file and new database.

If still not working, the database may be deprecated. In this case, delete the all files in `./data`, then restart the app.

However, I am working on a better solution.

### Where are the data of simulation stored?

Saved data of the simulation are stored as NeDB database in `./data/\*.db`.

### Where are the protocols of simulation stored?

Protocols of the simulation are stored as NeDB database in `./data/protocols/\*.db`.

### Where are the thumbnails of simulation stored?

Thumbnails of the simulation are stored in `./data/images/`.

### Why is the protocol not working?

Just remove db files in `./data/protocols/`.

### How can I update the thumbnails?

Just click the button 'capture screen'. For the hard case, remove image files in `./data/images/` and then resimulate.

### How can I reload the window?

Keybinding to reload the app is 'CTRL + R' (Linux) or 'CMD + R' (Mac OSX)

### How can I close the window?

Keybinding to close the window is 'CTRL + W' (Linux) or 'CMD + W' (Mac OSX). In Linux the app will be closed when the window is closed.

### What are S, R and N in colored nodes stand for?

These node elements are grouped in stimulator (S), neurons (N) and recorder (R).

### License [MIT](LICENSE)

# Random Survey App

An app that presents random survey questions to the user and records the results.

## Admin Page

To log in as an admin, visit the `/admin` page.

The database is seeded with an admin that has `admin@surveyapp.com` as the email and `password` as the password.

## Without Docker

If you want to use docker to run the app, scroll down to the "With Docker" section.  Everything after that section uses docker.

This section assumes you have `npm`, `make`, and `mysql` installed with mysql already running.

### Installing

Install with npm.

```
npm install
```

### Running

**Before running the app, you need to change the config/config.json file to match your
database setup.**  This allows migrations and seeders to connect to the database.

```
npm start
```

Visit the app at `http://localhost:3000`

### Running Tests

**Make sure the config/config.json matches your database setup.**

```
npm test
```


## With Docker

**Everything in this section uses docker.**

### Requirements

The app uses docker and docker-compose to make it easy to run anywhere.  Depending on your OS, the installation will be different.

Follow a guide from [this page](https://docs.docker.com/engine/installation/) to install docker.

To install docker-compose, follow [this guide](https://docs.docker.com/compose/install/).

To make running tasks easier, `make` is also used.  Most OS's come with `make` already installed.

### Building Containers

Before running anything, you need to build the docker containers.

This process takes a while due to installing npm and bower dependencies:

```
make build
```

### Running The App

After the build has succeeded, run the app with:

```
make
```

This starts the app on port 3000;

#### On Mac

Mac uses a Linux VM to run docker containers.  To view the app in the browser, you need to know what the IP of the VM is:

```
docker-machine ip <machine-name>
```

The default machine name is `default`.

Now visit `http://<vm-ip-address>:3000`

#### On Linux

Linux can use docker natively so you can simply view `http://localhost:3000`

### Running Tests

The tests are run in a docker container that is isolated from the rest of the app.  You can run the tests with:

```
make test
```

### Other Tasks

#### MySQL Console

```
make mysql
```

#### Logs

```
make logs
```

#### Clean

This stops and removes all running containers.  This is good to start fresh with you setup.  Sometimes, in dev,
you will make a change that screwed something up.  It's really easy to just clean everything and run `make` again.

```
make clean
```

### Common Issues

#### Database isn't ready yet.

The makefile starts the app as a daemon so we have to wait for the database to come up before running migrations and seeding.
This takes different amounts of time depending on your machine.  In the makefile, there is a 10 second wait for the db, but
that isn't always long enough. To fix this, just run `make` again.

#### DNS Lookup Error.

I have no idea how to explain this issue but it only happens on Mac.  Occasionally, the server just won't work because the mysql
instance says it can't find the lookup for DNS.  You can check this is the case by running `make logs`.  To fix it, you just need
to restart you docker-machin VM:

```
docker-machine restart <machine-name>
eval $(docker-machine env <machine-name>)
```

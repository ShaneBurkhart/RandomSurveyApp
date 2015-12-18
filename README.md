# Random Survey App

An app that presents random survey questions to the user and records the results.

## Requirements

The app uses docker and docker-compose to make it easy to run anywhere.  Depending on your OS, the installation will be different.

Follow a guide from [this page](https://docs.docker.com/engine/installation/) to install docker.

To install docker-compose, follow [this guide](https://docs.docker.com/compose/install/).

To make running tasks easier, `make` is also used.  Most OS's come with `make` already installed.

## Pull The App

```
git clone https://github.com/ShaneBurkhart/RandomSurveyApp.git
```

## Building Containers

Before running anything, you need to build the docker containers.

This process takes a while due to installing npm and bower dependencies:

```
make build
```

## Running The App

After the build has succeeded, run the app with:

```
make
```

This starts the app on port 3000;

### On Mac

Mac uses a Linux VM to run docker containers.  To view the app in the browser, you need to know what the IP of the VM is:

```
docker-machine ip <machine-name>
```

The default machine name is `default`.

Now visit `http://<vm-ip-address>:3000`

### On Linux

Linux can use docker natively so you can simply view `http://localhost:3000`

## Admin Page

To log in as an admin, visit the `/admin` page.

`make` seeds the database with an admin that has `admin@surveyapp.com` as the email and `password` as the password.

## Running Tests

The tests are run in a docker container that is isolated from the rest of the app.  You can run the tests with:

```
make test
```

## Common Issues

#### Database isn't ready yet.

The makefile starts the app as a daemon so we have to wait for the database to come up before running migrations and seeding.
This takes different amounts of time depending on your machine.  In the makefile, there is a 10 second wait for the db, but
that isn't always long enough. To fix this, just run `make` again.

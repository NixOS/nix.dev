Building and running Docker images
==================================

`Docker <https://www.docker.com/>`_ is a set of tools and services used to
build, manage and deploy containers. As many cloud platforms offer Docker-based
container hosting services, creating Docker containers for a given service is a
common task when building reproducible software. In this tutorial, you will
learn how to build Docker containers using Nix.
Prerequisites
-------------
We assume you have both Nix and `Docker installed <https://docs.docker.com/get-docker/>`_. Docker is available in
nixpkgs, which is the preferred way to install it on NixOS. However, you can
also use the native Docker installation of your OS, if you are on another Linux
distribution or MacOS.


Build your first container
--------------------------

`nixpkgs <https://github.com/NixOS/nixpkgs>`_ provides `dockerTools` to create
Docker images:

.. code:: nix

    { pkgs ? import <nixpkgs> {} }:

    pkgs.dockerTools.buildImage {
      name = "hello-docker";
      config = {
        Cmd = [ "${pkgs.hello}/bin/hello" ];
      };
    }

We call the `buildImage` function from `dockerTools` and pass in a few
parameters: a `name` for our image and a configuration including the command
`Cmd` that should be run inside the container once the image is started. Here we
reference the GNU hello package from nixpkgs and access its 36

Save this in `hello-docker.nix` and build it:

.. code:: shell-session

    $ nix-build hello-docker.nix
    these derivations will be built:
      /nix/store/qpgdp0qpd8ddi1ld72w02zkmm7n87b92-docker-layer-hello-docker.drv
      /nix/store/m4xyfyviwbi38sfplq3xx54j6k7mccfb-runtime-deps.drv
      /nix/store/v0bvy9qxa79izc7s03fhpq5nqs2h4sr5-docker-image-hello-docker.tar.gz.drv
    warning: unknown setting 'experimental-features'
    building '/nix/store/qpgdp0qpd8ddi1ld72w02zkmm7n87b92-docker-layer-hello-docker.drv'...
    No contents to add to layer.
    Packing layer...
    Computing layer checksum...
    Finished building layer 'hello-docker'
    building '/nix/store/m4xyfyviwbi38sfplq3xx54j6k7mccfb-runtime-deps.drv'...
    building '/nix/store/v0bvy9qxa79izc7s03fhpq5nqs2h4sr5-docker-image-hello-docker.tar.gz.drv'...
    Adding layer...
    tar: Removing leading `/' from member names
    Adding meta...
    Cooking the image...
    Finished.
    /nix/store/y74sb4nrhxr975xs7h83izgm8z75x5fc-docker-image-hello-docker.tar.gz

The image tag (`y74sb4nrhxr975xs7h83izgm8z75x5fc`) refers to the Nix build hash
and makes sure that the Docker image corresponds to our Nix build. The store
path at the end of the command line output contains the Docker image.


Run the container
-----------------

To work with the container, load this image into
Docker's image registry from the default `result` file created by nix-build:

.. code:: shell-session

    $ docker load < result
    Loaded image: hello-docker:y74sb4nrhxr975xs7h83izgm8z75x5fc

You can also use the store path to load it to avoid depending on the presence of
`result`:

.. code:: shell-session

    $ docker load < /nix/store/y74sb4nrhxr975xs7h83izgm8z75x5fc-docker-image-hello-docker.tar.gz
    Loaded image: hello-docker:y74sb4nrhxr975xs7h83izgm8z75x5fc

Even more conveniently, you can do it all in one-go. The advantage here is that
`nix-build` will rebuild the image, if there are any changes and pass its store
path to `docker load`:

.. code:: shell-session

    $ docker load < $(nix-build hello-docker.nix)
    Loaded image: hello-docker:y74sb4nrhxr975xs7h83izgm8z75x5fc

Now that you have loaded the image into Docker, it is time to run it:

.. code:: shell-session

    $ docker run -t hello-docker:y74sb4nrhxr975xs7h83izgm8z75x5fc
    Hello, world!


Working with Docker images
--------------------------

A general introduction to working with Docker images is not part of this
tutorial. The `official Docker documentation <https://docs.docker.com/>`_ is a
much better place for that. Note however, that when you want to build your
Docker images with Nix, you will probably not spend time writing a `Dockerfile`,
as Nix replaces its functionality within the Docker ecosystem.

Nonetheless, understanding the anatomy of a Dockerfile may still be useful to
follow along how Nix replaces each of its functions. Using the Docker CLI,
Docker Compose, Docker Swarm or Docker Hub on the other hand may still be
relevant depending on your use case.


Going forward
-------------

More details on how to use `dockerTools` can be found in the `nixpkgs manual
<https://nixos.org/nixpkgs/manual/#sec-pkgs-dockerTools>`_. You will also find
more advanced examples of docker images built with Nix `in the examples file on
nixpkgs
<https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/docker/examples.nix>`_.

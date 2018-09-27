# Sofp Example Backend

This is an example backend for for Simple Observation Features Pilot WFS 3.0 project. The core is available at https://github.com/vaisala-oss/sofp-core

## Packaging

Backends are packaged as docker containers that are built on top of the sofp-core container. A full server is the core + at least one backend. Multiple backends can be packaged by chaining together backends so that the first backend starts from the sofp-core container, then next uses the output of the previous backend container and so forth until all backends are included.

To build this particular mock backend, you can use the Dockerfile in the repository along this documentation. Clone the project, then run:

  docker build -t sofp/example-backend .

To start the image (removing the container when stopped):

  docker run --rm -p 127.0.0.1:8080:3000/tcp sofp/example-backend

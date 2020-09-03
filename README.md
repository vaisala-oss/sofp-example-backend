# Sofp Example Backend

This is an example backend for for Simple Observation Features Pilot WFS 3.0 project. The core is available at https://github.com/vaisala-oss/sofp-core

© 2018-2020 Vaisala Corporation

## Developing

You can run the entire server with this backend using ```npm start```. This will watch the typescript source files, recompile when necessary and restart the server. For this to work, sofp-core must be cloned alongside this backend module directory and compiled (npm install, npm run build).

The step-by-step is as follows:

  cd /where/you/store/projects
  git clone https://github.com/vaisala-oss/sofp-core.git
  git clone https://github.com/vaisala-oss/sofp-example-backend.git
  cd sofp-core
  npm install && npm run build
  cd ..
  cd sofp-example-backend
  npm start

## To release

To release a new version, do the following:

1. Bump the version appropriately in package.json
2. Commit and push all changes
3. rm -r dist/
4. npm run build
5. npm publish

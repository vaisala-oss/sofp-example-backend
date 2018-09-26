FROM spatineo/sofp-core:master

# Switch to root to allow copying and building the project

USER root

COPY . backends/sofp-mock-backend

WORKDIR  ./backends/sofp-mock-backend
RUN npm run build
RUN npm test


# Revert back to the original work directory and the proper user

WORKDIR ../../

USER sofp-user
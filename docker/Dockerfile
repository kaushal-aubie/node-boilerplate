FROM node:16

LABEL name="Node Backend"

# - Create backend folder in container
RUN mkdir -p /backend

# Create app directory
WORKDIR /backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json /backend 

# 'npm install' to install dependencies from package.json file
RUN yarn cache clean --f && yarn install

# Bundle app source
COPY . /backend

# Create typescript build
RUN yarn run build 

# - Start node 
CMD [ "yarn", "run", "start" ]

# - Port expose so that it will access from local environment as well as from container
EXPOSE 8080

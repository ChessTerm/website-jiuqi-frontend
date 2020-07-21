FROM node:12

ENV APP_DIR "/app"
WORKDIR $APP_DIR

ENV NODE_ENV "production"

# Build dependencies
COPY ["package.json", "yarn.lock", "$APP_DIR/"]
RUN yarn install

# Build application
COPY . $APP_DIR
RUN yarn build

# Run application
EXPOSE 3000
CMD yarn serve

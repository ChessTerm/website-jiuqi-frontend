FROM node:12

ENV APP_DIR "/app"
WORKDIR $APP_DIR

ENV NODE_ENV "production"

# Build dependencies
COPY ["package.json", "yarn.lock", ".yarnrc.yml", "$APP_DIR/"]
COPY ".yarn" "$APP_DIR/.yarn"
RUN yarn install

# Build application
COPY . $APP_DIR
RUN yarn build

# Run application
EXPOSE 80
CMD yarn start --port $PORT

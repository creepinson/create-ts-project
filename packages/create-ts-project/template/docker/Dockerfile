FROM ianwalter/pnpm as node

# ----------------------------------------
# Build the app.
# ----------------------------------------

FROM node as build

WORKDIR /tmp/build

ARG TEMP_DEPS_DIR

# ----- Copy only the files that affect pnpm run install -----
# Allows docker to use cache and skip install if dependencies are unchanged.
# Assumes that ./packages/*/package.json files have been copied to TEMP_DEPS_DIR
# with that same directory structure. build.sh does this.
COPY pnpm-workspace.yml /tmp/build/
COPY package.json /tmp/build/
COPY ${TEMP_DEPS_DIR} /tmp/build/

# ----- Install dependencies -----
# Install dependencies exactly as in the pnpm run.lock file - no updates.
RUN pnpm i

# ----- Copy source and all other files that affect lint, test, build -----
COPY config config/
COPY packages packages/
COPY .eslintignore ./
COPY .eslintrc.js ./

# ----- Lint, test and build -----
RUN pnpm run verify:all

# ----- Bundle the app for deployment -----
ARG APP_NAME
RUN pnpm run -r --prod --filter ${APP_NAME} tsp bundle ${APP_NAME} --out-dir /tmp/bundle


# ----------------------------------------
# Copy files to the deployment image.
# ----------------------------------------

FROM node

ENV NODE_ENV=production
ENV PORT=8001
EXPOSE 8001

# This user is created in the base image with uid and gid = 1000.
USER node

# ----- Copy files required at runtime by the app -----
COPY --from=build --chown=1000:1000 /tmp/build/node_modules /home/node/node_modules/
COPY --from=build --chown=1000:1000 /tmp/bundle /home/node/

ARG COMMIT_HASH
ENV COMMIT_HASH ${COMMIT_HASH:-unknown}

ARG APP_DIR
WORKDIR /home/node/${APP_DIR}

CMD ["node", "./lib/index.js"]

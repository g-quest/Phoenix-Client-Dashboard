# Base Stage: Install Dependencies
FROM node:20-alpine AS base
LABEL project="phoenix" stage="base"
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
USER node
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm install

# Build Stage: Build the Next.js App
FROM node:20-alpine AS build
LABEL project="phoenix" stage="build"
ARG API
ARG NEXT_PUBLIC_API
USER node
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# Development Stage: For Local Development
FROM node:20-alpine AS local
LABEL project="phoenix" stage="development"
USER node
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]

# Production Stage: Serve the Built App
FROM node:20-alpine AS production
LABEL project="phoenix" stage="production"
USER node
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
CMD ["npm", "start"]
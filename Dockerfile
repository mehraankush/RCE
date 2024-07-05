# Stage 1: Build the app
FROM node:16 AS build
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:16
WORKDIR /app
COPY --from=build /app/build .
EXPOSE 3000
CMD [ "npm", "start" ]


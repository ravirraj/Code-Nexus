# Stage 1: Build the project
FROM node:18-alpine AS builder

WORKDIR /build

# Copy package files and install dependencies
COPY package*.json ./

RUN npm ci

# Copy the rest of the source code and build
COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./

# Expose the port
EXPOSE 5173

# Start the server
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
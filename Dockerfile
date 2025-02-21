# Build stage
FROM node:18-slim AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim AS production

# Create app directory
WORKDIR /usr/src/app

# Create a non-root user
RUN groupadd -r nestjs && useradd -r -g nestjs nestjs

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/mail/templates ./src/mail/templates

# Create and set permissions for uploads directory
RUN mkdir -p uploads && chown nestjs:nestjs uploads && chmod 755 uploads

# Set ownership for the app directory
RUN chown -R nestjs:nestjs .

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Start the application
CMD [ "node", "dist/main" ]


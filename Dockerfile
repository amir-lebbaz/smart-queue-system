# Production Dockerfile for Smart Queue System
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Run production build
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

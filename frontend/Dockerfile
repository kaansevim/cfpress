FROM node:20-alpine

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (default vite dev port is 5173, but we can map it to 3000 or use host)
# The compose file maps 3000, so let's run vite with --host and specific port
EXPOSE 3000

# Start in development mode
# Note: For production, you would run `npm run build` and then start the built output
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Install Playwright dependencies
RUN bunx playwright install-deps chromium

# Set working directory
WORKDIR /workspace

# Keep container running
CMD ["sleep", "infinity"]

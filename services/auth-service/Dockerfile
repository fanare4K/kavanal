FROM python:3.11

# Set work directory
WORKDIR /app

# Install system dependencies (required for mysqlclient + netcat)
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    netcat-openbsd

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Give execution permission
RUN chmod +x /entrypoint.sh

# Expose Django port
EXPOSE 8000

# Use entrypoint instead of direct runserver
CMD ["/entrypoint.sh"]
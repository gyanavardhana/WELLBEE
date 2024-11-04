#!/bin/bash

# Exit on any error
set -e

# Function to show usage
show_usage() {
    echo "Usage: $0 [-e /path/to/.env]"
    echo "Options:"
    echo "  -e    Path to .env file (optional)"
    exit 1
}

# Function to check if command executed successfully
check_status() {
    if [ $? -eq 0 ]; then
        echo "✓ $1 completed successfully"
    else
        echo "✗ Error during $1"
        exit 1
    fi
}

# Function to check if script is run with sudo
check_sudo() {
    if [ "$EUID" -ne 0 ]; then 
        echo "Please run this script with sudo privileges"
        exit 1
    fi
}

# Function to handle .env file
handle_env_file() {
    local env_path="$1"
    if [ -n "$env_path" ]; then
        if [ ! -f "$env_path" ]; then
            echo "Error: .env file not found at $env_path"
            exit 1
        fi
        echo "Copying .env file..."
        cp "$env_path" WELLBEE/.env
        check_status "ENV file copy"
    else
        echo "No .env file specified, skipping..."
    fi
}

# Main installation process
main() {
    check_sudo

    # Parse command line arguments
    local env_file=""
    while getopts "e:h" opt; do
        case $opt in
            e) env_file="$OPTARG"
            ;;
            h) show_usage
            ;;
            \?) echo "Invalid option -$OPTARG" >&2
                show_usage
            ;;
        esac
    done

    echo "Starting WELLBEE setup..."
    
    # Update package list
    echo "Updating package list..."
    apt update
    check_status "Package list update"

    # Install Docker
    echo "Installing Docker..."
    apt install -y docker.io
    check_status "Docker installation"

    # Install Docker Compose
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    check_status "Docker Compose installation"

    # Verify Docker Compose installation
    echo "Verifying Docker Compose installation..."
    docker-compose --version
    check_status "Docker Compose verification"

    # Clone repository
    echo "Cloning WELLBEE repository..."
    git clone https://github.com/gyanavardhana/WELLBEE.git
    check_status "Repository cloning"

    # Handle .env file
    handle_env_file "$env_file"

    # Change directory and set up permissions
    cd WELLBEE
    echo "Setting up permissions..."
    chmod +x allowed_ports.sh
    check_status "Permissions setup"

    # Run the ports script
    echo "Configuring ports..."
    ./allowed_ports.sh
    check_status "Ports configuration"

    # Start the application
    echo "Starting WELLBEE application..."
    docker-compose up
    check_status "Application startup"
}

# Run the script
main "$@"

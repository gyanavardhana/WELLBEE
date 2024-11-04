#!/bin/bash

# Make this script executable
chmod +x $0

# Allow ports
ufw allow 3000
ufw allow 5173
ufw allow 3002

# Reload ufw
ufw reload

# Display ufw status
ufw status

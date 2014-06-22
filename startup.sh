#!/bin/bash
LANG=C #needed for perl locale

set -eu

# Start the services
# We limit to service to avoid the container to exit on app crash
/usr/sbin/sshd -D &
PORT=8080 DEBUG=yapdnsui node /app/yapdnsui/bin/www


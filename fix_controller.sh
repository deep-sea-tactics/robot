#!/bin/sh

echo "KERNEL==\"hidraw*\", SUBSYSTEM==\"hidraw\", MODE=\"0664\", GROUP=\"plugdev\"" > /etc/udev/rules.d/99-hidraw-permissions.rules
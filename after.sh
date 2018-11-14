#!/bin/sh

# If you would like to do some extra provisioning you may
# add any commands you wish to this file and they will
# be run after the Homestead machine is provisioned.
#
# If you have user-specific configurations you would like
# to apply, you may also create user-customizations.sh,
# which will be run after this script.

cd /home/vagrant/code
composer install
php artisan key:generate --ansi
php artisan migrate
php artisan db:seed
php artisan ide-helper:generate
php artisan ide-helper:meta
php artisan ide-helper:model -n
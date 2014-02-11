#!/bin/bash

# Make sure we're in the right dir
cd /home/willem/projects/geofront

export BRANCH=$1
export ENV=$2
git checkout $BRANCH

export COMMIT=$(git rev-parse --short HEAD)
export FILE=$COMMIT.tar.gz
export HOST=georeliefs.com
export DATE=$(date)

# Update appcache.manifest
cp appcache.manifest old.appcache.manifest
sed -i "s/DATE/$DATE/g" appcache.manifest

# Replace localhost with georeliefs.com
cp js/config.js js/old.config.js
sed -i "s/localhost/$HOST/g" js/config.js

# Insert commit hash into header
cp templates/header.html templates/old.header.html
sed -i "s/in-dev/$COMMIT/g" templates/header.html

# Build it
r.js -o build/app.build.js

cd dist
tar -cvzf $FILE appcache.manifest index.php css/* js/main.js img/ js/lib/bower_components/leaflet/dist/leaflet.css js/lib/bower_components/leaflet/dist/leaflet.ie.css js/lib/bower_components/requirejs/require.js
scp -r $FILE ubuntu@$HOST:/home/ubuntu/ && rm $FILE &&
ssh ubuntu@$HOST "cd /var/www/releases && sudo mkdir $COMMIT && sudo tar -xf /home/ubuntu/$FILE -C $COMMIT && rm /home/ubuntu/$FILE && cd /var/www && sudo rm /var/www/$ENV && sudo ln -s /var/www/releases/$COMMIT /var/www/$ENV"

cd ..
# Revert js/config.js
mv js/old.config.js js/config.js
# Revert templates/header.html
mv templates/old.header.html templates/header.html
# Revert appcache.manifest
mv old.appcache.manifest appcache.manifest


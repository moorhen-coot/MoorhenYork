#!/bin/bash

theDate=`date +%Y-%m-%d-%H%M`
exec 1> /y/people/sjm27/Moorhen-nightly/moorhen_nightly-${theDate}.log
exec 2>&1

#This script:
#    Builds Moorhen from the specifiedbranch with the Coot version specified in VERSIONS.
#    Uses the resultant build to create a simple "servable" directory using MoorhenYork.
#    Copies the directory produced to https://moorhen.hosted.york.ac.uk/dev .

#The script (unfortunately) assumes that Moorhen has already been checked out and built previously.

BRANCH=main

#The following source the emsdk environment.
#(*This* script + emsdk_env.sh does not work with all Bourne like shells! 'dash' does not work with this.)
. /y/people/sjm27/Moorhen-nightly/emsdk/emsdk_env.sh

#This sets the PATH for some user installed utilities not in system PATH in York machine 'frigg'.
PATH=/y/people/sjm27/Moorhen-nightly/utils/bin:$PATH
PATH=/y/people/sjm27/Moorhen-nightly/meson_env/bin:$PATH
PATH=/y/people/sjm27/Moorhen-nightly/emsdk/node/22.16.0_64bit/bin:$PATH

fail() {
    echo $1
    exit 1
}

echo "#####################################################################"
echo "Checking out latest version of Moorhen ${BRANCH} branch"
echo "#####################################################################"

cd /y/people/sjm27/Moorhen-nightly/Moorhen || fail "Error changing to Moorhen directory"
git pull || fail "Error pulling current branch"
git checkout ${BRANCH} || fail "Error checking out ${BRANCH}"
git pull || fail "Error pulling ${BRANCH}"

#echo "#####################################################################"
#echo "Checking out latest version of Coot's main branch inside Moorhen"
#echo "#####################################################################"

#cd checkout/coot-1.0 || fail "Error changing to Moorhen's Coot directory"
#git pull || fail "Error pulling Coot"

echo "#####################################################################"
echo "Building Moorhen"
echo "#####################################################################"

cd /y/people/sjm27/Moorhen-nightly/Moorhen || fail "Error changing to Moorhen directory"
./moorhen_build.sh         moorhen || fail "Error building 32-bit version of Moorhen"
./moorhen_build.sh --64bit moorhen || fail "Error building 64-bit version of Moorhen"

echo "#####################################################################"
echo "Building Moorhen tar ball"
echo "#####################################################################"

cd baby-gru || fail "Error changing to Moorhen's baby-gru directory"
patch_ver=$(npm version prepatch --preid `git rev-parse --short HEAD`-`date +%Y-%m-%d`) || fail "Error changing version number"
echo "Patched nightly version number: $patch_ver"
#npm run build-release || fail "Error running 'npm run build-release'"
npm run build-release-dev || fail "Error running 'npm run build-release-dev'"
cd dist || fail "Error changing to Moorhen's baby-gru/dist directory"
npm pack || fail "Error running 'npm pack' in Moorhen's baby-gru/dist directory"
cd .. || fail "Error going back to Moorhen's baby-gru directory"
git restore package.json package-lock.json || fail "Error restoring version number"

echo "#####################################################################"
echo "Updating MoorhenYork"
echo "#####################################################################"

cd /y/people/sjm27/Moorhen-nightly || fail "Error changing to Moorhen-nightly directory"
cd MoorhenYork || fail "Error changing to MoorhenYork directory"
git restore . || fail "Error restoring MoorhenYork current branch"
git pull || fail "Error pulling MoorhenYork current branch"
git checkout main || fail "Error checking out MoorhenYork main branch."
git pull || fail "Error pulling MoorhenYork main branch."

echo "#####################################################################"
echo "Building MoorhenYork"
echo "#####################################################################"

npm install || fail "Error running 'npm install' in MoorhenYork directory"
rm -fr node_modules/moorhen package-lock.json
npm install ../Moorhen/baby-gru/dist/moorhen-${patch_ver#v}.tgz || fail "Error running 'npm install' of Moorhen tar ball moorhen-${patch_ver#v}.tgz"
mkdir -p ./public || fail "Error making MoorhenYork/public directory"

cp -r ./node_modules/moorhen/public/* ./public/ || fail "Error copying Moorhen 'public' in MoorhenYork directory"
SERVER_ROOT="/dev/" npm run build || fail "Error running 'npm build' in MoorhenYork directory"

echo "#####################################################################"
echo "Sending build to web server"
echo "#####################################################################"

#rsync -avzP -e ssh dist/ moorhen@moorhen.hosted.york.ac.uk:public_html/dev || fail "Error sending build to server"
scp -Cr dist/* moorhen@moorhen.hosted.york.ac.uk:public_html/dev || fail "Error sending build to server"

echo "#####################################################################"
echo "All finished"
echo "#####################################################################"

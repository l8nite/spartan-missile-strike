To set yourself up for iOS development, from a fresh clone:


- Set up the Facebook SDK submodule:

    git submodule init && git submodule update
    cd client/ios/External/facebook-ios-sdk
    ./scripts/build_framework.sh
    # Note, you will get some unit test failures regarding testing app secret
    # and key, these are safe to ignore

- Copy 'assets' folder from Dropbox into spartan-missile-strike/client/

    cp -R /Dropbox/SJSU\ Engineering\ Missile\ Strike/assets spartan-missile-strike/client/

- Open SpartanMissileStrike.xcodeproj and start developing!

SETTING UP ANDROID SDK:
  Before coding/testing the Android client, do the following things: 
    - make a symbolic link for the android/assets folder to the client/html and client/shared folder
    - make a keyhash for Facebook SDK (must be given to Facebook)

  For Windows, the command for creating symlinks are (RUN CMD AS ADMIN)
    set SMSGIT=
    cd %SMSGIT%\client\droid\android\
	mklink /D res\ ..\..\assets\android\res\
	mklink ic_launcher-web.png ..\..\assets\android\ic_launcher-web.png
	mkdir assets\assets\shared\
	mklink /D assets\html\ ..\..\..\html\
	mklink /D assets\assets\shared\images\ ..\..\..\..\..\assets\shared\images\

  For Windows, the command for creating the facebook debug keyhash: (you will need download openssl, for windows: https://code.google.com/p/openssl-for-windows/)
    set OPENSSLDIR=
    keytool -exportcert -alias androiddebugkey -keystore "%HOMEPATH%"\.android\debug.keystore | "%OPENSSLDIR%"\openssl.exe sha1 -binary | "%OPENSSLDIR%"\openssl.exe base64
    <<password = 'android' (without quotes)>>



Android SDK
1. Download Android SDK from http://developer.android.com/sdk/index.html
2. Launch Android SDK Manager after starting the packaged Eclipse
3. Install the necessary packages
	a. Tools/: *
	b. API17/: SDKPlatform, All System Images, Documentation/API/Sources if wanted
	c. API14/: Same as API 17/
	d. Extra/: Support Lib, Play Serives, APK expansions, USB Driver, Web Driver, emulator faster build times
4. Afer installing packages, launch AVD manager from packaged Eclipse
5. Create an AVD to test MissileApp, Sample Minimum:
	a. New > AVD Name, Any Device (Ideally, Galaxy Nexus)
	b. Target > 4.0 Minimum
	c. Camera are not always operational
	d. Memory Options: Maximum 768
	e. Internal: Minimum 256 MB 
	f. SD Card: Minimum: 512 MB
	g. Check Snapshots ("Hibernates" AVD to disk, fast near instances load times)
	h. (Optional) Use Host GPU for hardware acceleration
6. Start AVD for first time and close after loading (NOTE: takes 3-5 mins)
7. Any consecutive load times should be much faster if snapshot is enabled. 

HTML Assets:
Before coding/testing the Android client, make a symbolic link for the android/assets folder to the client/html folder
For Windows, the command is "mklink /d assets\ ..\..\html\" (assuming that you are in the root directory of the android project). You may need to delete the assets the folder if you encounter "Access is Denied"


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

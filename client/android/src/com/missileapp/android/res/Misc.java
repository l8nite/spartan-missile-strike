package com.missileapp.android.res;

import android.os.Vibrator;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.missileapp.android.MALogger;
import com.missileapp.android.MissileApp;

public class Misc {
	
	/**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public static void hideSplash(final MissileApp missileapp, final ImageView splashScreen) {
    	final String TAG = "HideSplash";
        MALogger.log(TAG, Log.VERBOSE, "CMD Hide Splash");
        // Runs on the UI Thread
        missileapp.runOnUiThread(new Runnable() {
            
            @Override
            public void run() {
                try {
                    splashScreen.setVisibility(View.GONE);
                    MALogger.log(TAG, Log.VERBOSE, "Splash Screen Removed.");
                }
                catch (Exception e) {
                    // There should be no exception here but just in case...
                    MALogger.log(TAG, Log.ERROR, "Unable to hide splash: " + e.getMessage(), e);
                }
            }
        });
    }
    
	
	/**
     * Vibrates the Android device 
     * @param time - time to vibrate the device
     */
    public static void vibrate(Vibrator vibrator, String time) {
    	final String TAG = "Vibrate";
        long milliseconds;
        
        // Parse time
        try {
            milliseconds = Long.parseLong(time);
        }
        catch (Exception e) {
            milliseconds = 0;
        }
        MALogger.log(TAG, Log.INFO, "Vibrate command: " + time + ", parsed to: " + milliseconds + ".");
        
        // Vibrate if the vibrator instance is created, has a vibrator, and the time to vibrate is greater than 0ms 
        if (vibrator != null && vibrator.hasVibrator() && milliseconds > 0) {
            vibrator.vibrate(milliseconds);
        }
    }
}
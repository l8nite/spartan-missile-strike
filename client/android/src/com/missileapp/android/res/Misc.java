package com.missileapp.android.res;

import android.os.Vibrator;
import android.util.Log;

import com.missileapp.android.MALogger;

public class Misc {
	
	/**
     * Vibrates the Android device 
     * @param time - time to vibrate the device
     */
    public static void vibrate(Vibrator vibrator, String time) {
    	String TAG = "Vibrate";
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

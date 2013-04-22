package com.missileapp.android.res;

import android.os.Vibrator;
import android.util.Log;
import android.view.View;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

public class Utilities {
	
	/**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public static void hideSplash(final BagOfHolding variables) {
    	final String TAG = "HideSplash";
        MALogger.log(TAG, Log.VERBOSE, "CMD Hide Splash");
        
        // Runs on the UI Thread
        variables.getMissileApp().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    variables.getSplashScreen().setVisibility(View.GONE);
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
    public static void vibrate(BagOfHolding variables, String time) {
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
        Vibrator vibrator = variables.getVibrator();
        if (vibrator != null && vibrator.hasVibrator() && milliseconds > 0) {
            vibrator.vibrate(milliseconds);
        }
    }
    
    
    /**
     * Event from Native Bridge, if true, call default back request, else notify back
     * @param inMainMenu true if in Main Menu; else false
     */
    public static void processBackButton(BagOfHolding variables, String inMainMenu) {
    	final String TAG = "Back Button";
    	boolean inMainMenuView;
    	
    	MALogger.log(TAG, Log.INFO, "ProcessBackButton command: " + inMainMenu + ".");
    	
    	// Parse State
    	try {
            inMainMenuView = Boolean.valueOf(inMainMenu);
        }
        catch (Exception e) {
            inMainMenuView = true;
            MALogger.log(TAG, Log.ERROR, "Error: " + e.getMessage() , e);
        }
    	MALogger.log(TAG, Log.INFO, "ProcessBackButton command: " + inMainMenu + ", parsed to: " + inMainMenuView + ".");
    	
    	// Process back request
    	if(inMainMenuView) {
    	    variables.getMissileApp().callBackButton();
    	}
    	else {
    	    final String url = "previousView()";
            variables.getDroidBridge().callNativeBridge(url);
    	}
    }
}

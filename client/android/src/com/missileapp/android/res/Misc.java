package com.missileapp.android.res;

import android.os.Vibrator;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;
import com.missileapp.android.MissileApp;

public class Misc {
	
	/**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public static void hideSplash(BagOfHolding variables, final MissileApp missileapp, final ImageView splashScreen) {
    	final String TAG = "HideSplash";
        MALogger.log(TAG, Log.VERBOSE, "CMD Hide Splash");
        
        if(variables.isEnabled()) {
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
        else {
        	variables.setHideSplash(true);
        }
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
    
    
    /**
     * Event from Native Bridge, if true, call default back request, else notify back
     * @param inMainMenu true if in Main Menu; else false
     */
    public static void processBackButton(BagOfHolding variables, String inMainMenu) {
    	final String TAG = "Back Button";
    	boolean inMainMenuView;
    	
    	MALogger.log(TAG, Log.INFO, "ProcessBackButton command: " + inMainMenu + ".");
    	
    	try {
            inMainMenuView = Boolean.valueOf(inMainMenu);
        }
        catch (Exception e) {
            inMainMenuView = true;
            MALogger.log(TAG, Log.ERROR, "Error: " + e.getMessage() , e);
        }
    	MALogger.log(TAG, Log.INFO, "ProcessBackButton command: " + inMainMenu + ", parsed to: " + inMainMenuView + ".");
    	if(inMainMenuView) {
    		final String url = "NativeBridge.previousView()";
    		variables.getDroidBridge().callJS(url);
    	}
    	else {
    		variables.getMissileApp().callBackButton();
    	}
    }
}

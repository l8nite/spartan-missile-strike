package com.missileapp.android;

import android.content.Context;
import android.os.Vibrator;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;

public class AndroidBridge extends MissileApp {
    // Data
    private static final String TAG = "AndroidBridge";                     // TAG for logging
    private static final String CallJSPrefix = "javascript:"; 
    private static final String NBCallBack_prefix = "NativeBridge.callback(";
    private static final String NBCallBack_postfix = ");";
    
    // Variables
    private static BagOfHolding variables;           // Bag Of Holding for Variables
    private Vibrator vibrator;                    // Device vibrator
    
    /**
     * Android Concrete Methods for HTML/Native Bridge
     * @param context - Android MissileApp/Context {@link Context}
     * @param webview - MissileApp webView {@link WebView}
     */
    public AndroidBridge(BagOfHolding variables) {
        MALogger.log(TAG, Log.INFO, "Init Android Bridge");
        AndroidBridge.variables = variables;
        
        //NOTE: System Services are not available during this phase 
        // Init variables
        vibrator = null;
    }
    
    /**
     * Calls the NativeBridge CallBack function
     * @param callbackident - callback identifier, see Native Bridge
     * @param callbackData - data to pass to the callback identifier
     */
    public void callJS(String callbackident, String callbackData) {
        String url = NBCallBack_prefix + callbackident + "," + callbackData + NBCallBack_postfix;
        this.callJS(url);
    }
    
    
    /**
     * Calls the JavaScript and executes the 
     * @param url - javascript to run
     */
    public void callJS(String url) {
        variables.getWebView().loadUrl(CallJSPrefix +  url);
    }
    
    
    
    /**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public void hideSplash() {
        MALogger.log(TAG, Log.VERBOSE, "CMD Hide Splash");
        // Runs on the UI Thread
        runOnUiThread(new Runnable() {
            
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
     * Get a user preference
     * @param preference - retrieve user preference associated with the key 
     * @param callbackID - callback function to asscoiate with
     */
    public void getPreference(String preference, String callbackID) {
        variables.getUserPrefs().getPreference(callbackID, preference);
    }
    
    
    /**
     * Set (a) user preference(s)
     * @param preference - json data with key value pairs 
     * @param callbackID - callback function to asscoiate with
     */
    public void setPreference(String preference, String callbackID) {
        variables.getUserPrefs().setPreferences(callbackID, preference);
    }
    
    
    /**
     * Vibrates the Android device 
     * @param time - time to vibrate the device
     */
    public void vibrate(String time) {
        //TODO VERIFY THIS WORKS, SYSTEM SRVICES MAY NOT BE AVAILABLE HERE 
        long milliseconds;
        
        // Parse time
        try {
            milliseconds = Long.parseLong(time);
        }
        catch (Exception e) {
            milliseconds = 0;
        }
        MALogger.log(TAG, Log.INFO, "Vibrate command: " + time + ", parsed to: " + milliseconds + ".");
        
        // Create Vibrator if it existst
        if(vibrator == null) {
            vibrator = (Vibrator) super.getSystemService(Context.VIBRATOR_SERVICE);
        }
        
        // Vibrate if the vibrator instance is created, has a vibrator, and the time to vibrate is greater than 0ms 
        if (vibrator != null && vibrator.hasVibrator() && milliseconds > 0) {
            vibrator.vibrate(milliseconds);
        }
    }
    
    
    
    /**
     * If in firescreen, cuts camera and sets the background white
     * If not in firescreen, rolls camera and sets the background transparent
     * @param showFireScreen - true to enter fire screen, false to exit
     */
    public void showFireMissileScreen(String showFireScreen) {
        boolean showScreen;
        
        // Parse command
        try {
            showScreen = Boolean.parseBoolean(showFireScreen);
        }
        catch (Exception e) {
            showScreen = false;
        }
        MALogger.log(TAG, Log.INFO, "Fire Screen command: " + showFireScreen + ", parsed to: " + showScreen + ".");
        
        if (showScreen) {
            variables.getFireScreen().enterFireScreen();
        }
        else {
            variables.getFireScreen().exitFireScreen();
        }
    }
    
    
}

package com.missileapp.android;

import org.json.JSONException;

import com.missileapp.android.res.Misc;

import android.content.Context;
import android.util.Log;
import android.webkit.WebView;

public class AndroidBridge {
    // Data
    private static final String TAG = "AndroidBridge";                     // TAG for logging
    private static final String CALL_NB_PREFIX = "javascript:NativeBridge."; 
    private static final String CALLBACK_PREFIX = "callback(";
    private static final String CALLBACK_POSTFIX = ")";
    
    // Variables
    private BagOfHolding variables;           // Bag Of Holding for Variables
    
    /**
     * Android Concrete Methods for HTML/Native Bridge
     * @param context - Android MissileApp/Context {@link Context}
     * @param webview - MissileApp {@link WebView}
     */
    public AndroidBridge(BagOfHolding variables) {
        MALogger.log(TAG, Log.INFO, "Init Android Bridge");
        this.variables = variables;
    }
    
    /**
     * Calls the native bridge call back function
     * @param url - javascript to run
     */
    public void callNativeBridge(final String url) {
        variables.getMissileApp().runOnUiThread(new Runnable() {
            
            @Override
            public void run() {
                variables.getWebView().loadUrl(CALL_NB_PREFIX +  url);
            }
        });
    }
    
    /**
     * Notify Native Bridge to Wake
     */
    public void wakeNativeBridge() {
    	final String url = "wake()";
    	this.callNativeBridge(url);
    }
    
    /**
     * Asks native if in main menu
     */
    public void requestMainMenuViewStatus() {
    	final String url = "onMainMenu()";
    	this.callNativeBridge(url);
    }
    
    /**
     * Calls the NativeBridge CallBack function
     * @param callbackident - callback identifier, see Native Bridge
     * @param callbackData - data to pass to the callback identifier
     */
    public void notifyNativeBridgeCallback(String callbackID, String callbackData) {
        String url = CALLBACK_PREFIX + callbackID + "," + callbackData + CALLBACK_POSTFIX;
        this.callNativeBridge(url);
    }
    
    /**
     * If in Main Menu, process back else, call back function
     * @param inMainMenu true if in main menu
     */
    public void onMainMenu(String inMainMenu) {
    	Misc.processBackButton(variables, inMainMenu);
    }
    
    /**
     * Starts location updates to Native Bridge
     * @param callbackID - callback identifier
     */
    public void startLocationUpdates(String callbackID) {
        variables.getLocationManagement().startLocationUpdates(callbackID);
    }
    
    /**
     * Stops location updates to Native Bridge
     */
    public void stopLocationUpdates() {
        variables.getLocationManagement().stopLocationUpdates();
    }
    
    /**
     * Starts orientation updates to Native Bridge
     * @param callbackID callback identifier
     */
    public void startOrientationUpdates(String callbackID) {
        variables.getGyro().startOrientationUpdates(callbackID);
    }
    
    /**
     * Starts orientation updates to Native Bridge
     * @param callbackID callback identifier
     */
    public void stopOrientationUpdates() {
        variables.getGyro().stopOrientationUpdates();
    }
    
    /**
     * Starts up Firescreen
     */
    public void showFireMissileScreen() {
        variables.getFireScreen().enterFireScreen();
    }
    
    /**
     * Exits FireScreen
     */
    public void hideFireMissileScreen() {
        variables.getFireScreen().exitFireScreen();
    }
    
    /**
     * Get a user preference
     * @param preference - retrieve user preference associated with the key 
     * @param callbackID - callback function to asscoiate with
     * @throws JSONException - thrown if there was an exception 
     */
    public void getPreferences(String preference, String callbackID) {
        try {
			variables.getUserPrefs().getPreference(callbackID, preference);
		} catch (JSONException e) {}
    }
    
    /**
     * Set (a) user preference(s)
     * @param preference - json data with key value pairs 
     * @param callbackID - callback function to asscoiate with
     * @throws JSONException - throws {@link JSONException} if error
     */
    public void setPreferences(String preference, String callbackID) {
        try {
			variables.getUserPrefs().setPreferences(callbackID, preference);
		} catch (JSONException e) { }
    }
    
    /**
     * Returns the Facebook Access Token
     * @param callbackID - Native Bridge Callback Identifier
     */
    public void getFacebookAccessToken(String callbackID) {
        MALogger.log(TAG, Log.INFO, "SENDING FACEBOOK ACCESS TOKEN");
        variables.getFacebookAuth().notifyNativeBridgeAccessToken(callbackID);
    }
    
    /**
     * Logout of Facebook
     */
    public void logoutFacebook() {
        MALogger.log(TAG, Log.INFO, "Logging Out of Facebook");
    	variables.getFacebookAuth().logoutFacebook();
    }
    
    /**
     * Plays Sound 
     * @param soundID - sound id to play
     * @param options - play options
     */
    public void playSound(String soundID, String options) {
        variables.getMediaManager().playSound(soundID, options);
    }
    
    /**
     * Stops sound
     * @param soundID - sound id to stop
     */
    public void stopSound(String soundID) {
        variables.getMediaManager().stopSound(soundID);
    }
    
    /**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public void hideSplash() {
    	Misc.hideSplash(variables, variables.getMissileApp(), variables.getSplashScreen());
    }
    
    
    /**
     * Vibrates the Android device 
     * @param time - time to vibrate the device
     */
    public void vibrate(String time) {
    	Misc.vibrate(variables, time);
    }
    
    /**
     * Allows logging to Native Bridge
     * @param data - data to Log
     */
    public void log(String data) {
        MALogger.log("NativeBridge", Log.INFO, data);
    }
}

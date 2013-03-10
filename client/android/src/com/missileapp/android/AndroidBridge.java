package com.missileapp.android;

import org.json.JSONException;

import com.missileapp.android.res.MediaManager;
import com.missileapp.android.res.Misc;

import android.content.Context;
import android.util.Log;
import android.webkit.WebView;

public class AndroidBridge {
    // Data
    private static final String TAG = "AndroidBridge";                     // TAG for logging
    private static final String CallJSPrefix = "javascript:"; 
    private static final String NBCallBack_prefix = "MissileAppHTML.NativeBridge.callback(";
    private static final String NBCallBack_postfix = ");";
    
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
     * Notify Native Bridge to Wake
     */
    public void callJSforWake() {
    	final String url = "MissileAppHTML.wake()";
    	this.callJS(url);
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
     * If in Main Menu, process back else, call back function
     * @param inMainMenu
     */
    public void onMainMenu(String inMainMenu) {
    	Misc.processBackButton(variables, inMainMenu);
    }
    
    /**
     * Subscribe to location updates 
     * @param activate - true to subscribe; else false
     * @param callbackID - native bridge callback identifer
     */
    public void getLocationUpdates(String activate, String callbackID) {
    	//TODO: Implement
    }
    
    /**
     * Return's the user current location
     * @param callbackIdentifier
     */
    public void getCurrentLocation(String callbackIdentifier) {
    	//TODO: Implement
    }
    
    /**
     * Subscribe to location updates 
     * @param activate - true to subscribe; else false
     * @param callbackID - native bridge callback identifer
     */
    public void getOrientationUpdates(String activate, String callbackID) {
    	//TODO: Implement
    }
    
    
    /**
     * If in firescreen, cuts camera and sets the background white
     * If not in firescreen, rolls camera and sets the background transparent
     * @param showFireScreen - true to enter fire screen, false to exit
     */
    public void showFireMissileScreen(String showFireScreen) {
        variables.getFireScreen().showFireMissileScreen(showFireScreen);
    }
    
    
    /**
     * Get a user preference
     * @param preference - retrieve user preference associated with the key 
     * @param callbackID - callback function to asscoiate with
     * @throws JSONException - thrown if there was an exception 
     */
    public void getPreference(String preference, String callbackID) {
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
    public void setPreference(String preference, String callbackID) {
        try {
			variables.getUserPrefs().setPreferences(callbackID, preference);
		} catch (JSONException e) { }
    }
    
    
    /**
     * Returns the Facebook Access Token
     * @param callbackID - Native Bridge Callback Identifier
     */
    public void getFacebookAccessToken(String callbackID) {
    	//TODO: Implement
    }
    
    /**
     * Logout of Facebook
     */
    public void logoutFacebook() {
    	//TODO: Implement
    }
    
    
    /**
     * Plays Sound Effect/Music
     * @param options {@link MediaManager#playSound(String)}
     */
    public void playSound(String options) {
    	variables.getMediaManager().playSound(options);
    }
    
    /**
     * Stops Sound Effect/Music
     * @param soundID {@link MediaManager#stopSound(String)}
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
    	Misc.vibrate(variables.getVibrator(), time);
    }
}

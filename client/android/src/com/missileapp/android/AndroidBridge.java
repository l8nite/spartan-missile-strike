package com.missileapp.android;

import android.content.Context;
import android.os.Vibrator;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;

@SuppressWarnings({"unused"})
public class AndroidBridge extends MissileApp {
    // Data
    private static final String TAG = "AndroidBridge";          //TAG for logging
    private static final String NBCallBack_prefix = "javascript:NativeBridge.callback(";
    private static final String NBCallBack_postfix = ");";
    
    private Context context;
    private WebView webview;
    
    private Vibrator vibrator;                    //Device vibrator
    
    /**
     * Android Concrete Methods for HTML/Native Bridge
     * @param context - Android MissileApp Context {@link Context}
     * @param webview - MissileApp webView {@link WebView}
     */
    public AndroidBridge(Context context, WebView webview) {
        super();
        this.context = context;
        this.webview = webview;
        
        
        //Vibrator
        vibrator = (Vibrator) super.getSystemService(Context.VIBRATOR_SERVICE);
        if(!vibrator.hasVibrator())
            vibrator = null;
    }
    
    
    /**
     * Calls the NativeBridge CallBack function
     * @param callbackident - callback identifier, see Native Bridge
     * @param callbackData - data to pass to the callback identifier
     */
    public void callJS(String callbackident, String callbackData) {
        String url = NBCallBack_prefix + callbackident + "," + callbackData + NBCallBack_postfix;
        webview.loadUrl(url);
    }


    
    
    
    /**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public void hideSplash() {
        super.toast("Hide Splash Command Recieved.");
        try {
            // Show WebView
            super.findViewById(R.id.webView).setVisibility(View.VISIBLE);
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not show webview", e);
            // TODO send event back to Native Bridge
        }
        
        try {
            // Show Camera View
            super.findViewById(R.id.camView).setVisibility(View.VISIBLE);
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not show camView", e);
            // TODO send event back to Native Bridge
        }
        
        try {
            // Hide Splash Screen
            super.findViewById(R.id.splashScreenView).setVisibility(View.GONE);
        }
        catch (Exception e) {
            // This shouldn't be a problem because the webview and cam view take precedence
            MALogger.log(TAG, Log.INFO, "Could not hide splash screen", e);
            // TODO send event back to Native Bridge
        }
    }
    
    
    /**
     * Vibrates the Android device 
     * @param time - time to vibrate the device
     */
    public void vibrate(String time) {
        long milliseconds;
        
        // Parse time
        try {
            milliseconds = Long.parseLong(time);
        }
        catch (Exception e) {
            milliseconds = 0;
        }
        
        // Vibrate if vibrator exists and time is greater than 0
        if (vibrator != null && milliseconds > 0) {
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
        // Parse time
        try {
            showScreen = Boolean.parseBoolean(showFireScreen);
        }
        catch (Exception e) {
            showScreen = false;
        }
        
        if (showScreen) {
            super.rollCam();
        }
        else {
            super.cutCam();
        }
    }
    
    
    
    
    
    
    
    
    
    
}

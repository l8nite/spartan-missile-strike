package com.missileapp.android;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;

@SuppressWarnings({"unused"})
public class AndroidBridge extends MissileApp {
    private static final String TAG = "AndroidBridge";          //TAG for logging
    private Context context;
    private WebView webview;
    
    /**
     * Android Concrete Methods for HTML/Native Bridge
     * @param context - Android MissileApp Context {@link Context}
     * @param webview - MissileApp webView {@link WebView}
     */
    public AndroidBridge(Context context, WebView webview) {
        super();
        this.context = context;
        this.webview = webview;
    }
    
    /**
     * Hides Splash Screen when the webView has been fully loaded
     */
    public void hideSplash() {
        try {
            //Show WebView
            super.findViewById(R.id.webView).setVisibility(View.VISIBLE);
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not show webview", e);
            //TODO send event back to Native Bridge
        }
        
        try {
            //Show Camera View
            super.findViewById(R.id.camView).setVisibility(View.VISIBLE);
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not show camView", e);
            //TODO send event back to Native Bridge
        }
        
        try {
            //Hide Splash Screen
            super.findViewById(R.id.splashScreenView).setVisibility(View.GONE);
        }
        catch (Exception e) {
            // This shouldn't be a problem because the webview and cam view take precedence
            MALogger.log(TAG, Log.INFO, "Could not hide splash screen", e);
            //TODO send event back to Native Bridge
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
}

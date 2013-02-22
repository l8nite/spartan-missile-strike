package com.missileapp.android;

import android.hardware.Camera;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.Toast;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.SharedPreferences;

@SuppressLint("SetJavaScriptEnabled")
@SuppressWarnings({"unused"})
public class MissileApp extends Activity implements SurfaceHolder.Callback {
    //TODO [MARKER] REMOVE WAKELOCK FROM ANDROID MANIFEST FILE
    
    // Settings Variables
    private static final String TAG = "MainApp";                           // Class Name for Logging
    private static final String PREFERENCES_FILENAME = "SMSFilePref";      // The name of the preference file
    private static final String PREFERENCES_GPSPROMPT = "DROIDASKGPS";     // The key for asking user for GPS location, True -> Ask user, False -> skip
    private static final String DROIDNB_VARNAME = "AndroidInterface";      // Native Bridge name
    private static final String DROIDWB_FILENAME =                         // Webview file to load
            "file:///android_asset/" + "index" + ".html";

    // Varible Bag
    private static BagOfHolding varBag;
    
    /*********************************
     * Android OS call back functions
     *********************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Variables
        Camera cam;                        // Camera settings
        SurfaceView surfaceView;           // Surface View for layout options
        SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
        WebView webView;                   // WebView for UI
        AndroidBridge droidBridge;         // Android Interface to the WebView
        ImageView splashScreen;            // ImageView
        SharedPreferences settings;        // User Preferences
        
        // Init -> super create, set view, get variable data
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        varBag = BagOfHolding.getInstance();
        varBag.setMissileApp(this);
        
        // Get user settings, mode_private --> accessible only by this process
        settings = getSharedPreferences(PREFERENCES_FILENAME, MODE_PRIVATE);
        varBag.setSettings(settings);
        if(settings.getBoolean(PREFERENCES_GPSPROMPT, true)) {
            //TODO Prompt user to turn on GPS and preference to prompts
        }
        
        // Create surface view for cam preview and register callback functions
        surfaceView = (SurfaceView) findViewById(R.id.camview);
        surfaceHolder = surfaceView.getHolder();
        varBag.setSurfaceView(surfaceView);
        varBag.setSurfaceHolder(surfaceHolder);
        surfaceHolder.addCallback(this);
        
        // Store Image View for later call
        splashScreen = (ImageView) findViewById(R.id.splashview);
        varBag.setSplashScreen(splashScreen);
        
        // Set up WebView
        webView = (WebView) findViewById(R.id.webview);
        droidBridge = new AndroidBridge(varBag);
        varBag.setWebView(webView);
        varBag.setDroidBridge(droidBridge);
        webView.addJavascriptInterface(droidBridge, DROIDNB_VARNAME);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl(DROIDWB_FILENAME);
    }
    
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
        this.reopenCam();
    }
    
    
    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.");
        releaseCam();
    }
    
    
    @Override
    protected void onStop() {
        super.onStop();
        MALogger.log(TAG, Log.INFO, "Stopping activity.");
        releaseCam();
    }
    
    
    /**
     * Reopen camera if it was in firescreen
     */
    private void reopenCam() {
        MALogger.log(TAG, Log.INFO, "Reopening Cam Method.");
        Camera cam = varBag.getCam();
        if(cam != null) {
            try {
                MALogger.log(TAG, Log.INFO, "Reopening Cam.");
                cam.lock();
                cam.startPreview();
            }
            catch (Exception e) {
                MALogger.log(TAG, Log.ERROR, "Error Restarting Camera!", e);
            }
        }
    }
    
    /**
     * Release cam temporarily if it's in firescreen
     */
    private void releaseCam() {
        MALogger.log(TAG, Log.INFO, "Release Cam Method.");
        Camera cam = varBag.getCam();
        if(cam != null) {
            try {
                MALogger.log(TAG, Log.INFO, "Releasing Cam.");
                cam.stopPreview();
                cam.unlock();
            }
            catch (Exception e) {
                MALogger.log(TAG, Log.ERROR, "Error Releasing Camera!", e);
            }
        }
    }
    
    
    
    
    /*********************************
     * Surface call back function
     *********************************/
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        MALogger.log(TAG, Log.VERBOSE, "Surface Created.");
        varBag.setSurfaceHolder(holder);
    }
    
    
    /**
     * Surface Holder changes
     * @param holder - the holder to draw the camera preview, {@link SurfaceHolder.Callback2#surfaceChanged(SurfaceHolder, int, int, int)}
     * @param format - {@link SurfaceHolder.Callback2#surfaceChanged(SurfaceHolder, int, int, int)}
     * @param width - {@link SurfaceHolder.Callback2#surfaceChanged(SurfaceHolder, int, int, int)
     * @param height - {@link SurfaceHolder.Callback2#surfaceChanged(SurfaceHolder, int, int, int)}
     */
    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        MALogger.log(TAG, Log.VERBOSE, "Surface Changed.");
        varBag.setSurfaceHolder(holder);
    }

    
    /**
     * Surface Holder was destroyed
     * @param holder Holder that was destroyed
     */
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        MALogger.log(TAG, Log.INFO, "SurfaceHolder destroyed.");
        varBag.setSurfaceHolder(null);
    }
}

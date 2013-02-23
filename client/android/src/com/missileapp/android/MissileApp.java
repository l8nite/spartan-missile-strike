package com.missileapp.android;

import com.missileapp.android.res.FireScreen;
import com.missileapp.android.res.UserPreferences;

import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.widget.ImageView;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.SharedPreferences;

@SuppressLint("SetJavaScriptEnabled")
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
    private static BagOfHolding variables;
    
    /*********************************
     * Android OS call back functions
     *********************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Variables
        SurfaceView surfaceView;           // Surface View for layout options
        SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
        WebView webView;                   // WebView for UI
        AndroidBridge droidBridge;         // Android Interface to the WebView
        ImageView splashScreen;            // ImageView
        SharedPreferences settings;        // User Preferences
        
        // Init -> super create, set view, get variable data
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        variables = BagOfHolding.getInstance();
        variables.setMissileApp(this);
        
        // Get user settings, mode_private --> accessible only by this process
        settings = getSharedPreferences(PREFERENCES_FILENAME, MODE_PRIVATE);
        variables.setSettings(settings);
        if(settings.getBoolean(PREFERENCES_GPSPROMPT, true)) {
            //TODO Prompt user to turn on GPS and preference to prompts
        }
        
        // Create surface view for cam preview and register callback functions
        surfaceView = (SurfaceView) findViewById(R.id.camview);
        surfaceHolder = surfaceView.getHolder();
        variables.setSurfaceView(surfaceView);
        variables.setSurfaceHolder(surfaceHolder);
        surfaceHolder.addCallback(this);
        
        // Store Image View for later call
        splashScreen = (ImageView) findViewById(R.id.splashview);
        variables.setSplashScreen(splashScreen);
        
        // Set up WebView
        webView = (WebView) findViewById(R.id.webview);
        droidBridge = new AndroidBridge(variables);
        variables.setWebView(webView);
        variables.setDroidBridge(droidBridge);
        webView.addJavascriptInterface(droidBridge, DROIDNB_VARNAME);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl(DROIDWB_FILENAME);
        
        // Store resource variables
        variables.setFireScreen(new FireScreen(variables));
        variables.setUserPrefs(new UserPreferences(variables));
    }
    
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
        variables.getFireScreen().processResumeRequest();
    }
    
    
    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.");
        variables.getFireScreen().processPauseRequest();
    }
    
    
    @Override
    protected void onStop() {
        super.onStop();
        MALogger.log(TAG, Log.INFO, "Stopping activity.");
        variables.getFireScreen().processPauseRequest();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        MALogger.log(TAG, Log.INFO, "Activity Destroying");
        variables.getFireScreen().exitFireScreen();
    }
    
    
    
    
    
    /*********************************
     * Surface call back function
     *********************************/
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        MALogger.log(TAG, Log.VERBOSE, "Surface Created.");
        variables.setSurfaceHolder(holder);
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
        variables.setSurfaceHolder(holder);
    }

    
    /**
     * Surface Holder was destroyed
     * @param holder Holder that was destroyed
     */
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        MALogger.log(TAG, Log.INFO, "SurfaceHolder destroyed.");
        variables.setSurfaceHolder(null);
    }
}

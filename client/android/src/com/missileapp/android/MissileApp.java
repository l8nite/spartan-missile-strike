package com.missileapp.android;

import android.hardware.Camera;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.webkit.WebView;
import android.app.Activity;
import android.content.SharedPreferences;

public class MissileApp extends Activity implements SurfaceHolder.Callback {
    //TODO [MARKER] REMOVE WAKELOCK FROM ANDROID MANIFEST FILE
    
    // Settings Variables
    private static final String TAG = "MainApp";                           // Class Name for Logging
    private static final String DROIDNB_VARNAME = "AndroidInterface";      // Native Bridge name
    private static final String DROIDWB_FILENAME =                         // Webview file to load
            "file:///android_asset/" + "index" + ".html";
    private static final String PREFERENCES_FILENAME = "SMSFilePref";      // The name of the preference file
    private static final String PREFERENCES_GPSPROMPT = "DROIDASKGPS";     // The key for asking user for GPS location
                                                                           // True -> Ask user, False -> skip
    private static final int CAMERA_ORIENTATION = 90;                      // Camera orientation -> portrait
    

    // Variables
    private Camera cam;                        // Camera settings
    private SurfaceView surfaceView;           // Surface View for layout options
    private SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
    private WebView webView;                   // WebView for UI
    private SharedPreferences settings;        // User Preferences
    
    
    /*********************************
     * Android OS call back functions
     *********************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        // Get user settings, mode_private --> accessible only by this process
        settings = getSharedPreferences(PREFERENCES_FILENAME, MODE_PRIVATE);
        if(settings.getBoolean(PREFERENCES_GPSPROMPT, true)) {
            //TODO Prompt user to turn on GPS and preference
        }
        
        // Create surface view for cam preview and register callback functions
        surfaceView = (SurfaceView) findViewById(R.id.camView);
        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
        
        // Trigger Callback functions
        super.findViewById(R.id.camView).setVisibility(View.INVISIBLE);
        super.findViewById(R.id.webView).setVisibility(View.INVISIBLE);
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
    }

    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.");
    }
    
    @Override
    protected void onStop() {
        super.onStop();
        MALogger.log(TAG, Log.INFO, "Stopping activity.");
    }
    
    
    
    
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        // TODO Auto-generated method stub
        
    }
    
    
    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        // TODO Auto-generated method stub
        
    }
    
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        // TODO Auto-generated method stub
        
    }
    
    
}

package com.missileapp.android;

import android.hardware.Camera;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.widget.Toast;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.SharedPreferences;

@SuppressLint("SetJavaScriptEnabled")
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
            //TODO Prompt user to turn on GPS and preference to prompts
        }
        
        // Create surface view for cam preview and register callback functions
        surfaceView = (SurfaceView) findViewById(R.id.camview);
        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
        
        // Set up WebView
        webView = (WebView) findViewById(R.id.webview);
        webView.addJavascriptInterface(new AndroidBridge(this, webView), DROIDNB_VARNAME);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl(DROIDWB_FILENAME);
    }
    
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
        //TODO: Handle unlock case and in firescreen.
    }
    
    
    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.");
        cutCam();
    }
    
    
    @Override
    protected void onStop() {
        super.onStop();
        MALogger.log(TAG, Log.INFO, "Stopping activity.");
        closeCam();
    }
    
    
    
    
    
    
    
    
    
    
    /********************************
     * Camera functions
     ********************************/
    /**
     * Locks the front facing camera
     * @param holder the SurfaceHolder that the camera data should be drawn on
     */
    public void openCam(SurfaceHolder holder) {
        MALogger.log(TAG, Log.INFO, "Opening Cam");
        
        // Camera should not have been open. Reset cam
        closeCam();
        
        // Get the default reverse facing camera
        try {
            cam = Camera.open();
            if(cam != null) {
                cam.setDisplayOrientation(CAMERA_ORIENTATION);
                cam.setPreviewDisplay(holder);
                cam.unlock();
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Could not get camera instance!", e);
        }
    }
    
    
    /**
     * Lock the Camera and Start the Preview
     */
    public void rollCam() {
        try {
            if (cam != null) {
                cam.lock();
                cam.startPreview();
            }
            else {
                MALogger.log(TAG, Log.ERROR, "Camera is null.");
            }
        }
        catch (Exception e) {
            Toast.makeText(this, "Error Starting Camera...", Toast.LENGTH_SHORT).show();
            MALogger.log(TAG, Log.ERROR, "Error starting camera", e);
        }
    }
    
    
    /**
     * Stop the Camera Preview and Unlock
     */
    public void cutCam() {
        try {
            if (cam != null) {
                cam.stopPreview();
                cam.unlock();
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Error starting camera", e);
        }
    }
    
    /**
     * Permenantly release the camera
     */
    public void closeCam() {
        if (cam != null) {
            try {
                // Stop the preview and release
                cam.stopPreview();
                cam.release();
            }
            catch (Exception e) {
                MALogger.log(TAG, Log.ERROR, "Camera Reset Error", e);
            }
            finally {
                cam = null;
            }
        }
    }
    
    
    
    
    
    
    
    
    
    
    /*********************************
     * Surface call back function
     *********************************/
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        try {
            // Create camera if it doesn't exist, else set the preview surface
            if (cam == null) {
                this.openCam(holder);
            }
            else {
                cam.setPreviewDisplay(holder);
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.INFO, "Could not open Cam", e);
        }
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
        try {
            // Create camera if it doesn't exist, else set the preview surface
            if (cam == null) {
                this.openCam(holder);
            }
            else {
                cam.setPreviewDisplay(holder);
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.INFO, "Could not open Cam", e);
        }
    }

    
    /**
     * Surface Holder was destroyed
     * @param holder Holder that was destroyed
     */
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        this.closeCam();
    }
}

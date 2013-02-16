package com.missileapp.android;

import android.graphics.Color;
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
    private static final String TAG = "com.missileapp.android.MissileApp"; // Class Name for Logging
    private static final String DROIDNB_VARNAME = "AndroidInterface";      // Native Bridge name
    private static final String DROIDWB_FILENAME = "file:///android_asset/" + "view" + ".html"; // Webview file to load
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
        MALogger.log(TAG, Log.INFO, "Starting activity.");
        setContentView(R.layout.main);
        
        // Get user settings, mode_private --> accessible only by this process
        settings = getSharedPreferences(PREFERENCES_FILENAME, MODE_PRIVATE);
        if(settings.getBoolean(PREFERENCES_GPSPROMPT, true)) {
            //TODO Prompt user to turn on GPS and preference
        }
        
        surfaceView = (SurfaceView) findViewById(R.id.camView);
        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
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
     * 
     * @param holder
     *            the SurfaceHolder that the camera data should be drawn on
     */
    public void openCam(SurfaceHolder holder) {
        MALogger.log(TAG, Log.INFO, "Opening Cam");
        
        // Camera should not have been open. Reset cam
        closeCam();
        
        // Get the default reverse facing camera
        try {
            cam = Camera.open();
            cam.setDisplayOrientation(CAMERA_ORIENTATION);
            cam.setPreviewDisplay(holder);
            cam.unlock();
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
            if(webView != null) {
                webView.setBackgroundColor(Color.TRANSPARENT);
            }
            
            if (cam != null) {
                cam.lock();
                cam.startPreview();
            }
            else {
                MALogger.log(TAG, Log.ERROR, "Camera is null.");
            }
                
        }
        catch (Exception e) {
            Toast.makeText(this, "Camera Error...", Toast.LENGTH_SHORT).show();
            MALogger.log(TAG, Log.ERROR, "Error starting camera", e);
        }
    }
    
    /**
     * Stop the Camera Preview and Unlock
     */
    public void cutCam() {
        try {
            if(webView != null) {
                webView.setBackgroundColor(Color.WHITE);
            }
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
    /**
     * Surface holder is created and we can reserve the camera and set the
     * location of the camera preview
     * 
     * @param holder
     *            surface holder to draw cam view
     */
    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        MALogger.log(TAG, Log.INFO, "Surface Created!");
        try {
            // Create cam and set surface
            if (cam == null) {
                this.openCam(holder);
            }
            else {
                cam.setPreviewDisplay(holder);
            }
            
            // Launch WebView
            webView = (WebView) findViewById(R.id.webView);
            webView.addJavascriptInterface(new AndroidBridge(this, webView), DROIDNB_VARNAME);
            webView.getSettings().setJavaScriptEnabled(true);
            //TODO VERIFY NEED FOR SETTING BACKGROUND COLOR.
            webView.setBackgroundColor(Color.WHITE);
            webView.loadUrl(DROIDWB_FILENAME);
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
     * 
     * @param holder
     *            Holder that was destroyed
     */
    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        this.closeCam();
    }
}

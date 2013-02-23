package com.missileapp.android;

import android.content.Context;
import android.hardware.Camera;
import android.os.Vibrator;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.View;
import android.webkit.WebView;
import android.widget.Toast;

public class AndroidBridge extends MissileApp {
    // Data
    private static final String TAG = "AndroidBridge";                     // TAG for logging
    private static final int CAMERA_ORIENTATION = 90;                      // Camera orientation -> portrait
    private static final String NBCallBack_prefix = "javascript:NativeBridge.callback(";
    private static final String NBCallBack_postfix = ");";
    
    // Variables
    private static BagOfHolding varBag;           // Bag Of Holding for Variables
    private Vibrator vibrator;                    // Device vibrator
    
    /**
     * Android Concrete Methods for HTML/Native Bridge
     * @param context - Android MissileApp/Context {@link Context}
     * @param webview - MissileApp webView {@link WebView}
     */
    public AndroidBridge(BagOfHolding varBag) {
        MALogger.log(TAG, Log.INFO, "Init Android Bridge");
        AndroidBridge.varBag = varBag;
        
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
        varBag.getWebView().loadUrl(url);
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
                    varBag.getSplashScreen().setVisibility(View.GONE);
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
            this.rollCam();
        }
        else {
            this.stopCam();
        }
    }
    
    
    public void rollCam() {
        MALogger.log(TAG, Log.INFO, "Roll Cam.");
        try {
            // Create and Save Variables, default to rear facing camera
            Camera cam = Camera.open();
            if(cam != null) {
                varBag.setCam(cam);
                SurfaceHolder holder = varBag.getSurfaceHolder();
                
                // Set Orientation and display  
                cam.setDisplayOrientation(CAMERA_ORIENTATION);
                cam.setPreviewDisplay(holder);
                
                // Lock and Start Preview
                cam.lock();
                cam.startPreview();
            }
            else {
                MALogger.log(TAG, Log.WARN, "No Camera.");
                Toast.makeText(varBag.getMissileApp(), "No Camera", Toast.LENGTH_SHORT).show();
            }
                
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Error Starting Camera", e);
        }
    }
    
    public void stopCam() {
        MALogger.log(TAG, Log.INFO, "Stop Cam.");
        try {
            // Stop Preview, unlock, and release
            Camera cam = varBag.getCam();
            if(cam != null) {
                cam.stopPreview();
                cam.unlock();
                cam.release();
            }
            else {
                MALogger.log(TAG, Log.WARN, "Camera is null.");
            }
        }
        catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, "Stopping Camera failed.", e);
        }
        finally {
            varBag.setCam(null);
        }
    }
}

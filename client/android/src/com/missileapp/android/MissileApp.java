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

@SuppressLint("SetJavaScriptEnabled")
public class MissileApp extends Activity implements SurfaceHolder.Callback {
    // Static final vars
    private static final String TAG = "com.missileapp.android.MissileApp"; // Class Name for Logging
    private static final int CAMERA_ORIENTATION = 90;                      // Camera orientation -> portrait
    
    // Variables
    private Camera cam;
    private SurfaceView surfaceView;
    private SurfaceHolder surfaceHolder;
    private WebView webView;
    
    /*********************************
     * Android OS call back functions
     *********************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MALogger.log(TAG, Log.INFO, "Starting activity.", null);
        setContentView(R.layout.main);
        
        //TODO Prompt user for GPS status
        
        surfaceView = (SurfaceView) findViewById(R.id.camView);
        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.", null);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.", null);
        stopCam();
    }
    
    @Override
    protected void onStop() {
        super.onStop();
        MALogger.log(TAG, Log.INFO, "Stopping activity.", null);
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
        MALogger.log(TAG, Log.INFO, "Opening Cam", null);
        
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
    public void startCam() {
        try {
            if (cam != null) {
                cam.lock();
                cam.startPreview();
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
    public void stopCam() {
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
        MALogger.log(TAG, Log.INFO, "Surface Created!", null);
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
            webView.addJavascriptInterface(new AndroidBridge(this, webView), "AndroidInterface");
            webView.getSettings().setJavaScriptEnabled(true);
            webView.loadUrl("file:///android_asset/view.html");
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

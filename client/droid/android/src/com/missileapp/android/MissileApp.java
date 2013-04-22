package com.missileapp.android;

import com.missileapp.android.res.FacebookAuth;
import com.missileapp.android.res.FireScreen;
import com.missileapp.android.res.Gyro;
import com.missileapp.android.res.LocationManagement;
import com.missileapp.android.res.MAWebChromeClient;
import com.missileapp.android.res.MediaManager;
import com.missileapp.android.res.UserPreferences;

import android.location.LocationManager;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;
import android.webkit.WebSettings.RenderPriority;
import android.widget.ImageView;
import android.widget.Toast;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.SensorManager;

@SuppressLint("SetJavaScriptEnabled")
public class MissileApp extends Activity implements SurfaceHolder.Callback {
    // Settings Variables
    private static final String TAG = "MainApp";                           // Class Name for Logging
    private static final String PREFERENCES_FILENAME = "SMSFilePref";      // The name of the preference file
    private static final String PREFERENCES_GPSPROMPT = "DROIDSHOWLS";     // The key for asking user for GPS location, True -> Ask user, False -> skip
    private static final String DROIDNB_VARNAME = "AndroidInterface";      // Native Bridge name
    private static final String DROIDWB_FILENAME =                         // Webview file to load
            "file:///android_asset/html/MissileApp-Android.html";
    
    // Varible Bag
    private static BagOfHolding variables;
    private static boolean mainMenuViewVerified;
    
    /*********************************
     * Android OS call back functions
     *********************************/
	@SuppressLint("NewApi")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        MALogger.log(TAG, Log.INFO, "Creating activity.");
        
        // Variables
        SurfaceView surfaceView;           // Surface View for layout options
        SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
        WebView webView;                   // WebView for UI
        AndroidBridge droidBridge;         // Android Interface to the WebView
        ImageView splashScreen;            // ImageView
        
        // Init -> super create, set view, get variable data
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        variables = (BagOfHolding) super.getApplication();
        variables.setMissileApp(this);
        mainMenuViewVerified = false;
        
        // Store Android views:
        surfaceView = (SurfaceView) findViewById(R.id.camview);
        splashScreen = (ImageView) findViewById(R.id.splashview);
        webView = (WebView) findViewById(R.id.webview);
        
        // Store Image View for later call
        variables.setSplashScreen(splashScreen);
        
        // Set up webview and android interface
        droidBridge = new AndroidBridge(variables);
        variables.setWebView(webView);
        variables.setDroidBridge(droidBridge);
        
        // Smooth Transition
        webView.setScrollbarFadingEnabled(true);
        webView.getSettings().setRenderPriority(RenderPriority.HIGH);
        webView.getSettings().setSupportZoom(false);
        
        // JavaScript
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebChromeClient(new MAWebChromeClient());
        webView.addJavascriptInterface(droidBridge, DROIDNB_VARNAME);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            try {
                webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
            }
            catch(Exception e) {
                MALogger.log(TAG, Log.ERROR, "Content-Access-Control: " + e.getMessage(), e);
            }
        }
        
        // Create surface view for cam preview and register callback functions
        surfaceHolder = surfaceView.getHolder();
        variables.setSurfaceView(surfaceView);
        variables.setSurfaceHolder(surfaceHolder);
        surfaceHolder.addCallback(this);
        
        // Store resource variables
        variables.setSettings(super.getSharedPreferences(PREFERENCES_FILENAME, MODE_PRIVATE));            // User Settings
        variables.setFacebookAuth(new FacebookAuth(variables));                                           // Facebook Auth  
        variables.setFireScreen(new FireScreen(variables));                                               // Fire Screen, camera
        variables.setUserPrefs(new UserPreferences(variables));                                           // User Preferences, app data
        variables.setMediaManager(new MediaManager(variables));                                           // Media Manager, preloads the necessary audio
        variables.getMediaManager().loadSound();
        variables.setVibrator((Vibrator) super.getSystemService(Context.VIBRATOR_SERVICE));               // Android System Service Vibrator
        variables.setLocationManager((LocationManager) getSystemService(Context.LOCATION_SERVICE));       // Android System Service Location Manager
        variables.setLocationManagement(new LocationManagement(variables));                               // MissileApp Location Implementation
        variables.setSensorManager((SensorManager) super.getSystemService(Context.SENSOR_SERVICE));       // Android Sensor Service Implementation
        variables.setGyro(new Gyro(variables));                                                           // Gyroscope implementation
        
        // Show Location Services
        checkLocationServices();
    }
    
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
        
        // Location Services
        variables.getLocationManagement().processResumeRequest();
        
        // Switch to audio controls rather than call resume on media manager
        this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        variables.getMediaManager().processResume();

        // Re-enter Fire Screen
        variables.getFireScreen().processResumeRequest();
        
        // Notify Native Bridge to Wake
        variables.getDroidBridge().wakeNativeBridge();
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.");
        
        // Pause Media
        variables.getMediaManager().processPause();
        
        // Exit Fire Screen
        variables.getFireScreen().processPauseRequest();
        
        // Remove Location Updates for GPS and Network
        variables.getLocationManagement().processPauseRequest();
    }
    
    @Override
    protected void onStop() {
        super.onStop();
        MALogger.log(TAG, Log.INFO, "Stopping activity.");
        variables.getFacebookAuth().processStopRequest();
        variables.getFireScreen().processPauseRequest();
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
        MALogger.log(TAG, Log.INFO, "Activity Destroying.");
        variables.getFireScreen().exitFireScreen();
    }
    
    /**
     * Intercept Back, process back if not in firescreen
     */
    @Override
    public void onBackPressed() {
        if (!mainMenuViewVerified) {
            variables.getDroidBridge().requestMainMenuViewStatus();
        }
        else {
            super.onBackPressed();
            mainMenuViewVerified = false;
        }
    }
    
    /**
     * Calls back button
     */
    public void callBackButton() {
        mainMenuViewVerified = true;
        Toast.makeText(this, "Press back again", Toast.LENGTH_SHORT).show();
    }
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        variables.getFacebookAuth().setActivityResult(requestCode, resultCode, data);
    }
    
    private void checkLocationServices() {
        MALogger.log(TAG, Log.INFO, "Processing Location.");
        
        // Check if the alert was already given
        if(variables.getSettings().getBoolean(PREFERENCES_GPSPROMPT, true)) {
            LocationManager locationManager = variables.getLocationManager();
            boolean locationEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
            boolean gpsLocationEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
            
            // Show only if no location provider is not enabled
            if(!locationEnabled && !gpsLocationEnabled) {
                // Construct Alert Dialog
                AlertDialog.Builder locationAlert = new AlertDialog.Builder(variables.getMissileApp());
                locationAlert.setIcon(R.drawable.ic_launcher);
                locationAlert.setTitle(R.string.location_prompt_title);
                locationAlert.setMessage(R.string.location_prompt_message);
                locationAlert.setCancelable(false);
                locationAlert.setPositiveButton(R.string.location_prompt_button, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                        variables.getWebView().loadUrl(DROIDWB_FILENAME);
                        
                        // Save Preference
                        SharedPreferences.Editor editor = variables.getSettings().edit();
                        editor.putBoolean(PREFERENCES_GPSPROMPT, false);
                        editor.apply();
                    }
                });
            }
            else {
                variables.getWebView().loadUrl(DROIDWB_FILENAME);
            }
        }
        else {
            variables.getWebView().loadUrl(DROIDWB_FILENAME);
        }
    }
    
    /** Opens Location Settings **/
    @SuppressWarnings("unused")
    private void openLocationSettings() {
        Intent settingsIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivityForResult(settingsIntent, 1);
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
        variables.setSurfaceHolder(holder);
    }
}

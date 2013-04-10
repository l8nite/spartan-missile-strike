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
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebSettings.RenderPriority;
import android.widget.CheckBox;
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
    private static final String PREFERENCES_GPSPROMPT = "DROIDASKGPS";     // The key for asking user for GPS location, True -> Ask user, False -> skip
    private static final String DROIDNB_VARNAME = "AndroidInterface";      // Native Bridge name
    private static final String DROIDWB_FILENAME =                         // Webview file to load
            "file:///android_asset/MissileApp-Android.html";
    
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

        // Disable app
        variables.setEnabled(false);
        
        // Store Android views:
        surfaceView = (SurfaceView) findViewById(R.id.camview);
        splashScreen = (ImageView) findViewById(R.id.splashview);
        webView = (WebView) findViewById(R.id.webview);
        
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
        
        // Create surface view for cam preview and register callback functions
        surfaceHolder = surfaceView.getHolder();
        variables.setSurfaceView(surfaceView);
        variables.setSurfaceHolder(surfaceHolder);
        surfaceHolder.addCallback(this);
        
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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            try {
                webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
            }
            catch(Exception e) {
                MALogger.log(TAG, Log.ERROR, "Content-Access-Control: " + e.getMessage(), e);
            }
        }
        webView.setWebChromeClient(new MAWebChromeClient());
        webView.addJavascriptInterface(droidBridge, DROIDNB_VARNAME);
        variables.setHasWebViewLoaded(false);
    }
    
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
        
        //TODO have to change this to something else instead of getting visibility
        boolean hideSplashWhenDone = (variables.getSplashScreen().getVisibility() == View.GONE);
        
        this.runOnUiThread(new Runnable() {
            public void run() {
                variables.getSplashScreen().setVisibility(View.VISIBLE);
            }
        });
        
        if (variables.getFacebookAuth().processResumeRequest(hideSplashWhenDone)) {
            finishProcessingResume(hideSplashWhenDone);
        }
    }
    
    public void finishProcessingResume(Boolean hideSplashWhenDone) {
        // Check location services are enabled.
        this.processLocationServices();
        variables.getLocationManagement().processResumeRequest();

        // Switch to audio controls rather than call
        this.setVolumeControlStream(AudioManager.STREAM_MUSIC);
        variables.getMediaManager().processResume();

        // Re-enter Fire Screen
        variables.getFireScreen().processResumeRequest();
        
        if (variables.isEnabled()) {
            // Notify Native Bridge to Wake
            variables.getDroidBridge().wakeNativeBridge();
            runOnUiThread(new Runnable() {
                public void run() {
                    variables.getSplashScreen().setVisibility(View.GONE);
                }
            });
        }
        
        if (hideSplashWhenDone) {
            runOnUiThread(new Runnable() {
                public void run() {
                    variables.getSplashScreen().setVisibility(View.GONE);
                }
            });
        }
        
        if (!variables.isWebViewLoaded()) {
            variables.getWebView().loadUrl(DROIDWB_FILENAME);
            variables.setHasWebViewLoaded(true);
        }
        
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
    
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        variables.getFacebookAuth().setActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 1:
                finishLocationSettings();
                break;
            
            default:
                break;
        }
    }
    
    /**
     * Processes user location settings
     */
    private void processLocationServices() {
        MALogger.log(TAG, Log.INFO, "Processing Location.");

        View locationCheckBoxView = View.inflate(this, R.layout.locationcb, null);
        final CheckBox checkBox = (CheckBox) locationCheckBoxView.findViewById(R.id.gps_checkbox);
        checkBox.setPadding(checkBox.getPaddingLeft() + (int) (10.0f * this.getResources().getDisplayMetrics().density + 0.5f),
                checkBox.getPaddingTop(), checkBox.getPaddingRight(), checkBox.getPaddingBottom());

    	LocationManager locationManager = variables.getLocationManager();
    	boolean locationEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    	boolean gpsLocationEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    	
    	//construct message if enabled
    	if (!locationEnabled && !gpsLocationEnabled) {
            AlertDialog.Builder locationAlert = new AlertDialog.Builder(this);
            locationAlert.setIcon(R.drawable.ic_launcher_padded);
            locationAlert.setTitle(R.string.location_prompt_title);
            locationAlert.setMessage(R.string.location_prompt_location_disabled_msg);
            locationAlert.setCancelable(false);
            locationAlert.setPositiveButton(R.string.location_prompt_location_disabled_positive, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                    openLocationSettings();
                }
            });
            locationAlert.setNegativeButton(R.string.location_prompt_location_disabled_negative, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                    exitMissileApp();
                }
            });
            locationAlert.show();
    	}
    	else if (!gpsLocationEnabled && variables.getSettings().getBoolean(PREFERENCES_GPSPROMPT, true)) {
    	    AlertDialog.Builder locationAlert = new AlertDialog.Builder(this);
    	    locationAlert.setIcon(R.drawable.ic_launcher_padded);
            locationAlert.setTitle(R.string.location_prompt_title);
            locationAlert.setMessage(R.string.location_prompt_gps_disabled_msg);
            locationAlert.setCancelable(false);
            locationAlert.setView(locationCheckBoxView);
            locationAlert.setPositiveButton(R.string.location_prompt_gps_disabled_positive, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                    processGPSIgnoreCheckbox(checkBox.isChecked());
                    openLocationSettings();
                }
            });
            locationAlert.setNegativeButton(R.string.location_prompt_gps_disabled_negative, new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.dismiss();
                    processGPSIgnoreCheckbox(checkBox.isChecked());
                    variables.setEnabled(true);
                }
            });
            locationAlert.show();
    	}
    	else {
    	    variables.setEnabled(true);
    	}
    }
    
    private void processGPSIgnoreCheckbox(boolean GPSPromptIsChecked) {
        if (GPSPromptIsChecked) {
            // Save Prompt
            SharedPreferences.Editor prefEditor = variables.getSettings().edit();
            prefEditor.putBoolean(PREFERENCES_GPSPROMPT, !GPSPromptIsChecked);
            prefEditor.commit();
        }
    }
    
    private void finishLocationSettings() {
        // check location seervices are still enabled
        LocationManager locationManager = variables.getLocationManager();
        boolean locationEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        boolean gpsLocationEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        
        // Exit if no location provider enabled, else register all available services
        if (!locationEnabled && !gpsLocationEnabled) {
            exitMissileApp();
        }
        else {
            variables.setEnabled(true);
        }
    }
    
    
    /** Opens Location Settings **/
	private void openLocationSettings() {
        Intent settingsIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivityForResult(settingsIntent, 1);
    }
    
	
	/** Exit MissileApp **/
    private void exitMissileApp() {
    	this.finish();
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

package com.missileapp.android;

import com.missileapp.android.res.FireScreen;
import com.missileapp.android.res.LocationManagement;
import com.missileapp.android.res.MediaManager;
import com.missileapp.android.res.Misc;
import com.missileapp.android.res.UserPreferences;

import android.location.LocationManager;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebSettings.RenderPriority;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;

@SuppressLint("SetJavaScriptEnabled")
public class MissileApp extends Activity implements SurfaceHolder.Callback {
    //TODO [MARKER] REMOVE WAKELOCK FROM ANDROID MANIFEST FILE
    
    // Settings Variables
    private static final String TAG = "MainApp";                           // Class Name for Logging
    private static final String PREFERENCES_FILENAME = "SMSFilePref";      // The name of the preference file
    private static final String PREFERENCES_GPSPROMPT = "DROIDASKGPS";     // The key for asking user for GPS location, True -> Ask user, False -> skip
    private static final String DROIDNB_VARNAME = "AndroidInterface";      // Native Bridge name
    private static final String DROIDWB_FILENAME =                         // Webview file to load
            "file:///android_asset/html/MissileApp-Android.html";
    
    // Varible Bag
    private static BagOfHolding variables;
    
    /*********************************
     * Android OS call back functions
     *********************************/
    @SuppressWarnings("deprecation")
	@Override
    protected void onCreate(Bundle savedInstanceState) {
        // Variables
    	CheckBox checkBoxView;             // Location services checkbox
        SurfaceView surfaceView;           // Surface View for layout options
        SurfaceHolder surfaceHolder;       // Surface Holder to place Cam Preview
        WebView webView;                   // WebView for UI
        AndroidBridge droidBridge;         // Android Interface to the WebView
        ImageView splashScreen;            // ImageView
        
        // Init -> super create, set view, get variable data
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        variables = (BagOfHolding) super.getApplication(); 
        		//BagOfHolding.getInstance(); TODO REMOVE
        variables.setMissileApp(this);
        variables.setEnabled(false);
        
        // Store Android views:
        surfaceView = (SurfaceView) findViewById(R.id.camview);
        splashScreen = (ImageView) findViewById(R.id.splashview);
        webView = (WebView) findViewById(R.id.webview);
        checkBoxView = (CheckBox) findViewById(R.id.locationcheckbox);

        // Store resource variables
        variables.setSettings(super.getSharedPreferences(PREFERENCES_FILENAME, MODE_PRIVATE));            // User Settings
        variables.setFireScreen(new FireScreen(variables));                                               // Fire Screen, camera
        variables.setUserPrefs(new UserPreferences(variables));                                           // User Preferences, app data
        variables.setMediaManager(new MediaManager(variables));                                           // Media Manager, preloads the necessary audio
        variables.setVibrator((Vibrator) super.getSystemService(Context.VIBRATOR_SERVICE));               // Android System Service Vibrator
        variables.setLocationManager((LocationManager) getSystemService(Context.LOCATION_SERVICE));       // Android System Service Location Manager
        variables.setLocationManagement(new LocationManagement(variables));                               // MissileApp Location Implementation
        
        // Store the Dialog checkbox
        variables.setLocationCheckBox(checkBoxView);
        
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
        webView.getSettings().setRenderPriority(RenderPriority.HIGH);
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        webView.getSettings().setSupportZoom(false);
        webView.getSettings().enableSmoothTransition(); // Deprecated but lets leave it for now
        
        // JavaScript
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(droidBridge, DROIDNB_VARNAME);
        
        // Color Transparent
        webView.setBackgroundColor(Color.TRANSPARENT);
        
        // Load WebView
        webView.loadUrl(DROIDWB_FILENAME);
    }
    
    
    @Override
    protected void onResume() {
        super.onResume();
        MALogger.log(TAG, Log.INFO, "Resuming activity.");
        
        // Check location services are enabled.
        this.processLocationServices();
        
        // Re-enter Fire Screen
        variables.getFireScreen().processResumeRequest();
        
        // Notify Native Bridge to Wake
        variables.getDroidBridge().callJSforWake();
    }
    

    /**
     * Intercept Back, process back if not in firescreen
     */
    @Override
    public void onBackPressed() {
		// TODO
		// TODO
		// TODO
		// TODO call mainView.previousView() when not in main menu view
		// TODO
		// TODO
		// TODO Notify native bridge of back event
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
		// TODO
    }
    
    public void callBackButton() {
    	super.onBackPressed();
    }

    
    
    @Override
    protected void onPause() {
        super.onPause();
        MALogger.log(TAG, Log.INFO, "Pausing activity.");
        
        // Exit Fire Screen
        variables.getFireScreen().processPauseRequest();
        
        // Remove Location Updates for GPS and Network
        variables.getLocationManager().removeUpdates(variables.getLocationManagement());
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
    
    
    /**
     * Processes user location settings
     */
    private void processLocationServices() {
    	LocationManager locationManager = variables.getLocationManager();
    	final CheckBox checkBox = variables.getLocationCheckBox();
    	boolean locationEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    	boolean gpsLocationEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    	
    	//construct message if enabled
    	if(!locationEnabled && !gpsLocationEnabled) {
    		AlertDialog.Builder locationAlert = new AlertDialog.Builder(this);
			locationAlert.setIcon(R.drawable.ic_launcher_padded)
		         .setTitle(R.string.location_prompt_title)
		         .setMessage(R.string.location_prompt_location_disabled_msg)
		         .setCancelable(false)
		         .setView(checkBox)
		         .setPositiveButton(R.string.location_prompt_location_disabled_positive, new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						processLocationDialog(dialog, true, false, checkBox.isChecked());
					}
				 })
		         .setNegativeButton(R.string.location_prompt_location_disabled_negative, new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						processLocationDialog(dialog, false, true, checkBox.isChecked());
					}
		         })
		         .show();
    	}
    	else if (!gpsLocationEnabled && variables.getSettings().getBoolean(PREFERENCES_GPSPROMPT, true)) {
    		AlertDialog.Builder locationAlert = new AlertDialog.Builder(this);
			locationAlert.setIcon(R.drawable.ic_launcher_padded)
		         .setTitle(R.string.app_name)
		         .setMessage(R.string.location_prompt_gps_disabled_msg)
		         .setCancelable(false)
		         .setView(checkBox)
		         .setPositiveButton(R.string.location_prompt_gps_disabled_positive,  new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						processLocationDialog(dialog, true, false, checkBox.isChecked());
					}
				 })
				 .setNegativeButton(R.string.location_prompt_gps_disabled_negative, new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						processLocationDialog(dialog, false, false, checkBox.isChecked());
					}
				})
				.show();
    	}
    }
    
    
    /**
     * Process Location Listener Dialog box
     * @param dialog - Dialogbox
     * @param showSettings - shows location settings
     * @param exitApplication - exit Missile App 
     * @param GPSPromptIsChecked - save settings from dialogbox
     */
    private void processLocationDialog(DialogInterface dialog, boolean showSettings, boolean exitApplication, boolean GPSPromptIsChecked) {
    	// Close Dialog
    	dialog.dismiss();
    	
    	// Save Prompt
    	SharedPreferences.Editor prefEditor = variables.getSettings().edit();
    	prefEditor.putBoolean(PREFERENCES_GPSPROMPT, !GPSPromptIsChecked);
    	prefEditor.commit();
    	
    	// Process user request
    	if(showSettings) {
    		openLocationSettings();
    	}
    	if(exitApplication) {
    		exitMissileApp();
    	}
    	
    	// check location services are still enabled
    	LocationManager locationManager = variables.getLocationManager();
    	boolean locationEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    	boolean gpsLocationEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    	
    	
    	// Exit if no location provider enabled, else register all available services
    	if(!locationEnabled && !gpsLocationEnabled) {
    		exitMissileApp();
    	}

    	if(locationEnabled) {
    		variables.getLocationManager().requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, variables.getLocationManagement());
    		variables.setEnabled(true);
    	}
    	if(gpsLocationEnabled){
    		variables.getLocationManager().requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, variables.getLocationManagement());
    		variables.setEnabled(true);
    	}
    	
    	variables.setEnabled(true);
    	if(variables.isHideSplash()) {
    		Misc.hideSplash(variables, variables.getMissileApp(), variables.getSplashScreen());
    		variables.setHideSplash(false);
    	}
    }
    
    
    /** Opens Location Settings **/
	private void openLocationSettings() {
        Intent settingsIntent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivity(settingsIntent);
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
        variables.setSurfaceHolder(null);
    }
}

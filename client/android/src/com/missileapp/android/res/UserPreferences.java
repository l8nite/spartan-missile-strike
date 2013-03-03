package com.missileapp.android.res;

import java.util.Iterator;

import org.json.JSONException;
import org.json.JSONObject;

import android.content.SharedPreferences;
import android.util.Log;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

public class UserPreferences {
    
    // Variables
    private static final String TAG = "UserPrefs";             // TAG for logging
    private static BagOfHolding varibles;                        // Bag Of Holding for Variables
    
    
    /**
     * User Preference Constructor
     * @param variables - {@link BagOfHolding} var bag
     */
    public UserPreferences(BagOfHolding variables) {
        UserPreferences.varibles = variables;
    }
    
    
    /**
     * Sets the new user preferences  
     * @param callbackIdent - JavaScript Callback Identifier to notify success result
     * @param newPreferences - JSON of User Preferences
     * @throws JSONException if it can't parse data
     */
    public void setPreferences(String callbackIdent, String newPreferences) throws JSONException {
    	// TODO update to new specs: volume preferences
        MALogger.log(TAG, Log.INFO, "Saving User Prefs: " + newPreferences);
        // Get Editor and preference from JSON Object
        SharedPreferences.Editor prefs = varibles.getSettings().edit();
        boolean success = false;
        
        try {
            JSONObject userdata = new JSONObject(newPreferences);
            @SuppressWarnings("unchecked")
            Iterator<String> keyIter = userdata.keys();
            
            while(keyIter.hasNext()) {
                // Get key and values
                String key = keyIter.next();
                String value = userdata.getString(key);
                
                // Save new preference
                prefs.putString(key, value);
            }
            
            success = prefs.commit();
        }
        catch (JSONException e) {
            MALogger.log(TAG, Log.ERROR, "Could Not Parse Data", e);
            success = false;
        }
        
        // Notify the Native Bridge
        varibles.getDroidBridge().callJS(callbackIdent, (new JSONObject()).put("succeeded", success).toString());
    }
    
    
    /**
     * Returns a specific user preference
     * @param callbackIdent - callback identifier to notify with data
     * @param key - the resulting value to retreive  
     */
    public void getPreference(String callbackIdent, String key) {
    	//TODO: update to new specs: multiple values requested
    	
        // Get Data from the application manager
        SharedPreferences prefs =  varibles.getSettings();
        
        // Default to null as specced in Native Bridge Doc
        String callbackData = prefs.getString(key, null);
        
        // Call Back Native Bridge
        varibles.getDroidBridge().callJS(callbackIdent, callbackData);
    }
}
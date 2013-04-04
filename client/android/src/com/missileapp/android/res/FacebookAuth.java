package com.missileapp.android.res;

import java.util.Date;

import android.content.SharedPreferences;
import android.util.Log;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

public class FacebookAuth {
    private static final String TAG = "FacebookAuth";
    private static final String FBSETTING_ACCESS_TOKEN = "SMSFB_AccessToken";
    private static final String FBSETTING_ACCESS_TOKEN_EXPIRE = "SMSFB_AccessTokenExpire";
    
    private final BagOfHolding variables;
    private String facebookToken;
    private Date facebookTokenExpiration;
    
    public FacebookAuth(BagOfHolding variables) {
        this.variables = variables;
        getFacebookAccessTokenFromPrefs();
        
        //TODO get info from Facebook
    }
    
    private void getFacebookAccessTokenFromPrefs() {
        SharedPreferences prefs = variables.getSettings();
        facebookToken = prefs.getString(FBSETTING_ACCESS_TOKEN, "");
        facebookTokenExpiration = new Date(prefs.getLong(FBSETTING_ACCESS_TOKEN_EXPIRE, 0));
    }
    
    private boolean saveFacebookAccessTokenToPrefs() {
        SharedPreferences.Editor prefsEditor = variables.getSettings().edit();
        prefsEditor.putString(FBSETTING_ACCESS_TOKEN, facebookToken);
        prefsEditor.putLong(FBSETTING_ACCESS_TOKEN_EXPIRE, facebookTokenExpiration.getTime());
        return prefsEditor.commit();
    }
    
    public boolean checkIfSessionExists() {
        return !facebookToken.isEmpty() && (facebookTokenExpiration.compareTo(new Date()) == -1);
    }
    
    public void notifyNativeBridgeAccessToken(String callbackID) {
        if(checkIfSessionExists()) {
            MALogger.log(TAG, Log.INFO, "Sending NB Access Token");
            variables.getDroidBridge().notifyNativeBridgeCallback(callbackID, facebookToken);
        }
    }
    
    public void logoutFacebook() {
        // Local Settings
        MALogger.log(TAG, Log.INFO, "Logging Out Of Facebook");
        facebookToken = "";
        facebookTokenExpiration = new Date(0);
        saveFacebookAccessTokenToPrefs();
        
        //TODO Nofify Facebook 
    }
}

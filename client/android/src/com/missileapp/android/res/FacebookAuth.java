package com.missileapp.android.res;

import java.util.Date;

import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.facebook.Session;
import com.facebook.SessionState;
import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

public class FacebookAuth {
    private static final String TAG = "FacebookAuth";
    private static final String FBSETTING_ACCESS_TOKEN = "SMSFB_AccessToken";
    private static final String FBSETTING_ACCESS_TOKEN_EXPIRE = "SMSFB_AccessTokenExpire";
    
    private final BagOfHolding variables;
    private String facebookToken;
    private Date facebookTokenExpiration;
    private String nbCallbackID;
    private Session.StatusCallback statusCallback;
    
    public FacebookAuth(BagOfHolding variables) {
        this.variables = variables;
        getFacebookAccessTokenFromPrefs();
        statusCallback = new SessionStatusCallback();
    }
    
    public void setActivityResult(int requestCode, int resultCode, Intent data) {
        Session.getActiveSession().onActivityResult(variables.getMissileApp(), requestCode, resultCode, data);
    }
    
    public void processStopRequest() {
        Session.getActiveSession().removeCallback(statusCallback);
    }
    
    /**
     * Retrieve Facebook Access Token + Expiration from Prefs
     */
    private void getFacebookAccessTokenFromPrefs() {
        SharedPreferences prefs = variables.getSettings();
        facebookToken = prefs.getString(FBSETTING_ACCESS_TOKEN, "");
        facebookTokenExpiration = new Date(prefs.getLong(FBSETTING_ACCESS_TOKEN_EXPIRE, 0));
    }
    
    /**
     * Save Facebook Access token + Expirations to Prefs
     * @return true if successfully saved
     */
    private boolean saveFacebookAccessTokenToPrefs() {
        SharedPreferences.Editor prefsEditor = variables.getSettings().edit();
        prefsEditor.putString(FBSETTING_ACCESS_TOKEN, facebookToken);
        prefsEditor.putLong(FBSETTING_ACCESS_TOKEN_EXPIRE, facebookTokenExpiration.getTime());
        return prefsEditor.commit();
    }
    
    /**
     * Checks whether a session exists with Facebook
     * @return true if session exists else false
     */
    public boolean checkIfSessionExists() {
        if(!facebookToken.isEmpty() && (facebookTokenExpiration.compareTo(new Date()) == -1)) {
            return true;
        }
        else {
            Session session = Session.getActiveSession();
            if(session == null) {
                loginFacebook();
            }
            else {
                processSession(session);
            }
            return false;
        }
        
    }
    
    /**
     * Notifies Native Bridge
     * @param callbackID - NB callback ident
     */
    public void notifyNativeBridgeAccessToken(String callbackID) {
        MALogger.log(TAG, Log.INFO, "Sending NB Access Token: " + callbackID);
        if(checkIfSessionExists()) {
            MALogger.log(TAG, Log.INFO, "Sending NB Access Token");
            variables.getDroidBridge().notifyNativeBridgeCallback(callbackID, facebookToken);
        }
        else {
            nbCallbackID = callbackID;
        }
    }
    
    private void loginFacebook() {
        if(!checkIfSessionExists()) {
            Session session = Session.openActiveSession(variables.getMissileApp(), true, statusCallback);
            Session.setActiveSession(session);
        }
    }
    
    private void processSession(Session session) {
        if(session != null && session.isOpened()) {
            facebookToken = session.getAccessToken();
            facebookTokenExpiration = session.getExpirationDate();
            if(!saveFacebookAccessTokenToPrefs()) {
                MALogger.log(TAG, Log.INFO, "Saving Facebook Data Failed");
            }
            
            if(nbCallbackID != null) {
                notifyNativeBridgeAccessToken(nbCallbackID);
            }
            
            MALogger.log(TAG, Log.INFO, "Setting Facebook Access Token with: " + facebookTokenExpiration.toString() + " token: " + facebookToken);
        }
    }
    
    /**
     * Logout of Facebook 
     */
    public void logoutFacebook() {
        // Local Settings
        MALogger.log(TAG, Log.INFO, "Logging Out Of Facebook");
        facebookToken = "";
        facebookTokenExpiration = new Date(0);
        if(!saveFacebookAccessTokenToPrefs()) {
            MALogger.log(TAG, Log.INFO, "Saving Facebook Data Failed");
        }
        
        // Notify Facebook
        Session session = Session.getActiveSession();
        if (!session.isClosed()) {
            session.closeAndClearTokenInformation();
        } 
    }
    
    
    private class SessionStatusCallback implements Session.StatusCallback {
        @Override
        public void call(Session session, SessionState state, Exception exception) {
            processSession(session);
        }
    }
}

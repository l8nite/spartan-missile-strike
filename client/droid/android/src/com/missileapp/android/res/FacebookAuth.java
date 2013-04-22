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
    private String callbackID;
    private String facebookToken;
    private Date facebookTokenExpiration;
    private Session.StatusCallback statusCallback;
    
    public FacebookAuth(BagOfHolding variables) {
        this.variables = variables;
        getFacebookAccessTokenFromPrefs();
        statusCallback = new SessionStatusCallback();
        callbackID = null;
    }
    
    public void setActivityResult(int requestCode, int resultCode, Intent data) {
        Session activeSession = Session.getActiveSession();
        if(activeSession != null) {
            activeSession.onActivityResult(variables.getMissileApp(), requestCode, resultCode, data);
        }
    }
    
    public void processStopRequest() {
        Session activeSession = Session.getActiveSession();
        if(activeSession != null) {
            activeSession.removeCallback(statusCallback);
        }
    }
    
    /**
     * Retrieve Facebook Access Token + Expiration from Prefs
     */
    private void getFacebookAccessTokenFromPrefs() {
        SharedPreferences prefs = variables.getSettings();
        facebookToken = prefs.getString(FBSETTING_ACCESS_TOKEN, null);
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
     * Returns true if we have a session currently saved
     */
    private boolean checkIfSessionExistsFromPrefs() {
        return (facebookToken != null && !facebookToken.isEmpty() && (facebookTokenExpiration.compareTo(new Date()) == -1));
    }
    
    /**
     * Checks with Facebook for access token
     * @param saveToPrefs - true to save to prefs if session is openeed 
     */
    private boolean checkIfSessionExistsFromFacebook(boolean saveToPrefs) {
        Session session = Session.getActiveSession();
        if(saveToPrefs && session != null && session.isOpened()) {
            facebookToken = session.getAccessToken();
            facebookTokenExpiration = session.getExpirationDate();
            if(!saveFacebookAccessTokenToPrefs()) {
                MALogger.log(TAG, Log.INFO, "Saving Facebook Data Failed");
            }
        }
        return (session != null) && session.isOpened();
    }
    
    /**
     * Notifies Native Bridge
     * @param callbackID - NB callback ident
     */
    public void notifyNativeBridgeAccessToken(String callbackID) {
        MALogger.log(TAG, Log.INFO, "Sending NB Access Token");
        this.callbackID = callbackID;
        if(checkIfSessionExistsFromPrefs() || checkIfSessionExistsFromFacebook(true)) {
            sendFacebookAccessTokenToNB();
        }
        else {
            loginToFacebook();
        }
    }
    
    /**
     * Sends Facebook Access Token To Native Bridge
     */
    private void sendFacebookAccessTokenToNB() {
        if(callbackID != null) {
            variables.getDroidBridge().notifyNativeBridgeCallback(callbackID, "\"" +facebookToken + "\"");
            callbackID = null;
        }
    }
    
    /**
     * Creates a request to Facebook
     */
    public void loginToFacebook() {
        Session session = Session.openActiveSession(variables.getMissileApp(), true, statusCallback);
        Session.setActiveSession(session);
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
        if (session != null && !session.isClosed()) {
            session.closeAndClearTokenInformation();
        } 
    }
    
    private class SessionStatusCallback implements Session.StatusCallback {
        public void call(Session session, SessionState state, Exception exception) {
            if(state == SessionState.OPENED || state == SessionState.OPENED_TOKEN_UPDATED || session.isOpened()) {
                try {
                    facebookToken = session.getAccessToken();
                    facebookTokenExpiration = session.getExpirationDate();
                    if(!saveFacebookAccessTokenToPrefs()) {
                        MALogger.log(TAG, Log.INFO, "Saving Facebook Data Failed");
                    }
                    sendFacebookAccessTokenToNB();
                }
                catch (Exception e) {
                    MALogger.log(TAG, Log.ERROR, "Error in Facebook callback", e);
                }
            }
            else {
                
            }
        }
    }
}
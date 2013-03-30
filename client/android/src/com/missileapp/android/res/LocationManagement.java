package com.missileapp.android.res;

import org.json.JSONException;
import org.json.JSONObject;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

import com.missileapp.android.BagOfHolding;
import com.missileapp.android.MALogger;

public class LocationManagement implements LocationListener {
    // DATA
    private static final String TAG = "LocationManagement";       // TAG for logging
    private BagOfHolding variables;                               // Variable bag
    private Location lastKnownLocation;                           // Last known lcoation
    private String callbackID;                                    // call back ident for native brigde

    /**
     * Location Manager for Android
     * @param variables - Variables Bag
     */
    public LocationManagement(BagOfHolding variables) {
        this.variables = variables;
        
        try {
            lastKnownLocation = variables.getLocationManager().getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            MALogger.log(TAG, Log.ERROR, lastKnownLocation.toString());
        } catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, e.getMessage(), e);
        }
    }
    
    /**
     * Starts sending location updates to Native Bridge
     * @param callbackID - callback identifier
     */
    public synchronized void startLocationUpdates(String callbackID) {
        MALogger.log(TAG, Log.ERROR, "Location subscription recieved");
        this.callbackID = callbackID;
    }
    
    /**
     * Stops sending location updates to Native Bridge
     */
    public synchronized void stopLocationUpdates() {
        MALogger.log(TAG, Log.ERROR, "Recieved Location revoked");
        this.callbackID = null;
    }
    
    /**
     * Sends the last known location to Native Bridge
     * @param callbackIdent callback identifier
     * @throws JSONException could not constuct JSON
     */
    public synchronized void sendLocationToNativeBridge() throws JSONException {
        MALogger.log(TAG, Log.ERROR, "Sending location data: " + ((lastKnownLocation == null) ? "null." : lastKnownLocation.toString()));
        
        if(lastKnownLocation != null && this.callbackID != null) {
            // Get Location
            double latitude = lastKnownLocation.getLatitude();
            double longitude = lastKnownLocation.getLongitude();
            
            // Construct Data
            JSONObject callbackData = new JSONObject();
            callbackData.put("latitude", latitude);
            callbackData.put("longitude", longitude);
            variables.getDroidBridge().notifyNativeBridgeCallback(this.callbackID, callbackData.toString());
        }
    }

    /** Location Provider Created */
    public void onProviderEnabled(String provider) { }

    /** Location Provider Destroyed */
    public void onProviderDisabled(String provider) { }

    /** Location Service Status */
    public void onStatusChanged(String provider, int status, Bundle extras) { }

    /** Location Changed */
    public void onLocationChanged(Location location) {
        synchronized (lastKnownLocation) {
            if (isBetterLocation(location)) {
                lastKnownLocation = location;
            }
        }

        try {
            sendLocationToNativeBridge();
        } catch (Exception e) {
            MALogger.log(TAG, Log.ERROR, e.getMessage(), e);
        }
    }

    ////////////////////////
    //     Google Code    //
    ////////////////////////
    /* http://developer.android.com/guide/topics/location/strategies.html  */
    private boolean isBetterLocation(Location location) {
        final int TWO_MINUTES = 1000 * 60 * 2;

        if (lastKnownLocation != null) {
            long timeDelta = location.getTime() - lastKnownLocation.getTime();
            boolean isSignificantlyNewer = timeDelta > TWO_MINUTES;
            boolean isSignificantlyOlder = timeDelta < -TWO_MINUTES;
            boolean isNewer = timeDelta > 0;

            if (isSignificantlyNewer) {
                return true;
            }
            else if (isSignificantlyOlder) {
                return false;
            }
            else {
                int accuracyDelta = (int) (location.getAccuracy() - lastKnownLocation.getAccuracy());
                boolean isLessAccurate = accuracyDelta > 0;
                boolean isMoreAccurate = accuracyDelta < 0;
                boolean isSignificantlyLessAccurate = accuracyDelta > 200;
                boolean isFromSameProvider = (location.getProvider() == null) ? lastKnownLocation.getProvider() == null : location.equals(lastKnownLocation);

                if (isMoreAccurate) {
                    return true;
                }
                else if (isNewer && !isLessAccurate) {
                    return true;
                }
                else if (isNewer && !isSignificantlyLessAccurate && isFromSameProvider) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return true;
        }
    }
}

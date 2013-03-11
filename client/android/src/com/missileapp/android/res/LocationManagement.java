package com.missileapp.android.res;

import org.json.JSONException;
import org.json.JSONObject;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import com.missileapp.android.BagOfHolding;

@SuppressWarnings("unused")
public class LocationManagement implements LocationListener {
    // DATA
    private static final String TAG = "LocationManagement";       // TAG for logging
    private BagOfHolding variables;                               // Variable bag
    private Location lastKnownLocation;                           // Last known lcoation
    private boolean isNativeBridgeSubscribed;                     // true of native bridge is subscribed
    private String callbackID;                                    // call back ident for native brigde

    /**
     * Location Manager for Android
     * @param variables - Variables Bag
     */
    public LocationManagement(BagOfHolding variables) {
        this.variables = variables;

        try {
            lastKnownLocation = variables.getLocationManager().getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        } catch (Exception e) {}
    }

    /**
     * Returns the current location to native bridge
     * @param callbackIdentifier call back identifier
     */
    public void getCurrentLocation(String callbackIdentifier) {
        try {
            sendLocationToNativeBridge(callbackIdentifier);
        } catch (Exception e) { }
    }

    /**
     * Set location subscription to Native Bridge
     * @param activate true to send, else false
     * @param callbackID native bridge call back identifier
     */
    public void getLocationUpdates(String activate, String callbackID) {
        try {
            isNativeBridgeSubscribed = Boolean.valueOf(activate);
            this.callbackID = callbackID;
        }
        catch (Exception e) {
            isNativeBridgeSubscribed = false;
        }
    }
    
    /**
     * Sends the last known location to Native Bridge
     * @param callbackIdent callback identifier
     * @throws JSONException could not constuct JSON
     */
    public void sendLocationToNativeBridge(String callbackIdent) throws JSONException {
        if(lastKnownLocation != null && callbackIdent != null) {
            double latitude = 0.0;
            double longitude = 0.0;
            synchronized (lastKnownLocation) {
                if (lastKnownLocation != null) {
                    latitude = lastKnownLocation.getLatitude();
                    longitude = lastKnownLocation.getLongitude();
                }
            }

            if (isNativeBridgeSubscribed) {
                JSONObject callbackData = new JSONObject();
                callbackData.put("latitude", latitude);
                callbackData.put("longitude", longitude);
                variables.getDroidBridge().callJSforCallBack(callbackIdent, callbackData.toString());
            }
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
            sendLocationToNativeBridge(callbackID);
        } catch (Exception e) { }
    }

    // //////////////////////
    // Google Code //
    // //////////////////////
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

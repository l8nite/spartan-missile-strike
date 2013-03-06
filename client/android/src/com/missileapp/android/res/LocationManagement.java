package com.missileapp.android.res;

import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

import com.missileapp.android.BagOfHolding;

public class LocationManagement implements LocationListener {
	// DATA
    private static final String TAG = "Location";                 // TAG for logging
    private BagOfHolding variables;                               // Variable bag
    
    /**
     * Location Manager for Android 
     * @param variables - Variables Bag
     */
	public LocationManagement(BagOfHolding variables) {
		super();
		this.variables = variables;
	}
	
	
	/**
	 * Location Provider Created
	 */
	@Override
	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * Location Provider Destroyed
	 */
	@Override
	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * Location Changed
	 */
	@Override
	public void onLocationChanged(Location location) {
		// TODO Auto-generated method stub
	}
	
	
	/**
	 * Location Service Status
	 */
	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub
		
	}

}

package com.missileapp.android.res;

import android.content.SharedPreferences;

import com.missileapp.android.BagOfHolding;

public class UserPreferences {
    
    // Variables
    private static BagOfHolding varBag;           // Bag Of Holding for Variables
    
    public UserPreferences(BagOfHolding varBag) {
        UserPreferences.varBag = varBag;
    }
    
    
    public void setPreferences() {
        // TODO set preference
        SharedPreferences.Editor prefs = varBag.getSettings().edit();
        
        
        prefs.commit();
        // TODO notify Native Bridge?
    }
    
    public void getPreference() {
        // TODO get preference
        SharedPreferences prefs =  varBag.getSettings();
        
    }
    
    
}

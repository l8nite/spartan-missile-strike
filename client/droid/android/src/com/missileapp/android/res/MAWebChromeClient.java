package com.missileapp.android.res;

import com.missileapp.android.MALogger;

import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;

public class MAWebChromeClient extends WebChromeClient {
    private static final String TAG = "WebChromeClient"; 
    
    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        boolean retVal = super.onConsoleMessage(consoleMessage);
        MALogger.log(TAG, Log.VERBOSE, "Source: " + consoleMessage.sourceId() + "| Line: " + consoleMessage.lineNumber() + "| MSG: " + consoleMessage.message());
        return retVal;
    }
}

package com.missileapp.android;

import android.content.Context;
import android.os.Vibrator;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;

@SuppressWarnings({"unused"})
public class AndroidBridge extends MissileApp {
    // Data
    private static final String TAG = "AndroidBridge";          //TAG for logging
    private static final String NBCallBack_prefix = "javascript:NativeBridge.callback(";
    private static final String NBCallBack_postfix = ");";
    
    private Context context;
    private WebView webview;
    
    private Vibrator vibrator;                    //Device vibrator
    
    /**
     * Android Concrete Methods for HTML/Native Bridge
     * @param context - Android MissileApp Context {@link Context}
     * @param webview - MissileApp webView {@link WebView}
     */
    public AndroidBridge(Context context, WebView webview) {
        super();
        this.context = context;
        this.webview = webview;
    }
    
    /**
     * Calls the NativeBridge CallBack function
     * @param callbackident - callback identifier, see Native Bridge
     * @param callbackData - data to pass to the callback identifier
     */
    public void callJS(String callbackident, String callbackData) {
        String url = NBCallBack_prefix + callbackident + "," + callbackData + NBCallBack_postfix;
        webview.loadUrl(url);
    }
}

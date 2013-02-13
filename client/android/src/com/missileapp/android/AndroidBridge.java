package com.missileapp.android;

import android.content.Context;
import android.webkit.WebView;

@SuppressWarnings({"unused"})
public class AndroidBridge extends MissileApp {
    private Context context;
    private WebView webview;
    
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
    
    
    
    
    
}

package com.srkarra.sandbox.webvt;

import android.annotation.*;
import android.app.*;
import android.os.*;
import android.webkit.*;

@SuppressLint("SetJavaScriptEnabled")
public class SBWVT extends Activity {
	
	private WebView webview;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        webview = (WebView) findViewById(R.id.main);
        webview.addJavascriptInterface(new JSInterface(this, webview), "SpartanMissileStrike");
        webview.getSettings().setJavaScriptEnabled(true);
        webview.loadUrl("file:///android_asset/main/index.html");
    }
}
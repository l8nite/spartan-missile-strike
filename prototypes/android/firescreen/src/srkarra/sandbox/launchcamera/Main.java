package srkarra.sandbox.launchcamera;

import android.hardware.Camera;
import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.webkit.WebView;

public class Main extends Activity implements SurfaceHolder.Callback {
	private Camera cam;
	private SurfaceView surfaceView;
	private SurfaceHolder surfaceHolder;
	private WebView webview;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        surfaceView = (SurfaceView) findViewById(R.id.CamView);
        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
    }
    
    @Override
    public void onResume(){
    	openCam();
        super.onResume();
    }
    @Override
    public void onPause(){
        closeCam();
        super.onPause();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    public void surfaceCreated(SurfaceHolder holder) {
		previewCam(holder);
	}
    
	public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
		previewCam(holder);
	}


	public void surfaceDestroyed(SurfaceHolder holder) {
		closeCam();
	}
	
	private void openCam() {
		cam = Camera.open();
	}
	
	private void previewCam(SurfaceHolder holder) {
		try {
			cam.setDisplayOrientation(90);
            cam.setPreviewDisplay(holder);
            cam.startPreview();

            
            //Launch Webview
            webview = (WebView) findViewById(R.id.WebView);
            webview.setBackgroundColor(0x00000000);
            webview.getSettings().setJavaScriptEnabled(true);
            webview.loadUrl("file:///android_asset/index.html");
        } catch (Exception e) {
            e.printStackTrace();
        }
	}
	
	private void closeCam() {
		cam.stopPreview();
        cam.release();
	}
}

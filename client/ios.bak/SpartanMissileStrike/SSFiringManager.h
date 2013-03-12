//
//  SSFiringManager.h
//  SpartanMissileStrike
//
//  Created by Sherif on 3/5/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
@protocol AVCamCaptureManagerDelegate;
@interface SSFiringManager : NSObject{
    
    
}

@property (nonatomic,strong) AVCaptureSession *session;
@property (nonatomic,assign) AVCaptureVideoOrientation orientation;
@property (nonatomic,strong) AVCaptureDeviceInput *videoInput;

- (BOOL) setupSession;
@end

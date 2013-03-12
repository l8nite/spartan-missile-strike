//
//  SSNativeBridge.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SSNativeBridgeDelegate;

@interface SSNativeBridge : NSObject <UIWebViewDelegate>

@property (unsafe_unretained) id<SSNativeBridgeDelegate> delegate;

@end
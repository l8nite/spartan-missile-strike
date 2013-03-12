//
//  SSFacebookManager.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SSFacebookManagerDelegate;

@interface SSFacebookManager : NSObject

@property (unsafe_unretained) id<SSFacebookManagerDelegate> delegate;

-(BOOL)isLoggedIn;
-(void)openSession;
-(void)handleDidBecomeActive;
-(BOOL)handleOpenURL:(NSURL *)url;
-(NSString *)accessToken;

@end

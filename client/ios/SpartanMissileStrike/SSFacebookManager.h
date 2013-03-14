//
//  SSFacebookManager.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <FacebookSDK/FacebookSDK.h>

@interface SSFacebookManager : NSObject

-(void)openSessionAndContinueWith:(void (^)(FBSessionState sessionState))stateHandler;
-(void)getAccessTokenWith:(void (^)(NSString* accessToken))tokenHandler;

@end

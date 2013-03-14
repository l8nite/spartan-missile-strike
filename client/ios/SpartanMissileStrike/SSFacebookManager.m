//
//  SSFacebookManager.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSFacebookManager.h"

@implementation SSFacebookManager

-(id)init
{
    if (self = [super init]) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(applicationDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
    }
    
    return self;
}

-(void)applicationDidBecomeActive
{
    [FBSession.activeSession handleDidBecomeActive];
}

-(void)openSessionAndContinueWith:(void (^)(FBSessionState state))stateHandler
{
    [FBSession openActiveSessionWithReadPermissions:nil allowLoginUI:YES completionHandler:
     ^(FBSession *session, FBSessionState state, NSError *error) {
         if (error) {
             NSLog(@"openActiveSessionWithReadPermissions error: %@", error);
         }

         switch (state) {
             case FBSessionStateOpen:
                 stateHandler(FBSessionStateOpen);
                 break;
             case FBSessionStateClosed:
             case FBSessionStateClosedLoginFailed:
                 [FBSession.activeSession closeAndClearTokenInformation];
                 stateHandler(FBSessionStateClosed);
                 break;
             default:
                 break;
         }
     }];
}

-(void)getAccessTokenWith:(void (^)(NSString*))tokenHandler
{
    NSString *accessToken = [[[FBSession activeSession] accessTokenData] accessToken];

    if (accessToken != nil) {
        tokenHandler(accessToken);
    }
    else {
        [self openSessionAndContinueWith:^(FBSessionState sessionState) {
            if (sessionState == FBSessionStateOpen) {
                tokenHandler([[[FBSession activeSession] accessTokenData] accessToken]);
            }
            else {
                tokenHandler(nil);
            }
        }];
    }
}

@end

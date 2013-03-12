//
//  SSFacebookManager.m
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/12/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import "SSFacebookManager.h"
#import "SSFacebookManagerDelegate.h"
#import <FacebookSDK/FacebookSDK.h>

@implementation SSFacebookManager

@synthesize delegate;

-(void)openSession
{
    NSLog(@"calling openSession");
    [FBSession openActiveSessionWithReadPermissions:nil
                                       allowLoginUI:YES
                                  completionHandler:
     ^(FBSession *session,
       FBSessionState state, NSError *error) {
         [self sessionStateChanged:session state:state error:error];
     }];
}

-(BOOL)isLoggedIn
{
    return FBSession.activeSession.state == FBSessionStateCreatedTokenLoaded;
}

-(void)handleDidBecomeActive
{
    [FBSession.activeSession handleDidBecomeActive];
}

-(BOOL)handleOpenURL:(NSURL *)url
{
    return [FBSession.activeSession handleOpenURL:url];
}

- (void)sessionStateChanged:(FBSession *)session
                      state:(FBSessionState) state
                      error:(NSError *)error
{
    switch (state) {
        case FBSessionStateOpen:
            [delegate facebookUserDidLogIn];
            break;
        case FBSessionStateClosed:
        case FBSessionStateClosedLoginFailed:
            [FBSession.activeSession closeAndClearTokenInformation];
            [delegate facebookUserDidLogOut];
            break;
        default:
            break;
    }
    
    if (error) {
        NSLog(@"sessionStateChanged Error: %@", error);
    }
}

-(NSString *)accessToken
{
    return FBSession.activeSession.accessTokenData.accessToken;
}
@end

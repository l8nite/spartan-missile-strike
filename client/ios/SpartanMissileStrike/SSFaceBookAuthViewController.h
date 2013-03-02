//
//  SSFaceBookAuthViewController.h
//  SpartanMissileStrike
//
//  Created by Sherif on 2/26/13.
//  Copyright (c) 2013 Group 2. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <FacebookSDK/FacebookSDK.h>

@interface SSFaceBookAuthViewController : UIViewController
{
    
    FBSession *_session;
    UIButton *_logoutButton;
	NSString *_facebookName;
    
    
}
@property (nonatomic, retain) FBSession *session;
@property (nonatomic, copy) NSString *facebookName;

-(void)loginFB:(id)sender;

// FBSample logic
// This method should be called to indicate that a login which was in progress has
// resulted in a failure.
- (void)loginFailed;

@end

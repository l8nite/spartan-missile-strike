//
//  AppDelegate.h
//  Spartan Missile Strike
//
//  Created by Sherif on 11/28/12.
//  Copyright (c) 2012 Jomana Sherif. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SSAppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
 

@end
@interface AddTwoTextFiledViewController: UIViewController
{
    IBOutlet UITextField *textField;
    IBOutlet UITextField *textField1;
    IBOutlet UITextField *textField2;
    
    NSString *String;
    
}

  
@end

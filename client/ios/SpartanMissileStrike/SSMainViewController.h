//
//  SSViewController.h
//  SpartanMissileStrike
//
//  Created by Shaun Guth on 3/11/13.
//  Copyright (c) 2013 missileapp.com. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SSMainViewController : UIViewController

@property (weak, nonatomic) IBOutlet UIWebView *webView;

-(void)initializeHtmlContent;

@end

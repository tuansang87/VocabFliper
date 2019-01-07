/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

//#import "RCTSplashScreen.h" //import interface
#define  DEFAULT_IP @"192.168.1.1"
#define  DEFAULT_PORT @"8080"

@interface AppDelegate()<UITextFieldDelegate>
{
  NSString *tmpIp;
  NSString *tmpPort;
  NSString *tmpOfflineSign;
}

@end


@implementation AppDelegate
+ (AppDelegate *)sharedInstance {
  return (AppDelegate *)UIApplication.sharedApplication.delegate;
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
  return YES;
}

-(BOOL)textFieldShouldEndEditing:(UITextField *)textField {
  return YES;
}

- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string {
  NSString * newStr = [textField.text stringByReplacingCharactersInRange:range withString:string];
  switch (textField.tag) {
    case 1001:
      tmpIp = newStr;
      break;
    case 1002:
      tmpPort = newStr;
      break;
    case 1003:
      tmpOfflineSign = newStr;
      break;
      
    default:
      break;
  }
  return YES;
}


- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
  
  NSString * cachedIP = [[NSUserDefaults standardUserDefaults] stringForKey:@"DEV_IP"] ?: DEFAULT_IP;
  NSString * cahedPort = [[NSUserDefaults standardUserDefaults] stringForKey:@"DEV_PORT"] ?: DEFAULT_PORT;
  
  NSString *DEV_IP = tmpIp ?: cachedIP;
  NSString *DEV_PORT =tmpPort ?: cahedPort;
  if(DEV_IP) {
    [[NSUserDefaults standardUserDefaults] setValue:DEV_IP forKey:@"DEV_IP"];
  }
  if(DEV_PORT) {
    [[NSUserDefaults standardUserDefaults] setValue:DEV_PORT forKey:@"DEV_PORT"];
  }
  [[NSUserDefaults standardUserDefaults] synchronize];
  
  NSURL *jjsCodeLocation = nil;
  BOOL useOfflineBundle = tmpOfflineSign && tmpOfflineSign.length > 0;
  if(useOfflineBundle) {
    jjsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  } else {
    jjsCodeLocation = [NSURL URLWithString:[NSString stringWithFormat:@"http://%@:%@/index.bundle?platform=ios&dev=true&minify=false" , DEV_IP , DEV_PORT]];
  }
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jjsCodeLocation
                                                      moduleName:@"VocabFliper"
                                               initialProperties:nil
                                                   launchOptions:nil];
  //[RCTSplashScreen open:rootView];
//  [RCTSplashScreen open:rootView withImageNamed:@"splash"]; // activate splashscreen, imagename from LaunchScreen.xib
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  UIView *rootView = nil;
#ifdef DEBUG
  
  UIAlertView *myView = [[UIAlertView alloc]initWithTitle:@"Enter your Dev IP/Port" message:@"" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
  myView.delegate = self;
  NSString * cachedIP = [[NSUserDefaults standardUserDefaults] stringForKey:@"DEV_IP"] ?: DEFAULT_IP;
  NSString * cahedPort = [[NSUserDefaults standardUserDefaults] stringForKey:@"DEV_PORT"] ?: DEFAULT_PORT;
  
  UIView *v = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 250, 100)];
  
  UITextField *textField1 = [[UITextField alloc] initWithFrame:CGRectMake(10,0,252,25)];
  textField1.tag = 1001;
  textField1.borderStyle = UITextBorderStyleRoundedRect;
  textField1.placeholder = @"IP";
  textField1.text = cachedIP;
  textField1.delegate = self;
  textField1.keyboardAppearance = UIKeyboardAppearanceAlert;
  [v addSubview:textField1];
  
  UITextField *textField2 = [[UITextField alloc] initWithFrame:CGRectMake(10,30,252,25)];
  textField2.tag = 1002;
  textField2.placeholder = @"PORT";
  textField2.text = cahedPort;
  textField2.delegate = self;
  textField2.borderStyle = UITextBorderStyleRoundedRect;
  textField2.keyboardAppearance = UIKeyboardAppearanceAlert;
  [v addSubview:textField2];
  
  
  UITextField *textField3 = [[UITextField alloc] initWithFrame:CGRectMake(10,60,252,25)];
  textField3.tag = 1003;
  textField3.placeholder = @"Input any for offline bundle";
  textField3.borderStyle = UITextBorderStyleRoundedRect;
  textField3.keyboardAppearance = UIKeyboardAppearanceAlert;
  [v addSubview:textField3];
  textField3.delegate = self;
  [myView setValue:v  forKey:@"accessoryView"];
  [myView show];
  rootView = [UIView new];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                         moduleName:@"VocabFliper"
                                  initialProperties:nil
                                      launchOptions:launchOptions];
  //[RCTSplashScreen open:rootView];
//  [RCTSplashScreen open:rootView withImageNamed:@"splash"]; // activate splashscreen, imagename from LaunchScreen.xib
#endif
  
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end

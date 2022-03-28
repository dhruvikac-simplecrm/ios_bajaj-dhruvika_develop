//
//  WebViewC.h
//  SalesMobi
//
//  Created by SimpleCRM on 24/08/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

//#ifndef WebViewC_h
//#define WebViewC_h
//#import <React/RCTBridgeModule.h>
//#import <WebKit/WebKit.h>
//
//@interface WebViewC : UIViewController NSObject<RCTBridgeModule>
//
//@property(strong,nonatomic) WKWebView *webView;
//@property (strong, nonatomic) NSString *productURL;
//
//@end
//#endif /* WebViewC_h */

#import <React/RCTBridgeModule.h>
#import <WebKit/WebKit.h>
//UIViewController
@interface WebViewC : NSObject<RCTBridgeModule>
//@interface WebViewC : UIViewController

@property(strong,nonatomic) WKWebView *webView;
@property (strong, nonatomic) NSString *productURL;

@end

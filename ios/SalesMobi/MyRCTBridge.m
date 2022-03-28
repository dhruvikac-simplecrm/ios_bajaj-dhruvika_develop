//
//  MyRCTBridge.m
//  SalesMobi
//
//  Created by SimpleCRM on 08/09/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "MyRCTBridge.h"
#import "ReactNativeEvents.h"

@implementation MyRCTBridge
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(closeModal) {
    [[NSNotificationCenter defaultCenter] postNotificationName:ReactEventCloseModal object:nil];
}

@end

package com.salesmobi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactlibrary.RNReactNativeDocViewerPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.rnfs.RNFSPackage;
import com.airbnb.android.react.maps.MapsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativenavigation.NavigationReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativePushNotificationPackage(),
            new RNDeviceInfo(),
            new ImageResizerPackage(),
            new RNReactNativeDocViewerPackage(),
            new RNGooglePlacesPackage(),
            new RNFSPackage(),
            new MapsPackage(),
            new RNFirebasePackage(),
            new ReactNativeDocumentPicker(),
            new PickerPackage(),
            new NavigationReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

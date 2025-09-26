
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/polyfills-legacy.21vFzCyf.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/app-legacy.yJKmzkix.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/bg-legacy.CzqWzUzY.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/page-OnePage-legacy.Dqo_CsIe.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/DeliveryMethodSelectorSection-legacy.DDSgiI8s.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/useEditorShopPayNavigation-legacy.BR_BVuqu.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/VaultedPayment-legacy.DM5Cvcmg.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField-legacy.BZ8crxQE.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/ShopPayOptInDisclaimer-legacy.DwbTAYxq.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown-legacy.DUyclN68.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/MerchandiseModal-legacy.oCCzu96c.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview-legacy.DyRlCbos.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/PayButtonSection-legacy.Cq4QoLSU.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/component-ShopPayVerificationSwitch-legacy.BiITk0Ly.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/useSubscribeMessenger-legacy.CRUMnqgu.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/index-legacy.OfXxGx2t.js"];
      var styles = [];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0724/1954/1309/files/C8E6CA34-5FC4-4640-A3D9-4CAA5B7677E7_x320.png?v=1677103220"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  
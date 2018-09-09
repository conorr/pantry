const inventory = [
    {
        "sku": "GrassfedGroundBeefPH", 
        "startingQuantity": 40.0, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-01T00:00:00.000Z", 
        "consumedQuantity": 40.0, 
        "invoice": "113601", 
        "unitCost": 3.69, 
        "unit": "lb"
    }, 
    {
        "sku": "LambGroundSuperiorUSAHalal", 
        "startingQuantity": 20.0, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-02T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "113601", 
        "unitCost": 5.99, 
        "unit": "lb"
    }, 
    {
        "sku": "ChickenThighBonelessSkinlessNW", 
        "startingQuantity": 14.83, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-03T00:00:00.000Z", 
        "consumedQuantity": 14.83, 
        "invoice": "113601", 
        "unitCost": 2.99, 
        "unit": "lb"
    }, 
    {
        "sku": "ChickenThighBoneless", 
        "startingQuantity": 31.5, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-04T00:00:00.000Z", 
        "consumedQuantity": 31.5, 
        "invoice": "113649", 
        "unitCost": 1.5, 
        "unit": "lb"
    }, 
    {
        "sku": "ChickenThighBonelessSkinlessNW", 
        "startingQuantity": 15.18, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-04T00:00:00.000Z", 
        "consumedQuantity": 15.18, 
        "invoice": "113649", 
        "unitCost": 2.99, 
        "unit": "lb"
    }, 
    {
        "sku": "Delivery113649", 
        "startingQuantity": 1.0, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-04T00:00:00.000Z", 
        "consumedQuantity": 1.0, 
        "invoice": "113649", 
        "unitCost": 10.0, 
        "unit": "delivery"
    }, 
    {
        "sku": "Chickpeas", 
        "startingQuantity": 25.0, 
        "vendor": "Villa Jerada", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-20T00:00:00.000Z", 
        "consumedQuantity": 25.0, 
        "invoice": "9343", 
        "unitCost": 1.116, 
        "unit": "lb"
    }, 
    {
        "sku": "AtlasOliveOil3L", 
        "startingQuantity": 4.0, 
        "vendor": "Villa Jerada", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-20T00:00:00.000Z", 
        "consumedQuantity": 2.5, 
        "invoice": "9343", 
        "unitCost": 22.73, 
        "unit": "unit"
    }, 
    {
        "sku": "SesameSeeds", 
        "startingQuantity": 20.0, 
        "vendor": "Villa Jerada", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-05-20T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "9343", 
        "unitCost": 3.95, 
        "unit": "lb"
    }, 
    {
        "sku": "LemonJuiceConcentrate10x40oz", 
        "startingQuantity": 10.0, 
        "vendor": "Pacific Food Importers", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-06T00:00:00.000Z", 
        "consumedQuantity": 2.0, 
        "invoice": "248020", 
        "unitCost": 11.495, 
        "unit": "unit"
    }, 
    {
        "sku": "PBFThinPitaBread12inch6pcWhite", 
        "startingQuantity": 36.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-07T00:00:00.000Z", 
        "consumedQuantity": 33.0, 
        "invoice": "3751321", 
        "unitCost": 1.49, 
        "unit": "bag"
    }, 
    {
        "sku": "PBFThinPitaBread12inch6pcWholeWheat", 
        "startingQuantity": 12.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-08T00:00:00.000Z", 
        "consumedQuantity": 12.0, 
        "invoice": "3751321", 
        "unitCost": 1.49, 
        "unit": "bag"
    }, 
    {
        "sku": "ZahlawiTahini40lbPail", 
        "startingQuantity": 1.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-09T00:00:00.000Z", 
        "consumedQuantity": 1.0, 
        "invoice": "3751321", 
        "unitCost": 73.95, 
        "unit": "pail"
    }, 
    {
        "sku": "Delivery3751321", 
        "startingQuantity": 1.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-10T00:00:00.000Z", 
        "consumedQuantity": 1.0, 
        "invoice": "3751321", 
        "unitCost": 10.0, 
        "unit": "delivery"
    }, 
    {
        "sku": "ChickenThighBonelessSkinlessNW", 
        "startingQuantity": 31.45, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-15T00:00:00.000Z", 
        "consumedQuantity": 31.45, 
        "invoice": "114077", 
        "unitCost": 2.99, 
        "unit": "lb"
    }, 
    {
        "sku": "Delivery114077", 
        "startingQuantity": 1.0, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-15T00:00:00.000Z", 
        "consumedQuantity": 1.0, 
        "invoice": "114077", 
        "unitCost": 10.0, 
        "unit": "delivery"
    }, 
    {
        "sku": "SadafBulgurNumber1_50lbs", 
        "startingQuantity": 1.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-06-25T00:00:00.000Z", 
        "consumedQuantity": 0.1, 
        "invoice": "3751998", 
        "unitCost": 43.65, 
        "unit": "unit"
    }, 
    {
        "sku": "GrassfedGroundBeefPH", 
        "startingQuantity": 40.0, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-09T00:00:00.000Z", 
        "consumedQuantity": 30.0, 
        "invoice": "114510", 
        "unitCost": 3.69, 
        "unit": "pound"
    }, 
    {
        "sku": "DraperThighBoneless", 
        "startingQuantity": 16.78, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-09T00:00:00.000Z", 
        "consumedQuantity": 16.78, 
        "invoice": "114510", 
        "unitCost": 2.99, 
        "unit": "pound"
    }, 
    {
        "sku": "ZahlawiTahini40lbPail", 
        "startingQuantity": 2.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-26T00:00:00.000Z", 
        "consumedQuantity": 0.33, 
        "invoice": "3753188", 
        "unitCost": 73.95, 
        "unit": "pail"
    }, 
    {
        "sku": "PBFThinPitaBread12inch6pcWholeWheat", 
        "startingQuantity": 36.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-27T00:00:00.000Z", 
        "consumedQuantity": 28.0, 
        "invoice": "3753188", 
        "unitCost": 1.49, 
        "unit": "bag"
    }, 
    {
        "sku": "PBFThinPitaBread12inch6pcWhite", 
        "startingQuantity": 72.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-28T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "3753188", 
        "unitCost": 1.49, 
        "unit": "bag"
    }, 
    {
        "sku": "AzureRoastedEggplantPulp1x3kg", 
        "startingQuantity": 1.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-29T00:00:00.000Z", 
        "consumedQuantity": 1.0, 
        "invoice": "3753188", 
        "unitCost": 7.0, 
        "unit": "jar"
    }, 
    {
        "sku": "Delivery3753188", 
        "startingQuantity": 1.0, 
        "vendor": "West Coast Pita", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-07-30T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "3753188", 
        "unitCost": 10.0, 
        "unit": "delivery"
    }, 
    {
        "sku": "RandomThighBonelessFresh", 
        "startingQuantity": 40.0, 
        "vendor": "Select Gourmet Foods", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-01T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "114807", 
        "unitCost": 1.99, 
        "unit": "pound"
    }, 
    {
        "sku": "AtlasOliveOil3L", 
        "startingQuantity": 3.0, 
        "vendor": "Villa Gerada", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-14T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "10129", 
        "unitCost": 22.73, 
        "unit": "unit"
    }, 
    {
        "sku": "Chickpeas25lbs", 
        "startingQuantity": 1.0, 
        "vendor": "Villa Gerada", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-14T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "10129", 
        "unitCost": 27.9, 
        "unit": "unit"
    }, 
    {
        "sku": "BaklawaPistFullTray", 
        "startingQuantity": 2.0, 
        "vendor": "Shatila Bakery", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-29T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "1270836", 
        "unitCost": 31.0, 
        "unit": "box"
    }, 
    {
        "sku": "BirdNesCashewFullTray", 
        "startingQuantity": 2.0, 
        "vendor": "Shatila Bakery", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-29T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "1270836", 
        "unitCost": 21.5, 
        "unit": "box"
    }, 
    {
        "sku": "MamoulMiniDatesFullTray", 
        "startingQuantity": 3.0, 
        "vendor": "Shatila Bakery", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-29T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "1270836", 
        "unitCost": 22.0, 
        "unit": "box"
    }, 
    {
        "sku": "Shipping1270836", 
        "startingQuantity": 1.0, 
        "vendor": "Shatila Bakery", 
        "spoiledQuantity": 0.0, 
        "invoiceDateUtc": "2018-08-29T00:00:00.000Z", 
        "consumedQuantity": 0.0, 
        "invoice": "1270836", 
        "unitCost": 32.42, 
        "unit": "shipment"
    }
]

module.exports = inventory;
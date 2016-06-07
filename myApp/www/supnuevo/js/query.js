angular.module('app')
  .controller('queryController',function($scope,$state,$http,$cordovaProgress,$ionicPlatform,locals){
    $scope.user = {username:locals.get('username',''),supnuevoMerchantId:locals.get('supnuevoMerchantId','')};
    $scope.selectedCode = {codeNum:''};
    //$scope.updatePrice = new Object();
    $scope.goods = {codeNum:''};
    $scope.barCodes = new Array();
    $scope.tax = new Array();
    $scope.sizeArr = new Array();
    $scope.selectedCodeInfo = {priceId:'',price:'',oldPrice:'',priceShow:'',price1:'',nombre:'',codigo:'',iva:'',printType:''};
    $scope.printType = {type1:'0',type2:'0',type3:'0',type4:'0'};
    $scope.class = {
      class1:'button button-block button-stable',
      class2:'button button-block button-stable',
      class3:'button button-block button-stable',
      class4:'button button-block button-stable'}
    $scope.queryGoodsCode = function(){
      var code = $scope.goods.codeNum;
      if(code !== null && code !== undefined && code !== "" &&　code.length === 4){
        $cordovaProgress.show();
        $http({
          method:"post",
          data:{codigo:code},
          url:"http://211.87.225.210:8080/supnuevo/supnuevo/supnuevoGetQueryDataListByInputStringBs.do?codigo="+code,
          error:function(err){

          },
        }).success(function(response){

          var array = new Array();
          response.array.map(function(index,i){
            array.push(index);
          });
          $scope.barCodes = [];
          for(var i = 0 ; i < array.length;i++){
            var o = {value:'',label:''};
            o.label = array[i].commodityId;
            o.value = array[i].codigo;
            $scope.barCodes.push(o);
          }
          $cordovaProgress.hide();
        }).error(function(err){
          alert(err.toSource());
          $cordovaProgress.show({
            template:'connect the server timeout',
            duration:'2000'
          });
        })

      }



    }
    $scope.func = function(){
     // var codigo = $scope.selectedCode[codeNum];
     var selectedCode =  $scope.selectedCode;
      var supnuevoMerchantId =  $scope.user.supnuevoMerchantId;
      var codigo = selectedCode.codeNum;
      $http({
        method:"post",

        url:"http://211.87.225.210:8080/supnuevo/supnuevo/supnuevoGetSupnuevoBuyerPriceFormByCodigoBs.do?codigo="+codigo+"&supnuevoMerchantId="+supnuevoMerchantId,
      }).success(function(response){
        var goodInfo = response.object;
        for(var info in goodInfo){
          $scope.selectedCodeInfo[info] = goodInfo[info];
        }
        var printType = goodInfo["printType"];
        for(var i = 0 ; i < printType.length; i++){
          var j = i + 1;
          var type = "type" + j;
          var clazz= "class" + j;
          $scope.printType[type]=printType.charAt(i);
          if(printType.charAt(i) == '1')
            $scope.class[clazz] = 'button button-block button-positive';
          else
            $scope.class[clazz] = 'button button-block button-stable';
        }
      }).error(function(err){
        alert(err);
      })

    }
    $scope.verify = function(){

    }
    $scope.getGoodInfo = function(){
      console.log("aa");
    }

    $scope.updatePrice = function(){
      $scope.selectedCodeInfo.price =  $scope.selectedCodeInfo.oldPrice;
      $scope.selectedCodeInfo.price1 =  $scope.selectedCodeInfo.oldPrice;
    }
    $scope.doClearGoodCode = function(){
      $scope.goods.codeNum = "";
    }
    $scope.doClearCodeNum = function(){
      $scope.selectedCodeInfo.price = "";
    }
    $scope.addGoods=function(){
        $http({
          method:"post",
          url:"http://211.87.225.210:8080/supnuevo/supnuevo/supnuevoGetSupnuevoCommodityTaxInfoListMobile.do",
        }).success(function(response){
          var taxArr = new Array();
          var sizeArr = new Array();
          response.taxArr.map(function(index,i){
            taxArr.push(index);
          })
          response.sizeArr.map(function(index,i){
            sizeArr.push(index);
          })
            for(var i = 0 ; i < taxArr.length;i++){
              var o = {'value':'','label':''};
              o.label = taxArr[i].label;
              o.value = taxArr[i].value;
              $scope.tax.push(o);
            }
          for(var i = 0 ; i < sizeArr.length;i++){
            var o = {'value':'','label':''};
            o.label = sizeArr[i].label;
            o.value = sizeArr[i].value;
            $scope.sizeArr.push(o);
          }
          //alert(JSON.stringify($scope.sizeArr));
          $state.go("addGoods",{taxName:JSON.stringify($scope.tax),sizeArr:JSON.stringify($scope.sizeArr)});
        }).error(function(){

        })

    }
    $scope.addIVA = function(){
      //$scope.selectedCodeInfo.price =
      //  $scope.selectedCodeInfo.price * (1 +  $scope.selectedCodeInfo.iva);
      if(cordova.plugins.Keyboard.isVisible){
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * (1 +  $scope.selectedCodeInfo.iva)*100)/100;
        $scope.selectedCodeInfo.priceShow = Math.round($scope.selectedCodeInfo.priceShow * (1 +  $scope.selectedCodeInfo.iva)*100)/100;
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.price1;
      }else{
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.price1 * (1 +  $scope.selectedCodeInfo.iva)*100)/100;
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * (1 +  $scope.selectedCodeInfo.iva)*100)/100;
      }

    }
    $scope.addPercentage1=function(){
      if(cordova.plugins.Keyboard.isVisible){
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * 110)/100;
        $scope.selectedCodeInfo.priceShow = Math.round($scope.selectedCodeInfo.priceShow * 110)/100;
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.price1;
      }else{
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.price1 * 110)/100;
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * 110)/100;
      }

    }
    $scope.addPercentage2=function(){
      if(cordova.plugins.Keyboard.isVisible){
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * 105)/100;
        $scope.selectedCodeInfo.priceShow = Math.round($scope.selectedCodeInfo.priceShow * 105)/100;
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.price1;
      }else{
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.price1 * 105)/100;
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * 105)/100;
      }
    }
    $scope.zero=function(){

    }
    $scope.reduceIVA=function(){
      //$scope.selectedCodeInfo.price =
      //  $scope.selectedCodeInfo.price * (1 -  $scope.selectedCodeInfo.iva);
      if(cordova.plugins.Keyboard.isVisible){
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * (1 -  $scope.selectedCodeInfo.iva)*100)/100;
        $scope.selectedCodeInfo.priceShow = Math.round($scope.selectedCodeInfo.priceShow * (1 -  $scope.selectedCodeInfo.iva)*100)/100;
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.price1;
      }else{
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.price1 * (1 -  $scope.selectedCodeInfo.iva)*100)/100;
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * (1 -  $scope.selectedCodeInfo.iva)*100)/100;
      }
    }
    $scope.reducePercentage1=function(){
      if(cordova.plugins.Keyboard.isVisible){
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * 90)/100;
        $scope.selectedCodeInfo.priceShow = Math.round($scope.selectedCodeInfo.priceShow * 90)/100;
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.price1;
      }else{
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.price1 * 90)/100;
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * 90)/100;
      }
    }
    $scope.reducePercentage2=function(){
      if(cordova.plugins.Keyboard.isVisible){
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * 95)/100;
        $scope.selectedCodeInfo.priceShow = Math.round($scope.selectedCodeInfo.priceShow * 95)/100;
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.price1;
      }else{
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.price1 * 95)/100;
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * 95)/100;
      }

    }
    $scope.zero1=function(){

    }
    $scope.savePrice = function(){
      var price = $scope.selectedCodeInfo.price;
      var priceId = $scope.selectedCodeInfo.priceId;
      var type1 = $scope.printType.type1;
      var type2 = $scope.printType.type2;
      var type3 = $scope.printType.type3;
      var type4 = $scope.printType.type4;
      var printType = type1 + type2 + type3 + type4;
      if(price !== null && price !== undefined && price !== ''){
        $http({
          method:"post",
          url:"http://211.87.225.210:8080/supnuevo/supnuevo/supnueSaveOrUpdateSupnuevoBuyerCommodityPriceMobile.do?price="+price+"&priceId="+priceId+"&supnuevoMerchantId=1"+"&printType="+ printType,
        }).success(function(response){
          var o = response.message;
          alert(o);
        }).error(function(err){
          alert(err);
        })
      }
    }
    $scope.updatePrintType1 = function(){
      if($scope.printType.type1 == '0'){
        $scope.class.class1 = "button button-block button-positive";
        $scope.printType.type1 = '1';
      }else if($scope.printType.type1 == '1'){
        $scope.class.class1 = "button button-block button-stable";
        $scope.printType.type1 = '0';
      }
    }
    $scope.updatePrintType2 = function(){
      if($scope.printType.type2 == '0'){
        $scope.class.class2 = "button button-block button-positive";
        $scope.printType.type2 = '1';
      }else if($scope.printType.type2 == '1'){
        $scope.class.class2 = "button button-block button-stable";
        $scope.printType.type2 = '0';
      }
    }
    $scope.updatePrintType3 = function(){
      if($scope.printType.type3 == '0'){
        $scope.class.class3 = "button button-block button-positive";
        $scope.printType.type3 = '1';
      }else if($scope.printType.type3 == '1'){
        $scope.class.class3 = "button button-block button-stable";
        $scope.printType.type3 = '0';
      }
    }
    $scope.updatePrintType4 = function(){
      if($scope.printType.type4 == '0'){
        $scope.class.class4 = "button button-block button-positive";
        $scope.printType.type4 = '1';
      }else if($scope.printType.type4 == '1'){
        $scope.class.class4 = "button button-block button-stable";
        $scope.printType.type4 = '0';
      }
    }

  })

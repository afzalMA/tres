var allParty = [],
  allPartyValue = [],
  arrOfHC = [],
  chartArray = [],
  sumAllPartyValue = 0,
  sumAllPartyValueLead = 0,
  sumAllPartyValueWon = 0,
  stateWiseResDropDef = 33,
  national = "";

var getName;
var list1 = [],
  list2 = [],
  list3 = [],
  list4 = [],
  list5 = [],
  all_5_states = [];
// var url1 ="http://rut.api.etvbharat.com/web_api/website/kerala_2021/five_states_common_tally.php";
// var test="";
// var stremingURLs;
var appData = {
  apiConfig: {
    // appData.apiConfig.baseURL + appData.apiConfig.suffixes.getState
    // baseURL: "http://65.0.40.45/web_api/website/",
    baseURL: "https://rut.api.etvbharat.com/web_api/website/",

    suffixes: {
      getState: "getLanguage.php",
      state5tally: "uttarpradesh_2022/five_states_common_tally.php",
      uttarpradesh: {
        distResult: "uttarpradesh_2022/districtwise_party_tally.php",
        constwiseR: "uttarpradesh_2022/statewise_const_tally.php",
        allianceWiseR: "uttarpradesh_2022/partywise_wonlead_total.php",
        viplistup: "uttarpradesh_2022/vipcandidates_wonlead.php",
      },
      uttarakhand: {
        distResult: "uttarakhand_2022/districtwise_party_tally.php",
        constwiseR: "uttarakhand_2022/statewise_const_tally.php",
        allianceWiseR: "uttarakhand_2022/partywise_wonlead_total.php",
        viplistuk: "uttarakhand_2022/vipcandidates_wonlead.php",
      },
      punjab: {
        distResult: "punjab_2022/districtwise_party_tally.php",
        constwiseR: "punjab_2022/statewise_const_tally.php",
        allianceWiseR: "punjab_2022/partywise_wonlead_total.php",
        viplistpb: "punjab_2022/vipcandidates_wonlead.php",
      },

      // partyWiseResults: "partywise_wonlead_total.php?language=english",
      // ndaResults: "partywise_wonlead_total_sf.php?language=english",
      // mgbResults: "partywise_wonlead_total_tf.php?language=english",
      // stateVIP: "vipcandidates_wonlead.php?language=english",
      // stateConstituency: "statewise_const_tally.php?language=english",
      // nationalPerson: "vipcandidates_wonlead.php?language=english",
      // resultType: "?electionType=",
    },
  },
};

function getJSON(url, successCallback) {
  // debugger;
  $.getJSON(url, function (response) {
    successCallback(response);
  });
}

// function getLiveStreamURL() {
//   var parentURL = document.referrer;
//   // var parentURL = 'https://www.etvbharat.com/bengali/kerala';
//   var temp = parentURL.split("/");
//   var lang = temp[4];
//   national = "hindi";
//   var lang = "kerala";
// var lang_state = temp
// var lang = "national";
// var national = "urdu";

// var stremingURLs = {
//   "andhra-pradesh":
//     "https://d1lqvjyfwvyj07.cloudfront.net/out/v1/d54651fa806648719a92727a661fa0d0/ETVB_CF_AP_NewsTime.m3u8",
//   assam:
//     "https://etvbharatlive8.akamaized.net/hls/live/710674/assam/index.m3u8",
//   bihar:
//     "https://etvbharatlive3.akamaized.net/hls/live/710666/bihar/index.m3u8",
//   chhattisgarh:
//     "https://d2lkimnyxc1ji8.cloudfront.net/out/v1/cadefd8c8bff49d4a3ef38c1b3bf6a31/ETVB_CF_CG_NewsTime.m3u8",
//   delhi:
//     "https://d29q6tdfij96f1.cloudfront.net/out/v1/94b12003316c4d6c9721a1508b0d1bac/ETVB_CF_DL_NewsTime.m3u8",
//   gujarat:
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/04fee298badd4ea087aa4b68f4a8c034/ETVB_BG_GJ_NewsTime.m3u8",
//   haryana:
//     "https://d3ejgzjh1qxqqq.cloudfront.net/out/v1/6d44b1b671d548a6bc95edea325b8413/ETVB_CF_HR_NewsTime.m3u8",
//   "himachal-pradesh":
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/a64cd2ff63e14792a4783b6d458ed5ab/ETVB_BG_HP_NewsTime.m3u8",
//   jharkhand:
//     "https://etvbharatlive2.akamaized.net/hls/live/710296/jharkhand/index.m3u8",
//   "jammu-and-kashmir":
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/baf7abc4aceb441abe16f4d636fb80cc/ETVB_BG_UR_NewsTime.m3u8",
//   karnataka:
//     "https://etvbharatlive5.akamaized.net/hls/live/710671/kannada/index.m3u8",
//   kerala:
//     "https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8",
//   maharashtra:
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/bd4b06bb4ff24d938c3942ee89b1126d/ETVB_BG_MH_NewsTime.m3u8",
//   "madhya-pradesh":
//     "https://d1i5fpe095d43k.cloudfront.net/out/v1/16a901263bf7402e9cb7ff4b94fa5bfd/ETVB_CF_MP_NewsTime.m3u8",
//   english:
//     "https://d5i7xalz199bi.cloudfront.net/out/v1/770fb77abc5d4ef487fc8b8b38d60510/ETVB_CF_EN_NewsTime.m3u8",
//   urdu: "https://etvbharat.pc.cdn.bitgravity.com/out/v1/baf7abc4aceb441abe16f4d636fb80cc/ETVB_BG_UR_NewsTime.m3u8",
//   odisha:
//     "https://etvbharatlive.akamaized.net/hls/live/707618/odisha/index.m3u8",
//   punjab:
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/68eee6155d904f199aad20af043f9003/ETVB_BG_PB_NewsTime.m3u8",
//   rajasthan:
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/0703d0f945c64e15aef72cd11fd54668/ETVB_BG_RJ_NewsTime.m3u8",
//   "tamil-nadu":
//     "https://dfae28bzu51al.cloudfront.net/out/v1/ee7ba7ef70fc4005a3992a2c0e8336aa/ETVB_CF_TN_NewsTime.m3u8",
//   telangana:
//     "https://d1q8rg3smbsux8.cloudfront.net/out/v1/c7849afc704b478fb86a9e2caac3854a/ETVB_CF_TS_NewsTime.m3u8",
//   "uttar-pradesh":
//     "https://etvbharatlive6.akamaized.net/hls/live/710672/uttarPradesh/index.m3u8",
//   uttarakhand:
//     "https://etvbharatlive1.akamaized.net/hls/live/710294/uttarakhand/index.m3u8",
//   "west-bengal":
//     "https://etvbharatlive9.akamaized.net/hls/live/710675/westBengal/index.m3u8",
// };
// if (national == "hindi"){

// }
// if (lang == "assam") {
//   var url = stremingURLs[lang.toLowerCase()];
//   // if (url) assamElection();
//   // document.getElementById("state-name").innerHTML = "ASSAM";

//   $(".btn-list").hide();
//   $(".btn-list1").show();
//   $("#other-states").show();
//   $("#election-state").show();
//   $("#tamil-vip").hide();
//   $("#state-name1").hide();

//   return url;
// } else if (lang == "west-bengal") {
//   var url = stremingURLs[lang.toLowerCase()];
//   // if (url) westBengalElection();
//   // document.getElementById("state-name").innerHTML = "WEST BENGAL";
//   $(".btn-list").hide();
//   $(".btn-list1").show();
//   $("#other-states").show();
//   $("#tamil-vip").hide();
//   $("#election-state").show();
//   $("#state-name1").hide();

//   return url;
// } else if (lang == "tamil-nadu") {
//   var url = stremingURLs[lang.toLowerCase()];
//   if (url) {
//     // document.getElementById("state-name").innerHTML = "TAMILNADU";
//     $("#other-states").show();
//     $("#election-state").show();
//     $("#tamil-vip").show();
//     $("#state-name1").show();

//     // tamilnaduElection();
//     return url;
//   }
// } else if (lang == "kerala") {
//   var url = stremingURLs[lang.toLowerCase()];
//   // if (url) keralaElection();
//   // document.getElementById("state-name").innerHTML = "KERALA";
//   $("#other-states").show();
//   $("#election-state").show();
//   $("#tamil-vip").hide();
//   $("#state-name1").hide();
//   return url;
// } else if (lang == "national") {
//   // var url = stremingURLs[lang.toLowerCase()];
//   if (national == "urdu") {
//     var url = stremingURLs[national.toLowerCase()];
//     return url;
//   } else if (national == "english") {
//     var url = stremingURLs[national.toLowerCase()];
//     return url;
//   }
// } else if (lang) {
//   var url = stremingURLs[lang.toLowerCase()];
//   if (url) return url;
//   // console.log(url);
//   // electionResults();
// }

// return stremingURLs["assam"];
// }

function getLanguageState(value, stateDdlID) {
  var ele = document.getElementById(stateDdlID);
  getJSON(
    appData.apiConfig.baseURL +
    appData.apiConfig.suffixes.getState +
    "?electionType=" +
    value,
    function (getStatesresult) {
      renderLanguageState(
        ele,
        createDropdownHTML(getStatesresult, "state_id", "state_name")
      );
    }
  );
}

function createDropdownHTML(incomingData, idKey, displayKey) {
  var option = "";
  for (var l = 0; l <= incomingData.results.length - 1; l++) {
    option +=
      '<option value="' +
      incomingData.results[l][idKey] +
      '">' +
      incomingData.results[l][displayKey] +
      "</option>";
  }
  return option;
}

function renderLanguageState(ele, option) {
  ele.innerHTML = option;
  var exists = false;
  $(ele)
    .find("option")
    .each(function () {
      if (this.value == stateWiseResDropDef) {
        exists = true;
        return false;
      }
    });
  if (exists) {
    $(ele).val(stateWiseResDropDef);
  }
  $(ele).trigger("change");
  getName = $("#stateWiseOption option:selected").text();
  $("#stateText").text(getName);
}

// LiveNews function

function getLiveStateNews() {
  // var test = getLiveStreamURL();
  // // console.log(test, "test")
  // var player =
  //   '<iframe style="width: 100%; height: 342px" webkitallowfullscreen="true" mozallowfullscreen="true" frameborder="0" allowFullScreen="true" class="tally-scroll" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=' +
  //   test +
  //   '&thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&autoplay=true&mute=true&content_type=live"></iframe>';
  // $("#test-player").html(player);
  // $("#divPlayer").attr("src", test);
  // var parentURL = document.location.href
  var parentURL = document.referrer;
  // var parentURL = 'https://www.etvbharat.com/bengali/kerala';
  var temp = parentURL.split("/");
  // var lang = temp[4];
  // national = temp[3]
  national = "hindi";
  if (national == "hindi" || national == "english" || national == 'urdu') {
    var test1 = 'https://dgt6f5s87pgbo.cloudfront.net/out/v1/dd6e383c67c44d20a41a358679edd9c7/ETVB_CF_JK_Live3.m3u8';
    var player = '<iframe style="width:100%; margin-top:20px; height:300px;" id="live-player" class="liveplayer" allowfullscreen="true" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=' + test1 + '&amp;thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&amp;autoplay=true&amp;mute=true&amp;content_type=live&amp;content_id=keralaml20181012194643400&amp;v=0.007124921779837923&amp;comscorec3=23&amp;state=kerala&amp;language=malayalam&amp;daistream=true" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8&amp;thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&amp;autoplay=true&amp;mute=true&amp;content_type=live&amp;content_id=keralaml20181012194643400&amp;v=0.007124921779837923&amp;comscorec3=23&amp;state=kerala&amp;language=malayalam&amp;daistream=true"></iframe>';
    $('#test-player').html(player);
    $("#divPlayer").attr('src', test1);
  } else if (national == "punjabi") {
    var test1 = 'https://d5kr2u5kstlj5.cloudfront.net/out/v1/5f05ee8522374d38b84c14ae8a6e4cfe/ETVB_CF_JK_Live2.m3u8';
    var player = '<iframe style="width:100%; margin-top:20px; height:300px;" id="live-player" class="liveplayer" allowfullscreen="true" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=' + test1 + '&amp;thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&amp;autoplay=true&amp;mute=true&amp;content_type=live&amp;content_id=keralaml20181012194643400&amp;v=0.007124921779837923&amp;comscorec3=23&amp;state=kerala&amp;language=malayalam&amp;daistream=true" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8&amp;thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&amp;autoplay=true&amp;mute=true&amp;content_type=live&amp;content_id=keralaml20181012194643400&amp;v=0.007124921779837923&amp;comscorec3=23&amp;state=kerala&amp;language=malayalam&amp;daistream=true"></iframe>';
    $('#test-player').html(player);
    $("#divPlayer").attr('src', test1);
  } else {
    var test1 = 'https://d16f45e0h78rsl.cloudfront.net/out/v1/4b73cef0e43c4e378ccd0c90caccea37/ETVB_CF_JK_Live1.m3u8';
    var player = '<iframe style="width:100%; margin-top:20px; height:300px;" id="live-player" class="liveplayer" allowfullscreen="true" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=' + test1 + '&amp;thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&amp;autoplay=true&amp;mute=true&amp;content_type=live&amp;content_id=keralaml20181012194643400&amp;v=0.007124921779837923&amp;comscorec3=23&amp;state=kerala&amp;language=malayalam&amp;daistream=true" src="https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8&amp;thumbnailurl=https://etvwinvideo.akamaized.net/etv-bharat/images/placeholder.png&amp;autoplay=true&amp;mute=true&amp;content_type=live&amp;content_id=keralaml20181012194643400&amp;v=0.007124921779837923&amp;comscorec3=23&amp;state=kerala&amp;language=malayalam&amp;daistream=true"></iframe>';

    var player = `<div id='div-gpt-ad-1646308362127-0' style='min-width: 300px; min-height: 250px;margin-top:40px;'>
    <script>
      googletag.cmd.push(function() { googletag.display('div-gpt-ad-1646308362127-0'); });
    </script>
  </div>`;
    $('#test-player').html(player);
    // $("#divPlayer").attr('src' , test1);
  }

  if(national == "hindi"){
    $('#heading-tag').html('विधानसभा चुनाव 2022 परिणाम लाइव');
  } else if(national == "telugu"){
    $('#heading-tag').html('అసెంబ్లీ ఎలక్షన్స్ 2022 రిజల్ట్ లైవ్');
  }else if(national == "assamese"){
    $('#heading-tag').html('বিধানসভা নিৰ্বাচন 2022 ৰ ফলাফল লাইভ');
  }else if(national == "urdu"){
    $('#heading-tag').html('اسمبلی انتخابات 2022 نتیجہ لائیو,');
  }else if(national == "kannada"){
    $('#heading-tag').html('ವಿಧಾನಸಭಾ ಚುನಾವಣೆ 2022 ಫಲಿತಾಂಶ ನೇರಪ್ರಸಾರ');
  }else if(national == "malayalam"){
    $('#heading-tag').html('നിയമസഭ തെരഞ്ഞെടുപ്പ്  ഫലം 2022 തത്സമയം ');
  }else if(national == "marathi"){
    $('#heading-tag').html('विधानसभा निवडणूक २०२२ निकाल लाईव्ह');
  }else if(national == "oriya"){
    $('#heading-tag').html('ବିଧାନସଭା ନିର୍ବାଚନ 2022 ଫଳାଫଳ ଲାଇଭ');
  }else if(national == "punjabi"){
    $('#heading-tag').html('Punjab Election 2022 Results Live');
  }else if(national == "tamil"){
    $('#heading-tag').html('சட்டப்பேரவை தேர்தல் 2022 முடிவுகள் நேரலை');
  }else if(national == "bengali"){
    $('#heading-tag').html('বিধানসভা নির্বাচন ২০২২ ফলাফল লাইভ');
  }else if(national == "english"){
    $('#heading-tag').html('Assembly Elections 2022 Result Live');
  }else if(national == "gujarati"){
    $('#heading-tag').html('વિધાનસભા ચૂંટણી 2022નું પરિણામ લાઈવ');
  }
  // $('#livedebate').css('font-weight','600');
  // $('#livenews').css('color','white');
  // $("#livenews").css("font-weight", "600");
  // $("#livenews").css("color", "#fff");
  // $("#livedebate").css("color", "#70787A");
}

// LiveDebate function

// state wise Vip candidates
function getVipResult() {
  $('#resultName').html('Important Personalities 2022');
  $(".col-bg1").css("background-color", "#F1F1F1");
  $("#vip-list").show();
  $("#const-table").hide();
  $("#tdSearch").show();
  $("#tdSearch1").hide();
  var state = document.getElementById("mySelect").value;
  // debugger;
  const tbody = document.querySelector("#AP_Constituency > tbody");
  if (state == "Up") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarpradesh.viplistup;
    url = "./json/upvip.json";
  }
  else if (state == "Pb") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.punjab.viplistpb;
    url = "./json/pbvip.json";
  } else if (state == "Uk") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarakhand.viplistuk;
    url = "./json/ukvip.json";
  }
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  // if (
  //   test ==
  //   "https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8"
  // ) {
  //   url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.kerala.viplist;
  // } else if (
  //   test ==
  //   "https://dfae28bzu51al.cloudfront.net/out/v1/ee7ba7ef70fc4005a3992a2c0e8336aa/ETVB_CF_TN_NewsTime.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL + appData.apiConfig.suffixes.tamilnadu.viplist;
  // } else if (
  //   test ==
  //   "https://etvbharatlive8.akamaized.net/hls/live/710674/assam/index.m3u8"
  // ) {
  //   url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.assam.viplist;
  // } else if (
  //   test ==
  //   "https://etvbharatlive9.akamaized.net/hls/live/710675/westBengal/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL + appData.apiConfig.suffixes.westBengal.viplist;
  // }

  $.getJSON(url, function (success) {
    var nationalPerson = success.results;
    var CombinedHTML = "";
    for (var i = 0; i <= nationalPerson.length - 1; i++) {
      var personailty = {
        leadings: nationalPerson[i]["status"],
        constituency: nationalPerson[i]["const_name"],
        candidate: nationalPerson[i]["cand_name"],
        party: nationalPerson[i]["party_name"],
        img: nationalPerson[i]["cand_pic"],
      };

      var leadingBlogElement = "";
      var spanElement = "<span>" + personailty.constituency + "</span>";
      var leadings = "<p>" + personailty.leadings + "</p>";
      if (personailty.leadings.toLowerCase() == "lead") {
        leadingBlogElement =
          "<span class='leading-blog'>" + leadings + "</span>";
        var winlose =
          '<div><img class="win" style="margin-left:-40px" src="/images/states/WIN_THUMB.png"  alt=""/></div>';
      } else if (personailty.leadings.toLowerCase() == "won") {
        leadingBlogElement = "<span class='won-blog'>" + leadings + "</span>";
        var winlose =
          '<div><img class="win" style="margin-left:-40px" src="/images/states/WIN_THUMB.png"  alt=""/></div>';
      } else if (personailty.leadings.toLowerCase() == "trailing") {
        leadingBlogElement =
          "<span class='trailing-blog'>" + leadings + "</span>";
        var winlose =
          '<div><img src="/images/states/LOOSE_THUMB.png" class="lose" alt=""/></div>';
      } else if (personailty.leadings.toLowerCase() == "lost") {
        leadingBlogElement = "<span class='lost-blog'>" + leadings + "</span>";
        var winlose =
          '<div><img src="/images/states/LOOSE_THUMB.png" class="lose" alt=""/></div>';
      } else {
        leadingBlogElement = "<span class='lost-blog'>" + leadings + "</span>";
        var winlose = "";
      }
      var heder4 =
        "<h4> " +
        personailty.candidate +
        leadingBlogElement +
        "</h4><hr>" +
        "<h4> " +
        personailty.constituency +
        "<span >" +
        personailty.party +
        "</span></h4> ";
      var secDiv =
        "<div class='pers-blg-text col-lg-10 col-md-9 col-sm-10 col-xs-9 no-pad'>" +
        heder4 +
        "</div>";
      var img =
        '<img style="margin-left:0px" id="vip-image" src="https://jh-vip-images.s3.ap-south-1.amazonaws.com/' +
        personailty.img + '"  alt="">' +
        winlose;
      var firstDiv =
        "<div class='img-blg col-lg-2 col-md-3 col-sm-2 col-xs-3 no-pad' >" +
        img +
        "</div>" +
        secDiv;
      var anc =
        "<a href='#' class='personalities-blg clearfix '>" +
        firstDiv +
        "</div>";

      CombinedHTML = CombinedHTML + anc;
    }
    $("#constituency_tbody").html(CombinedHTML);

    $(".img-blg img")
      .off("error")
      .on("error", function () {
        $(this).attr(
          "src",
          "https://jh-vip-images.s3.ap-south-1.amazonaws.com/DUMMY.jpg"
        );
      });
    $("#tdSearch").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#AP_Constituency a").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });
}
function onChangeStates(val) {
  if (val) {
    $("#state-tg").empty();
    if ($.isNumeric(val)) {
      stateWiseResUrl =
        appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateVIP + val;
    }
    stateResBind(stateWiseResUrl);
    // getVipPerson();
    getName = $("#stateWiseOption option:selected").text();
    $("#stateText").text(getName);
  }
}

function totalCount(successdata, stateWiseTotal) {
  var totalCountStateWise = successdata.results[0].TotalConstituency;
  document.getElementById("stateWiseTotal").textContent =
    parseInt(stateWiseTotal) + "/" + parseInt(totalCountStateWise);
}

function callAPiEveryMinute() {
  stateConstUrl =
    appData.apiConfig.baseURL + appData.apiConfig.suffixes.stateConstituency;
  getconstiResBind(stateConstUrl);
  getNationalPerson();
}

function callTallyEveryMinute() {
  getLokSabhaHighChart();
}

// state wise  Constituency Results

// function bannerAdd() {
//   // andhrapradesh banner Add
//   if (
//     test ==
//     "https://d1lqvjyfwvyj07.cloudfront.net/out/v1/d54651fa806648719a92727a661fa0d0/ETVB_CF_AP_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591042705-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591042705-0'); });
//                             </script>
//                           </div>`);
//   }
//   // bihar banner Add
//   else if (
//     test ==
//     "https://etvbharatlive3.akamaized.net/hls/live/710666/bihar/index.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619590721177-0' style='width: 728px; height: 90px;'>
//                           <script>
//                             googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619590721177-0'); });
//                           </script>
//                         </div>`);
//   }
//   // delhi Banner add
//   else if (
//     test ==
//     "https://d29q6tdfij96f1.cloudfront.net/out/v1/94b12003316c4d6c9721a1508b0d1bac/ETVB_CF_DL_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591521659-0' style='width: 728px; height: 90px;'>
//                     <script>
//                       googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591521659-0'); });
//                     </script>
//                   </div>`);
//   }
//   // chattisgarh banner add
//   else if (
//     test ==
//     "https://d2lkimnyxc1ji8.cloudfront.net/out/v1/cadefd8c8bff49d4a3ef38c1b3bf6a31/ETVB_CF_CG_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619672928221-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619672928221-0'); });
//                             </script>
//                           </div>`);
//   }
//   // gujarath
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/04fee298badd4ea087aa4b68f4a8c034/ETVB_BG_GJ_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619590647524-0' style='width: 728px; height: 90px;'>
//                           <script>
//                             googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619590647524-0'); });
//                           </script>
//                         </div>`);
//   }
//   // haryana
//   else if (
//     test ==
//     "https://d3ejgzjh1qxqqq.cloudfront.net/out/v1/6d44b1b671d548a6bc95edea325b8413/ETVB_CF_HR_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591655993-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591655993-0'); });
//                             </script>
//                           </div>`);
//   }
//   // himachal pradesh
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/a64cd2ff63e14792a4783b6d458ed5ab/ETVB_BG_HP_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591814342-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591814342-0'); });
//                             </script>
//                           </div>`);
//   }
//   // jharkhand
//   else if (
//     test ==
//     "https://etvbharatlive2.akamaized.net/hls/live/710296/jharkhand/index.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619592055180-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619592055180-0'); });
//                             </script>
//                           </div>`);
//   }
//   // karnataka
//   else if (
//     test ==
//     "https://etvbharatlive5.akamaized.net/hls/live/710671/kannada/index.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619592490022-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619592490022-0'); });
//                             </script>
//                           </div>`);
//   }
//   // mahareashtra
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/bd4b06bb4ff24d938c3942ee89b1126d/ETVB_BG_MH_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591246174-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591246174-0'); });
//                             </script>
//                           </div>`);
//   }
//   // madhya pradesh
//   else if (
//     test ==
//     "https://d1i5fpe095d43k.cloudfront.net/out/v1/16a901263bf7402e9cb7ff4b94fa5bfd/ETVB_CF_MP_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619592125445-0' style='width: 728px; height: 90px;'>
//                         <script>
//                           googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619592125445-0'); });
//                         </script>
//                       </div>`);
//   }
//   // english
//   else if (
//     test ==
//     "https://d5i7xalz199bi.cloudfront.net/out/v1/770fb77abc5d4ef487fc8b8b38d60510/ETVB_CF_EN_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619590544629-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619590544629-0'); });
//                             </script>
//                           </div`);
//   }

//   // urdu
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/baf7abc4aceb441abe16f4d636fb80cc/ETVB_BG_UR_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619590881032-0' style='width: 728px; height: 90px;'>
//                           <script>
//                             googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619590881032-0'); });
//                           </script>
//                         </div>`);
//   }
//   // jammu and kashmir
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/baf7abc4aceb441abe16f4d636fb80cc/ETVB_BG_UR_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`div id='div-gpt-ad-1619590933874-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619590933874-0'); });
//                             </script>
//                           </div>`);
//   }
//   // odisha
//   else if (
//     test ==
//     "https://etvbharatlive.akamaized.net/hls/live/707618/odisha/index.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591308767-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591308767-0'); });
//                             </script>
//                           </div>`);
//   }
//   // punjab
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/68eee6155d904f199aad20af043f9003/ETVB_BG_PB_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619591110009-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619591110009-0'); });
//                             </script>
//                           </div>`);
//   }
//   // rajasthan
//   else if (
//     test ==
//     "https://etvbharat.pc.cdn.bitgravity.com/out/v1/0703d0f945c64e15aef72cd11fd54668/ETVB_BG_RJ_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619592214223-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619592214223-0'); });
//                             </script>
//                           </div>`);
//   }
//   // telangana
//   else if (
//     test ==
//     "https://d1q8rg3smbsux8.cloudfront.net/out/v1/c7849afc704b478fb86a9e2caac3854a/ETVB_CF_TS_NewsTime.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619590988230-0' style='width: 728px; height: 90px;'>
//                         <script>
//                           googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619590988230-0'); });
//                         </script>
//                       </div>`);
//   }
//   // uttar pradesh
//   else if (
//     test ==
//     "https://etvbharatlive6.akamaized.net/hls/live/710672/uttarPradesh/index.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619592365397-0' style='width: 728px; height: 90px;'>
//                           <script>
//                             googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619592365397-0'); });
//                           </script>
//                         </div>`);
//   }
//   // uttarakhand
//   else if (
//     test ==
//     "https://etvbharatlive1.akamaized.net/hls/live/710294/uttarakhand/index.m3u8"
//   ) {
//     $("#BannerAdd")
//       .html(`<div id='div-gpt-ad-1619592287168-0' style='width: 728px; height: 90px;'>
//                             <script>
//                               googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619592287168-0'); });
//                             </script>
//                           </div>`);
//   }
// }

// var test = getLiveStreamURL();

// (above table) five state tally

function fiveStateTally(CombineTable, theadh, state) {
  var t = "";
  for (i = 0; i < theadh.length; i++) {
    theadh[i] = theadh[i] === "OTHERS" ? "OTH" : theadh[i];
    t = t + "<th class='tdata2' style='background: #B80403;font-weight: 700;'><div width='100'>" + theadh[i] + "</div></th>";
  }
  CombineTable = "<tr><th class='lead-won' style='background: #B80403;'><div> </div></th>" + t + "</tr><tr>" + "<td class='lead-won' style='font-weight: 700;'>Lead/won</td>" + CombineTable + "</tr>";
  if (state === "UP") {
    $("#Up_data").html(CombineTable);
  } else if (state === "PB") {
    $("#Pb_data").html(CombineTable);
  } else if (state === "UK") {
    $("#Uk_data").html(CombineTable);
  } else if (state === "MNP") {
    $("#Mnr_data").html(CombineTable);
  } else if (state === "GA") {
    $("#Ga_data").html(CombineTable);
  }
}

function electionResults() {

  var url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.state5tally;
  // var url = "http://65.0.40.45/web_api/website/uttarpradesh_2022/five_states_common_tally.php";
  var url='./json/kerala.json';
  var arr = [], totaltally = [];
  var results = [];
  getJSON(url, function (response) {
    for (var i = 0; i < response.totalresults.length; i++) {
      if (!response.totalresults[i].party_name) {
        arr.push(response.totalresults[i].state_id);
        totaltally.push(response.totalresults[i].total_seats)
      }
    }
    for (var j = 0; j < arr.length; j++) {
      var CombineTable = "";
      var com2 = "";
      var theadh = [];
      var i;
      for (i = 0; i < response.totalresults.length; i++) {
        if (response.totalresults[i].state_id == arr[j] && response.totalresults[i].party_name) {
          theadh.push(response.totalresults[i].party_name);
          trf = "<td class='td-style'>" + response.totalresults[i].total + "</td>";
          CombineTable = CombineTable + trf;
        } else if (response.totalresults[i].total_seats == totaltally[j]) {
          var countTally = response.totalresults[i].total_count;
          var totalTally = response.totalresults[i].total_seats;
          var westTotal = countTally + "/" + totalTally;
        }
      }
      if (arr[j] == "34") {
        $("#UpTotal").html(westTotal);
        fiveStateTally(CombineTable, theadh, "UP");
      } else if (arr[j] == "35") {
        $("#UkTotal").html(westTotal);
        fiveStateTally(CombineTable, theadh, "UK");
      } else if (arr[j] == "11") {
        $("#tamilTotal").html(westTotal);
        fiveStateTally(CombineTable, theadh, "GA");
      } else if (arr[j] == "22") {
        $("#keralaTotal").html(westTotal);
        fiveStateTally(CombineTable, theadh, "MNP");
      } else if (arr[j] == "28") {
        $("#PbTotal").html(westTotal);
        fiveStateTally(CombineTable, theadh, "PB");
      }
    }
  });
}



function getPrevYear() {
  // $("#previous-year").click(function(){
  var state_el = document.getElementById("mySelect").value;
  if (state_el == "Up") {
    var frame1 =
      '<iframe title="Uttarpradesh Winners" aria-label="Map" id="datawrapper-chart-Z30ot" src="https://datawrapper.dwcdn.net/Z30ot/" scrolling="no" frameborder="0" style="border: none;" width="100%" height="683"></iframe>';
    $("#iframe-state").html(frame1);
  } else if (state_el == "Pb") {
    var frame1 =
      '<iframe title="Punjab Winners" aria-label="Map" id="datawrapper-chart-41N0A" src="https://datawrapper.dwcdn.net/41N0A/" scrolling="no" frameborder="0" style="border: none;" width="100%" height="707"></iframe>';
    $("#iframe-state").html(frame1);
  } else if (state_el == "Uk") {
    var frame1 =
      '<iframe title="Uttarakhand Winners" aria-label="Map" id="datawrapper-chart-I19Oa" src="https://datawrapper.dwcdn.net/I19Oa/" scrolling="no" frameborder="0" style="border: none;" width="100%" height="583"></iframe>';
    $("#iframe-state").html(frame1);
  }

  $("button.crnt-year").removeClass("clicked");
  $("button.prev-year").addClass("clicked");
  $("#previous-year").css("color", "white");
  $("#previous-year").css("background-color", "#B80403");
  $("#current-year").css("color", "black");
  $("#current-year").css("background-color", "#949494");
  // });
}
// var state_el = "Up";
function getCrntYear() {
  // $("#current-year").click(function(){
  var state_el = document.getElementById("mySelect").value;
  if (state_el == "Up") {
    var frame1 =
      '<iframe title="Uttarpradesh Winners" aria-label="Map" id="datawrapper-chart-Z30ot" src="https://datawrapper.dwcdn.net/p01uu/" scrolling="no" frameborder="0" style="border: none;" width="100%" height="683"></iframe>';
    $("#iframe-state").html(frame1);
  } else if (state_el == "Pb") {
    var frame1 =
      '<iframe title="Punjab Winners" aria-label="Map" id="datawrapper-chart-41N0A" src="https://datawrapper.dwcdn.net/xH7gO/" scrolling="no" frameborder="0" style="border: none;" width="100%" height="707"></iframe>';
    $("#iframe-state").html(frame1);
  } else if (state_el == "Uk") {
    var frame1 =
      '<iframe title="Uttarakhand Winners" aria-label="Map" id="datawrapper-chart-I19Oa" src="https://datawrapper.dwcdn.net/gvAQr/" scrolling="no" frameborder="0" style="border: none;" width="100%" height="583"></iframe>';
    $("#iframe-state").html(frame1);
  }
  $("button.prev-year").removeClass("clicked");
  $("button.crnt-year").addClass("clicked");
  $("#current-year").css("color", "white");
  $("#current-year").css("background-color", "#B80403");
  $("#previous-year").css("color", "black");
  $("#previous-year").css("background-color", "#949494");
  // });
}


// state wise District result results display (below tables)
function partiesDisplay(parties) {
  for (var key in parties) {
    var thead = thead + "<th class='wb1'>" + parties[key] + "</th>";
  }
  return thead;
}
function upHead() {
  var parties = {
    a: "BJP+",
    b: "SP+",
    c: "BSP",
    d: "INC",
    e: "OTHERS"
  };
  return partiesDisplay(parties);
}
function pbHead() {
  var parties = {
    a: "INC",
    b: "AAP",
    c: "SAD+",
    d: "BJP+",
    e: "OTHERS"
  };
  return partiesDisplay(parties);
}
function ukHead() {
  var parties = {
    a: "BJP",
    b: "INC",
    c: "AAP",
    d: "OTHERS"
  };
  return partiesDisplay(parties);
}

function getDistrictResult() {
  $('#resultName').html('District wise Results 2022');
  $(".col-bg1").css("background-color", "#fff");
  $("#vip-list").hide();
  $("#tdSearch").hide();
  $("#tdSearch1").show();
  // $('#dist-search').hide();
  $("#const-table").hide();
  // url = "";
  const tbody = document.querySelector("#AP_Constituency > tbody");
  var state = document.getElementById("mySelect").value;
  // debugger;
  if (state == "Up") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarpradesh.distResult;
    // url = "http://65.0.40.45/web_api/website/uttarpradesh_2022/districtwise_party_tally.php";
    url='./json/up.json';
    $.getJSON(url, function (successdata) {
      CombinedHTMLTable = "";
      var thead = "";
      thead = "<tr>" + "<th class='table-h'></th>" + upHead() + "</tr>";
      CombinedHTMLTable = CombinedHTMLTable + thead;
      var tr = "";
      var distresults = successdata.results;
      for (var i = 0; i <= distresults.length - 1; i++) {
        tr = "<tr class='searchnone' style='border:none;height:10px;'></tr><tr class='district-name'><td class='dist1' colspan=6><div>" + distresults[i].dist_name + "<span>&nbsp;&nbsp;(" + distresults[i].count_seats + "/" + distresults[i].total_seats + ")</span></div></td></tr>" +
          "<tr class='district-LW'><td style='color: #05601C;margin-left:10px;border-left: 1px solid #B80403;border-bottom: 1px solid #B80403;' class='lead1'> Lead/Won </td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].bjp_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].sp_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].bsp_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].inc_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;border-right:1px solid #B80403;'>" + distresults[i].oth_wonlead + "</td></tr>";
        CombinedHTMLTable = CombinedHTMLTable + tr;
      }
      $("#constituency_tbody").html(CombinedHTMLTable);
    });
  }
  else if (state == "Pb") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.punjab.distResult;
    url = "./json/pb.json";
    $.getJSON(url, function (successdata) {
      CombinedHTMLTable = "";
      var thead = "";
      thead = "<tr>" + "<th class='table-h'></th>" + pbHead();
      CombinedHTMLTable = CombinedHTMLTable + thead;
      var tr = "";
      var distresults = successdata.results;
      for (var i = 0; i <= distresults.length - 1; i++) {
        tr = "<tr class='searchnone' style='border:none;height:10px;'></tr><tr class='district-name'><td class='dist1' colspan=6><div>" + distresults[i].dist_name + "<span>&nbsp;&nbsp;(" + distresults[i].count_seats + "/" + distresults[i].total_seats + ")</span></div></td></tr>" +
          "<tr class='district-LW'><td style='color: #05601C;border-left: 1px solid #B80403;border-bottom: 1px solid #B80403;' class='lead1'> Lead/Won </td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].inc_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].aap_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].sad_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].bjp_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;border-right:1px solid #B80403;'>" + distresults[i].oth_wonlead + "</td></tr>";
        CombinedHTMLTable = CombinedHTMLTable + tr;
      }
      $("#constituency_tbody").html(CombinedHTMLTable);
    });
  } else if (state == "Uk") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarakhand.distResult;
    url = "./json/uk.json";
    $.getJSON(url, function (successdata) {
      CombinedHTMLTable = "";
      var thead = "";
      thead = "<tr>" + "<th class='table-h'></th>" + ukHead();
      CombinedHTMLTable = CombinedHTMLTable + thead;
      var tr = "";
      var distresults = successdata.results;
      for (var i = 0; i <= distresults.length - 1; i++) {
        tr = "<tr class='searchnone' style='border:none;height:10px;'></tr><tr class='district-name'><td class='dist1' colspan=5><div>" + distresults[i].dist_name + "<span>&nbsp;&nbsp;(" + distresults[i].count_seats + "/" + distresults[i].total_seats + ")</span></div></td></tr>" +
          "<tr class='district-LW'><td style='color: #05601C;border-left: 1px solid #B80403;border-bottom: 1px solid #B80403;' class='lead1'> Lead/Won </td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].bjp_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].inc_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;'>" + distresults[i].aap_wonlead + "</td>" +
          "<td class='district-td' style='border-bottom:1px solid #B80403;border-right:1px solid #B80403;'>" + distresults[i].oth_wonlead + "</td></tr>";
        CombinedHTMLTable = CombinedHTMLTable + tr;
      }
      $("#constituency_tbody").html(CombinedHTMLTable);
    });
  }
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  searchfun();
}

function searchfun() {
  $("#tdSearch1").on("keyup", function () {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("tdSearch1");
    filter = input.value.toUpperCase();
    table = document.getElementById("AP_Constituency");
    tr = table.getElementsByTagName("tr");
    for (i = 2; i < tr.length; i = i + 3) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          tr[i + 1].style.display = "";
          tr[i + 1].style.display = "";
        } else {
          tr[i].style.display = "none";
          tr[i + 1].style.display = "none";
          tr[i + 1].style.display = "none";
        }
        $('.searchnone').addClass('displaynone');
      }
    }
  });
}
// state wise party results
function getPartyResult() {
  $('#resultName').html('Party wise Results 2022');
  $("#vip-list").hide();
  $("#const-table").hide();
  $("#tdSearch").show();
  $("#tdSearch1").hide();
  url = "";
  const tbody = document.querySelector("#AP_Constituency > tbody");
  var state = document.getElementById("mySelect").value;
  if (state == "Up") {
    url="./json/uppartywise.json"
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarpradesh.allianceWiseR;
    // url = "http://65.0.40.45/web_api/website/uttarpradesh_2022/partywise_wonlead_total.php";
  }
  else if (state == "Pb") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.punjab.allianceWiseR;
    url = "./json/pbpartywise.json";
  } else if (state == "Uk") {
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarakhand.allianceWiseR;
    url = "./json/uk-partwise.json";
  }
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // debugger;
  // if(state == "Up"){
  //   url = "./json/alliance.json";
  // }
  // if (
  //   test ==
  //   "https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL +
  //     appData.apiConfig.suffixes.kerala.allianceWise;
  // } else if (
  //   test ==
  //   "https://dfae28bzu51al.cloudfront.net/out/v1/ee7ba7ef70fc4005a3992a2c0e8336aa/ETVB_CF_TN_NewsTime.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL +
  //     appData.apiConfig.suffixes.tamilnadu.allianceWise;
  // } else if (
  //   test ==
  //   "https://etvbharatlive8.akamaized.net/hls/live/710674/assam/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL + appData.apiConfig.suffixes.assam.allianceWise;
  // } else if (
  //   test ==
  //   "https://etvbharatlive9.akamaized.net/hls/live/710675/westBengal/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL +
  //     appData.apiConfig.suffixes.westBengal.allianceWise;
  // }
  $.getJSON(url, function (successdata) {
    // while (tbody.firstChild) {
    //   tbody.removeChild(tbody.firstChild);
    // }
    CombinedHTMLTable = "";
    var alliance_name = '';
    var other = "";
    var tr;
    var thead = "";
    thead = `<tr class='alliance-row'><th class='party-class'>Party/Alliance Name</th><th class='party-class'> Lead/Won</th></tr>`;
    CombinedHTMLTable = CombinedHTMLTable + thead;

    for (var j = 0; j <= successdata.results.length - 1; j++) {
      if ((successdata.results[j]["alliance_name"] == undefined)) {
        alliance_name = successdata.results[j]["party_name"]

        tr =
          "<tr>" +
          "<td class='ldf-party' style='font-weight: 700;'>" +
          successdata.results[j]["party_name"] + '  (' + successdata.results[j]["total"] + '/' + successdata.results[j]["Seats Contested"] + ')' +
          "</td>" +
          "<td class='ldf-party' style='font-weight: 700;'>" +
          successdata.results[j]["total"] +
          "</td>" +
          // "<td class='ldf-party' style='font-weight: 700;'>" +
          // successdata.results[j]["won"] +
          // "</td>" +
          // "<td class='ldf-party' style='font-weight: 700;'>" +
          // successdata.results[j]["total"] +
          // "</td>" +
          "</tr>";
        if (successdata.results[j]["party_name"] !== "OTHER") {
          CombinedHTMLTable = CombinedHTMLTable + tr;
        }
        else {
          other = tr;
        }
        getallianceParties(successdata.results, alliance_name)
      }
    }
    function getallianceParties(results, alliance_name) {

      var count = results.filter(function (o) { return o['alliance_name'] == alliance_name }).length
      // console.log(count)
      if (count > 1) {
        for (var j = 0; j <= results.length - 1; j++) {
          if (results[j]["alliance_name"] == alliance_name) {
            tr =
              "<tr>" +
              "<td class='alliancestyle'>" +
              results[j]["party_name"] +
              "</td>" +
              "<td class='alliance-style'>" +
              results[j]["total"] +
              "</td>" +
              // "<td class='alliance-style'>" +
              // results[j]["won"] +
              // "</td>" +
              // "<td class='alliance-style'>" +
              // results[j]["total"] +
              // "</td>" +
              "</tr>";
            CombinedHTMLTable = CombinedHTMLTable + tr;
          }
        }
      }
    }
    CombinedHTMLTable = CombinedHTMLTable + other
    $("#constituency_tbody").html(CombinedHTMLTable);
    $("#tdSearch").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#AP_Constituency tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });
}
// state wise constituency results
function getConstResult() {
  $('#resultName').html('Constituency wise Results 2022');
  $(".col-bg1").css("background-color", "#fff");
  $("#vip-list").hide();
  $("#tdSearch").show();
  $("#tdSearch1").hide();
  $("#const-table").show();

  const tbody = document.querySelector("#AP_Constituency > tbody");
  var state = document.getElementById("mySelect").value;
  // debugger;
  if (state == "Up") {
    url='./json/upconstwise.json';
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarpradesh.constwiseR;
    // url = "http://65.0.40.45/web_api/website/uttarpradesh_2022/statewise_const_tally.php";
  }
  else if (state == "Pb") {
    url='./json/pbconstwise.json';
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.punjab.constwiseR;
    // url = "http://65.0.40.45/web_api/website/kerala_2021/statewise_const_tally.php";
  } else if (state == "Uk") {
    url= './json/ukconstwise.json';
    // url = appData.apiConfig.baseURL + appData.apiConfig.suffixes.uttarakhand.constwiseR;
    // url = "http://65.0.40.45/web_api/website/tamilnadu_2021/statewise_const_tally.php";
  }
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  // if (
  //   test ==
  //   "https://etvbharatlive7.akamaized.net/hls/live/710673/kerala/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL + appData.apiConfig.suffixes.kerala.constwise;
  // } else if (
  //   test ==
  //   "https://dfae28bzu51al.cloudfront.net/out/v1/ee7ba7ef70fc4005a3992a2c0e8336aa/ETVB_CF_TN_NewsTime.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL +
  //     appData.apiConfig.suffixes.tamilnadu.constwise;
  // } else if (
  //   test ==
  //   "https://etvbharatlive8.akamaized.net/hls/live/710674/assam/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL + appData.apiConfig.suffixes.assam.constwise;
  // } else if (
  //   test ==
  //   "https://etvbharatlive9.akamaized.net/hls/live/710675/westBengal/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL +
  //     appData.apiConfig.suffixes.westBengal.constwise;
  // }
  $.getJSON(url, function (successdata) {

    CombinedHTMLTable = "";
    var tr;
    var thead = "";
    thead = `<tr class="const-row">
            <th id="const-header"  style= "background-color: rgb(155, 167, 176);">CONSTITUENCY</th>
            <th id="candidate-header"  style= "background-color: rgb(155, 167, 176);">CANDIDATE</th>
            <th id="party-header" style= "background-color: rgb(155, 167, 176);">PARTY</th>
            <th id="status-header" style= "background-color: rgb(155, 167, 176);">STATUS</th>
          </tr>`;
    CombinedHTMLTable = CombinedHTMLTable + thead;
    for (var j = 0; j <= successdata.results.length - 1; j++) {
      tr = "<tr>" +
        "<td style='padding-left: 15px;text-align: initial;'>" + successdata.results[j]["const_name"] + "</td>" +
        "<td style='padding-left: 15px;text-align: initial;'>" + successdata.results[j]["candidate_name"] + "</td>" +
        "<td>" + successdata.results[j]["party_name"] + "</td>";
      if (successdata.results[j]["status"].toLowerCase() == "lead") {
        tr = tr + "<td class='leading-blog sorting_1'>" + "<p>" + successdata.results[j]["status"] + "</p>" + "</td>" +
          "</tr>";
      } else if (successdata.results[j]["status"].toLowerCase() == "won") {
        tr = tr + "<td class='won-blog sorting_1'>" + "<p>" + successdata.results[j]["status"] + "</p>" + "</td>" +
          "</tr>";
      } else if (successdata.results[j]["status"].toLowerCase() == "lost") {
        tr = tr + "<td class='lost-blog sorting_1'>" + "<p>" + successdata.results[j]["status"] + "</p>" + "</td>" +
          "</tr>";
      } else {
        tr = tr + "<td class='trailing-blog sorting_1'>" + "<p>" + successdata.results[j]["status"] + "</p>" + "</td>" +
          "</tr>";
      }
      CombinedHTMLTable = CombinedHTMLTable + tr;
    }
    $("#constituency_tbody").html(CombinedHTMLTable);

    $("#tdSearch").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $("#AP_Constituency tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  });
}
// assam and west bengal phase wise results
// function PhaseR(assamp, distresults, CombinedHTMLTable) {
//   for (var j = 0; j < assamp.length; j++) {
//     var CombineTable = "";
//     var com2 = "";
//     var leadphase;
//     var totalphase;
//     for (var i = 0; i < distresults.length; i++) {
//       if (distresults[i].phase_name == assamp[j]) {
//         if (!distresults[i].party_name) {
//           trf = "";
//           trf2 = "";
//           countphase = distresults[i].phase_count_seats;
//           totalphase = distresults[i].phase_total_seats;
//         } else {
//           var trh = distresults[i].phase_name;
//           var trf = "<td  class='edhyna'>" + distresults[i].lead + "</td>";
//           CombineTable = CombineTable + trf;
//           var trf2 =
//             "<td style='color: #05601C;' class='edhyna'>" +
//             distresults[i].won +
//             "</td>";
//           com2 = com2 + trf2;
//         }
//       }
//     }
//     CombinedHTMLTable =
//       CombinedHTMLTable +
//       "<tr><td  class='dist1' colspan=5>" +
//       trh +
//       "<span>&nbsp;&nbsp;(" +
//       countphase +
//       "/" +
//       totalphase +
//       ")</span></td><tr><td class='lead1'> Lead</td>" +
//       CombineTable +
//       "</tr><tr><td  style='color: #05601C;'class='lead1'> Won</td>" +
//       com2 +
//       "</tr>";
//     $("#constituency_tbody").html(CombinedHTMLTable);
//   }
// }
function getPhaseResult() {
  $(".col-bg1").css("background-color", "#fff");
  $("#vip-list").hide();
  $("#const-table").hide();
  $("#tdSearch1").show();
  $("#tdSearch").hide();

  const tbody = document.querySelector("#AP_Constituency > tbody");
  var state = document.getElementById("mySelect").value;
  // debugger;
  if (state == "Up") {
    url = "";
  }
  else if (state == "Pb") {
    url = "";
  } else if (state == "Uk") {
    url = "";
  } else if (state == "Goa") {
    url = "";
  } else if (state == "Mn") {
    url = "";
  }
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  // if (
  //   test ==
  //   "https://etvbharatlive8.akamaized.net/hls/live/710674/assam/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL + appData.apiConfig.suffixes.assam.phaseWise;
  // } else if (
  //   test ==
  //   "https://etvbharatlive9.akamaized.net/hls/live/710675/westBengal/index.m3u8"
  // ) {
  //   url =
  //     appData.apiConfig.baseURL +
  //     appData.apiConfig.suffixes.westBengal.phaseWise;
  // }
  $.getJSON(url, function (successdata) {
    // while (tbody.firstChild) {
    //   tbody.removeChild(tbody.firstChild);
    // }
    if (
      url ==
      appData.apiConfig.baseURL + appData.apiConfig.suffixes.assam.phaseWise
    ) {
      CombinedHTMLTable = "";
      var thead = "";
      thead = "<tr>" + "<th class='table-h'></th>" + assamHead();
      CombinedHTMLTable = CombinedHTMLTable + thead;
      var distresults = successdata.totalresults;
      var assamp = ["PHASE-1", "PHASE-2", "PHASE-3"];
      PhaseR(assamp, distresults, CombinedHTMLTable);
    } else if (
      url ==
      appData.apiConfig.baseURL +
      appData.apiConfig.suffixes.westBengal.phaseWise
    ) {
      CombinedHTMLTable = "";
      var thead = "";
      thead = "<tr>" + "<th class='table-h'></th>" + westHead();
      CombinedHTMLTable = CombinedHTMLTable + thead;
      var distresults = successdata.totalresults;
      var westp = [
        "PHASE-1",
        "PHASE-2",
        "PHASE-3",
        "PHASE-4",
        "PHASE-5",
        "PHASE-6",
        "PHASE-7",
        "PHASE-8",
      ];
      PhaseR(westp, distresults, CombinedHTMLTable);
    }
    searchfun();
  });
}

function upElectionBanner() {
  var upImg =
    "<img src='/images/states/uttarpradesh.jpg' alt='hello' style='width:300; height: 250;' />";
  $("#state-img").html(upImg);
  $("#BannerAdd")
    .html(`<div id='div-gpt-ad-1619085131490-0' style='width: 728px; height: 90px;'>
                      <script>
                        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619085131490-0'); });
                      </script>
                    </div>`);
  // $("#web-add")
  //   .html(`<div id='div-gpt-ad-1619694076984-0' style='width: 300px; height: 250px;'>
  //                       <script>
  //                         googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619694076984-0'); });
  //                       </script>
  //                     </div>`);
  // $("#web-add1")
  //   .html(`<div id='div-gpt-ad-1619694049650-0' style='width: 300px; height: 250px;'>
  //                   <script>
  //                     googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619694049650-0'); });
  //                   </script>
  //                 </div>`);
}

function ukElectionBanner() {
  var ukImg =
    "<img src='/images/states/uttarakhand.jpg' alt='hello' style='width:300; height: 250;' />";
  $("#state-img").html(ukImg);
  $("#BannerAdd")
    .html(`<div id='div-gpt-ad-1619085131490-0' style='width: 728px; height: 90px;'>
                      <script>
                        googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619085131490-0'); });
                      </script>
                    </div>`);
  // $("#web-add")
  //   .html(`<div id='div-gpt-ad-1619694076984-0' style='width: 300px; height: 250px;'>
  //                       <script>
  //                         googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619694076984-0'); });
  //                       </script>
  //                     </div>`);
  // $("#web-add1")
  //   .html(`<div id='div-gpt-ad-1619694049650-0' style='width: 300px; height: 250px;'>
  //                   <script>
  //                     googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619694049650-0'); });
  //                   </script>
  //                 </div>`);
}
function pbElectionBanner() {
  var pbimg =
    " <img src='/images/states/punjab.jpg' alt=''style='width:300; height: 250;' />";
  $("#state-img").html(pbimg);
  $("#BannerAdd")
    .html(`<div id='div-gpt-ad-1619085076269-0' style='width: 728px; height: 90px;'>
          <script>
            googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619085076269-0'); });
          </script>
        </div>`);
  $("#BannerAdd1")
    .html(`<div id='div-gpt-ad-1619085019384-0' style='width: 300px; height: 250px;'>
        <script>
          googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619085019384-0'); });
        </script>
        </div>`);
  // $("#web-add")
  //   .html(`<div id='div-gpt-ad-1619693895857-0' style='width: 300px; height: 250px;'>
  //                       <script>
  //                         googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619693895857-0'); });
  //                       </script>
  //                       </div>`);
  // $("#web-add1")
  //   .html(`<div id='div-gpt-ad-1619693924710-0' style='width: 300px; height: 250px;'>
  //                     <script>
  //                       googletag.cmd.push(function() { googletag.display('div-gpt-ad-1619693924710-0'); });
  //                     </script>
  //                     </div>`);

}
// function getPcConst() {
//   var puducherry_table = "";
//   var url =
//     appData.apiConfig.baseURL + appData.apiConfig.suffixes.puducherry.constwise;
//   $.getJSON(url, function (response) {
//     for (var j = 0; j <= response.results.length - 1; j++) {
//       if (response.results[j]["status"].toLowerCase() == "lead") {
//         tr =
//           "<tr>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["const_name"] +
//           "</td>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["candidate_name"] +
//           "</td>" +
//           "<td>" +
//           response.results[j]["party_name"] +
//           "</td>" +
//           "<td class='leading-blog sorting_1'>" +
//           "<p>" +
//           response.results[j]["status"] +
//           "</p>" +
//           "</td>" +
//           "</tr>";
//         puducherry_table = puducherry_table + tr;
//       } else if (response.results[j]["status"].toLowerCase() == "won") {
//         tr =
//           "<tr>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["const_name"] +
//           "</td>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["candidate_name"] +
//           "</td>" +
//           "<td>" +
//           response.results[j]["party_name"] +
//           "</td>" +
//           "<td class='won-blog sorting_1'>" +
//           "<p>" +
//           response.results[j]["status"] +
//           "</p>" +
//           "</td>" +
//           "</tr>";
//         puducherry_table = puducherry_table + tr;
//       } else if (response.results[j]["status"].toLowerCase() == "lost") {
//         tr =
//           "<tr>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["const_name"] +
//           "</td>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["candidate_name"] +
//           "</td>" +
//           "<td>" +
//           response.results[j]["party_name"] +
//           "</td>" +
//           "<td class='lost-blog sorting_1'>" +
//           "<p>" +
//           response.results[j]["status"] +
//           "</p>" +
//           "</td>" +
//           "</tr>";
//         puducherry_table = puducherry_table + tr;
//       } else {
//         tr =
//           "<tr>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["const_name"] +
//           "</td>" +
//           "<td style='padding-left: 15px;text-align: initial;'>" +
//           response.results[j]["candidate_name"] +
//           "</td>" +
//           "<td>" +
//           response.results[j]["party_name"] +
//           "</td>" +
//           "<td class='trailing-blog sorting_1'>" +
//           "<p>" +
//           response.results[j]["status"] +
//           "</p>" +
//           "</td>" +
//           "</tr>";
//         puducherry_table = puducherry_table + tr;
//       }
//     }
//     $("#Pc_Constituency1>tbody").html(puducherry_table);

//     $("#tdSearch2").on("keyup", function () {
//       var value = $(this).val().toLowerCase();
//       $("#Pc_Constituency1 tr").filter(function () {
//         $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
//       });
//     });
//   });
// }
// var state_el="";
function selectState() {
  var state_el = document.getElementById("mySelect").value;
  if (state_el == "Up") {
    // document.getElementById("state-name").innerHTML = "UTTARPRADESH";
    upElectionBanner();

  } else if (state_el == "Pb") {
    // document.getElementById("state-name").innerHTML = "PUNJAB";
    pbElectionBanner()
  } else if (state_el == "Uk") {
    // document.getElementById("state-name").innerHTML = "UTTARAKHAND";
    ukElectionBanner();
  }

  $('button').removeClass('clicked');
  $('button').removeClass('active');
  $("button.dist").addClass('clicked')
  $("button.dist").addClass('active')
  getCrntYear();
  getDistrictResult();
  $("#other-states").show();
  $("#election-state").show();
}
$(document).ready(function () {
  electionResults();
  getLiveStateNews();

  $("#vip-list").hide();

  // bannerAdd();
  setInterval(() => {
    electionResults();
  }, 30000);

  getDistrictResult();
  selectState();
  // getCrntYear();

  setInterval(() => {
    if ($("button.prev-year").hasClass("clicked")) {
      getPrevYear();
    } else if ($("button.crnt-year").hasClass("clicked")) {
      getCrntYear();
    }
  }, 30000);

  setInterval(() => {
    if ($("button.dist").hasClass("clicked")) {
      getDistrictResult();
    } else if ($("button.const").hasClass("clicked")) {
      // document.getElementById('tdSearch').value;
      getConstResult();
    } else if ($("button.party").hasClass("clicked")) {
      // document.getElementById('tdSearch').value;
      getPartyResult();
    } else if ($("button.vip").hasClass("clicked")) {
      // document.getElementById('tdSearch').value;
      getVipResult();
    }
    // getPcConst();
  }, 30000);
});

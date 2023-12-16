window.YTD = {
  "profile" : { "part0" : [] },
  "account" : { "part0" : [] },
  "follower" : { "part0" : [] },
  "following" : { "part0" : [] },
  "like" : { "part0" : [] },
  "tweets" : { "part0" : [] },
  "retweets" : { "part0" : [] },
  "imgalt" : { "part0" : [] }
}
window.optStats = {
  "enable_imgalt" : true,
  "orientation" : 0,
  "keywordHilite" : "#1DA1F2",
  "active_tab" : "tweets", 
  "profile_folder" : "data/profile_media",
  "data_folder" : "data/tweets_media",
  "avatar_logo" : "",
  "data_order" : "desc", // Default : desc
  "retweet_only" : false,
  "media_only" : false,
  "text_only" : false,
  "search_mode" : false,
  "displayPerPage" : 10,
  "iConnected" : window.navigator.onLine,
  "cache" : [],
  "stats" : {
    "total_data" : 0,
    "search" : {
      "tweets" : {
        "active" : false,
        "keyword" : null,
        "found" : 0
      },
      "replies" : {
        "active" : false,
        "keyword" : null,
        "found" : 0
      },
      "likes" : {
        "active" : false,
        "keyword" : null,
        "found" : 0
      }
    },
    "total_post" : 0,
    "total_replies" : 0,
    "total_retweet" : 0,
    "total_likes" : 0,
    "post_text" : 0,
    "post_with_media" : 0,
    "post_videos" : 0,
    "post_images" : 0,
    "retweet_text" : 0,
    "retweet_with_media" : 0,
    "retweet_videos" : 0,
    "retweet_images" : 0,
    "reply_text" : 0,
    "reply_with_media" : 0,
    "reply_videos" : 0,
    "reply_images" : 0
  }
}

var refresh = 0;

function InitiateButton()
{
  /* reset contents */
  $(".tab-content #nav-tweets #tweets-data").first().html("");
  /* Set initial active tab */
  $(".nav.nav-tabs #nav-tweets-tab").tab("show");
  
  $('.nav-tabs a').on('shown.bs.tab', function (e) {
        if($(this).html().trim()=="Tweets")
        {
          window.optStats.active_tab = "tweets";
          preparePosts();
        }
        else if($(this).html().trim()=="Replies")
        {
          window.optStats.active_tab = "replies";
          //if($("span#replies-data").html().length==0) 
          preparePosts();
        }
        else if($(this).html().trim()=="Likes")
        {
          window.optStats.active_tab = "likes";
          preparePosts();
        }
        var current_tab = e.target;
        var previous_tab = e.relatedTarget;
    });

  /* Set main menu default setting */
  $(".dropdown-menu a").click(function()
  {
    if(String($(this).html()).indexOf("fa-retweet")!==-1)
    {
       if($(this).hasClass("dropdown-item-checked"))
       {
         if(window.optStats.active_tab=="tweets")
         {
            window.optStats.retweet_only = false;
            preparePosts();
            $(this).removeClass("dropdown-item-checked");
         }
       }
       else
       {
         if(window.optStats.active_tab=="tweets")
         {
           window.optStats.retweet_only = true;
           window.optStats.stats.search.tweets.keyword = null;
           window.optStats.stats.search.replies.keyword = null;
           preparePosts();
           $(this).addClass("dropdown-item-checked");
         }
       }
    }
    if(String($(this).html()).indexOf("fa-file-image-o")!==-1)
    {
      if(!window.optStats.retweet_only)
      {
        if($(this).hasClass("dropdown-item-checked"))
        {
          if(window.optStats.active_tab=="tweets" || window.optStats.active_tab=="replies")
          {
            window.optStats.media_only = false;
            preparePosts();
            $(this).removeClass("dropdown-item-checked");
          }
       }
        else
        {
           if($(this).parent().parent().find(".fa-file-text-o").parent().hasClass("dropdown-item-checked") && window.optStats.text_only)
           {
              $(this).parent().parent().find(".fa-file-text-o").parent().removeClass("dropdown-item-checked");
              window.optStats.text_only = false;
            }
            window.optStats.media_only = true;
            preparePosts();
            $(this).addClass("dropdown-item-checked");
        }
      }
      if(window.optStats.active_tab=="tweets" && window.optStats.retweet_only)
      {
        if($(this).hasClass("dropdown-item-checked"))
        {
          window.optStats.media_only = false;
          preparePosts();
          $(this).removeClass("dropdown-item-checked");
        }
        else
        {
          if(window.optStats.text_only)
          {
            window.optStats.text_only = false;
            if($(this).parent().parent().find(".fa-file-text-o").parent().hasClass("dropdown-item-checked"))
              $(this).parent().parent().find(".fa-file-text-o").parent().removeClass("dropdown-item-checked");
            window.optStats.media_only = true;
            preparePosts();
            $(this).addClass("dropdown-item-checked");
          }
          else
          {
            window.optStats.media_only = true;
            preparePosts();
            $(this).addClass("dropdown-item-checked");
          }
        }
      }
    }
    if(String($(this).html()).indexOf("fa-file-text-o")!==-1)
    {
      if(window.optStats.active_tab=="tweets")
      {
        if($(this).parent().parent().find(".fa-file-image-o").parent().hasClass("dropdown-item-checked") && window.optStats.media_only)
        {
          window.optStats.media_only = false;
          window.optStats.text_only = true;
          preparePosts();
          $(this).parent().parent().find(".fa-file-image-o").parent().removeClass("dropdown-item-checked");
          $(this).addClass("dropdown-item-checked");
        }
        else
        {
          if($(this).hasClass("dropdown-item-checked"))
          {
            window.optStats.text_only = false;
            preparePosts();
            $(this).removeClass("dropdown-item-checked");
          }
          else
          {
            window.optStats.text_only = true;
            preparePosts();
            $(this).addClass("dropdown-item-checked");
          }
        }
      }
      else if(window.optStats.active_tab=="replies")
      {
        if($(this).parent().parent().find(".fa-file-image-o").parent().hasClass("dropdown-item-checked") && window.optStats.media_only)
        {
          window.optStats.media_only = false;
          window.optStats.text_only = true;
          preparePosts();
          $(this).parent().parent().find(".fa-file-image-o").parent().removeClass("dropdown-item-checked");
          $(this).addClass("dropdown-item-checked");
        }
        else
        {
          window.optStats.text_only = true;
          preparePosts();
          $(this).addClass("dropdown-item-checked");
        }
      }
    }
    if(String($(this).html()).indexOf("fa-sort-numeric")!==-1)
    {
      if(String($(this).html()).indexOf("fa-sort-numeric-desc")!==-1)
      {
         $(this).html("<i class=\"fa fa-sort-numeric-asc\"></i>Show Oldest First");
         window.optStats.data_order ="desc";
         preparePosts();
      }
      else 
      {
         $(this).html("<i class=\"fa fa-sort-numeric-desc\"></i>Show Newest First");
         window.optStats.data_order = "asc";
         preparePosts();
      }
    }
    if(String($(this).html()).indexOf("fa-refresh")!==-1)
    {
      resetMenuState();
      /*window.optStats.media_only = false;
      if($(this).parent().parent().find(".fa-file-image-o").parent().hasClass("dropdown-item-checked"))
           $(this).parent().parent().find(".fa-file-image-o").parent().removeClass("dropdown-item-checked");
           
      if(window.optStats.active_tab=="tweets")
      {
        window.optStats.data_order = "desc";
        window.optStats.retweet_only = false;
        window.optStats.search_term.tweets.keyword = null;
        window.optStats.search_term.tweets.found = 0;
        window.optStats.search_term.replies.keyword = null;
        window.optStats.search_term.replies.found = 0;
        window.optStats.search_term.likes.keyword = null;
        window.optStats.search_term.likes.found = 0;
        if($(this).parent().parent().find(".fa-retweet").parent().hasClass("dropdown-item-checked"))
           $(this).parent().parent().find(".fa-retweet").parent().removeClass("dropdown-item-checked");

        if($(this).parent().parent().find(".fa-sort-alpha-desc").parent().html()!='undefined')
        {
          $(this).parent().parent().find(".fa-sort-alpha-desc").parent().html("<i class=\"fa fa-sort-alpha-asc\"></i>Show Oldest First");
        }
        preparePosts();
      }
      else if(window.optStats.active_tab=="replies")
      {
        window.optStats.search_term.replies.keyword = null;
        window.optStats.data_order ="desc";
        if($(this).parent().parent().find(".fa-sort-alpha-desc").parent().html()!='undefined')
        {
          $(this).parent().parent().find(".fa-sort-alpha-desc").parent().html("<i class=\"fa fa-sort-alpha-asc\"></i>Show Oldest First");
        }
        preparePosts();
      }
      else if(window.optStats.active_tab=="likes")
      {
        window.optStats.search_term.likes.keyword = null;
        window.optStats.data_order ="desc";
        preparePosts();
      }*/
    }
    if(String($(this).html()).indexOf("fa-search")!==-1)
    {
      showDialog("", "input", "Search Tweets");
    }
    else if(String($(this).html()).indexOf("fa-gears")!==-1)
    {
      showDialog($(".tabular").html(), "settings", "Settings");
    }
  });
}

function resetMenuState(reload=false)
{
  window.optStats.data_order = "desc";
  window.optStats.retweet_only = false;
  window.optStats.media_only = false;
  window.optStats.text_only = false;
  window.optStats.stats.search.tweets.keyword = null;
  window.optStats.stats.search.tweets.found = 0;
  window.optStats.stats.search.tweets.active = false;
  window.optStats.stats.search.replies.keyword = null;
  window.optStats.stats.search.replies.found = 0;
  window.optStats.stats.search.replies.active = false;
  window.optStats.stats.search.likes.keyword = null;
  window.optStats.stats.search.likes.found = 0;
  window.optStats.stats.search.likes.active = false;
  window.optStats.search_mode = false;
  if($(".dropdown-menu a").parent().parent().find(".fa-retweet").parent().hasClass("dropdown-item-checked"))
     $(".dropdown-menu a").parent().parent().find(".fa-retweet").parent().removeClass("dropdown-item-checked");
  if($(".dropdown-menu a").parent().parent().find(".fa-file-image-o").parent().hasClass("dropdown-item-checked"))
     $(".dropdown-menu a").parent().parent().find(".fa-file-image-o").parent().removeClass("dropdown-item-checked");
  if($(".dropdown-menu a").parent().parent().find(".fa-file-text-o").parent().hasClass("dropdown-item-checked"))
     $(".dropdown-menu a").parent().parent().find(".fa-file-text-o").parent().removeClass("dropdown-item-checked");
  if(reload) preparePosts();
}

function startLoader()
{
  if(typeof($(".app-loader").html())=="undefined")
  {
     $(document.body).append("<div class=\"app-loader\" style=\"height:100vmax;width:100%;position:fixed;top:0px;left:0px;background-color:#fff;z-index:5;overflow-x:none;overflow-y:none\"><center style=\"position:relative;margin:0;top:50%;transform:translateY(-50%);-ms-transform:translateY(-50%)\"><i class=\"fa fa-twitter\" style=\"font-size:70px;color:#1DA1F2\"></i></center></div><div class=\"image-viewer\"><img src=\"\"></div>");
     dir = window.optStats.data_folder.split("/");
     loadJS(dir[0]+"/imgalt.js");
     loadJS(dir[0]+"/retweet.js");
  }
}

function FileExists(url, variable=null, callback=null, idx=-1, loop=0)
{
  fileType = url.toLowerCase().split(".");
  imgType = ["jpg","jpeg","png","gif","webp"];
  vdoType = ["mpg","mpeg","mp4"];
  if(imgType.indexOf(fileType[fileType.length-1])>-1)
  {
    let imgFile = document.createElement("img");
    imgFile.setAttribute("src", url);
    imgFile.setAttribute("width", "400px");
    imgFile.setAttribute("height", "300px");
    document.body.appendChild(imgFile);
    
    imgFile.addEventListener("error", () => {
      if (document.body.removeChild(imgFile))
      {
        callback(false, null, null);
      }
    });
    imgFile.addEventListener("load", () => {
      if(document.body.removeChild(imgFile))
      {
        if(variable!==null)
          callback(true, variable, url);
        else callback(true, null, url);
      }
    });
  }
  else if(vdoType.indexOf(fileType[fileType.length-1])>-1)
  {
    let vdoFile = document.createElement("video");
    vdoFile.setAttribute("src", url);
    document.body.appendChild(vdoFile);
    
    vdoFile.addEventListener("error", () => {
      if(document.body.removeChild(vdoFile))
      {
        callback(false, null, null);
      }
    });
    vdoFile.addEventListener("loadeddata", () => {
      if(document.body.removeChild(vdoFile))
      {
         callback(true, variable, url, idx, loop);
      }
    });
  }
}
  
function loadJS(FILE_URL, feedback=null, async = true)
{
  unloadJS(FILE_URL);
  let scriptEle = document.createElement("script");
  scriptEle.setAttribute("id", CryptoJS.MD5(FILE_URL).toString());
  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);
  // success event 
  scriptEle.addEventListener("load", () =>
  {
    if(feedback!=null) feedback(true);
  });
   // error event
  scriptEle.addEventListener("error", (ev) => 
  {
    if(feedback!=null) feedback(false, ev);
  });
}

function unloadJS(FILE_URL)
{
  $("script[id^='"+CryptoJS.MD5(FILE_URL).toString()+"']").remove();
  if(FILE_URL.indexOf("tweets.js")>0)
  {
    delete window.YTD.tweets.part0;
    window.YTD.tweets.part0 = [];
    if(window.optStats.active_tab=="tweets")
      window.optStats.tweets = [];
    if(window.optStats.active_tab=="replies")
    window.optStats.replies = [];
  }
  else if(FILE_URL.indexOf("like.js")>0)
  {
    delete window.YTD.like.part0;
    window.YTD.like.part0 = [];
  }
}

function showDialog(message="", type='dialog', title="Information")
{
  if(type=='dialog')
  {
    $("<div id=\"dialog-box\" title=\""+title+"\"><p>"+message+"</p></div>").dialog({
          modal: true,
          buttons: {
            btnCancel : {
              click : function() {
               $(this).dialog("close");
              },
              text: "Close",
              class: 'btn-dialog'
            }
          }
          /*height: 490,
          width: 350*/
    });
  }
  else if(type=='input')
  {
    text = "<div class=\"form-group\"><label for=\"inputSearch\">Search :</label><input type=\"text\" class=\"form-control is-valid\" id=\"inputSearch\" aria-describedby=\"clueHelp\" placeholder=\"Keyword...\"></div>";
  $("<div id=\"dialog-box\" title=\""+title+"\"><p>"+text+"</p></div>").dialog({
      modal: true,
      buttons: {
        btnCancel : {
          click : function() {
            $(this).dialog("close");
          },
          text: "Cancel",
          class: 'btn-dialog'
        },
        btnSearch : {
          click : function() {
            if(window.optStats.active_tab=="tweets" && $(this).find("input").val().length>0)
            {
              window.optStats.stats.search.tweets.keyword = $(this).find("input").val();
              window.optStats.stats.search.tweets.active = true;
            }
            if(window.optStats.active_tab=="replies" && $(this).find("input").val().length>0)
            {
              window.optStats.stats.search.replies.keyword = $(this).find("input").val();
              window.optStats.stats.replies.active = true;
            }
            if(window.optStats.active_tab=="likes" && $(this).find("input").val().length>0)
            {
              window.optStats.stats.search.likes.keyword = $(this).find("input").val();
              window.optStats.stats.likes.active = true;
            }
            if($(this).find("input").val().length>0)
            {
               window.optStats.search_mode = true;
               $(this).dialog( "close" );
               preparePosts();
            }
            else $(this).find("input").focus();
          },
          text: "Search",
          class: 'btn-dialog'
        }
      }
  });
  }
  else if(type=='settings')
  {
   $(" "+message).find('span').each(function() {
     id = $(this).attr('id');
     txt = $(this).text();
     if(id=="total-records")
       temp = message.replace($(this).parent().html(), "Total records (<i>tweets.js</i>) : <span id=\"total-records\">"+window.optStats.stats.total_data+" records</span>");
     if(id=="total-posts")
      temp = temp.replace($(this).parent().html(), "Total tweet posts : <span id=\"total-posts\">"+window.optStats.stats.total_post+" records</span>");
     if(id=="total-retweets")
       temp = temp.replace($(this).parent().html(), "Total retweets : <span id=\"total-retweets\">"+window.optStats.stats.total_retweet+" records</span>");
    if(id=="total-replies")
       temp = temp.replace($(this).parent().html(), "Total replies : <span id=\"total-replies\">"+window.optStats.stats.total_replies+" records</span>");
    if(id=="total-likes")
       temp = temp.replace($(this).parent().html(), "Total likes (<i>like.js</i>) : <span id=\"total-likes\">"+window.optStats.stats.total_likes+" records</span>");
   });
   $(" "+temp).children().each(function(){
     $($(this).html()).find('input').each(function() {
       if($(this).attr('id')=="hilite")
       {
         prev = $(this).parent().html();
         $(this).attr("value", window.optStats.keywordHilite);
         temp = temp.replace(prev, $(this).parent().html());
       }
       else if($(this).attr('id')=="data-folder")
       {
         folder = window.optStats.data_folder.split("/");
         prev = $(this).parent().html();
         $(this).attr("value", (folder[0].length>0)?"/"+folder[0]+"/":"/"+folder[1]+"/");
         temp = temp.replace(prev, $(this).parent().html());
       }
     });
     $($(this).html()).find('select').each(function() {
         prev = $(this).parent().html();
         for(var n=0; n<$(this).children().length; n++)
         {
           if($(this).children().eq(n).attr("value")==window.optStats.displayPerPage)
           {
             val = $(this).children().eq(n).val();
             $(this).children().eq(n).attr("selected", "selected");
           }
         }
         temp = temp.replace(prev, $(this).parent().html());
     });
   });
   $("<div id=\"dialog-box\" title=\""+title+"\"><p>"+temp+"</p></div>").dialog({
      modal: true,
      buttons: {
        btnCancel : {
          click : function() {
            if($(this).find('input[id="hilite"]').val().length>0)
            {
              if(String($(this).find('input[id="hilite"]').val().match(/\#([A-Fa-f0-9]+)/g)).length==7 && $(this).find('input[id="hilite"]').val().length==7)
                window.optStats.keywordHilite = $(this).find('input[id="hilite"]').val();
              else $(this).find('input[id="hilite"]').focus();
            }
            else $(this).find('input[id="hilite"]').focus();
            if($(this).find('input[id="data-folder"]').val().length>3)
            {
              if($(this).find('input[id="data-folder"]').val().substring(0,1)=="/")
              {
                folder = $(this).find('input[id="data-folder"]').val().split("/");
                loadJS(folder[1]+"/profile.js", function(stat) {
                  if(!stat)
                  {
                    alert("Folder not found !!!");
                    $(this).find('input[id="data-folder"]').focus();
                  }
                  else
                  {
                    window.optStats.profile_folder = folder[1]+"/profile_media/";
                   window.optStats.data_folder = folder[1]+"/tweets_media/";
                   loadJS(folder[1]+"/manifest.js", function(stat) {
                      if(!stat)
                      {
                        alert("Required file \""+folder[1]+"/manifest.js\" not found");
                        $(this).find('input[id="data-folder"]').focus();
                        return;
                      }
                      else
                      {
                        //preparePosts(1, true);
                        resetMenuState();
                      }
                    })
                  }
                });
              }
              else
              {
                folder = $(this).find('input[id="data-folder"]').val().split("/");
                loadJS(folder[0]+"/profile.js", function(stat) {
                  if(!stat)
                  {
                    alert("Folder not found !!!");
                    $(this).find('input[id="data-folder"]').focus();
                  }
                  else
                  {
                    window.optStats.profile_folder = folder[0]+"/profile_media/";
                    window.optStats.data_folder = folder[0]+"/tweets_media/";
                    loadJS(folder[0]+"/manifest.js", function(stat) {
                      if(!stat)
                      {
                        alert("Required file \""+folder[0]+"/manifest.js\" not found");
                        $(this).find('input[id="data-folder"]').focus();
                        return;
                      }
                      else
                      {
                        //preparePosts(1, true);
                        resetMenuState();
                      }
                    });
                  }
                });
              }
            }
            else $(this).find('input[id="data-folder"]').focus();
            window.optStats.displayPerPage = $(this).find('select[id="viewPerPage"]').val();
            $(this).dialog("close");
          },
          text: "Close",
          class: 'btn-dialog'
        }
      },
      height: 490,
      width: 350
    }).tabs();
  }
  else if(type=='source')
  {
    $("<div id=\"dialog-box\" title=\"HTML Source\"><p><textarea style=\"width:310px;height:350px\">"+message+"</textarea></p></div>").dialog({
          modal: true,
          buttons: {
            btnCancel : {
              click : function() {
               $(this).dialog("close");
              },
              text: "Close",
              class: 'btn-dialog'
            }
          },
          height: 490,
          width: 350
    });
  }
  else alert("😣 Unknown dialog type !!!")
}

function setMenu(obj)
{
  if(typeof($(obj).parent().attr('screenName'))!=='undefined')
          {
             window.open("https://twitter.com/"+$(obj).parent().attr('screenName')+"/status/"+$(obj).attr("id").substring(0, $(obj).attr("id").length));
          }
  else showDialog("Twitter Post ID : "+$(obj).parent().attr("id").substring(0, $(obj).parent().attr("id").length-1))
}

String.prototype.replace1st = function (pattern, replacement)
{
  return this.substring(0, this.indexOf(pattern))+replacement+this.substring(this.indexOf(pattern)+pattern.length, this.length);
}

// Listen for orientation changes
window.addEventListener("orientationchange", function() {
  // Announce the new orientation number
  window.optStats.orientation = window.orientation;
}, false);

function isMobile()
{
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

function setPagination(current=1)
{
   template = "<nav><ul class=\"pagination\">";
   scrolls = "";
   records = 0;
   if(window.optStats.active_tab=="tweets")
   {
     //Normal
     if(!window.optStats.retweet_only && !window.optStats.media_only)
     {
       if(window.optStats.text_only)
       {
         if(window.optStats.search_mode && window.optStats.stats.search.tweets.active)
            records = window.optStats.stats.search.tweets.found;
         else
            records = window.optStats.stats.post_text+window.optStats.stats.retweet_text;
       }
       else
       {
         if(window.optStats.search_mode  && window.optStats.stats.search.tweets.active)
         {
            records = window.optStats.stats.search.tweets.found;
         }
         else
           records = window.optStats.stats.total_post+window.optStats.stats.total_retweet;
       }
     }
     else
     {
       if(window.optStats.media_only)
       {
         if(window.optStats.retweet_only) records = window.optStats.stats.retweet_with_media
         else records = window.optStats.stats.post_with_media+window.optStats.stats.retweet_with_media;
       }
       else
       {
         if(window.optStats.retweet_only)
         {
           if(window.optStats.text_only)
             records = window.optStats.stats.retweet_text;
           else
             records = window.optStats.stats.total_retweet;
         }
       }
     }
   }
   else if(window.optStats.active_tab=="replies")
   {
     if(window.optStats.media_only)
     {
       records = window.optStats.stats.reply_with_media;
     }
     else
     {
       if(window.optStats.text_only)
       {
         records = window.optStats.stats.reply_text;
       }
       else
       {
         records = window.optStats.stats.total_replies;
       }
     }
   }
   else if(window.optStats.active_tab=="likes")
   {
     records = window.optStats.stats.total_likes;
   }
   //alert("Records : "+records)
   if(typeof(records)!=='undefined')
   {
     loop = Math.ceil(records/window.optStats.displayPerPage);
     if(loop>5)
     {
        for(c=0; c<loop; c++)
        {
          if (c<5)
          {
             template += "<li class=\"page-item\"><a class=\"page-link"+((c==(current-1))?" disabled":"")+"\" onclick=\"javascript:preparePosts("+(c+1)+")\">"+(c+1)+"</a></li>";
             scrolls += "<li><a class=\"dropdown-item"+((c==(current-1))?" disabled":"")+"\" href=\"javascript:preparePosts("+(c+1)+")\">"+(c+1)+"</a></li>";
          }
          else
          {
            if(c==5 && loop>5)
              template += "<li id=\"pagination-pages\" class=\"page-item dropup\"><a class=\"page-link fa fa-angle-double-right\" data-bs-toggle=\"dropdown\" role=\"button\" aria-expanded=\"false\" style=\"font-size:24px\">&nbsp;</a><ul class=\"dropdown-menu scroll-menu dropdown-menu-end\" style=\"bottom: 0; left: auto;\">";
              scrolls += "<li><a class=\"dropdown-item"+((c==(current-1))?" disabled":"")+"\" href=\"javascript:preparePosts("+(c+1)+")\">"+(c+1)+"</a></li>";
          }
        }
     }
     else if(loop<=5)
     {
       for(n=0; n<5; n++)
       {
         if(n<loop && n!=(current-1))
          template += "<li class=\"page-item\"><a class=\"page-link\" onclick=\"javascript:preparePosts("+(n+1)+")\">"+(n+1)+"</a></li>";
         else
          template += "<li class=\"page-item disabled\"><a class=\"page-link\">"+(n+1)+"</a></li>";
       }
       template += "<li class=\"page-item dropup disabled\"><a class=\"page-link fa fa-angle-double-right\" style=\"font-size:24px\">&nbsp;</a></li>";
     }
     end = "</ul></li></ul></nav>";
     if(window.optStats.active_tab=="tweets")
     {
       $(".tab-content #nav-tweets .paging-bottom").empty();
       $(".tab-content #nav-tweets .paging-bottom").append(template+scrolls+end);
     }
     else if(window.optStats.active_tab=="replies")
     {
       $(".tab-content #nav-replies .paging-bottom").empty();
       $(".tab-content #nav-replies .paging-bottom").append(template+scrolls+end);
     }
     else if(window.optStats.active_tab=="likes")
     {
       $(".tab-content #nav-like .paging-bottom").empty();
       $(".tab-content #nav-like .paging-bottom").append(template+scrolls+end);
     }
   }
}

function updateHashtagUser(txt, d)
{
  if(txt.length>0)
  {
    var urlRegex = /(<img\s[^>]*>|<a(?:\s[^>]*)?>[\s\S]*?<\/a>)|(?:(?:#?|@?"))(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[\•\✓\√\"A-Z0-9+&@#\/%=~_|$])/gi;
    usrReg = /(\@[A-Za-z0-9\_\-]+)/g;
    t = txt.match(usrReg);
    if(t!=null && t.length>0)
    {
       word = String(t[t.length-1]);
       end = txt.indexOf(word);
       txt = txt.replace(word+" ", txt.substring(end, end+word.length)+"\n");
    }
    txt = txt.replace(urlRegex, function (words, tag) {
      if(typeof(tag)=='undefined')
      {
         hashes = /(\#[A-Za-z0-9\_\-]+)/g;
         if(words.match(hashes)!=null)
         {
            words = String("<a target=\"_blank\" href=\"https://twitter.com/search?q="+escape("#")+words.substring(1,words.length)+"&src=typed_query\">"+words+"</a>");
         }
         if(txt.substring(0,1)=="@" || txt.substring(0,4)=="RT @")
         {
           if(t!==null && words.substring(0,1)=="@" && words.length>1)
           {
             return words.replace(words, "<a target=\"_blank\" href=\"https://twitter.com/"+words.substring(1, words.length)+"\">"+words+"</a>");
           }
         }
         if(window.optStats.active_tab=="tweets" && window.optStats.stats.search.tweets.keyword!=null && words.toLowerCase().includes(window.optStats.stats.search.tweets.keyword.toLowerCase()))
         {
           rep = new RegExp(window.optStats.stats.search.tweets.keyword, 'gi');
           return words.replace(rep, "<b><i style=\"color: "+window.optStats.keywordHilite+"\">"+window.optStats.stats.search.tweets.keyword+"</i></b>");
         } else if(window.optStats.active_tab=="replies" && window.optStats.stats.search.replies.keyword!=null && words.toLowerCase().includes(window.optStats.stats.search.replies.keyword.toLowerCase()))
         {
           rep = new RegExp(window.optStats.stats.search.replies.keyword, 'gi');
           return words.replace(rep, "<b><i style=\"color: "+window.optStats.keywordHilite+"\">"+window.optStats.stats.search.replies.keyword+"</i></b>");
         }
         else if(window.optStats.active_tab=="likes" && window.optStats.stats.search.likes.keyword!=null && words.toLowerCase().includes(window.optStats.stats.search.likes.keyword.toLowerCase()))
         {
           rep = new RegExp(window.optStats.stats.search.likes.keyword, 'gi');
           return words.replace(rep, "<b><i style=\"color: "+window.optStats.keywordHilite+"\">"+window.optStats.stats.search.likes.keyword+"</i></b>");
         }
         else return words;
      } else return words;
    });
    if(txt.length>0) return txt;
  }
}

function updateLinks(d)
{
  let dump = (typeof(d.tweet.full_text)!=='undefined')?d.tweet.full_text:"";
  if(dump.length>0)
  {
    if(typeof(d.tweet.entities.urls)!=='undefined')
    {
      d.tweet.entities.urls.forEach(m => {
        dump = dump.replace(m.url, "<a target=\"_blank\" href=\""+m.expanded_url+"\">"+m.display_url+"</a>");
      });
      if(dump.length>0) return dump;
    }
  }
  else return false;
}

function updateMedia(txt, d, index=-1)
{
  if(txt.length>0)
  {
    if(typeof(d.tweet.extended_entities)!=='undefined')
    {
      var iTxt = "";
      var desc = [];
      for(var z=0; z<d.tweet.extended_entities.media.length; z++)
      {
        if(d.tweet.extended_entities.media[z].type=="video" || d.tweet.extended_entities.media[z].type=="animated_gif")
        {
          refresh++;
          if(z==0)
          {
            if(d.tweet.extended_entities.media.length>1 && d.tweet.extended_entities.media.length==2)
              iTxt = "<div class=\"double_img-prev\">"
            if(d.tweet.extended_entities.media.length>1 && d.tweet.extended_entities.media.length==3)
              iTxt = "<div class=\"triple_img-prev\">";
            if(d.tweet.extended_entities.media.length>1 && d.tweet.extended_entities.media.length==4)
              iTxt = "<div class=\"forth_img-prev\">"
          }
          for(var s=0; s<d.tweet.extended_entities.media[z].video_info.variants.length; s++)
          {
            ext = d.tweet.extended_entities.media[z].video_info.variants[s].content_type.split("\/");
            var fName = String(d.tweet.extended_entities.media[z].video_info.variants[s].url).slice(String(d.tweet.extended_entities.media[z].video_info.variants[s].url).lastIndexOf("\/")+1, String(d.tweet.extended_entities.media[z].video_info.variants[s].url).indexOf(ext[1])+ext[1].length);
           var vdoFname = (fName.length>0)?window.optStats.data_folder+d.tweet.id+"-"+fName:"";

           if(vdoFname.trim().length>0)
           {
             FileExists(vdoFname, d.tweet, function(stat, va, file, idx, lastIdx) {
               orient = !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape';

              altmsg = ""; 
              if(stat) 
              {
                vh = va.extended_entities.media[lastIdx].sizes.small.h;
                vw = va.extended_entities.media[lastIdx].sizes.small.w;
                if(vw>vh)
                  vdoTypeClass = "-horizontal";
                else if(vh==vw)
                  vdoTypeClass = "-equal"
                else if(vh>vw)
                  vdoTypeClass = "-vertical";
                
                if(va.extended_entities.media.length==2)
                {
                   if(lastIdx==0) vdoTypeClass += altmsg = "_double_1st";
                   if(lastIdx==1) vdoTypeClass += altmsg = "_double_2nd"
                }
                if(va.extended_entities.media.length==3)
                {
                  if(lastIdx==0)
                   vdoTypeClass += altmsg = "_triple_1st";
                  if(lastIdx==1) vdoTypeClass += altmsg = "_triple_2nd";
                  if(lastIdx==2) vdoTypeClass += altmsg = "_triple_3rd";
                }
                if(va.extended_entities.media.length==4)
                {
                   if(lastIdx==0) 
                     vdoTypeClass += altmsg = "_forth_1st";
                   if(lastIdx==1) 
                     vdoTypeClass += altmsg = "_forth_2nd";
                   if(lastIdx==2)
                     vdoTypeClass += altmsg = "_forth_3rd";
                   if(lastIdx==3)
                     vdoTypeClass += altmsg = "_forth_4th";
                }
               
                if(va.extended_entities.media.length>1)
                {
                  if(va.extended_entities.media.length==2)
                    className = "double_img-prev_with-vdo";
                  else if(va.extended_entities.media.length==3)
                    className = "triple_img-prev_with-vdo";
                  else if(va.extended_entities.media.length==4)
                    className = "forth_img-prev_with-vdo";
                  vdo = "<video class=\"vdo_tag"+vdoTypeClass+"\" "+((va.extended_entities.media[lastIdx].type=="animated_gif")?" type=\"gif\" previewable=\"true\" autoplay loop muted":"type=\"mp4\" controls")+"><source src=\""+file+"\">Your browser does not support video</video>";
                }
                else
                {
                  if(va.extended_entities.media.length==1)
                    className = "single_img-prev";
                  vdo = "<video class=\"vdo_tag"+vdoTypeClass+"\" "+((va.extended_entities.media[lastIdx].type=="animated_gif")?" type=\"gif\" autoplay loop muted":"type=\"mp4\" controls")+"><source src=\""+file+"\">Your browser does not support video</video>";
               }
               if(va.extended_entities.media[lastIdx].type=="animated_gif")
               {
                 if(va.extended_entities.media.length==1)
                   vdo += "<div class=\"alt-gif\">GIF</div>";
                 if(va.extended_entities.media.length==2)
                   vdo += "<div class=\"alt-gif"+((lastIdx==1)?"_double-2nd":"_double-1st")+"\">GIF</div>";
                 if(va.extended_entities.media.length==3)
                   vdo += "<div class=\"alt-gif"+((lastIdx==1)?"_triple-2nd":((lastIdx==2)?"_triple-3rd":"_triple-1st"))+"\">GIF</div>";
                 if(va.extended_entities.media.length==4)
                   vdo += "<div class=\"alt-gif"+((lastIdx==1)?"_forth-2nd":((lastIdx==2)?"_forth-3rd":((lastIdx==3)?"_forth-4th":"_forth-1st")))+"\">GIF</div>";
                 
                 if(window.optStats.enable_imgalt==true && typeof(window.YTD.imgalt.part0)!='undefined' && window.YTD.imgalt.part0.length>0 && window.YTD.imgalt.part0.filter(a=>a.tweet.id==va.id).length>0)
                 {
                   desc = window.YTD.imgalt.part0.filter(a => a.tweet.id == va.id)[0].tweet.description[lastIdx].full_text;
                   if(desc != 'undefined')
                   {
                     urlRegex = /(https?:\/\/[^\s]+)/g;
                     if(desc.match(urlRegex)!==null)
                       {
                         t = desc.match(urlRegex);
                         if(t.length>0)
                         {
                         t.forEach(e => {
                           desc = desc.replace(e, "<a target=\"_blank\" class=\"default-link\" href=\""+e+"\">"+e.substring(0,40)+((e.length>40)?"...":"")+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                           });
                         }
                       }
                    style = altmsg.replaceAll("\_", "-")+"_with-vdo";
                     vdo += "<div index=\""+lastIdx+"\" class=\"alt-gif"+style+"\">ALT<span id=\"alt-txt\">"+desc+"</span></div>";
                   }
                 }
               }

                  if(va.extended_entities.media.length>1)
                  {
                    if(window.optStats.active_tab=="tweets")
                    {
                      $(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[lastIdx].url, window.optStats.cache.filter(e=>e.id==va.id)[0].content.replace("<!--template-->", vdo)));
                      
                    }
                    else if(window.optStats.active_tab=="replies")
                    {
                       $(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[lastIdx].url, window.optStats.cache.filter(e=>e.id==va.id)[0].content.replace("<!--template-->", vdo)));
                       //if(va.id=="1605453482445737984") alert($(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html())
                      //alert("Before : "+window.optStats.cache.length)
                      window.optStats.cache = window.optStats.cache.filter(e=>e.id!=va.id);
                      //alert("After : "+window.optStats.cache.length)
                    }
                    setImgPrev();
                  }
                  else
                  {
                    if(window.optStats.active_tab=="tweets")
                    {
                      $(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[lastIdx].url, vdo));

                    }
                    else if(window.optStats.active_tab=="replies")
                     $(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[lastIdx].url, vdo));
                  }
             }
            }, index, z);
          }
         }
        }
        else if(d.tweet.extended_entities.media[z].type=="photo")
        {
          if(typeof(d.tweet.entities.media)!='undefined')
          {
            imgFname = window.optStats.data_folder+d.tweet.id+"-"+d.tweet.extended_entities.media[z].media_url.substring(d.tweet.extended_entities.media[z].media_url.lastIndexOf("\/")+1);

          if(window.optStats.enable_imgalt==true && typeof(window.YTD.imgalt.part0)!='undefined' && window.YTD.imgalt.part0.length>0)
          {
            window.YTD.imgalt.part0.filter(e => e.tweet.id == d.tweet.id).forEach(r => {
               if(d.tweet.extended_entities.media.length==1) mode = "";
               wvid = "";
               if(d.tweet.extended_entities.media.filter(e=>e.type=="video" || e.type=="animated_gif").length>0)
               wvid = "_with-vdo";
               if(d.tweet.extended_entities.media.length==2) mode = "-double-"+((z==0)?"1st"+wvid:"2nd"+wvid);
               if(d.tweet.extended_entities.media.length==3) mode = "-triple-"+((z==0)?"1st"+wvid:((z==1)?"2nd"+wvid:"3rd"+wvid));
               if(d.tweet.extended_entities.media.length==4) mode = "-forth-"+((z==0)?"1st"+wvid:((z==1)?"2nd"+wvid:((z==2)?"3rd"+wvid:"4th"+wvid)));

                 for(k=0; k<r.tweet.description.length; k++)
                 {
                    if(d.tweet.extended_entities.media[z].media_url.substring(d.tweet.extended_entities.media[z].media_url.lastIndexOf("\/")+1) === r.tweet.description[k].media_url.substring(r.tweet.description[k].media_url.lastIndexOf("\/")+1))
                    {
                       urlRegex = /(https?:\/\/[^\s]+)/g;
                       temps = r.tweet.description[k].full_text;
                       if(temps.match(urlRegex)!==null)
                       {
                         t = temps.match(urlRegex);
                         if(t.length>0)
                         {
                         t.forEach(e => {
                           temps = temps.replace(e, "<a target=\"_blank\" class=\"default-link\" href=\""+e+"\">"+e.substring(0,40)+((e.length>40)?"...":"")+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                           });
                         }
                       }

                       if(typeof(r.tweet.description[k].index)!='undefined' && z == r.tweet.description[k].index)
                      desc[r.tweet.description[k].index] = "<div index=\""+r.tweet.description[k].index+"\" class=\"alt-left"+mode+"\">ALT<span id=\"alt-txt\">"+temps+"</span></div>";
                    
                    if(typeof(r.tweet.description[k].index)=='undefined')
                       desc[desc.length] = "<div class=\"alt-left\">ALT<span id=\"alt-txt\">"+temps+"</span></div>";

                  }
                 }
              });
            }

           if(d.tweet.extended_entities.media.length==1)
           {
             iTxt += "<div class=\"single_img-prev\"><img id=\"img-prev_single\" src=\""+imgFname+"\"/>";
           }
           else if(d.tweet.extended_entities.media.length==2)
           {
             if(d.tweet.extended_entities.media.filter(e=>e.type=="video" || e.type=="animated_gif").length>0)
               idName = "_with-vdo";
              if(z==0)
                iTxt += "<div class=\"double_img-prev\"><img class=\"img-prev_double-1st"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
              else 
                iTxt += "<img class=\"img-prev_double-2nd"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
           }
           else if(d.tweet.extended_entities.media.length==3)
          {
            if(d.tweet.extended_entities.media.filter(e=>e.type=="video" || e.type=="animated_gif").length>0)
               idName = "_with-vdo";
            if(z==0)
              iTxt += "<div class=\"triple_img-prev\"><img class=\"img-prev_triple-1st"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
            else if(z==1)
              iTxt += "<img class=\"img-prev_triple-2nd"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
            else 
              iTxt += "<img class=\"img-prev_triple-3rd"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
          }
          else if(d.tweet.extended_entities.media.length==4)
          {
            if(d.tweet.extended_entities.media.filter(e=>e.type=="video" || e.type=="animated_gif").length>0)
               idName = "_with-vdo";
            if(z==0)
              iTxt += "<div class=\"forth_img-prev\"><img class=\"img-prev_forth-1st"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
            else if(z==1)
              iTxt += "<img class=\"img-prev_forth-3rd"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
            else if(z==2)
              iTxt += "<img class=\"img-prev_forth-2nd"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
            else 
              iTxt += "<img class=\"img-prev_forth-4th"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
          }
        }
        }
  }
  if(typeof(iTxt)!='undefined' && iTxt.length>0)
  {
      if(typeof(idName)=='undefined')
      {
        txt = txt.replace(d.tweet.entities.media[0].url, iTxt+desc.join("")+((d.tweet.extended_entities.media.length>2)?"<div class=\"clearfix\"></div></div>":"</div>")).replace(/(\r\n|\r|\n)/g, "<br/>");
      }
      else
      {
        if(window.optStats.cache.filter(e=>e.id==d.tweet.id).length==0)
          window.optStats.cache.push({ "id" : d.tweet.id, "content" : iTxt+"<!--template-->"+desc.join("").replace(/(\r\n|\r|\n)/g, "<br/>")+((d.tweet.extended_entities.media.length>2)?"<div class=\"clearfix\"></div></div>":"</div>") });;
      }
      delete iTxt;
      delete desc;
      delete idName;
    }
  }
  return txt;
  }
}

function appendPosts(txt, d)
{
  if(txt.length>0 && typeof(d.tweet)!='undefined')
  {
     dates = d.tweet.created_at.split(" ");
     realDate = new Date(Date.parse(dates[1]+" "+dates[2]+", "+dates[5]+" "+dates[3]));
     template = "";
     displayName = (d.tweet.full_text.substring(0,4)=="RT @")?((window.matchMedia("(max-width: 767px)").matches)?((d.tweet.entities.user_mentions[0].name.length>12)?d.tweet.entities.user_mentions[0].name.substring(0,12)+"...":((d.tweet.entities.user_mentions[0].name.length>0)?d.tweet.entities.user_mentions[0].name:d.tweet.entities.user_mentions[0].screen_name)):((d.tweet.entities.user_mentions[0].name.length>0)?d.tweet.entities.user_mentions[0].name:d.tweet.entities.user_mentions[0].screen_name)):((window.matchMedia("(max-width: 767px)").matches)?((window.__THAR_CONFIG.userInfo.displayName.length>12)?window.__THAR_CONFIG.userInfo.displayName.substring(0,12)+"...":window.__THAR_CONFIG.userInfo.displayName):(window.__THAR_CONFIG.userInfo.displayName));
     displayUserName = (d.tweet.full_text.substring(0,4)=="RT @")?((window.matchMedia("(max-width: 380px)").matches)?((d.tweet.entities.user_mentions[0].screen_name.length>5)?d.tweet.entities.user_mentions[0].screen_name.substring(0,4)+"...":d.tweet.entities.user_mentions[0].screen_name):(d.tweet.entities.user_mentions[0].screen_name)):((window.matchMedia("(max-width: 380px)").matches)?((window.__THAR_CONFIG.userInfo.userName.length>5)?window.__THAR_CONFIG.userInfo.userName.substring(0,4)+"...":window.__THAR_CONFIG.userInfo.userName):(window.__THAR_CONFIG.userInfo.userName));
     children = window.YTD.tweets.part0.filter(c => c.tweet.in_reply_to_status_id==d.tweet.id);

     template += "<div id=\"row_"+d.tweet.id+"\" class=\"tweet-post\"><div class=\"col-lg-6 px-0\">"+((d.tweet.full_text.substring(0,2)=="RT")?"<div class=\"retweeted\"><i class=\"fa fa-retweet status\"></i><span>Retweeted from "+((typeof(d.tweet.entities.user_mentions[0].name)!='undefined' && d.tweet.entities.user_mentions[0].name.length>0)?d.tweet.entities.user_mentions[0].name:d.tweet.entities.user_mentions[0].screen_name)+"</span></div>":"")+"<div class=\"tweet-post-avatar\"><img id=\"avatar-post-logo\" width=\"44px\" height=\"44px\" src=\""+window.optStats.avatar_logo+"\"></div><div class=\"tweet-connector"+((typeof(d.tweet.in_reply_to_status_id)=='undefined')?" standalone\"":" standalone\"");
     template += "><div class=\"tweet-post-acc\"><span style=\"font-weight:bold; margin-right:10px\">"+displayName+"</span><span class=\"common-text greyed-text\">@"+displayUserName+" • "+realDate.toLocaleString("en-US",{ month : 'short', day : 'numeric', year : 'numeric' })+"</span></div><p class=\"common-text tweet-post-content\"><span class=\"main-content\">"+txt.replace(/(\r\n|\r|\n)/g,"<br/>");
     template += "</span></p><p class=\"tweet-post-action common-text\"><ul class=\"post-action-btn\"><li><a class=\"fa fa-comment-o\"><span>"+((typeof(children)!=='undefined')?children.length:"0")+"</span></a></li><li><a class=\"fa fa-retweet\"><span>"+((d.tweet.retweet_count>999)?(d.tweet.retweet_count/1000)+"K":d.tweet.retweet_count)+"</span></a></li><li><a class=\"fa "+((d.tweet.favorite_count>0)?"fa-heart":"fa-heart-o")+"\"><span>"+((d.tweet.favorite_count>999)?(d.tweet.favorite_count/1000)+"K":d.tweet.favorite_count)+"</span></a></li><li class=\"dropdown action-btn-last\"><a data-bs-toggle=\"dropdown\" role=\"link\" aria-expanded=\"false\" class=\"fa fa-share-alt\"></a><div class=\"dropdown-menu dropdown-menu-end\"><div id=\""+((typeof(d.tweet.id)!='undefined')?d.tweet.id:"")+"a\" screenName=\""+((d.tweet.entities.user_mentions.length>0)?d.tweet.entities.user_mentions[0].screen_name:window.__THAR_CONFIG.userInfo.userName)+"\"><a id=\""+((typeof(d.tweet.id)!='undefined')?d.tweet.id:"")+"\" class=\"dropdown-item\" onclick=\"javascript:setMenu(this)\"><i class=\"fa fa-link\"></i>Open On Twitter</a></div><div id=\""+((typeof(d.tweet.id)!='undefined')?d.tweet.id:"")+"c\"><a class=\"dropdown-item\" onclick=\"javascript:setMenu(this)\"><i class=\"fa fa-info-circle\"></i>Show Tweet Id</a></div></div></li></ul></p></div></div><div class=\"clearfix\"></div></div>";
    return template;
  }
}

function setImgPrev()
{
  $("img#img-prev_single").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $(".image-viewer").on("click", function(){
     $(".image-viewer").css("visibility", "hidden");
     if($(this).html().indexOf("<video")>-1)
     {
       $(this).html("<img src=\"\"/>");
     }
     else
     {
       $(this).css('background-image', '');
       $(this).css("background-color", "#0f0f0e")
     }
  });
  $(".double_img-prev img").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $(".triple_img-prev img").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $(".double_img-prev_with-vdo img").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $(".triple_img-prev_with-vdo img").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $(".forth_img-prev_with-vdo img").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $(".forth_img-prev img").click(function() {
     $(".image-viewer").css("background-image", "url("+$(this).attr("src")+")");
     $(".image-viewer").css("visibility", "visible");
  });
  $("div[class|=alt-left]").on("click", function() {
    txt = $($(this).html().replace("ALT", "")).html();
    $('.imgdesc .imgdescription').html(txt);
    if(isMobile())
    {
      $('.imgdesc').show().css( {'visibility': 'visible', 'opacity': 0, 'bottom': '-100px' } ).animate( { 'opacity': '1', 'bottom' : 0 }, 800 );
    }
    else
    {
      if(window.optStats.orientation==0)
        $('.imgdesc').show().css( {'visibility': 'visible', 'height' : '600px', 'opacity': 0.3 } ).animate( { 'opacity': '1'}, 800 );
      else if(window.optStats.orientation==90)
        $('.imgdesc').show().css( {'visibility': 'visible', 'height' : '380px', 'opacity': 0.3 } ).animate( { 'opacity': '1'}, 800 );
    }
  });
  $("div[class|=alt-gif]").on("click", function() {
    txt = $($(this).html().replace("ALT", "")).html();
    $('.imgdesc .imgdescription').html(txt);
    if(isMobile())
    {
      $('.imgdesc').show().css( {'visibility': 'visible', 'opacity': 0, 'bottom': '-100px' } ).animate( { 'opacity': '1', 'bottom' : 0 }, 800 );
    }
    else
    {
      if(window.optStats.orientation==0)
        $('.imgdesc').show().css( {'visibility': 'visible', 'height' : '600px', 'opacity': 0.3 } ).animate( { 'opacity': '1'}, 800 );
      else if(window.optStats.orientation==90)
        $('.imgdesc').show().css( {'visibility': 'visible', 'height' : '380px', 'opacity': 0.3 } ).animate( { 'opacity': '1'}, 800 );
    }
  });
  $(".btnplate button").click(function(){
    $(".imgdesc").css("visibility", "hidden");
  });
  $("video[class^=vdo_tag]").click(function(){
    if($(this).attr("type")=="gif" && Boolean($(this).attr("previewable"))==true)
    {
      //Math.ceil($('html').css('max-width')/)
      $(".image-viewer").css("background-color", '#0f0f0e');
      $(".image-viewer").html("<video autoplay loop muted width=\"100%\" style=\"margin:0 auto;position:absolute;top:50%;left:50%;-ms-transform: translate(-50%, -50%);transform: translate(-50%, -50%);\">"+$(this).html()+"</video>");
      $(".image-viewer").css("visibility", "visible");
    }
  })
}

function NumFormat(nStr)
{
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    if(x[0].length>4) return x[0]/1000 + "K";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function grabDBinfo()
{
  if(window.optStats.stats.total_data==0)
     window.optStats.stats.total_data = window.YTD.tweets.part0.length;
  
  if(window.optStats.stats.total_post==0)
     window.optStats.stats.total_post = window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,4)!=="RT @" && e.tweet.full_text.substring(0,1)!=="@").length;
  
  if(window.optStats.stats.total_retweet==0)
     window.optStats.stats.total_retweet = window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,4)=="RT @").length;
  
  if(window.optStats.stats.total_replies==0)
     window.optStats.stats.total_replies = window.YTD.tweets.part0.filter(e => typeof(e.tweet.in_reply_to_user_id)!=='undefined' && e.tweet.full_text.substring(0,1)=="@").length;
  
  if(window.optStats.stats.post_with_media==0)
     window.optStats.stats.post_with_media = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,2)!="RT" && e.tweet.full_text.substring(0,1)!="@" && typeof(e.tweet.extended_entities)!='undefined').length;
  
  if(window.optStats.stats.post_text==0)
     window.optStats.stats.post_text = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,2)!="RT" && e.tweet.full_text.substring(0,1)!="@" && typeof(e.tweet.extended_entities)=='undefined').length;
  
  if(window.optStats.stats.retweet_with_media==0)
     window.optStats.stats.retweet_with_media = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,4)=="RT @" && typeof(e.tweet.extended_entities)=='undefined').length;
  
  if(window.optStats.stats.retweet_text==0)
     window.optStats.stats.retweet_text = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,4)=="RT @" && typeof(e.tweet.extended_entities)!=='undefined').length;
  
  if(window.optStats.stats.reply_with_media==0)
     window.optStats.stats.reply_with_media = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,1)=="@" && typeof(e.tweet.extended_entities)!='undefined').length;
  
  if(window.optStats.stats.reply_text==0)
    window.optStats.stats.reply_text = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,1)=="@" && typeof(e.tweet.extended_entities)=='undefined').length;
    
  if(window.optStats.stats.post_videos==0)
    window.optStats.stats.post_videos = window.YTD.tweets.part0.filter(e=> e.tweet.full_text.substring(0,1)!="@" && e.tweet.full_text.substring(0,2)!="RT" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.filter(a=>a.type=="video").length>0).length;
     
  if(window.optStats.stats.post_images==0)
    window.optStats.stats.post_images = window.YTD.tweets.part0.filter(e=> e.tweet.full_text.substring(0,1)!="@" && e.tweet.full_text.substring(0,2)!="RT" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.filter(a=>a.type=="video").length==0).length;
    
  if(window.optStats.stats.reply_videos==0)
    window.optStats.stats.reply_videos = window.YTD.tweets.part0.filter(e=> e.tweet.full_text.substring(0,1)=="@" && e.tweet.full_text.substring(0,2)!="RT" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.filter(a=>a.type=="video").length>0).length;
     
  if(window.optStats.stats.reply_images==0)
    window.optStats.stats.reply_images = window.YTD.tweets.part0.filter(e=> e.tweet.full_text.substring(0,1)=="@" && e.tweet.full_text.substring(0,2)!="RT" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.filter(a=>a.type=="video").length==0).length;
    
  if(window.optStats.stats.retweet_videos==0)
     window.optStats.stats.retweet_videos = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,2)=="RT" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.filter(a=>a.type=="video").length>0).length;
     
  if(window.optStats.stats.retweet_images==0)
     window.optStats.stats.retweet_images = window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,2)=="RT" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.filter(a=>a.type=="video").length==0).length;
     
  //alert("Jumlah post video : "+window.optStats.stats.post_videos+"\nJumlah post images : "+window.optStats.stats.post_images+"\nJumlah reply video : "+window.optStats.stats.reply_videos+"\nJumlah reply images : "+window.optStats.stats.reply_images+"\nJumlah retweet video : "+window.optStats.stats.retweet_videos+"\nJumlah retweet images : "+window.optStats.stats.retweet_images)
}

function preparePosts(page=1, refresh=false)
{
  //Refresh is a total reset on all filters
  if(Boolean(refresh)==true)
  {
    resetMenuState();
    $(".tab-content #nav-tweets #tweets-data").empty();
    delete window.YTD.tweets.part0;
    delete window.YTD.like.part0;
  }
  if(typeof(window.__THAR_CONFIG.dataTypes.tweets.files[0].fileName)!=='undefined' && (window.optStats.active_tab=="tweets" || window.optStats.active_tab=="replies"))
  {
    dir = window.optStats.data_folder.split("/");
    tweetJS = dir[0]+"/"+window.__THAR_CONFIG.dataTypes.tweets.files[0].fileName.substring(window.__THAR_CONFIG.dataTypes.tweets.files[0].fileName.lastIndexOf("/")+1);
    unloadJS(tweetJS);
    if(window.YTD.tweets.part0.length==0)
    {
      /* loaded at initial load */
       loadJS(tweetJS, function() 
       {
         if(window.YTD.tweets.part0.length>0)
         {
           if(window.optStats.data_order.toLowerCase()=="asc")
           {
              window.YTD.tweets.part0.sort((a, b) => {
                let s = a.tweet.created_at.split(" ");
                    dat = new Date(Date.parse(s[1]+" "+s[2]+", "+s[5]+" "+s[3])).getTime()/1000;
                    e = b.tweet.created_at.split(" ");
                    dbt = new Date(Date.parse(e[1]+" "+e[2]+" "+e[5]+" "+e[3])).getTime()/1000;
                 
                 if(dbt > dat)  
                    return -1;
                 if(dbt < dat)
                    return 1;
                 return 0;
              });
              if(window.YTD.retweets.part0.length>0)
              {
                window.YTD.retweets.part0.sort((a, b) => {
                let s = a.tweet.created_at.split(" ");
                    dat = new Date(Date.parse(s[1]+" "+s[2]+", "+s[5]+" "+s[3])).getTime()/1000;
                    e = b.tweet.created_at.split(" ");
                    dbt = new Date(Date.parse(e[1]+" "+e[2]+" "+e[5]+" "+e[3])).getTime()/1000;
                 
                 if(dbt > dat)  
                    return -1;
                 if(dbt < dat)
                    return 1;
                 return 0;
                });
              }
           }
           else if(window.optStats.data_order.toLowerCase()=="desc")
           {
             window.YTD.tweets.part0.sort((a, b) => {
                 let s = a.tweet.created_at.split(" ");
                    dat = new Date(Date.parse(s[1]+" "+s[2]+", "+s[5]+" "+s[3])).getTime()/1000;
                    e = b.tweet.created_at.split(" ");
                    dbt = new Date(Date.parse(e[1]+" "+e[2]+" "+e[5]+" "+e[3])).getTime()/1000;
                 if(dbt > dat)  
                    return 1;
                 if(dbt < dat)
                    return -1;
                 return 0;
              });
              if(window.YTD.retweets.part0.length>0)
              {
                window.YTD.retweets.part0.sort((a, b) => {
                 let s = a.tweet.created_at.split(" ");
                    dat = new Date(Date.parse(s[1]+" "+s[2]+", "+s[5]+" "+s[3])).getTime()/1000;
                    e = b.tweet.created_at.split(" ");
                    dbt = new Date(Date.parse(e[1]+" "+e[2]+" "+e[5]+" "+e[3])).getTime()/1000;
                 if(dbt > dat)  
                    return 1;
                 if(dbt < dat)
                    return -1;
                 return 0;
                });
              }
           }
           bottom = ((page*window.optStats.displayPerPage)-window.optStats.displayPerPage);
           up = page*window.optStats.displayPerPage;
           grabDBinfo();
           count = 0;
           if(window.optStats.stats.search.tweets.keyword!=null || window.optStats.stats.search.replies.keyword!=null)
           {
             if(window.optStats.active_tab=="tweets" && window.optStats.stats.search.tweets.keyword!==null && window.optStats.stats.search.tweets.active && window.optStats.search_mode)
             {
               window.optStats.stats.search.tweets.found =  window.YTD.tweets.part0.filter(e => (e.tweet.entities.user_mentions.filter(a => a.name.indexOf(window.optStats.stats.search.tweets.keyword) > -1).length>0) || (e.tweet.full_text.includes(window.optStats.stats.search.tweets.keyword.toLowerCase()))).length;
               alert("Ketemu : "+window.optStats.stats.search.tweets.found)
               if(window.optStats.media_only==true)
               {
                if(window.optStats.stats.search.tweets.found>0)
                {
                 temp = ""; idx=0;
                 window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.stats.search.tweets.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)!="@" && typeof(e.tweet.extended_entities)!=='undefined' && e.tweet.extended_entities.media.length>1).forEach(e => {
                  if(count>=bottom && count<up)
                  {
                    src = updateLinks(e);
                    src = updateHashtagUser(src, e);
                    src = updateMedia(src, e, idx);
                    temp += appendPosts(src, e);
                    idx++;
                  }
                  count++;
               });
              } else alert("No records found !!!");
               }
               else
               {
              if(window.optStats.stats.search.tweets.found>0)
              {
               temp = ""; idx=0;
               window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.stats.search.tweets.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)!="@").forEach(e => {
                  if(count>=bottom && count<up)
                  {
                    src = updateLinks(e);
                    src = updateHashtagUser(src, e);
                    src = updateMedia(src, e, idx);
                    temp += appendPosts(src, e);
                    idx++;
                  }
                  count++;
               });
              } else alert("No records found !!!");
               }
             }
             else if(window.optStats.active_tab=="replies" && window.optStats.stats.search.replies.keyword!==null)
             {
               window.optStats.search_term.replies.found = window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.search_term.replies.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)=="@").length;
               
              if(window.optStats.search_term.replies.found>0)
              {
               temp = ""; idx=0;
               window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.search_term.replies.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)=="@").forEach(e => {
                  if(count>=bottom && count<up)
                  {
                    src = updateLinks(e);
                    src = updateHashtagUser(src, e);
                    src = updateMedia(src, e, idx);
                    temp += appendPosts(src, e);
                    idx++;
                  }
                  count++;
               });
              } else alert("No records found !!!");
             }
           }
           else
           {
             //Normal Unfiltered Mode
             if (window.optStats.active_tab=="tweets" || window.optStats.active_tab=="replies") 
             {
               if(window.optStats.active_tab=="tweets")
               {
                 /* Retweets Posts */
                 if(Boolean(window.optStats.retweet_only)==true)
                 {
                   if(Boolean(window.optStats.media_only)==true)
                   {
                     if(window.YTD.retweets.part0.length>0 && window.YTD.retweets.part0.length==window.YTD.tweets.part0.filter(a => a.tweet.full_text.substring(0,4)=="RT @").length)
                     {
                       temp = ""; idx = 0;
                       window.YTD.retweets.part0.filter(e => typeof(e.tweet.extended_entities)!=='undefined').forEach(e => {
                      if(count>=bottom && count<up)
                        {
                          src = updateLinks(e);
                          src = updateHashtagUser(src, e);
                          src = updateMedia(src, e, idx);
                          temp += appendPosts(src, e);
                          idx++;
                        }
                        count++;
                      });
                     }
                     else
                     {
                       temp = ""; idx = 0;
                       window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,4)=="RT @" && typeof(e.tweet.extended_entities)!=='undefined').forEach(e => {
                      if(count>=bottom && count<up)
                        {
                          src = updateLinks(e);
                          src = updateHashtagUser(src, e);
                          src = updateMedia(src, e, idx);
                          temp += appendPosts(src, e);
                          idx++;
                        }
                        count++;
                      });
                     }
                   }
                   else
                   {
                     if(window.optStats.text_only)
                     {
                       if(window.YTD.retweets.part0.length>0 && window.YTD.retweets.part0.length==window.YTD.tweets.part0.filter(a => a.tweet.full_text.substring(0,4)=="RT @").length && window.YTD.retweets.part0.filter(a => typeof(a.tweet.extended_entities)=='undefined').length>0)
                       {
                           temp = ""; idx = 0;
                           window.YTD.retweets.part0.filter(e => typeof(e.tweet.extended_entities)=='undefined').forEach(e=>{
                             if(count>=bottom && count<up)
                           {
                             src = updateLinks(e);
                             src = updateHashtagUser(src, e);
                             src = updateMedia(src, e, idx);
                             temp += appendPosts(src, e);
                             idx++;
                             }
                             count++;
                          });
                       }
                       else
                       {
                          temp = ""; idx = 0;
                          window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,4)=="RT @" && typeof(e.tweet.extended_entities)=='undefined').forEach(e=>{
                           if(count>=bottom && count<up)
                           {
                             src = updateLinks(e);
                             src = updateHashtagUser(src, e);
                             src = updateMedia(src, e, idx);
                             temp += appendPosts(src, e);
                             idx++;
                             }
                             count++;
                          });
                       }
                     }
                     else
                     {
                       if(window.YTD.retweets.part0.length>0 && window.YTD.retweets.part0.length==window.YTD.tweets.part0.filter(a => a.tweet.full_text.substring(0,4)=="RT @").length)
                       {
                         temp = ""; idx = 0;
                          window.YTD.retweets.part0.forEach(e=>{
                           if(count>=bottom && count<up)
                          {
                            src = updateLinks(e);
                            src = updateHashtagUser(src, e);
                            src = updateMedia(src, e, idx);
                            temp += appendPosts(src, e);
                            idx++;
                          }
                          count++;
                       });
                       }
                       else
                       {
                          temp = ""; idx = 0;
                          window.YTD.tweets.part0.filter(e=>e.tweet.full_text.substring(0,4)=="RT @").forEach(e=>{
                           if(count>=bottom && count<up)
                          {
                            src = updateLinks(e);
                            src = updateHashtagUser(src, e);
                            src = updateMedia(src, e, idx);
                            temp += appendPosts(src, e);
                            idx++;
                          }
                          count++;
                       });
                       }
                     }
                   }
                 }
                 else
                 {
                    /* Main Tweets */
                    if(!window.optStats.retweet_only)
                    {
                      temp = ""; idx=0;
                      if(window.optStats.media_only)
                      {
                        window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,1)!="@" && typeof(e.tweet.extended_entities)!='undefined').forEach(e =>
                        {
                          if(count>=bottom && count<up)
                          {
                            src = updateLinks(e)
                            src = updateHashtagUser(src, e);
                            src = updateMedia(src, e, idx);
                            temp += appendPosts(src, e);
                         idx++;
                       }
                       count++;
                      });
                      }
                      else
                      {
                        if(window.optStats.text_only)
                        {
                          temp = ""; idx = 0;
                          window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,1)!="@" && typeof(e.tweet.extended_entities)=='undefined').forEach(e =>
                        {
                          if(count>=bottom && count<up)
                          {
                             src = updateLinks(e);
                             src = updateHashtagUser(src, e);
                             src = updateMedia(src, e, idx);
                             temp += appendPosts(src, e);
                             idx++;
                          }
                          count++;
                        });
                        }
                        else
                        {
                          temp = ""; idx = 0;
                          window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,1)!="@").forEach(e =>
                        {
                          if(count>=bottom && count<up)
                          {
                             src = updateLinks(e);
                             src = updateHashtagUser(src, e);
                             src = updateMedia(src, e, idx);
                             temp += appendPosts(src, e);
                             idx++;
                          }
                          count++;
                        });
                        }
                      }
                    }
                 }
              }
              else if(window.optStats.active_tab=="replies")
            {
               if(window.optStats.stats.search.replies.keyword==null)
               {
                 temp = ""; idx=0;
                 if(window.optStats.media_only==true)
                 {
                 window.YTD.tweets.part0.filter(e => typeof(e.tweet.in_reply_to_user_id)!=='undefined' && e.tweet.full_text.substring(0,1)=="@" && typeof(e.tweet.extended_entities)!='undefined' && e.tweet.extended_entities.media.length>0).forEach(e => {
                   if(count>=bottom && count<up)
                   {
                    src = updateLinks(e);
                    src = updateHashtagUser(src, e);
                    src = updateMedia(src, e, idx);
                    temp += appendPosts(src, e);
                    idx++;
                  }
                  count++;
                 });
                 }
                 else
                 {
                   if(window.optStats.text_only)
                   {
                     window.YTD.tweets.part0.filter(e => typeof(e.tweet.in_reply_to_user_id)!=='undefined' && e.tweet.full_text.substring(0,1)=="@" && typeof(e.tweet.extended_entities)=='undefined').forEach(e => {
                      if(count>=bottom && count<up)
                      {
                        src = updateLinks(e);
                        src = updateHashtagUser(src, e);
                        src = updateMedia(src, e, idx);
                        temp += appendPosts(src, e);
                        idx++;
                      }
                      count++;
                     });
                   }
                   else
                   {
                   window.YTD.tweets.part0.filter(e => typeof(e.tweet.in_reply_to_user_id)!=='undefined' && e.tweet.full_text.substring(0,1)=="@").forEach(e => {
                   if(count>=bottom && count<up)
                   {
                    src = updateLinks(e);
                    src = updateHashtagUser(src, e);
                    src = updateMedia(src, e, idx);
                    temp += appendPosts(src, e);
                    idx++;
                  }
                  count++;
                 });
                   }
                 }
               }
             }
           }
          }
          if(typeof(temp)!='undefined' && temp.length>0)
          {
             if(window.optStats.active_tab=="tweets")
             {
               $(".tab-content #nav-tweets #tweets-data").empty();
               $(".tab-content #nav-tweets #tweets-data").append(temp);
                 delete temp;
             }
             else if(window.optStats.active_tab=="replies")
             {
               $(".tab-content #nav-replies #replies-data").empty();
               $(".tab-content #nav-replies #replies-data").append(temp);
                 delete temp;
             }
             setImgPrev();
          }
          setPagination(page);
          if($(".app-loader").css("visibility")=="visible") $(".app-loader").css("visibility", "hidden");
        }
     });
    }
  }
  if(typeof(window.__THAR_CONFIG.dataTypes.like.files[0].fileName)!=='undefined')
  {
    if(window.optStats.active_tab=="likes")
    {
       likeJS = dir[0]+"/"+window.__THAR_CONFIG.dataTypes.like.files[0].fileName.substring(window.__THAR_CONFIG.dataTypes.like.files[0].fileName.lastIndexOf("/")+1);
       template = "";
       source = "";
       unloadJS(likeJS);
       loadJS(likeJS, function(stat)
       {
          if(stat)
          {
           if(window.optStats.data_order.toLowerCase()=="asc")
           {
              start = window.YTD.like.part0.length;
              end = 0;
           }
           else if(window.optStats.data_order.toLowerCase()=="desc")
           {
             start = 0;
             end = window.YTD.like.part0.length;
           }
           
           const urlRegex = /(https?:\/\/[^\s]+)/g;
           source = "";
           if(window.optStats.stats.search.likes.keyword!=null)
           {
             m=0;
             if(window.YTD.like.part0.length>0)
             {
               do
               {
                 i = start;
                  update_txt = String(window.YTD.like.part0[i].like.fullText).toLowerCase();
                  template = String(window.YTD.like.part0[i].like.fullText);
                  exist = update_txt.includes(window.optStats.stats.search.likes.keyword.toLowerCase());
                  if(exist)
                  {
                    bottom = (page*window.optStats.displayPerPage)-window.optStats.displayPerPage;
                    up = page*window.optStats.displayPerPage;
                    if(m>=bottom && m<up)
                    {
                      if(window.YTD.like.part0[i].like.fullText.match(urlRegex)!==null)
                     {
                       t = window.YTD.like.part0[i].like.fullText.match(urlRegex);
                       if(t.length>0)
                       {
                         t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\""+e+"\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                          });
                       }
                     }
                     usrReg = /(\@[A-Za-z0-9\_\-]+)/g;
                  if(window.YTD.like.part0[i].like.fullText.match(usrReg)!==null)
                  {
                    t = window.YTD.like.part0[i].like.fullText.match(usrReg);
                    if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\"https://twitter.com/"+e.substring(1,e.length)+"\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                     }
                  }
                  
                  usrReg = /(\#[A-Za-z0-9\_\-]+)/g;
                  if(window.YTD.like.part0[i].like.fullText.match(usrReg)!==null)
                  {
                    t = window.YTD.like.part0[i].like.fullText.match(usrReg);
                    if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\"https://twitter.com/search?q="+escape("#")+e.substring(1,e.length)+"&src=typed_query\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                     }
                  }

                  reg = new RegExp("(?<!23)"+window.optStats.stats.search.likes.keyword+"|((?<=.+.>)"+window.optStats.stats.search.likes.keyword+")(?=<\/a>)|(?<=#|>)(?<!%23)"+window.optStats.stats.search.likes.keyword+"(?!\.\")|(?<=[a-zA-Z]+)"+window.optStats.stats.search.likes.keyword, "ig");
                 
                   template = template.replace(reg, "<b><i style=\" color: "+window.optStats.keywordHilite+"\">"+window.optStats.stats.search.likes.keyword+"</i></b>");
                     source += "<div class=\"tweet-post\"><div class=\"col-lg-6 px-0\"><div class=\"retweeted\"><span></span></div><div class=\"tweet-avatar\"><img id=\"avatar-logo\"></div><div class=\"tweet-connector standalone\"><p class=\"common-text tweet-post-content\"><span id=\"likened-tweet\">"+template+"</span></p><p class=\"tweet-post-action common-text\"><ul class=\"post-action-btn\"><li><a class=\"fa fa-comment-o\"><span></span></a></li><li><a class=\"fa fa-retweet\"><span></span></a></li><li><a class=\"fa fa-heart\" style=\"color:red\"><span></span></a></li><li class=\"dropdown action-btn-last like-menu\"><a data-bs-toggle=\"dropdown\" role=\"link\" aria-expanded=\"false\" class=\"fa fa-share-alt\"></a><div class=\"dropdown-menu dropdown-menu-end\"><div id=\""+window.YTD.like.part0[i].like.expandedUrl+"\"><a class=\"dropdown-item\"><i class=\"fa fa-link\"></i>Open on twitter</a></div><div id=\""+window.YTD.like.part0[i].like.tweetId+"\"><a class=\"dropdown-item\"><i class=\"fa fa-info-circle\"></i>Show tweet id</a></div></div></li></ul></p></div></div><div class=\"clearfix\"></div></div>";
                    }
                    m++;
                  }
                  if(end==0) start--;
                  else start++;
                } while (start!==end);
                
                $(".tab-content #nav-like #like-data").empty();
                $(".tab-content #nav-like #like-data").append(source);
                window.optStats.stats.search.likes.found = m;
                $(".like-menu .dropdown-menu a").click(function(){
                  if(String($(this).parent().attr("id")).substring(0,4)=="http")
                     window.open($(this).parent().attr("id"));
               });
               setPagination(page);
               delete window.YTD.like.part0;
             }
           }
           else if(window.optStats.stats.search.likes.keyword==null)
           {
             if(window.optStats.stats.total_likes>0)
             {
               bottom = ((end==0)?(window.YTD.like.part0.length-(page*window.optStats.displayPerPage)):((page*window.optStats.displayPerPage)-window.optStats.displayPerPage));
               up = ((end==0)?((window.YTD.like.part0.length-(page*window.optStats.displayPerPage))+window.optStats.displayPerPage):(page*window.optStats.displayPerPage));
               count = 0;
               if(bottom<0) bottom = 0;
               if(up>window.YTD.like.part0.length) up = window.YTD.like.part0.length;
               
               do
               {
                 i = start;
                 if(start>=bottom && start<up)
                 {
                  
                  if(typeof(window.YTD.like.part0[i].like.full_name)!='undefined' && typeof(window.YTD.like.part0[i].like.source_url)!='undefined' && typeof(window.YTD.like.part0[i].like.media)!='undefined')
                  {
                    template = window.YTD.like.part0[i].like.fullText;
                    
                    if(typeof(window.YTD.like.part0[i].like.urls)!='undefined')
                  {
                    for(m=0; m<window.YTD.like.part0[i].like.urls.length; m++)
                    {
                      template = template.replace(window.YTD.like.part0[i].like.urls[m].url, "<a href=\""+window.YTD.like.part0[i].like.urls[m].expanded_url+"\">"+window.YTD.like.part0[i].like.urls[m].displayed_url+"</a>");
                    }
                    if(window.YTD.like.part0[i].like.media.length>0)
                    {
                      for(z=0; z<window.YTD.like.part0[i].like.media.length; z++)
                     template = template.replace(window.YTD.like.part0[i].like.media[z].url, "<img id=\"img-prev_single\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[0].filename+"\" />");
                    }
                  }
                  else
                  {
                    urlReg = /https:\/\/t.co\/[a-zA-Z0-9\_\.\-]+/igm;
                    regex = new RegExp(urlReg);
                    t = [];
                    t = template.match(regex);
                    if(t.length==1)
                    {
                      if(window.YTD.like.part0[i].like.media.length==1)
                       template = template.replace(t[0], "<img id=\"img-prev_single\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[0].filename+"\" />");
                     if(window.YTD.like.part0[i].like.media.length>1)
                     {
                       img = [];
                       for(z=0; z<window.YTD.like.part0[i].like.media.length; z++)
                     {
                       if(window.YTD.like.part0[i].like.media[z].length==1)
                        template = template.replace(window.YTD.like.part0[i].like.media[z].url, "<img id=\"img-prev_single\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[0].filename+"\" />");
                        if(window.YTD.like.part0[i].like.media.length==2)
                        {
                        if(z==0)
                          img[img.length] = "<img class=\"img-prev_double-1st\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[z].filename+"\" />";
                        else 
                          img[img.length] = "<img class=\"img-prev_double-2nd\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[z].filename+"\" />";
                        }
                        if(window.YTD.like.part0[i].like.media.length==3)
                        {
                          if(z==0)
                          img[img.length] = "<img class=\"img-prev_triple-1st\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[z].filename+"\" />";
                          else if(z==1)
                            img[img.length] = "<img class=\"img-prev_triple-2nd\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[z].filename+"\" />";
                          else if(z==2)
                            img[img.length] = "<img class=\"img-prev_triple-3rd\" src=\"data/likes_media/"+window.YTD.like.part0[i].like.media[z].filename+"\" />";
                        }
                     }
                     if(window.YTD.like.part0[i].like.media.length==2) template = template.replace(window.YTD.like.part0[i].like.media[0].url, 
                     "<div class=\"double_img-prev\">"+img.join("")+"</div>")
                       if(window.YTD.like.part0[i].like.media.length==3) template = template.replace(window.YTD.like.part0[i].like.media[0].url, 
                     "<div class=\"triple_img-prev\">"+img.join("")+"</div>")
                     }
                   }
                   else if(t.length>1)
                   {
                     
                   }
                  }
                  usrReg = /(\@[A-Za-z0-9\_\-]+)/g;
                  if(window.YTD.like.part0[i].like.fullText.match(usrReg)!==null)
                  {
                    t = window.YTD.like.part0[i].like.fullText.match(usrReg);
                    if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\"https://twitter.com/"+e.substring(1,e.length)+"\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                     }
                  }
                  
                  usrReg = /(\#[A-Za-z0-9\_\-]+)/g;
                  if(window.YTD.like.part0[i].like.fullText.match(usrReg)!==null)
                  {
                    t = window.YTD.like.part0[i].like.fullText.match(usrReg);
                    if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\"https://twitter.com/search?q="+escape("#")+e.substring(1,e.length)+"&src=typed_query\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                     }
                  }

                    uname = window.YTD.like.part0[i].like.source_url.split("\/");
                    post_date = new Date(Math.floor(new Date(window.YTD.like.part0[i].like.post_date).getTime()));
                    source += "<div class=\"tweet-post\"><div class=\"col-lg-6 px-0\"><div class=\"tweet-avatar\"><img id=\"avatar-logo\"></div><div class=\"tweet-connector standalone\"><div class=\"tweet-post-acc\"><span style=\"font-weight:bold; margin-right:10px\">"+((window.YTD.like.part0[i].like.full_name.length>10)?window.YTD.like.part0[i].like.full_name.substring(0,9)+"...":window.YTD.like.part0[i].like.full_name)+"</span><span class=\"common-text greyed-text\"><a class=\"default-link\" target=\"_blank\" href=\"https://twitter.com/"+uname[3]+"\">@"+((uname[3].length>8)?uname[3].substring(0,8)+"...":uname[3])+"</a> • "+post_date.toLocaleString("en-US",{ month : 'short', day : 'numeric', year : 'numeric' })+"</span></div><p class=\"common-text tweet-post-content\"><span id=\"likened-tweet\">"+template+"</span></p><p class=\"tweet-post-action common-text\"><ul class=\"post-action-btn\"><li><a class=\"fa fa-comment-o\"><span>"+((window.YTD.like.part0[i].like.reply_count>0)?NumFormat(window.YTD.like.part0[i].like.reply_count):"")+"</span></a></li><li><a class=\"fa fa-retweet\"><span>"+((window.YTD.like.part0[i].like.retweet_count>0)?NumFormat(window.YTD.like.part0[i].like.retweet_count):"")+"</span></a></li><li><a class=\"fa fa-heart\" style=\"color:red\"><span>"+NumFormat(window.YTD.like.part0[i].like.like_count)+"</span></a></li><li class=\"dropdown action-btn-last like-menu\"><a data-bs-toggle=\"dropdown\" role=\"link\" aria-expanded=\"false\" class=\"fa fa-share-alt\"></a><div class=\"dropdown-menu dropdown-menu-end\"><div id=\""+window.YTD.like.part0[i].like.source_url+"\"><a class=\"dropdown-item\"><i class=\"fa fa-link\"></i>Open on twitter</a></div><div id=\""+window.YTD.like.part0[i].like.tweetId+"\"><a class=\"dropdown-item\"><i class=\"fa fa-info-circle\"></i>Show tweet id</a></div></div></li></ul></p></div></div><div class=\"clearfix\"></div></div>";
                  }
                  else
                  {
                    template = window.YTD.like.part0[i].like.fullText;
                    if(typeof(window.YTD.like.part0[i].like.urls)!='undefined')
                  {
                    for(m=0; m<window.YTD.like.part0[i].like.urls.length; m++)
                    {
                      template = template.replace(window.YTD.like.part0[i].like.urls[m].url, "<a href=\""+window.YTD.like.part0[i].like.urls[m].expanded_url+"\">"+window.YTD.like.part0[i].like.urls[m].displayed_url+"</a>");
                    }
                  }
                  else
                  {
                    if(window.YTD.like.part0[i].like.fullText.match(urlRegex)!==null)
                  {
                     t = window.YTD.like.part0[i].like.fullText.match(urlRegex);
                     if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\""+e+"\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                      }
                  }
                  }
                  usrReg = /(\@[A-Za-z0-9\_\-]+)/g;
                  if(window.YTD.like.part0[i].like.fullText.match(usrReg)!==null)
                  {
                    t = window.YTD.like.part0[i].like.fullText.match(usrReg);
                    if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\"https://twitter.com/"+e.substring(1,e.length)+"\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                     }
                  }
                  
                  usrReg = /(\#[A-Za-z0-9\_\-]+)/g;
                  if(window.YTD.like.part0[i].like.fullText.match(usrReg)!==null)
                  {
                    t = window.YTD.like.part0[i].like.fullText.match(usrReg);
                    if(t.length>0)
                     {
                       t.forEach(e => {
                          template = template.replace(e, "<a target=\"_blank\" href=\"https://twitter.com/search?q="+escape("#")+e.substring(1,e.length)+"&src=typed_query\">"+e+"</a>").replace(/(\r\n|\r|\n)/g, "<br/>");
                        });
                     }
                  }
                     source += "<div class=\"tweet-post\"><div class=\"col-lg-6 px-0\"><div class=\"retweeted\"><span></span></div><div class=\"tweet-avatar\"><img id=\"avatar-logo\"></div><div class=\"tweet-connector standalone\"><p class=\"common-text tweet-post-content\"><span id=\"likened-tweet\">"+template+"</span></p><p class=\"tweet-post-action common-text\"><ul class=\"post-action-btn\"><li><a class=\"fa fa-comment-o\"><span></span></a></li><li><a class=\"fa fa-retweet\"><span></span></a></li><li><a class=\"fa fa-heart\" style=\"color:red\"><span></span></a></li><li class=\"dropdown action-btn-last like-menu\"><a data-bs-toggle=\"dropdown\" role=\"link\" aria-expanded=\"false\" class=\"fa fa-share-alt\"></a><div class=\"dropdown-menu dropdown-menu-end\"><div id=\""+window.YTD.like.part0[i].like.expandedUrl+"\"><a class=\"dropdown-item\"><i class=\"fa fa-link\"></i>Open on twitter</a></div><div id=\""+window.YTD.like.part0[i].like.tweetId+"\"><a class=\"dropdown-item\"><i class=\"fa fa-info-circle\"></i>Show tweet id</a></div></div></li></ul></p></div></div><div class=\"clearfix\"></div></div>";
                  }
                 }
                 count++;
                 if(end==0) start--;
                 else if(end==window.YTD.like.part0.length) start++;
               } while (count <= window.YTD.like.part0.length);

               $(".tab-content #nav-like #like-data").empty();
               $(".tab-content #nav-like #like-data").append(source);
               $(".like-menu .dropdown-menu a").click(function(){
                  if(String($(this).parent().attr("id")).substring(0,4)=="http")
                     window.open($(this).parent().attr("id"));
               });
               setImgPrev();
               setPagination(page);
               delete window.YTD.like.part0;
             }
           }
          }
       });
    }
    else
    {
      unloadJS(window.__THAR_CONFIG.dataTypes.like.files[0].fileName);
       loadJS(window.__THAR_CONFIG.dataTypes.like.files[0].fileName, function(stat)
       {
         if(stat) window.optStats.stats.total_likes = window.YTD.like.part0.length;
       });
    }
  }
}

$(document).ready(function ()
{
  startLoader();
    /* if document ready check manifest.js loaded status */
    if(typeof(window.__THAR_CONFIG)!=='undefined') {
      /* write real Account Name */
      $("div.info .title").text(window.__THAR_CONFIG.userInfo.displayName);
      /* write username */
      $("div.info .user").text("@"+window.__THAR_CONFIG.userInfo.userName);
      /* update button click url to respective user */
      $("button.btnFollow").click(function(){
        location.href='https://twitter.com/intent/user?user_id='+window.__THAR_CONFIG.userInfo.accountId;
      });
      /* make sure folder data is closed with slash */
      if(window.optStats.data_folder.substring(window.optStats.data_folder.lastIndexOf("\/")+1)!=="") window.optStats.data_folder = window.optStats.data_folder+"/";
      if(window.optStats.profile_folder.substring(window.optStats.profile_folder.lastIndexOf("\/")+1)!=="") window.optStats.profile_folder = window.optStats.profile_folder+"/";
      /* check profile.js json data on manifest.js */
      loadJS( window.__THAR_CONFIG.dataTypes.profile.files[0].fileName, function(){
          if(window.YTD.profile.part0.length>0  && typeof(window.YTD.profile.part0[0].profile.description.bio)!=='undefined')
          {
            /* get fileName of image header */
            fragments = String(window.YTD.profile.part0[0].profile.headerMediaUrl).split("/");
            fileName = window.optStats.profile_folder+window.__THAR_CONFIG.userInfo.accountId+"-"+fragments[fragments.length-1];
            /* validate each image file type & the validity of existing file */
            FileExists(fileName+".jpg", null, function(e, va, fn)
            {
              if(e==true) 
              {
                $("div.card.hovercard .cardheader").css("background-image", "url(\""+fileName+".jpg\")");
              }
              else 
              {
                FileExists(fileName+".jpeg", null, function(e, va, fn)
                {
                   if(e)
                   {
                       $("div.card.hovercard .cardheader").css("background-image", "url(\""+fileName+".jpeg\")");
                   }
                   else 
                   {
                     FileExists(fileName+".png", null, function(e,va,fn)
                     {
                        if(e)
                        {
                           $("div.card.hovercard .cardheader").css("background-image", "url(\""+fileName+".png\")");
                        }
                        else 
                        {
                          FileExists(fileName+".webp",null, function(e,va,fn)
                       {
                          if(e)
                          {
                             $("div.card.hovercard .cardheader").css("background-image", "url(\""+fileName+".webp\")");
                          }
                         });
                        }
                     });
                   }
                });
              }
            });
            /* get avatar image file from profile.js */
            frag = String(window.YTD.profile.part0[0].profile.avatarMediaUrl).split("/");
            avaName = window.optStats.profile_folder+window.__THAR_CONFIG.userInfo.accountId+"-"+frag[frag.length-1];
            FileExists(avaName, null, function(e,va,fn)
            {
              if(e==true) 
              {
                $("#avatar-logo").css("content", "url(\""+avaName+"\")");
                window.optStats.avatar_logo = avaName;
              }
            });
            $("div.info .desc").text(window.YTD.profile.part0[0].profile.description.bio);
            if(window.YTD.profile.part0[0].profile.description.website.length>0)
               $("ul.details li.fa-globe span").html("<a target=\"_blank\" href=\""+window.YTD.profile.part0[0].profile.description.website+"\">"+window.YTD.profile.part0[0].profile.description.website.replace(/(https?|http):\/\//gi, "")+"</a>");
            else $("ul.details .fa-globe").remove();
            if(window.YTD.profile.part0[0].profile.description.location.length>0)
               $("ul.details .fa-map-marker span").text(window.YTD.profile.part0[0].profile.description.location);
            else $("ul.details .fa-map-marker").remove();
            
            /* update followers & following data */
            if(window.__THAR_CONFIG.dataTypes.following.files.length>0)
            {
              loadJS(window.__THAR_CONFIG.dataTypes.following.files[0].fileName, function() {
                 if(window.YTD.following.part0.length>0)
                 {
                   $("li.following").val(window.YTD.following.part0.length);
                 }
              });
            }
            if(window.__THAR_CONFIG.dataTypes.follower.files.length>0)
            {
              loadJS(window.__THAR_CONFIG.dataTypes.follower.files[0].fileName, function()
              {
                 if(window.YTD.follower.part0.length>0)
                 {
                   $("li.followers").val(window.YTD.follower.part0.length);
                 }
              });
            }
          }
      });
      /* get account details on account.js */
      loadJS(window.__THAR_CONFIG.dataTypes.account.files[0].fileName, function(e)
      {
        if(window.YTD.account.part0.length>0  && typeof(window.YTD.account.part0[0].account.createdAt)!=='undefined')
          {
            dt = new Date(window.YTD.account.part0[0].account.createdAt.substring(0,10));
            $("ul.details li.fa-calendar span").text("Joined "+dt.toLocaleString("en-US", { month : 'short', year : 'numeric' }));
          }
      });
      $(".imgdesc").css("visibility", "hidden");
      window.YTD.account.part0 = [];
      preparePosts();
      InitiateButton();
    }
    else 
    {
      alert("Required file \"data/manifest.js\" not found");
      $(".app-loader").css('visibility','hidden');
      $("div[class^=alt-left]").on("click", function() {
        $('.imgdesc').show().css( {'visibility': 'visible', 'opacity': 0, 'bottom': '-100px' } ).animate( { 'opacity': '1', 'bottom' : 0 }, 1000 );
      });
      $(".btnplate button").click(function(){
        $(".imgdesc").css("visibility", "hidden");
      });
    }
    //
    $(".dropdown.action-btn-last .dropdown-menu .dropdown-menu-end").on("show.bs.dropdown", function() {
       $(this).css("position", "inherit");
    });
    
    //Adjust height if on desktop mode
    $(".tab-content .tab-pane").css("height", $(".tab-content .tab-pane").height()+"px");
    
});
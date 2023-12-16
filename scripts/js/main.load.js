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
  "total_tweets" : 0,
  "tweet_count" : 0,
  "reply_count" : 0,
  "retweet_count" : 0,
  "filtered_count" : 0,
  "like_count" : 0,
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
  "displayPerPage" : 10,
  "iConnected" : window.navigator.onLine,
  "search_term" : {
    "tweets" : {
      "keyword" : null,
      "found" : 0
    },
    "replies" : {
      "keyword" : null,
      "found" : 0
    },
    "likes" : {
      "keyword" : null,
      "found" : 0
    }
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
          if($("span#replies-data").html().length==0) 
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
           window.optStats.search_term.tweets.keyword = null;
           window.optStats.search_term.replies.keyword = null;
           preparePosts();
           $(this).addClass("dropdown-item-checked");
         }
       }
    }
    if(String($(this).html()).indexOf("fa-file-image-o")!==-1)
    {
      if(window.optStats.retweet_only!=true)
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
         if(window.optStats.active_tab=="tweets" || window.optStats.active_tab=="replies")
         {
           window.optStats.media_only = true;
           window.optStats.search_term.tweets.keyword = null;
           window.optStats.search_term.replies.keyword = null;
           preparePosts();
           $(this).addClass("dropdown-item-checked");
         }
       }
      }
    }
    if(String($(this).html()).indexOf("fa-sort-alpha")!==-1)
    {
      if(String($(this).html()).indexOf("fa-sort-alpha-desc")!==-1)
      {
         $(this).html("<i class=\"fa fa-sort-alpha-asc\"></i>Show Oldest First");
         window.optStats.data_order ="desc";
         preparePosts();
      }
      else 
      {
         $(this).html("<i class=\"fa fa-sort-alpha-desc\"></i>Show Newest First");
         window.optStats.data_order = "asc";
         preparePosts();
      }
    }
    if(String($(this).html()).indexOf("fa-refresh")!==-1)
    {
      window.optStats.media_only = false;
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
      }
    }
    if(String($(this).html()).indexOf("fa-search")!==-1)
    {
      showDialog("Search Tweets","","input");
    }
    else if(String($(this).html()).indexOf("fa-gears")!==-1)
    {
      showDialog("Settings", $(".tabular").html(), "settings");
    }
  });
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

function FileExists(url, variable=null, callback=null, idx=-1)
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
        if(variable!==null)
        {
          if(idx>-1)
            callback(true, variable, url, idx);
          else callback(true, variable, url);
        }
        else
        {
          if(idx>-1) callback(true, null, url, idx);
          else callback(true, variable, url);
        }
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

function showDialog(title="Information", message="", type='dialog')
{
  if(type=='dialog') text = message;
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
             window.optStats.search_term.tweets.keyword = $(this).find("input").val();
            if(window.optStats.active_tab=="replies" && $(this).find("input").val().length>0)
             window.optStats.search_term.replies.keyword = $(this).find("input").val();
            if(window.optStats.active_tab=="likes" && $(this).find("input").val().length>0)
             window.optStats.search_term.likes.keyword = $(this).find("input").val();
             if($(this).find("input").val().length>0)
             {
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
       temp = message.replace($(this).parent().html(), "Total records (<i>tweets.js</i>) : <span id=\"total-records\">"+window.optStats.total_tweets+" records</span>");
     if(id=="total-posts")
      temp = temp.replace($(this).parent().html(), "Total tweet posts : <span id=\"total-posts\">"+window.optStats.tweet_count+" records</span>");
     if(id=="total-retweets")
       temp = temp.replace($(this).parent().html(), "Total retweets : <span id=\"total-retweets\">"+window.optStats.retweet_count+" records</span>");
    if(id=="total-replies")
       temp = temp.replace($(this).parent().html(), "Total replies : <span id=\"total-replies\">"+window.optStats.reply_count+" records</span>");
    if(id=="total-likes")
       temp = temp.replace($(this).parent().html(), "Total likes (<i>like.js</i>) : <span id=\"total-likes\">"+window.optStats.like_count+" records</span>");
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
                      else preparePosts(1, true);
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
                      else preparePosts(1, true);
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
}

function setPagination(current=1)
{
   template = "<nav><ul class=\"pagination\">";
   scrolls = "";
   records = 0;
   if((window.optStats.active_tab=="tweets") && !window.optStats.retweet_only && window.optStats.search_term.tweets.keyword==null)
      records = window.optStats.tweet_count+window.optStats.retweet_count;
   if((window.optStats.active_tab=="tweets") && window.optStats.retweet_only && window.optStats.search_term.tweets.keyword==null)
      records = window.optStats.retweet_count;
   if(window.optStats.active_tab=="replies" && window.optStats.search_term.replies.keyword==null)
      records = window.optStats.reply_count;
   if(window.optStats.active_tab=="likes" && window.optStats.search_term.likes.keyword==null)
      records = window.optStats.like_count;
   if(window.optStats.search_term.tweets.keyword!=null || window.optStats.search_term.replies.keyword!=null || window.optStats.search_term.likes.keyword!=null)
   {
     if(window.optStats.active_tab=="tweets")
     {
       if(window.optStats.search_term.tweets.keyword==null)
         records = window.optStats.tweet_count+window.optStats.retweet_count;
       else records = window.optStats.search_term.tweets.found;
     }
     else if(window.optStats.active_tab=="replies")
     {
       if(window.optStats.search_term.replies.keyword==null)
         records = window.optStats.reply_count;
       else records = window.optStats.search_term.replies.found;
     }
     else if(window.optStats.active_tab=="likes" && window.optStats.search_term.likes.keyword!==null)
     {
       records = window.optStats.search_term.likes.found;
     }
   }
   if(window.optStats.media_only==true && window.optStats.active_tab!='likes')
   {
     records = window.optStats.filtered_count;
   }
   if(typeof(records)!=='undefined')
   {
     loop = Math.ceil(records/window.optStats.displayPerPage);
     //alert(records+" > "+loop+" pages");
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

function setMenu(obj)
{
  if(typeof($(obj).parent().attr('screenName'))!=='undefined')
          {
             window.open("https://twitter.com/"+$(obj).parent().attr('screenName')+"/status/"+$(obj).attr("id").substring(0, $(obj).attr("id").length));
          }
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
         if(window.optStats.active_tab=="tweets" && window.optStats.search_term.tweets.keyword!=null && words.toLowerCase().includes(window.optStats.search_term.tweets.keyword.toLowerCase()))
         {
           rep = new RegExp(window.optStats.search_term.tweets.keyword, 'gi');
           return words.replace(rep, "<b><i style=\"color: "+window.optStats.keywordHilite+"\">"+window.optStats.search_term.tweets.keyword+"</i></b>");
         } else if(window.optStats.active_tab=="replies" && window.optStats.search_term.replies.keyword!=null && words.toLowerCase().includes(window.optStats.search_term.replies.keyword.toLowerCase()))
         {
           rep = new RegExp(window.optStats.search_term.replies.keyword, 'gi');
           return words.replace(rep, "<b><i style=\"color: "+window.optStats.keywordHilite+"\">"+window.optStats.search_term.replies.keyword+"</i></b>");
         }
         else if(window.optStats.active_tab=="likes" && window.optStats.search_term.likes.keyword!=null && words.toLowerCase().includes(window.optStats.search_term.likes.keyword.toLowerCase()))
         {
           rep = new RegExp(window.optStats.search_term.likes.keyword, 'gi');
           return words.replace(rep, "<b><i style=\"color: "+window.optStats.keywordHilite+"\">"+window.optStats.search_term.likes.keyword+"</i></b>");
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
          for(var s=0; s<d.tweet.extended_entities.media[z].video_info.variants.length; s++)
          {
            ext = d.tweet.extended_entities.media[z].video_info.variants[s].content_type.split("\/");
            var fName = String(d.tweet.extended_entities.media[z].video_info.variants[s].url).slice(String(d.tweet.extended_entities.media[z].video_info.variants[s].url).lastIndexOf("\/")+1, String(d.tweet.extended_entities.media[z].video_info.variants[s].url).indexOf(ext[1])+ext[1].length);
           var vdoFname = (fName.length>0)?window.optStats.data_folder+d.tweet.id+"-"+fName:"";

           if(vdoFname.trim().length>0)
           {
             FileExists(vdoFname, d.tweet, function(stat, va, file, idx) {
               orient = !navigator.maxTouchPoints ? 'desktop' : !window.screen.orientation.angle ? 'portrait' : 'landscape';
               
              if(Boolean(stat)==true) 
              {
                vh = va.extended_entities.media[0].sizes.small.h;
                vw = va.extended_entities.media[0].sizes.small.w;
                if(vw>vh)
                  vdoTypeClass = "-horizontal";
                else if(vh==vw)
                  vdoTypeClass = "-equal"
                else if(vh>vw)
                  vdoTypeClass = "-vertical";
                if(typeof(window.optStats.temp)!='undefined')
                {
                  if(va.extended_entities.media.length==2)
                   vdoTypeClass += "_double";
                   else if(va.extended_entities.media.length==3)
                   vdoTypeClass += "_triple";
                   else if(va.extended_entities.media.length==4)
                   vdoTypeClass = "_forth";
                }
                if(va.extended_entities.media.length>1)
                {
                  if(va.extended_entities.media.length==2)
                  className = "double_img-prev_with-vdo";
                  else if(va.extended_entities.media.length==3)
                  className = "triple_img-prev_with-vdo";
                  else if(va.extended_entities.media.length==4)
                  className = "forth_img-prev_with-vdo";
                  vdo = "<video class=\"vdo_tag"+vdoTypeClass+"\" controls><source src=\""+file+"\">Your browser does not support video</video>";
                }
                else
                 vdo = "<video class=\"vdo_tag"+vdoTypeClass+"\" controls><source src=\""+file+"\">Your browser does not support video</video>";

                if(window.optStats.active_tab=="tweets")
                {
                  if(typeof(window.optStats.temp)!='undefined')
                  {
                    $(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[0].url, "<div class=\""+className+"\">"+vdo+window.optStats.temp));
                    delete window.optStats.temp;
                    setImgPrev();
                  }
                  else
                  $(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-tweets #tweets-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[0].url, "<br/>"+vdo));
                }
                else if(window.optStats.active_tab=="replies")
                {
                  if(typeof(window.optStats.temp)!='undefined')
                  {
                    $(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[0].url, "<div class=\""+className+"\">"+vdo+window.optStats.temp));
                    delete window.optStats.temp;
                    setImgPrev();
                  }
                  else 
                  $(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html($(".tab-content #nav-replies #replies-data").children('div').eq(idx).find('p').children(":first").html().replace(va.extended_entities.media[0].url, "<br/>"+vdo));
                }
             }
            }, index);
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
               if(d.tweet.extended_entities.media.length==2) mode = "-double-"+((z==0)?"1st":"2nd");
               if(d.tweet.extended_entities.media.length==3) mode = "-triple-"+((z==0)?"1st":((z==1)?"2nd":"3rd"));
               if(d.tweet.extended_entities.media.length==4) mode = "-forth-"+((z==0)?"1st":((z==1)?"2nd":((z==2)?"3rd":"4th")));
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
             if(d.tweet.extended_entities.media.filter(e=>e.type=="video").length>0)
               idName = "_with-vdo";
              if(z==0)
                iTxt += "<div class=\"double_img-prev\"><img class=\"img-prev_double-1st"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
              else 
                iTxt += "<img class=\"img-prev_double-2nd"+(typeof(idName)!='undefined'?idName:"")+"\" src=\""+imgFname+"\"/>";
           }
           else if(d.tweet.extended_entities.media.length==3)
          {
            if(d.tweet.extended_entities.media.filter(e=>e.type=="video").length>0)
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
            if(d.tweet.extended_entities.media.filter(e=>e.type=="video").length>0)
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
      if(d.tweet.extended_entities.media[0].type=="photo")
      {
        txt = txt.replace(d.tweet.entities.media[0].url, iTxt+desc.join("")+((d.tweet.extended_entities.media.length>2)?"<div class=\"clearfix\"></div></div>":"</div>")).replace(/(\r\n|\r|\n)/g, "<br/>");

           delete iTxt;
           delete desc;
           delete idName;
      }
      else
      {
        window.optStats.temp = iTxt;
        delete iTxt;
        delete desc;
        delete idName;
      }
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
  $(".btnplate button").click(function(){
    $(".imgdesc").css("visibility", "hidden");
  });
}

function preparePosts(page=1, refresh=false)
{
  if(Boolean(refresh)==true)
  {
    window.optStats.data_order = "desc";
    window.optStats.retweet_only = false;
    window.optStats.media_only = false;
    window.optStats.search_term.tweets.keyword = null;
    window.optStats.search_term.tweets.found = 0;
    window.optStats.search_term.replies.keyword = null;
    window.optStats.search_term.replies.found = 0;
    window.optStats.search_term.likes.keyword = null;
    window.optStats.search_term.likes.found = 0;
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
           count = 0;
           if(window.optStats.search_term.tweets.keyword!=null || window.optStats.search_term.replies.keyword!=null)
           {
             if(window.optStats.active_tab=="tweets" && window.optStats.search_term.tweets.keyword!==null)
             {
               window.optStats.search_term.tweets.found = window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.search_term.tweets.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)!="@").length;
               if(window.optStats.media_only==true)
               {
                if(window.optStats.search_term.tweets.found>0)
                {
                 temp = ""; idx=0;
                 window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.search_term.tweets.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)!="@" && typeof(e.tweet.extended_entities)!=='undefined' && e.tweet.extended_entities.media.length>1).forEach(e => {
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
              if(window.optStats.search_term.tweets.found>0)
              {
               temp = ""; idx=0;
               window.YTD.tweets.part0.filter(e => e.tweet.full_text.toLowerCase().includes(window.optStats.search_term.tweets.keyword.toLowerCase()) && e.tweet.full_text.substring(0,1)!="@").forEach(e => {
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
             else if(window.optStats.active_tab=="replies" && window.optStats.search_term.replies.keyword!==null)
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
             if (window.optStats.active_tab=="tweets" || window.optStats.active_tab=="replies") 
             {
               window.optStats.total_tweets = window.YTD.tweets.part0.length;
               window.optStats.tweet_count = window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,4)!=="RT @" && e.tweet.full_text.substring(0,1)!=="@").length;
              window.optStats.retweet_count = window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,4)==="RT @").length;
              window.optStats.reply_count = window.YTD.tweets.part0.filter(e => typeof(e.tweet.in_reply_to_user_id)!=='undefined' && e.tweet.full_text.substring(0,1)=="@").length;
           
             if(window.optStats.active_tab=="tweets")
             {
              /* Retweets Posts */
              if(window.optStats.active_tab=="tweets" && Boolean(window.optStats.retweet_only)==true)
              {
               temp = ""; idx = 0;
               if(window.YTD.retweets.part0.length>0)
               {
                 for(k=0; k<window.YTD.retweets.part0.length; k++)
                 {
                  if(k>=bottom && k<up)
                  {
                    e = window.YTD.retweets.part0[k];
                   src = updateLinks(e);
                   src = updateHashtagUser(src, e);
                   src = updateMedia(src, e, idx);
                   temp += appendPosts(src, e);
                   idx++;
                  }
                  else if(k>bottom) break;
                 }
               }
               else
               {
                 window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,4)==="RT @").forEach(e => {
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
             
              /* Main Tweets */
              if(window.optStats.active_tab=="tweets" && !window.optStats.retweet_only)
             {
                temp = ""; idx=0;
                if(window.optStats.media_only==true)
                {
                  if(window.YTD.retweets.part0.length>0)
                  {
                     window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,1)!=="@" && typeof(e.tweet.extended_entities)!=='undefined' && e.tweet.extended_entities.media.length>-1 || e.tweet.full_text.substring(0,2)=="RT").forEach(k =>
                {
                  len = window.YTD.retweets.part0.filter(y => y.tweet.id == k.tweet.id && typeof(y.tweet.extended_entities)!=='undefined' && y.tweet.extended_entities.media.length>-1).length;
                  if(count>=bottom && count<up)
                  {
                    if(len>0)
                    {
                       window.YTD.retweets.part0.filter(y => y.tweet.id == k.tweet.id && typeof(y.tweet.extended_entities)!=='undefined' && y.tweet.extended_entities.media.length>-1).forEach(z => {
                      src = updateLinks(z);
                      src = updateHashtagUser(src, z);
                      src = updateMedia(src, z, idx);
                      temp += appendPosts(src, z);
                      idx++;
                    });
                    }
                    else
                    {
                      if(k.tweet.full_text.substring(0,2)!=="RT")
                      {
                        src = updateLinks(k);
                        src = updateHashtagUser(src, k);
                        src = updateMedia(src, k, idx);
                        temp += appendPosts(src, k);
                        idx++;
                      }
                    }
                  }
                  if(len>0 || typeof(k.tweet.extended_entities)!=='undefined') count++;
                });
                  }
                  else
                  {
                  window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,1)!=="@" && typeof(e.tweet.extended_entities)!=='undefined' && e.tweet.extended_entities.media.length>-1).forEach(e =>
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
                window.optStats.filtered_count = count;
                }
                else
                {
                    window.YTD.tweets.part0.filter(e => e.tweet.full_text.substring(0,1)!=="@").forEach(e =>
                {
                  if(count>=bottom && count<up)
                  {
                    if(e.tweet.full_text.substring(0,2)=="RT")
                    {
                      if(window.YTD.retweets.part0.length>0)
                      {
                        window.YTD.retweets.part0.filter(m => e.tweet.id == m.tweet.id).forEach(z => {
                        src = updateLinks(z);
                        src = updateHashtagUser(src, z);
                        src = updateMedia(src, z, idx);
                        temp += appendPosts(src, z)
                     })
                      }
                      else
                      {
                        src = updateLinks(e);
                        src = updateHashtagUser(src, e);
                        src = updateMedia(src, e, idx);
                        temp += appendPosts(src, e);
                      }
                    }
                    else
                    {
                       src = updateLinks(e);
                       src = updateHashtagUser(src, e);
                       src = updateMedia(src, e, idx);
                       temp += appendPosts(src, e);
                    }
                    idx++;
                  }
                  count++;
                });
                }
             }
           }
             else if(window.optStats.active_tab=="replies")
             {
               if(window.optStats.search_term.replies.keyword==null)
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
                 window.optStats.filtered_count = count;
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
           if(window.optStats.search_term.likes.keyword!=null)
           {
             m=0;
             if(window.YTD.like.part0.length>0)
             {
               do
               {
                 i = start;
                  update_txt = String(window.YTD.like.part0[i].like.fullText).toLowerCase();
                  template = String(window.YTD.like.part0[i].like.fullText);
                  exist = update_txt.includes(window.optStats.search_term.likes.keyword.toLowerCase());
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

                  reg = new RegExp("(?<!23)"+window.optStats.search_term.likes.keyword+"|((?<=.+.>)"+window.optStats.search_term.likes.keyword+")(?=<\/a>)|(?<=#|>)(?<!%23)"+window.optStats.search_term.likes.keyword+"(?!\.\")|(?<=[a-zA-Z]+)"+window.optStats.search_term.likes.keyword, "ig");
                 
                   template = template.replace(reg, "<b><i style=\" color: "+window.optStats.keywordHilite+"\">"+window.optStats.search_term.likes.keyword+"</i></b>");
                     source += "<div class=\"tweet-post\"><div class=\"col-lg-6 px-0\"><div class=\"retweeted\"><span></span></div><div class=\"tweet-avatar\"><img id=\"avatar-logo\"></div><div class=\"tweet-connector standalone\"><p class=\"common-text tweet-post-content\"><span id=\"likened-tweet\">"+template+"</span></p><p class=\"tweet-post-action common-text\"><ul class=\"post-action-btn\"><li><a class=\"fa fa-comment-o\"><span></span></a></li><li><a class=\"fa fa-retweet\"><span></span></a></li><li><a class=\"fa fa-heart\" style=\"color:red\"><span></span></a></li><li class=\"dropdown action-btn-last like-menu\"><a data-bs-toggle=\"dropdown\" role=\"link\" aria-expanded=\"false\" class=\"fa fa-share-alt\"></a><div class=\"dropdown-menu dropdown-menu-end\"><div id=\""+window.YTD.like.part0[i].like.expandedUrl+"\"><a class=\"dropdown-item\"><i class=\"fa fa-link\"></i>Open on twitter</a></div><div id=\""+window.YTD.like.part0[i].like.tweetId+"\"><a class=\"dropdown-item\"><i class=\"fa fa-info-circle\"></i>Show tweet id</a></div></div></li></ul></p></div></div><div class=\"clearfix\"></div></div>";
                    }
                    m++;
                  }
                  if(end==0) start--;
                  else start++;
                } while (start!==end);
                
                $(".tab-content #nav-like #like-data").empty();
                $(".tab-content #nav-like #like-data").append(source);
                window.optStats.search_term.likes.found = m;
                $(".like-menu .dropdown-menu a").click(function(){
                  if(String($(this).parent().attr("id")).substring(0,4)=="http")
                     window.open($(this).parent().attr("id"));
               });
               setPagination(page);
               delete window.YTD.like.part0;
             }
           }
           else if(window.optStats.search_term.likes.keyword==null)
           {
             if(window.YTD.like.part0.length>0) window.optStats.like_count = window.YTD.like.part0.length;
             
             if(window.optStats.like_count>0)
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
                    template = window.YTD.like.part0[i].like.fullText;
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

                  source += "<div class=\"tweet-post\"><div class=\"col-lg-6 px-0\"><div class=\"retweeted\"><span></span></div><div class=\"tweet-avatar\"><img id=\"avatar-logo\"></div><div class=\"tweet-connector standalone\"><p class=\"common-text tweet-post-content\"><span id=\"likened-tweet\">"+template+"</span></p><p class=\"tweet-post-action common-text\"><ul class=\"post-action-btn\"><li><a class=\"fa fa-comment-o\"><span></span></a></li><li><a class=\"fa fa-retweet\"><span></span></a></li><li><a class=\"fa fa-heart\" style=\"color:red\"><span></span></a></li><li class=\"dropdown action-btn-last like-menu\"><a data-bs-toggle=\"dropdown\" role=\"link\" aria-expanded=\"false\" class=\"fa fa-share-alt\"></a><div class=\"dropdown-menu dropdown-menu-end\"><div id=\""+window.YTD.like.part0[i].like.expandedUrl+"\"><a class=\"dropdown-item\"><i class=\"fa fa-link\"></i>Open on twitter</a></div><div id=\""+window.YTD.like.part0[i].like.tweetId+"\"><a class=\"dropdown-item\"><i class=\"fa fa-info-circle\"></i>Show tweet id</a></div></div></li></ul></p></div></div><div class=\"clearfix\"></div></div>";
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
         if(stat) window.optStats.like_count = window.YTD.like.part0.length;
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
function RunIfAdmin(successFunc,failureFunc)
{
  if(!Parse.User.current())
  {
    failureFunc();
    return;
  }
  var query = (new Parse.Query(Parse.Role));
  query.equalTo("name", "Administrator");
  query.equalTo("users", Parse.User.current());
  var value = null;
  query.first({
    success: function(adminRole) {
      if(Parse.User.current() != null && adminRole != null)
      {
        successFunc();
      }
    },
    error: function(error) {
      alert("Error1: " + error.code + " " + error.message);
      if(failureFunc != nil)
      {
        failureFunc();
      }
    }
  });
}

function LoadUsers()
{
  $("#missionTable > tbody").html("");
  var query = new Parse.Query(Parse.User);
  query.find({
    success: function(users) {
      // add data here
      window.users = users;
      var query = (new Parse.Query(Parse.Role));
      query.equalTo("name", "Administrator");
      query.first().then(function(adminRole) {
        var adminRelation = new Parse.Relation(adminRole, 'users');
        var queryAdmins = adminRelation.query();
        queryAdmins.find({
          success: function(results) {
            console.log(results);
            for (index = 0; index < users.length; ++index) {
              var user = users[index];
              if(FindUser(results,user.id))
              {
                AddUser(user,true);
              }
              else
              {
                AddUser(user,false);
              }
            }
          }

        });
      });
    },
    error: function(error) {
      alert("Error2: " + error.code + " " + error.message);
    }
  });
}
function FindUser(array,userid)
{
  for(xx = 0;xx < array.length;++xx)
  {
    var obj = array[xx];
    if(obj.id == userid)
    {
      return true;
    }
  }
  return false;
}
function AddUser(auser,isadmin)
{
  var str = "";
  if(isadmin)
  {
    str = "<tr class='row'>";
  }
  else
  {
    str = "<tr class='row'>";
  }
  str += "<td class='cellMissions'><a>"+auser.get('username')+"</a></td>";
  if(isadmin)
  {
    str += '<td><a href="#" id="'+auser.id+'"<i class="fa fa-star"></i></a></td>';
  }
  else
  {
    str += '<td><a href="#" id="'+auser.id+'"<i class="fa fa-star-o"></i></a></td>';
  }
  str += "</tr>";
  $("#missionTable").append(str);
  link = '#'+auser.id;    
  if(isadmin)
  {
    $(link).click(function(event) {
      //alert(event.target.id);
      RemoveAdmin(event.target.id);
    });
  }
  else
  {
    $(link).click(function(event) {
      //alert(this.id);
      SetAdmin(this.id);
    });
  }
}
function SetAdmin(user)
{
  var query = new Parse.Query(Parse.User);
  query.get(user, {
  success: function(object) {
      // Successfully retrieved the object.
      window.adminUser = object;
   //   object.set("isAdmin",true);
  //    object.save();
      var role = Parse.Object.extend("_Role");
      var query = new Parse.Query(role);
      query.equalTo("name", "Administrator");
      query.first({
        success: function(role) {
          role.getUsers().add(window.adminUser);
          role.save();
          RunIfAdmin(LoadUsers,HideAll)
        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
  },error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
});
}
function RemoveAdmin(user)
{
  var query = new Parse.Query(Parse.User);
  query.get(user, {
    success: function(object) {
      // Successfully retrieved the object.
      window.adminUser = object;
      var role = Parse.Object.extend("_Role");
      var query = new Parse.Query(role);
      query.equalTo("name", "Administrator");
      query.first({
        success: function(role) {
          // Successfully retrieved the object.
//          window.user.set("isAdmin",false);
  //        window.user.save();
          role.getUsers().remove(window.adminUser);
          role.save();
          RunIfAdmin(LoadUsers,HideAll)
        },
        error: function(error) {
          alert("Error3: " + error.code + " " + error.message);
        }
      });
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}
function HideAll()
{
  $("#missionsList").hide();
  $("#getout").show();
  $("#getout").append('                <iframe width="560" height="315" src="http://www.youtube.com/embed/gvdf5n-zI14?autoplay=1" frameborder="0" allowfullscreen></iframe>');
}

Parse.initialize("1IijmSndIGJFPg6cw6xDl5PRe5AiGCHliyPzIgPc", "NHQLKq3nL8i0aK6Hz9J4EOMbAvHgkEu2XY5RAq8Q");
$("#getout").hide();
UpdateLoginButton();
RunIfAdmin(LoadUsers,HideAll)

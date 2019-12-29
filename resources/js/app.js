

require('./bootstrap');



import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});

let onLineUsersLength=0;

window.Echo.join(`online`)
    .here((users) => {
        onLineUsersLength=users.length;
        if(users.length > 1){
            $("#no-online-users").hide();
        }

        let userId=$('meta[name=user-id]').attr('content');

        users.forEach(function(user){
            if(user.id==userId){
            return;
            }
                
            
$('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><span class="fa fa-circle text-success"></span>${user.name}</li>`);
        })//end foreach
    })
    .joining((user) => {
        onLineUsersLength++;
        $('#no-online-users').hide();
        $('#online-users').append(`<li id="user-${user.id}" class="list-group-item"><span class="fa fa-circle text-success"></span>${user.name}</li>`);
    })
    .leaving((user) => {
        onLineUsersLength--;
        if(onLineUsersLength==1){
            $("#no-online-users").css("display", "block");
        }
        $('#user-' +user.id).remove();
    });

    $('#chat-text').keypress(function(e){
      
        if(e.keyCode == 13)
        {
            e.preventDefault();
           let body=$(this).val();
           let url=$(this).data('url');
           let userName=$('meta[name=user-name]').attr('content');
            $(this).val('');
           $('#chat').append(`
            
           <div class="mt-4 w-50 text-white p-3 rounded float-right bg-primary">
           <span class="bolder text-dark">${userName}</span>
           <p>${body}</p>
           </div>  
           <div class="clearfix"></div> 
           
           `)


           let data={
               '_token':$('meta[name=csrf-token]').attr('content'),
               body
           }
           $.ajax ({
            url:url,
            method:'post',
            data:data,
        })
    
    
        }
          
        });
    
    window.Echo.channel('chat-group')
        .listen('MessageDelivered', (e) => {
            $('#chat').append(`
            
            <div class="mt-4 w-50 text-white p-3 rounded float-left bg-success">
            <p>${e.message.user.name}</p>
            <p>${e.message.body}</p>
            </div>  
            <div class="clearfix"></div> 
            
            `)
    
    
        });

   

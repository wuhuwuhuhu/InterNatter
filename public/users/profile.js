$(() => {
    $('.friend_request_accept').click(function (e) { 
        e.preventDefault();
        let $card = $(e.target.parentNode);
        let data = {
            accept: true,
            friendlistId: $card.attr("friendlistId"),
            userId : $card.attr("userId"),
            friendId: $card.attr("friendId"),
            username: $card.attr("username"),
            friendname: $card.attr("friendname")

        }
        $.post("/users/friendRequestProcess", data, function (responseMessage) {
            if(responseMessage.code == 0){
                //success
            }else{
                //fail
            }
        });
        $card.children('.friend_request_accept').text("Accepted");
        $card.children().addClass("disabled");
        console.log(data)
        
    });

    $('.friend_request_decline').click(function (e) { 
        e.preventDefault();
        let $card = $(e.target.parentNode);
        let data = {
            accept: false,
            friendlistId: $card.attr("friendlistId"),
            userId : $card.attr("userId"),
            friendId: $card.attr("friendId"),
            username: $card.attr("username"),
            friendname: $card.attr("friendname")
        }
        $.post("/users/friendRequestProcess", data, function (responseMessage) {
            if(responseMessage.code == 0){
                //success
            }else{
                //fail
            }
        });
        $card.children('.friend_request_decline').text("Declined");
        $card.children().addClass("disabled");
        console.log(data)
        
    });
});
$(() => {
    $registerButton = $("#registerButton");
    $registerForm = $('#registerForm');
    $username = $('#username');
    $email = $('#email');
    $password = $('#password');
    $password2 = $('#password2');
    $language = $('#language');
    $registerAlert = $('#registerAlert');
    $registerButton = $('#registerButton');
    const errorUtilsList = ["Please provide valid username", "Please provide valid email", "Please provide valid password","Please provide same password again", "Good choice, this username has not been registered", "Good choice, this email has not been registered", "Good choice", "Error: this username has been registered, please use another one", "Error: this email has been registered, please use another one"];
    const utilsList = [...errorUtilsList];
    let utilsMap = {};
    init();
    function  init() {
        $("#usernameAlert").hide();
        $("#emailAlert").hide();
        $("#passwordAlert").hide();
        $("#password2Alert").hide();
        $.post("/utilsTranslator", {names: utilsList, selectedlanguage: $('#language').val()}, function(data){
            utilsMap = data;
        })

        $registerAlert.hide();
        $registerButton.prop( "disabled", true );
    }
    function getUtilsMap(key){
        if(utilsMap[key]) return utilsMap[key];
        return key;
    }

    $('#language').change(function () {
        window.location.href = `/register/${$(this).val()}`;

    });


    function alertMsg(isError, id, msg) {
        let $element = $(`#${id}Alert`);
        if(!isError){
            $element.removeClass("alert-danger");
            $element.addClass("alert-success");
        }else{
            $element.removeClass("alert-success");
            $element.addClass("alert-danger");
        }
        $element.html(getUtilsMap(msg));
        $element.show();
        activeRegisterButton();

    }
    function checkRegValid($element, pattern) {
        let value = $element.val().trim();
        let pass = pattern.test(value);
        if(!pass){
            alertMsg(true, $element[0].id, `Please provide valid ${$element[0].id}`);
            return false;
        }
        return true;
    }

    function activeRegisterButton() {
        // console.log($(".alert-danger").length);
        // console.log($(".alert-success").length);
        if($(".alert-danger").length === 0){
            $registerButton.prop( "disabled", false );
        }
        else{
            $registerButton.prop( "disabled", true );
        }
    }

    $username.blur(function () {
        let value = $username.val();
        let userNamePattern = /^[\w_-]{3,16}$/;
        if(!checkRegValid($username, userNamePattern)) return;
        $.get("/validate/checkRepeat", {username: value}, function (responseMessage) {
            if(responseMessage.code == 0){
                alertMsg(true, "username", responseMessage.error);
            }else{
                alertMsg(false, "username", `Good choice, this username has not been registered`);
            }
        });
        activeRegisterButton();
    })

    $email.blur(function () {
        let value = $email.val();
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!checkRegValid($email, emailPattern)) return;
        $.get("/validate/checkRepeat", {email: value}, function (responseMessage) {
            if(responseMessage.code == 0){
                alertMsg(true, "email", responseMessage.error);
            }else{
                alertMsg(false, "email", `Good choice, this email has not been registered`);
                return;
            }
        });
        activeRegisterButton();
    })

    $password.blur(function () {
        let value = $password.val();
        let passwordPattern = /^[\w_-]{3,16}$/;
        if(!checkRegValid($password, passwordPattern)) return;
        alertMsg(false, "password", "Good choice");
        activeRegisterButton();
    })

    $password2.blur(function () {
        let value = $password2.val();
        if($password.val() != value){
            alertMsg(true, "password2", "Please provide same password again");
            return;
        }
        alertMsg(false, "password2", "Good choice");
        activeRegisterButton();

    })

    $registerButton.click(function(event) {
       
    
    })

    
})
(function() {
    'use strict';

    angular.module('Controllers')
        .controller('adminUserController', adminUserController);

    adminUserController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', 'SessionService' ];

    function adminUserController(LxDialogService, $http, $httpParamSerializerJQLike, SessionService) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.userValidado = SessionService.sessionUser();
        vm.cerrarSesion = cerrarSesion;
        vm.cancelMouseover = cancelMouseover;
        vm.enviarLogin = enviarLogin;
        vm.limpiarLogin = limpiarLogin;
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        // console.log($statProvider.state);

        vm.fields = {
            numero: "",
            passw: ""
        };

        vm.captcha = { "key": "6LeGaoYqAAAAAGnc5rah3Q0XKODifVTfulTehozu" };


        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }

        function enviarLogin() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
            //console.info("Valor de vm.editarPerfil = %s", vm.editarPerfil);
            
            var noError = true;
            var errorText = "Error: ";

            if (vm.fields.numero === "" || vm.fields.numero === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su Número de Empleado<br>y registrado por un Administrador de siiFCA<br>";
            }            
            if (vm.fields.passw === "" || vm.fields.passw === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su contraseña de usuario Administrativo<br>";
            }

            if (noError) {
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                // Enviar el ReCapcha de signin
                grecaptcha.ready( async () => {
                    await grecaptcha.execute(vm.captcha.key, {action: 'signin'})
                        .then(  token => {
                        // Add your logic to submit to your backend server here.
                        // console.log( vm.captcha.key, '===>', token );
                        
                        sendLogin( token );
                    
                    }, (err) => {
                        console.log( err ); // reject
                        vm.showLinearProgress = false;       // progress...
                        vm.enviado = false;

                    });
                });


            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        }

        function sendLogin( token ) {
                
            var datosEnviar = { "numero"   : vm.fields.numero,
                "passw"             : vm.fields.passw,
                "recaptcha_response": token,
                "registrar"         : "inicio"           // enviar el módulo por validarse...
            };
            //console.log($httpParamSerializerJQLike(datosEnviar));
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Data-Type': 'html'
                },
                url: '/siiFCA/api/login_user.php'
            })
                .then(function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        $('div#msgInfo').html(r.data);
                        LxDialogService.open('dlgInfo');
                        vm.userValidado = SessionService.sessionUser();
                        vm.permisos = JSON.parse(SessionService.sessionPermisos());
                        //console.log( r.permisos );
                        vm.limpiarLogin();
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.data);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        vm.userValidado = SessionService.sessionUser();
                        vm.permisos = JSON.parse(SessionService.sessionPermisos());
                    }
                    //console.log(resp);

                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    //var r = resp.data;
                    //console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    vm.userValidado = SessionService.sessionUser();
                    vm.permisos = JSON.parse(SessionService.sessionPermisos());
                });

        }

        function cerrarSesion() {
            var datosEnviar = { "registrar": "logout" };
            //console.log($httpParamSerializerJQLike(datosEnviar));
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                            'Data-Type': 'html' },
                url: '/siiFCA/api/logout_user.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (r.status == 'Ok') {
                    $('div#msgInfo').html(r.data);
                    //console.log( $cookies.get('siifca_sid'));
                    LxDialogService.open('dlgInfo');
                    vm.userValidado = false;
                    vm.passwordValido = false;
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    vm.userValidado = SessionService.sessionUser();
                    vm.permisos = JSON.parse(SessionService.sessionPermisos());
                }
                //console.log(resp);
                
                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    vm.userValidado = SessionService.sessionUser();
            });

        }

        function limpiarLogin() {
            vm.fields = {
                numero: "",
                passw: ""
            };

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }

    }

})();

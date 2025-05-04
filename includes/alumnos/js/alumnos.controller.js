(function() {
    'use strict';

    angular.module('Controllers')
        .controller('alumnosLoginController', alumnosLoginController);

    alumnosLoginController.$injet = ['LxDialogService', 'LxDatePickerService', '$http', '$httpParamSerializerJQLike', 
                                        'SessionService', '$window', '$document'];

    function alumnosLoginController(LxDialogService, LxDatePickerService, $http, $httpParamSerializerJQLike, 
                                        SessionService, $window, $document) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.showLinearProgress2 = false;
        vm.showLinearProgress3 = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.passwordValido = false;
        vm.tpassw = "";
//        vm.copia = {};
        vm.alumnoValidado = SessionService.sessionAlumno();
        vm.validarEmail = validarEmail;
        vm.cerrarSesion = cerrarSesion;
        vm.cancelMouseover = cancelMouseover;
        vm.enviarLogin = enviarLogin;
        vm.enviarDatos = enviarDatos;
        vm.cancelarDatos = cancelarDatos;
        vm.limpiarLogin = limpiarLogin;
        vm.callbackTipo = callbackTipo;             // selecciona el tipo de sangre...
        vm.callbackEdoCivil = callbackEdoCivil;
        vm.callbackFecha = callbackFecha;
        vm.openFechaDialog = openFechaDialog;
        vm.scrollDown = scrollDown;
        vm.recuperaPassw = recuperaPassw;
        vm.borrarDatos = borrarDatos;
        vm.verificaPassword = verificaPassword;
        vm.actualizarDatos = actualizarDatos;
        vm.ejecutaCaptcha = ejecutaCaptcha;

        vm.response = null;
        vm.widgetId = null;
        vm.captcha = { "key": "6LeGaoYqAAAAAGnc5rah3Q0XKODifVTfulTehozu" };
        vm.setResponse = setResponse;
        vm.setWidgetId = setWidgetId;
        vm.cbExpiration = cbExpiration;
        
        vm.locale = "es";
        vm.inputFecha = new Date(2006,6,1);
        
        // carga del Recpatcha de googgle
        // if ( !grecaptcha ) {  // para no volverla a cargar... 
        // var script = $window.document.createElement('script');
        // script.async = true;
        // script.defer = true;
        // script.src = 'https://www.google.com/recaptcha/api.js?render='+vm.captcha.key;
        // $document.find('body')[0].appendChild(script);
        // }

        //console.log(vm.alumnoValidado);
        vm.campos = {
            cuenta: "",
            passw: "",
            passw2: "",
            nombre: "",
            appaterno: "",
            apmaterno: "",
            sexo: "MUJER",
            fecha: moment(vm.inputFecha).locale(vm.locale).format('L'),
            rfc: "",
            curp: "",
            imss: "",
            tipo: { "name": "O+"},
            civil: { "name": "SOLTER@"},
            telefono: "",
            movil: "",
            correoi: "",
            correop: "",
            domicilio: "",
            poblacion: "CULIACÁN",
            cp: "80000",
            municipio: "CULIACÁN",
            estado: "SINALOA",
            pais: "MÉXICO",
            observacion: ""
            
        };
//        vm.copia = vm.campos; 
        vm.selectTipo = [ 
            { "name" : "O-" },
            { "name" : "O+" },
            { "name" : "A-" },
            { "name" : "A+" },
            { "name" : "B-" },
            { "name" : "B+" },
            { "name" : "AB-" },
            { "name" : "AB+" }
        ];

        vm.selectEdoCivil = [ 
            { "name" : "SOLTER@" },
            { "name" : "CASAD@" },
            { "name" : "DIVORCIAD@" },
            { "name" : "VIUD@" },
            { "name" : "OTRO" }
        ];

        vm.fields = {
            cuenta: "",
            passw: ""
        };
        vm.contra = {
            cuenta: "",
            correo: ""
        }

        function ejecutaCaptcha(){
            if (vm.verificacion || vm.response === null) {
                // vcRecaptchaService.execute();
                //wait(1);
            }

        }

        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }

        function callbackTipo(_newValue, _oldValue) {
            //console.log(vm.campos);
        }

        function callbackEdoCivil(_newValue, _oldValue) {
            //console.log(vm.campos);
        }

        function validarEmail(_email) {
            return (_email !== "" && _email !== undefined) ? emailValidation(_email) : true;
        }

        function enviarLogin() {        // recupera los datos y los envÃ­a al API / BD
            // validar los datos antes de ser enviados...
            //console.info("Valor de vm.editarPerfil = %s", vm.editarPerfil);
            
            var noError = true;
            var errorText = "Error: ";

            if (vm.fields.cuenta === "" || vm.fields.cuenta === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su cuenta<br>";
            }            
            if (vm.fields.passw === "" || vm.fields.cuenta === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su(s) la contraseña<br>";
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
                
        } // enviarLogin() 

        function sendLogin( token ) {

            var datosEnviar = {
                "cuenta"        : vm.fields.cuenta,
                "passw"         : vm.fields.passw,
            "recaptcha_response": token,
                "registrar"     : "login"
            };
            //console.log($httpParamSerializerJQLike(datosEnviar));

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Data-Type': 'html'
                },
                url: '/siiFCA/api/login_alumno.php'
            })
                .then(function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        $('div#msgInfo').html(r.data);
                        //console.log( $cookies.get('siifca_sid'));
                        LxDialogService.open('dlgInfo');
                        vm.alumnoValidado = SessionService.sessionAlumno();
                        vm.limpiarLogin();
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.data);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        vm.alumnoValidado = SessionService.sessionAlumno();
                    }
                    //console.log(resp);

                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    vm.alumnoValidado = SessionService.sessionAlumno();
                });


        } // sendLogin()

        function cerrarSesion() {
            var datosEnviar = { "registrar"  : "logout" };
            //console.log($httpParamSerializerJQLike(datosEnviar));
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                            'Data-Type': 'html' },
                url: '/siiFCA/api/logout.php'
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
                    vm.alumnoValidado = false;
                    vm.cancelarDatos(false);
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    vm.alumnoValidado = SessionService.sessionAlumno();
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
                    vm.alumnoValidado = SessionService.sessionAlumno();
            });

        }

        function limpiarLogin() {
            vm.fields = {
                cuenta: "",
                passw: ""
            };

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function scrollDown() {
             $("body").trigger($.Event("keyup", { keyCode: 40 }));
        }

        // validación del correo...
        function emailValidation(_email) {
            return /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[_0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/.test(_email);
        }

        function enviarDatos() {   // captcha invisible...
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";
            // validar el reCaptcha invisible

            if (vm.campos.cuenta === "" || vm.campos.cuenta === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su Número de Cuenta<br>";
            }            
            if ( vm.campos.cuenta !== undefined && vm.campos.cuenta.length < 8 ) {
                noError = false;
                errorText = errorText + "Debe introducir su Número de Cuenta de 8 dígitos<br>";
            }            
            if (vm.campos.passw === "" || vm.campos.passw === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su contraseña<br>";
            }
            if (vm.campos.passw !== vm.campos.passw2 ) {
                noError = false;
                errorText = errorText + "Las contraseñas deben ser iguales<br>";
            }
            if (vm.campos.nombre === "" || vm.campos.nombre === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su nombre<br>";
            }
            if (vm.campos.appaterno === "" || vm.campos.appaterno === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su apellido paterno<br>";
            }
            if ((vm.campos.correoi === "" || vm.campos.correoi === undefined) && 
                    (vm.campos.correop === "" || vm.campos.correop === undefined) ) {
                noError = false;
                errorText = errorText + "Debe introducir por lo menos un tipo de correo<br>";
            }


            if (noError) {
                // vcRecaptchaService.execute();
                //enviarDatos();
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;
                
                grecaptcha.ready( async () => {
                    await grecaptcha.execute(vm.captcha.key, {action: 'signup'})
                        .then(  token => {
                        // Add your logic to submit to your backend server here.
                        // console.log( vm.captcha.key, '===>', token );
                        
                        enviarDatosRegistro( token );
                    }, (err) => {
                        console.log( err );
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

        function enviarDatosRegistro( token ) {        // recupera los datos y los envÃ­a al API / BD
            
            var datosEnviar = { "cuenta"    : vm.campos.cuenta,
                                "passw"     : vm.campos.passw,
                                "nombre"    : vm.campos.nombre,
                                "appaterno" : vm.campos.appaterno,
                                "apmaterno" : (vm.campos.apmaterno !== undefined) ? vm.campos.apmaterno : "",
                                "sexo"      : vm.campos.sexo,
                                "fecha"     : (vm.campos.fecha !== undefined) ? vm.campos.fecha : "",
                                "rfc"       : (vm.campos.rfc !== undefined) ? vm.campos.rfc : "",
                                "curp"      : (vm.campos.curp !== undefined) ? vm.campos.curp : "",
                                "imss"      : (vm.campos.imss !== undefined) ? vm.campos.imss : "",
                                "tipo"      : (vm.campos.tipo !== undefined) ? vm.campos.tipo.name : "O+",
                                "civil"     : (vm.campos.civil !== undefined) ? vm.campos.civil.name : "SOLTER@",
                                "telefono"  : (vm.campos.telefono !== undefined) ? vm.campos.telefono: "",
                                "movil"     : (vm.campos.movil !== undefined) ? vm.campos.movil : "",
                                "correoi"   : (vm.campos.correoi !== undefined) ? vm.campos.correoi : "",
                                "correop"   : (vm.campos.correop !== undefined) ? vm.campos.correop : "",
                                "domicilio" : (vm.campos.domicilio !== undefined) ? vm.campos.domicilio : "",
                                "cp"        : (vm.campos.cp !== undefined) ? vm.campos.cp : "",
                                "poblacion" : (vm.campos.poblacion !== undefined) ? vm.campos.poblacion : "",
                                "municipio" : (vm.campos.municipio !== undefined) ? vm.campos.municipio : "",
                                "estado"    : (vm.campos.estado !== undefined) ? vm.campos.estado : "",
                                "pais"      : (vm.campos.pais !== undefined) ? vm.campos.pais : "",
                              "observacion" : (vm.campos.observacion !== undefined) ? vm.campos.observacion : "",
                       "recaptcha_response" : token,
                               "registrar"  : "registrar"
            };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/registro_alumno.php'
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
                    //vm.alumnoValidado = SessionService.sessionAlumno();
                    vm.cancelarDatos();
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.data + JSON.stringify(r.error));
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    cbExpiration();
                    }
                
                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    cbExpiration();
            });
        }

        function recuperaPassw(){
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.contra.cuenta === "" || vm.contra.cuenta === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su Número de Cuenta<br>";
            }            
            
            if (vm.contra.correo === "" || vm.contra.correo === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir uno de los correos vinculado con la cuenta<br>";
            }            

            if (noError) {
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                // Reset Password...
                grecaptcha.ready( async () => {
                    await grecaptcha.execute(vm.captcha.key, {action: 'resetpassw'})
                        .then(  token => {
                        // Add your logic to submit to your backend server here.
                        // console.log( vm.captcha.key, '===>', token );
                        
                        sendRecuperaPassw( token );

                    }, (err) => {
                        console.log( err );
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

        function sendRecuperaPassw( token ) {
            var datosEnviar = {
                "cuenta": vm.contra.cuenta,
                "correo": vm.contra.correo,
                "recaptcha_response": token,
                "registrar": "retpassw"
            };
            //console.log($httpParamSerializerJQLike(datosEnviar));
            vm.showLinearProgress2 = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Data-Type': 'html'
                },
                url: '/siiFCA/api/retpassw.php'
            })
                .then(function ok(resp) {
                    vm.showLinearProgress2 = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        $('div#msgInfo').html(r.data);
                        //console.log( $cookies.get('siifca_sid'));
                        LxDialogService.open('dlgInfo');
                        // vm.alumnoValidado = SessionService.sessionAlumno();
                        vm.borrarDatos();
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.data);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //vm.alumnoValidado = SessionService.sessionAlumno();
                    }
                    //console.log(resp);

                }, function error(resp) {
                    vm.showLinearProgress2 = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    //vm.alumnoValidado = SessionService.sessionAlumno();
                });

        }

        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }
 
        function setResponse(response){
            // vm.response = response;
            // enviarDatosRegistro();

        }

        function setWidgetId(widgetId){
            // vm.widgetId = widgetId;

        }

        function cbExpiration(){
            // vcRecaptchaService.reload(vm.widgetId);
            // vm.response = null;

        }

        function callbackFecha(_newFecha){
            vm.inputFecha = _newFecha;
            vm.campos.fecha = moment(_newFecha).locale(vm.locale).format('L');

        }

        function openFechaDialog(_id){
            LxDatePickerService.open(_id);
        }
 
        function cancelarDatos(hasCaptcha) {
            if (hasCaptcha === undefined) hasCaptcha= true;
            vm.locale = "es";
            vm.inputFecha = new Date(2000,6,1);

            vm.campos = {
                cuenta: "",
                passw: "",
                passw2: "",
                nombre: "",
                appaterno: "",
                apmaterno: "",
                sexo: "MUJER",
                fecha: moment(vm.inputFecha).locale(vm.locale).format('L'),
                rfc: "",
                curp: "",
                imss: "",
                tipo: { "name": "O+"},
                civil: { "name": "SOLTER@"},
                telefono: "",
                movil: "",
                correoi: "",
                correop: "",
                domicilio: "",
                poblacion: "CULIACÁN",
                cp: "80000",
                municipio: "CULIACÁN",
                estado: "SINALOA",
                pais: "MÉXICO",
                observacion: ""
                
            };

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function borrarDatos() {
            vm.contra = {
                cuenta: "",
                correo: ""
            };

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function verificaPassword() {
            // console.info("Valor de vm.editarPerfil = %s", vm.editarPerfil);
            var noError = true;
            var errorText = "Error: ";

            if (vm.tpassw === "" || vm.tpassw === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir la Contraseña<br>";
            }            

            if (noError) {
                
                var datosEnviar = { "alumno"     : vm.tpassw,
                                    "registrar"  : "verifica"
                };
                //console.log($httpParamSerializerJQLike(datosEnviar));
                vm.showLinearProgress3 = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                                'Data-Type': 'html' },
                    url: '/siiFCA/api/verifica_alumno.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress3 = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        cargaPerfil(r);
                        vm.passwordValido = true;
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.data);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        // vm.alumnoValidado = SessionService.sessionAlumno();
                        vm.passwordValido = false;
                     }
                    //console.log(resp);
                    
                    }, function error(resp) {
                        vm.showLinearProgress3 = false;
                        vm.enviado = false;
                        var r = resp.data;
                        //console.log(resp);
                        $('div#msgError').html('<b>Error:</b><br>' + resp);
                        // vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        // vm.alumnoValidado = SessionService.sessionAlumno();
                        vm.passwordValido = false;
                });
            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
                vm.passwordValido = false;
            }

        }

        function actualizarDatos() {
            //console.info("Valor de nombre origina = %s", vm.myForm.input.$valid); return;
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.campos.cuenta === "" || vm.campos.cuenta === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su Número de Cuenta<br>";
            }            
            if ((vm.campos.passw === "" || vm.campos.passw === undefined) && 
                (vm.campos.passw2 === "" || vm.campos.passw2 == undefined)) {
                vm.campos.passw = vm.tpassw;
                vm.campos.passw2 = vm.tpassw;
            }
            if (vm.campos.passw !== vm.campos.passw2 ) {
                noError = false;
                errorText = errorText + "Las contraseñas deben ser iguales<br>";
            }
            if (vm.campos.nombre === "" || vm.campos.nombre === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su nombre<br>";
            }
            if (vm.campos.appaterno === "" || vm.campos.appaterno === undefined) {
                noError = false;
                errorText = errorText + "Debe introducir su apellido paterno<br>";
            }
            if ((vm.campos.correoi === "" || vm.campos.correoi === undefined) && 
                    (vm.campos.correop === "" || vm.campos.correop === undefined) ) {
                noError = false;
                errorText = errorText + "Debe introducir por lo menos un tipo de correo<br>";
            }

            if (noError) {
                // action: update''
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                grecaptcha.ready( async () => {
                    await grecaptcha.execute(vm.captcha.key, {action: 'update'})
                        .then(  token => {
                        // Add your logic to submit to your backend server here.
                        // console.log( vm.captcha.key, '===>', token );
                        
                        sendActualizarDatos( token );
                    }, (err) => {
                        console.log( err );
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

        function sendActualizarDatos( token ) {
            var datosEnviar = {
                "cuenta"   : vm.campos.cuenta,
                "passw"    : vm.campos.passw,
                "nombre"   : vm.campos.nombre,
                "appaterno": vm.campos.appaterno,
                "apmaterno": (vm.campos.apmaterno !== undefined) ? vm.campos.apmaterno : "",
                "sexo"     : vm.campos.sexo,
                "fecha"    : (vm.campos.fecha !== undefined) ? vm.campos.fecha : "",
                "rfc"      : (vm.campos.rfc !== undefined) ? vm.campos.rfc : "",
                "curp"     : (vm.campos.curp !== undefined) ? vm.campos.curp : "",
                "imss"     : (vm.campos.imss !== undefined) ? vm.campos.imss : "",
                "tipo"     : (vm.campos.tipo !== undefined) ? vm.campos.tipo.name : "O+",
                "civil"    : (vm.campos.civil !== undefined) ? vm.campos.civil.name : "SOLTER@",
                "telefono" : (vm.campos.telefono !== undefined) ? vm.campos.telefono : "",
                "movil"    : (vm.campos.movil !== undefined) ? vm.campos.movil : "",
                "correoi"  : (vm.campos.correoi !== undefined) ? vm.campos.correoi : "",
                "correop"  : (vm.campos.correop !== undefined) ? vm.campos.correop : "",
                "domicilio": (vm.campos.domicilio !== undefined) ? vm.campos.domicilio : "",
                "cp"       : (vm.campos.cp !== undefined) ? vm.campos.cp : "",
                "poblacion": (vm.campos.poblacion !== undefined) ? vm.campos.poblacion : "",
                "municipio": (vm.campos.municipio !== undefined) ? vm.campos.municipio : "",
                "estado"   : (vm.campos.estado !== undefined) ? vm.campos.estado : "",
                "pais"     : (vm.campos.pais !== undefined) ? vm.campos.pais : "",
      "recaptcha_response" : token,
                "registrar": "actualizar"
            };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Data-Type': 'html' },
                url: '/siiFCA/api/actualiza_perfil_alumno.php'
            })
                .then(function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        $('div#msgInfo').html(r.data);
                        //console.log( $cookies.get('siifca_sid'));
                        LxDialogService.open('dlgInfo');
                        //vm.alumnoValidado = SessionService.sessionAlumno();
                        //vm.cancelarDatos();
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.data + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();
                    }

                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    //cbExpiration();
                });



        }

        function cargaPerfil(r) {
            vm.campos.cuenta    = r.cuenta;
            vm.campos.nombre    = r.nombre;
            vm.campos.appaterno = r.appaterno;
            vm.campos.apmaterno = r.apmaterno;
            vm.campos.sexo      = r.sexo;
            vm.campos.fecha     = moment(r.fecha).locale(vm.locale).format('L'),
            vm.campos.rfc       = r.rfc;
            vm.campos.curp      = r.curp;
            vm.campos.imss      = r.imss;
            vm.campos.tipo      = { "name": r.tipo};
            vm.campos.civil     = { "name": r.civil};
            vm.campos.telefono  = r.telefono;
            vm.campos.movil     = r.movil;
            vm.campos.correoi   = r.correoi;
            vm.campos.correop   = r.correop;
            vm.campos.domicilio = r.domicilio;
            vm.campos.poblacion = r.poblacion;
            vm.campos.cp        = r.cp;
            vm.campos.municipio = r.municipio;
            vm.campos.estado    = r.estado;
            vm.campos.pais      = r.pais

            vm.inputFecha = new Date(r.fecha);
            //vm.copia = vm.campos;
        }

        // función para hacer un retardo en javascript 
        function wait(nsegundos) {
            var objetivo = (new Date()).getTime() + 1000 * Math.abs(nsegundos);
            while ( (new Date()).getTime() < objetivo );
        }

    }

})();

(function() {
    'use strict';

    angular.module('Controllers')
        .controller('docentesExpedienteController', docentesExpedienteController);

    docentesExpedienteController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', 
                                        'SessionService' ];

    function docentesExpedienteController(LxDialogService, $http, $httpParamSerializerJQLike, 
                                        SessionService ) {
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayDatos = false;
        vm.docenteValidado = SessionService.sessionDocente();
        vm.datosResumen = datosResumen;
        vm.registroEvento = registroEvento;
        vm.cancelarRegistroEvento = cancelarRegistroEvento;
        vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.callbackFecha = callbackFecha;
        //vm.scrollDown = scrollDown;

        //console.log(vm.alumnoValidado);
        vm.locale = "es";
        vm.inputFecha = new Date(1990,6,1);
        vm.fecha;
        vm.res = [ {
            numero: "",
            nombre: "",
            plaza: "",
            fecha: "",
            uo: ""
        }] ;

        vm.laboral = {
            fecha_ingreso: moment(new Date()).locale('es').format('L'),
            uo: 2300,
            plaza: 1330,
            nombra: '',
            tipo: 'BASE',
            activo: 'ACTIVO'
        };

        // controla la entrada al expediente.
        if (vm.docenteValidado) {
            datosResumen();
        }

        function datosResumen() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "registrar"  : "datosResumen" };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 15000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/resumen_expediente_docente.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    vm.res = r.resumen;
                    vm.hayDatos = true;
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.error);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                }
                
            }, function error(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                //console.log(resp);
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                //vm.htmlmsg = resp.data;
                LxDialogService.open('dlgError');
            });
        
        }

        function registroEvento(idevento) { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {  "idevento"  : idevento,
                                "registrar"  : "registroEvento"
                              };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 15000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/registro_evento_docente.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html('Ha sido registrado...!!');
                    LxDialogService.open('dlgInfo');
                    vm.hayEventos = true;
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.error);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                }
                vm.eventos = r.eventos;
                
            }, function error(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                //console.log(resp);
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                //vm.htmlmsg = resp.data;
                LxDialogService.open('dlgError');
            });
        
        }
        
        function cancelarRegistroEvento(idevento) { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {  "idevento"  : idevento,
                                "registrar"  : "cancelarRegistroEvento"
                              };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 15000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/cancelar_registro_evento_docente.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html('Ha sido cancelado...!!');
                    LxDialogService.open('dlgInfo');
                    vm.eventos = r.eventos;
                    vm.hayEventos = true;
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.error);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                }
                
            }, function error(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                //console.log(resp);
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                //vm.htmlmsg = resp.data;
                LxDialogService.open('dlgError');
            });
        
        }

        function cancelarDatos() {
            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function scrollDown() {
             $("body").trigger($.Event("keyup", { keyCode: 40 }));
        }

        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }

        function callbackFecha(_newFecha){
            vm.inputFecha = _newFecha;
            vm.laboral.fecha_ingreso = moment(_newFecha).locale(vm.locale).format('L');

        }

    }

})();

(function() {
    'use strict';

    angular.module('Controllers')
        .controller('adminintenEventosController', adminintenEventosController);

    adminintenEventosController.$injet = ['LxDialogService',  '$http', '$httpParamSerializerJQLike', 
                                        'SessionService'];

    function adminintenEventosController(LxDialogService, $http, $httpParamSerializerJQLike, 
                                        SessionService) {
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayEventos = false;
        vm.adminValidado = SessionService.sessionAdmin();
        vm.leerEventos = leerEventos;
        vm.registroEvento = registroEvento;
        vm.cancelarRegistroEvento = cancelarRegistroEvento;
        vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;

        //console.log(vm.alumnoValidado);
        vm.eventos = [ {
            idevento: "",
            evento: "",
            expositor: "",
            fecha: "",
            hora: "",
            lugar: "",
            turno: "",
            cupo: "",
            notas: "",
            registrado: false,
            cuposaturado: false
        }] ;

/*        if (vm.hayEventos) {

        }
*/
        function leerEventos() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "registrar"  : "leerEventos" };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_eventos_advo.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
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
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/registro_evento_advo.php'
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
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/cancelar_registro_evento_advo.php'
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
 
    }

})();

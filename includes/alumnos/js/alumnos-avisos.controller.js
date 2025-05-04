(function() {
    'use strict';

    angular.module('Controllers')
        .controller('alumnosAvisosController', alumnosAvisosController);

    alumnosAvisosController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', 'SessionService'];

    function alumnosAvisosController(LxDialogService, $http, $httpParamSerializerJQLike, SessionService) {
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayCarnet = false;
        vm.alumnoValidado = SessionService.sessionAlumno();
        vm.verCarnet = verCarnet;
        vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;

        vm.campos = {
            cuenta: '',
            pdf: '/siiFCA/images/nopdf.pdf'
        };

        function verCarnet() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "accion"  : "verCarnetAlumno" };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 15000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/ver_carnet_alumno.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    vm.campos.pdf = r.pdf;
                    vm.hayCarnet = true;

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

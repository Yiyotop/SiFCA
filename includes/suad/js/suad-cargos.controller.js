(function() {
    'use strict';
    
    angular.module('Controllers')
        .controller('suadCargosController', suadCargosController);

    suadCargosController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike',
                'SessionService', '$filter', '$scope', 'LxNotificationService'];

    function suadCargosController(LxDialogService, $http, $httpParamSerializerJQLike,
                            SessionService, $filter, $scope, LxNotificationService) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.selectedCons = [];
        vm.userValidado = SessionService.sessionUser();
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        vm.verNombre = verNombre;
        vm.borrarConsulta = borrarConsulta;
        // vm.leerConstancias = leerConstancias;
        vm.enviarConsulta = enviarConsulta;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        
        // console.log(vm.permisos.recibos);
        // vm.permisos = {"tipo": "usuario", "recibos": true };
        var fec = new Date();
        vm.campos = {
            cuenta: "",
            alumno: "",
            cargo: "",
            generacion: "",
            semestre: "",
            fecha: fec.toLocaleDateString(),
            nota: "",
        }

        
        function enviarConsulta() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";
            var cargo = Inputmask.unmask(vm.campos.cargo, {alias: 'currency'});

            if (vm.campos.cuenta === '' || vm.campos.cuenta.length < 8) {
                noError = false;
                errorText += "Número de Cuenta INCORRECTO<br>";
            }
            if (cargo <= 0 ) {
                noError = false;
                errorText += "El cargo no es válido<br>";
            }
            if (vm.campos.generacion <= 0) {
                noError = false;
                errorText += "La generación debe ser mayor que 0<br>";
            }
            if (vm.campos.semestre <= 0 || vm.campos.semestre >= 10) {
                noError = false;
                errorText += "El semestre no es válido<br>";
            }

            if (noError) {
                var datosEnviar = { "cuenta"    : vm.campos.cuenta,
                                    "cargo"     : cargo,
                                    "generacion": vm.campos.generacion,
                                    "semestre"  : vm.campos.semestre,
                                    "fecha"     : vm.campos.fecha,
                                    "nota"      : vm.campos.nota,
                                    "registrar" : "guardarCargo"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 15000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/suad/cargos_suad.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        LxNotificationService.success(r.data);
                        // console.log( vm.campos );
                        borrarConsulta();

                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();

                     }
                    
                    }, function error(resp) {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        // console.log(resp);
                        $('div#msgError').html('<b>Error:</b><br>' + resp.errorText);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();
                });
            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        }

        function verNombre() {    // Obtiene el nombre del alumno..
            // console.log(_event);
            if ( vm.campos.cuenta === undefined || vm.campos.cuenta === '' ) {
                vm.dataTableTbody = [];
                vm.campos.alumno = "";
            } else if ( vm.campos.cuenta.length < 8) {
                vm.dataTableTbody = [];
                vm.campos.alumno = "";
            } else {    // llenar automaticamente...
                // enviarConsulta();
                var datosEnviar = { "cuenta"    : vm.campos.cuenta,
                                    "registrar" : "verNombreAlumno"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 15000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/suad/veralumno_suad.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        LxNotificationService.success(r.alumno);
                        // console.log( vm.campos );
                        vm.campos.alumno = r.alumno;
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();

                        }
                    
                    }, function error(resp) {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        // console.log(resp);
                        $('div#msgError').html('<b>Error:</b><br>' + resp.errorText);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();
                });

            }
        }

        function borrarConsulta() {

            vm.campos = {
                cuenta: "",
                alumno: "",
                cargo: "",
                generacion: "",
                semestre: "",
                fecha: fec.toLocaleDateString(),
                nota: "",
            }

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;

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


(function() {
    'use strict';
    
    angular.module('Controllers')
        .controller('suadAbonosController', suadAbonosController);

    suadAbonosController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike',
                'SessionService', '$filter', '$scope', 'LxNotificationService'];

    function suadAbonosController(LxDialogService, $http, $httpParamSerializerJQLike,
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
        vm.enviarAbono = enviarAbono;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        
        // console.log(vm.permisos.recibos);
        // vm.permisos = {"tipo": "usuario", "recibos": true };
        var fec = new Date();
        vm.selectTipo  = [ 
            { "name" : "AMB" },
            { "name" : "INS" },
            { "name" : "COL" }
        ];

        vm.campos = {
            cuenta: "",
            folio: "",
            alumno: "",
            concepto: "",
            abono: "",
            tipo: vm.selectTipo[1],
            generacion: "",
            semestre: "",
            fecha: fec.toLocaleDateString(),
            nota: ""
        }

        function enviarAbono() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";
            var semestre = parseInt(vm.campos.semestre);
            var abono = Inputmask.unmask(vm.campos.abono, {alias: 'currency'});

            if (vm.campos.cuenta === '' || vm.campos.cuenta.length < 8) {
                noError = false;
                errorText += "Número de Cuenta INCORRECTO<br>";
            }
            if (abono <= 0 ) {
                noError = false;
                errorText += "El abono no es válido<br>";
            }
            if (vm.campos.generacion <= 0) {
                noError = false;
                errorText += "La generación debe ser mayor que 0<br>";
            }
            if (semestre <= 0 || semestre > 10) {
                noError = false;
                errorText += "El semestre no es válido<br>";
            }

            if (noError) {
                var datosEnviar = { "cuenta"    : vm.campos.cuenta,
                                    "folio"     : vm.campos.folio,
                                    "abono"     : abono,
                                    "concepto"  : vm.campos.concepto,
                                    "tipo"      : vm.campos.tipo.name,
                                    "generacion": vm.campos.generacion,
                                    "semestre"  : vm.campos.semestre,
                                    "fecha"     : vm.campos.fecha,
                                    "nota"      : vm.campos.nota,
                                    "registrar" : "guardarAbono"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/suad/abonos_suad.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        LxNotificationService.success(r.data, true);
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
                        $('div#msgError').html('<b>Errorson:</b><br>' + resp);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();
                });
            } else {
                $('div#msgError').html(errorText + "<br>Semestre: " + semestre + " - " + typeof(semestre));
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

                var datosEnviar = { "cuenta"    : vm.campos.cuenta,
                                    "registrar" : "verNombreAlumno"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
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
                        LxNotificationService.success(r.alumno, true);
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
                folio: "",
                alumno: "",
                concepto: "",
                abono: "",
                tipo:vm.selectTipo[1],
                generacion: "",
                semestre: "",
                fecha: fec.toLocaleDateString(),
                nota: ""
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

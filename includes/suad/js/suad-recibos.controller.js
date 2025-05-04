(function() {
    'use strict';
    
    angular.module('Controllers')
        .controller('suadRecibosController', suadRecibosController);

    suadRecibosController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike',
                                'SessionService', '$filter', '$scope', 'LxNotificationService'];

    function suadRecibosController(LxDialogService, $http, $httpParamSerializerJQLike,
                            SessionService, $filter, $scope, LxNotificationService) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.selectedCons = [];
        vm.userValidado = SessionService.sessionUser();
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        vm.clearTable = clearTable;
        vm.borrarConsulta = borrarConsulta;
        vm.borrarMovimi = borrarMovimi;
        // vm.leerConstancias = leerConstancias;
        vm.enviarConsulta = enviarConsulta;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        
        // console.log(vm.permisos.recibos);
        // vm.permisos = {"tipo": "usuario", "recibos": true };

        vm.campos = {
            cuenta: "",
            alumno: ""
        }

        vm.dataTableThead = [
            {   name: 'idmov',   label: 'NO.',    sortable: true, width: '10%', align: 'left' },
            {   name: 'cargo', label: 'CARGOS', sortable: true, width: '15%', align: 'right', icon: 'currency-usd' },
            {   name: 'abono', label: 'ABONOS', sortable: true, width: "15%", align: 'right', icon: 'currency-usd' },
            {   name: 'generacion',  label: 'GEN',  sortable: false, sort: 'asc', width: "10%", align: 'center' },
            {   name: 'semestre',  label: 'SEM',  sortable: true, sort: 'asc', width: "10%", align: 'center' },
            {   name: 'fecha',  label: 'FECHA',  sortable: true, sort: 'asc', width: "15%", align: 'left' },
            {   name: 'notas', label: 'NOTAS',  sortable: false, width: "25%", align: 'left' },
        ];
        vm.dataTableTfoot = [];
/*            {   name: 'total',   label: 'NO.' },
            {   name: 'cargos', label: 'CARGOS' },
            {   name: 'abonos', label: 'ABONOS' },
            {   name: 'saldo',  label: 'SALDO' },
            {   name: 'cuenta', label: 'CUENTA' },
        ];
*/
        vm.dataTableTbody = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////
/*
        if (vm.userValidado) { // si inicio sesión normal
            leerConstancias();
        }
*/
        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'estadocuenta') {
                vm.selectedCons = _selectedRows;
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
        
        function enviarConsulta() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.campos.cuenta === '' || vm.campos.cuenta.length < 8) {
                noError = false;
                errorText += "Número de Cuenta INCORRECTO";
            }

            if (noError) {
                var datosEnviar = { "cuenta": vm.campos.cuenta,
                                    "registrar"  : "LeerRecibo"
                };
                var formatter = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2,
                    // the default value for minimumFractionDigits depends on the currency
                    // and is usually already 2
                  });
                  
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/suad/edocuenta_suad.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    var pos = 0;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        angular.forEach(r.movimientos, function(value, key){
                            value.cargo = formatter.format(value.cargo);
                            value.abono = formatter.format(value.abono);
                            pos = key;
                        });
                        r.movimientos[pos].fecha = formatter.format(r.movimientos[pos].fecha);
                        vm.dataTableTbody = r.movimientos;
                        vm.campos.alumno = r.alumno;
                        // console.log( vm.dataTableTbody );

                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();
                        vm.campos.alumno = "";
                        vm.dataTableTbody = [];
                     }
                    
                    }, function error(resp) {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        console.log(resp);
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

        function borrarMovimi() {        // marca status como borrado...

            if (vm.selectedCons.length === 1) { // hay uno seleccionado...
                var datosEnviar = {   "cuenta"   : vm.campos.cuenta,
                                    "registrar"  : "LeerRecibo"
                };
                var formatter = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2,
                    // the default value for minimumFractionDigits depends on the currency
                    // and is usually already 2
                  });
                  
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/suad/edocuenta_suad.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    var pos = 0;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        angular.forEach(r.movimientos, function(value, key){
                            value.cargo = formatter.format(value.cargo);
                            value.abono = formatter.format(value.abono);
                            pos = key;
                        });
                        r.movimientos[pos].fecha = formatter.format(r.movimientos[pos].fecha);
                        vm.dataTableTbody = r.movimientos;
                        vm.campos.alumno = r.alumno;
                        // console.log( vm.dataTableTbody );

                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        //cbExpiration();
                        vm.campos.alumno = "";
                        vm.dataTableTbody = [];
                     }
                    
                    }, function error(resp) {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        console.log(resp);
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


        function clearTable() {    // evento de control de la cuenta y limpieza de datos..
            // console.log(_event);
            if ( vm.campos.cuenta === undefined || vm.campos.cuenta === '' ) {
                vm.dataTableTbody = [];
                vm.dataTableTfoot = [];
                vm.campos.alumno = "";
            } else if ( vm.campos.cuenta.length < 8) {
                vm.dataTableTbody = [];
                vm.dataTableTfoot = [];
                vm.campos.alumno = "";
            } 
        }

        function borrarConsulta() {

            vm.campos = {
                cuenta: "",
                alumno: ""
            };
            vm.dataTableTbody = [];
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

        Number.prototype.format = function(n, x) {
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
            return this.toFixed(Math.max(0, ~~n)).replace(new RegExp('\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')', 'g'), '$&,');
        }; 
    }


})();
